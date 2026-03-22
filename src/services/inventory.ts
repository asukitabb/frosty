import type { Product } from "@/types";
import type {
  KardexEntry,
  KardexMovementKind,
  KardexSummaryRow,
  MermaAuditEntry,
  ProductStockLevel,
  ReplenishAlertPayload,
  SaleCompletedInventoryPayload,
  StockLevelStatus,
} from "@/types/inventory";

/** Contrato mínimo para validar stock (Interface Segregation). */
export interface IStockChecker {
  checkStock(productId: string, requestedQty: number): Promise<StockCheckOutcome>;
}

export type StockCheckOutcome =
  | { ok: true; available: number }
  | { ok: false; available: number; reason: string };

interface RowState {
  quantity: number;
  weightedAverageCost: number;
  minLevel: number;
  name: string;
  icon?: string;
}

export interface InventorySnapshotState {
  levels: ProductStockLevel[];
  kardex: KardexEntry[];
  summary: KardexSummaryRow[];
  auditMerma: MermaAuditEntry[];
  version: number;
}

export interface InventoryServiceOptions {
  products: readonly Product[];
  seedQuantity: number;
  /** Factor sobre precio público para estimar costo inicial (simulación). */
  initialCostFactor?: number;
  /** Umbral "warning" sobre mínimo (ej. 1.5× mínimo). */
  warningFactor?: number;
  onReplenishAlert?: (payload: ReplenishAlertPayload) => void;
}

interface InternalSnapshot {
  items: Map<string, RowState>;
  kardex: KardexEntry[];
  auditMerma: MermaAuditEntry[];
  alertArmed: Map<string, boolean>;
}

/**
 * Inventario con Kardex, CPP (costo promedio ponderado), mermas y niveles (T4–T6).
 */
export class InventoryService implements IStockChecker {
  private items = new Map<string, RowState>();
  private kardex: KardexEntry[] = [];
  private auditMerma: MermaAuditEntry[] = [];
  private subscribers = new Set<() => void>();
  private version = 0;
  /** Cache para useSyncExternalStore: misma referencia si version no cambió (evita bucle infinito). */
  private snapshotCache: InventorySnapshotState | null = null;
  private snapshotCacheVersion = -1;
  private readonly warningFactor: number;
  private readonly onReplenishAlert?: (payload: ReplenishAlertPayload) => void;
  /** Evita spam de toasts: solo al cruzar a crítico. */
  private alertArmed = new Map<string, boolean>();

  constructor(private readonly options: InventoryServiceOptions) {
    this.warningFactor = options.warningFactor ?? 1.5;
    this.onReplenishAlert = options.onReplenishAlert;
    this.seedFromProducts(options.products, options.seedQuantity);
  }

  subscribe(listener: () => void): () => void {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  getSnapshot(): InventorySnapshotState {
    if (
      this.snapshotCache === null ||
      this.snapshotCacheVersion !== this.version
    ) {
      this.snapshotCacheVersion = this.version;
      this.snapshotCache = {
        levels: this.buildLevels(),
        kardex: [...this.kardex],
        summary: this.buildSummary(),
        auditMerma: [...this.auditMerma],
        version: this.version,
      };
    }
    return this.snapshotCache;
  }

  seedFromProducts(products: readonly Product[], defaultQty: number): void {
    const factor = this.options.initialCostFactor ?? 0.45;
    for (const p of products) {
      if (this.items.has(p.id)) continue;
      const initialWac = Math.round(p.price * factor * 100) / 100;
      const minLevel = Math.max(3, Math.floor(defaultQty * 0.82));
      this.items.set(p.id, {
        quantity: defaultQty,
        weightedAverageCost: initialWac,
        minLevel,
        name: p.name,
        icon: p.icon,
      });
      this.pushKardex({
        productId: p.id,
        productLabel: p.name,
        kind: "initial",
        quantityIn: defaultQty,
        quantityOut: 0,
        unitCost: initialWac,
        note: "Stock inicial / semilla",
      });
    }
    this.bump();
  }

  async checkStock(productId: string, requestedQty: number): Promise<StockCheckOutcome> {
    const row = this.items.get(productId);
    const available = row?.quantity ?? 0;
    if (requestedQty <= 0) {
      return { ok: false, available, reason: "Cantidad inválida" };
    }
    if (available >= requestedQty) {
      return { ok: true, available };
    }
    return {
      ok: false,
      available,
      reason: available === 0 ? "Sin stock" : `Solo quedan ${available}`,
    };
  }

  /**
   * T4: entrada de mercadería — incrementa stock y recalcula CPP (WAC).
   */
  registerEntry(productId: string, quantity: number, unitCost: number): void {
    if (quantity <= 0 || unitCost < 0) {
      throw new Error("Entrada inválida: cantidad y costo deben ser positivos");
    }
    const row = this.items.get(productId);
    if (!row) {
      throw new Error(`Producto desconocido: ${productId}`);
    }
    const oldQty = row.quantity;
    const oldWac = row.weightedAverageCost;
    const newQty = oldQty + quantity;
    const newWac =
      newQty > 0
        ? Math.round(((oldQty * oldWac + quantity * unitCost) / newQty) * 10000) / 10000
        : oldWac;
    row.quantity = newQty;
    row.weightedAverageCost = newWac;
    this.pushKardex({
      productId,
      productLabel: row.name,
      kind: "entry",
      quantityIn: quantity,
      quantityOut: 0,
      unitCost,
      note: `CPP → ${newWac.toFixed(4)}`,
    });
    this.checkLevels();
    this.bump();
  }

  /**
   * T6: merma — descuenta unidades y registra auditoría.
   */
  registerMerma(productId: string, quantity: number, reason: string): void {
    if (quantity <= 0) {
      throw new Error("Merma: cantidad debe ser positiva");
    }
    const row = this.items.get(productId);
    if (!row) {
      throw new Error(`Producto desconocido: ${productId}`);
    }
    if (row.quantity < quantity) {
      throw new Error("Stock insuficiente para registrar merma");
    }
    row.quantity -= quantity;
    const id = `MER-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    this.auditMerma.push({
      id,
      ts: new Date().toISOString(),
      productId,
      productLabel: row.name,
      quantity,
      reason,
    });
    this.pushKardex({
      productId,
      productLabel: row.name,
      kind: "merma",
      quantityIn: 0,
      quantityOut: quantity,
      note: reason,
      referenceId: id,
    });
    this.checkLevels();
    this.bump();
  }

  /**
   * T5: evalúa niveles mínimos y dispara alerta de reabastecimiento (toast vía callback).
   */
  checkLevels(): void {
    for (const [productId, row] of this.items) {
      const critical = row.quantity < row.minLevel;
      if (critical) {
        if (!this.alertArmed.get(productId)) {
          this.onReplenishAlert?.({
            productId,
            name: row.name,
            current: row.quantity,
            minLevel: row.minLevel,
          });
          this.alertArmed.set(productId, true);
        }
      } else {
        this.alertArmed.set(productId, false);
      }
    }
  }

  /**
   * T3: descuento atómico tras venta confirmada (listener SALE_COMPLETED).
   * Todas las líneas se aplican o se revierte el estado previo.
   */
  processSaleCompletedAtomic(payload: SaleCompletedInventoryPayload): void {
    const snap = this.cloneInternal();
    try {
      for (const line of payload.lines) {
        const row = this.items.get(line.productId);
        if (!row || row.quantity < line.quantity) {
          throw new Error(
            `Stock insuficiente para venta ${payload.saleId}: ${line.productId}`
          );
        }
      }
      for (const line of payload.lines) {
        const row = this.items.get(line.productId)!;
        row.quantity -= line.quantity;
        this.pushKardex({
          productId: line.productId,
          productLabel: row.name,
          kind: "sale",
          quantityIn: 0,
          quantityOut: line.quantity,
          referenceId: payload.saleId,
          note: "Venta POS",
        });
      }
      this.checkLevels();
      this.bump();
    } catch (e) {
      this.restoreInternal(snap);
      throw e;
    }
  }

  /** @deprecated usar processSaleCompletedAtomic vía EventBus */
  adjustStock(productId: string, delta: number): void {
    const row = this.items.get(productId);
    if (!row) return;
    row.quantity = Math.max(0, row.quantity + delta);
    this.bump();
  }

  getAvailable(productId: string): number {
    return this.items.get(productId)?.quantity ?? 0;
  }

  private buildLevels(): ProductStockLevel[] {
    const out: ProductStockLevel[] = [];
    for (const [productId, row] of this.items) {
      const status = this.levelStatus(row);
      out.push({
        productId,
        name: row.name,
        icon: row.icon,
        quantity: row.quantity,
        minLevel: row.minLevel,
        weightedAverageCost: row.weightedAverageCost,
        status,
      });
    }
    return out.sort((a, b) => a.name.localeCompare(b.name));
  }

  private levelStatus(row: RowState): StockLevelStatus {
    if (row.quantity < row.minLevel) return "critical";
    if (row.quantity < row.minLevel * this.warningFactor) return "warning";
    return "ok";
  }

  private buildSummary(): KardexSummaryRow[] {
    const agg = new Map<
      string,
      { name: string; icon?: string; ini: number; in: number; outSale: number; outMerma: number; final: number }
    >();
    for (const [id, row] of this.items) {
      agg.set(id, {
        name: row.name,
        icon: row.icon,
        ini: 0,
        in: 0,
        outSale: 0,
        outMerma: 0,
        final: row.quantity,
      });
    }
    for (const k of this.kardex) {
      const a = agg.get(k.productId);
      if (!a) continue;
      switch (k.kind) {
        case "initial":
          a.ini += k.quantityIn;
          break;
        case "entry":
          a.in += k.quantityIn;
          break;
        case "sale":
          a.outSale += k.quantityOut;
          break;
        case "merma":
          a.outMerma += k.quantityOut;
          break;
        default:
          break;
      }
    }
    const rows: KardexSummaryRow[] = [];
    for (const [productId, v] of agg) {
      rows.push({
        productId,
        name: v.name,
        icon: v.icon,
        stockInicial: v.ini,
        entradas: v.in,
        ventas: v.outSale,
        mermas: v.outMerma,
        stockFinal: v.final,
      });
    }
    return rows.sort((a, b) => a.name.localeCompare(b.name));
  }

  private pushKardex(p: {
    productId: string;
    productLabel: string;
    kind: KardexMovementKind;
    quantityIn: number;
    quantityOut: number;
    unitCost?: number;
    referenceId?: string;
    note?: string;
  }): void {
    const row = this.items.get(p.productId);
    const balanceAfter = row?.quantity ?? 0;
    const id = `KX-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const entry: KardexEntry = {
      id,
      ts: new Date().toISOString(),
      productId: p.productId,
      productLabel: p.productLabel,
      kind: p.kind,
      quantityIn: p.quantityIn,
      quantityOut: p.quantityOut,
      balanceAfter,
      unitCost: p.unitCost,
      referenceId: p.referenceId,
      note: p.note,
    };
    this.kardex.unshift(entry);
  }

  private cloneInternal(): InternalSnapshot {
    const items = new Map<string, RowState>();
    for (const [k, v] of this.items) {
      items.set(k, { ...v });
    }
    return {
      items,
      kardex: [...this.kardex],
      auditMerma: [...this.auditMerma],
      alertArmed: new Map(this.alertArmed),
    };
  }

  private restoreInternal(s: InternalSnapshot): void {
    this.items = s.items;
    this.kardex = s.kardex;
    this.auditMerma = s.auditMerma;
    this.alertArmed = s.alertArmed;
    this.snapshotCache = null;
  }

  private bump(): void {
    this.version += 1;
    this.subscribers.forEach((cb) => cb());
  }
}
