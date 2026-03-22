/** Movimiento en el Kardex digital (T1–T8). */
export type KardexMovementKind = "initial" | "entry" | "sale" | "merma";

export interface KardexEntry {
  id: string;
  ts: string;
  productId: string;
  productLabel: string;
  kind: KardexMovementKind;
  quantityIn: number;
  quantityOut: number;
  balanceAfter: number;
  unitCost?: number;
  referenceId?: string;
  note?: string;
}

/** Auditoría de mermas (T6). */
export interface MermaAuditEntry {
  id: string;
  ts: string;
  productId: string;
  productLabel: string;
  quantity: number;
  reason: string;
}

/** Payload atómico post-venta (T3 / SALE_COMPLETED). */
export interface SaleCompletedInventoryPayload {
  saleId: string;
  lines: readonly { productId: string; quantity: number }[];
}

/** Estado para semáforo de niveles (T5). */
export type StockLevelStatus = "ok" | "warning" | "critical";

export interface ProductStockLevel {
  productId: string;
  name: string;
  icon?: string;
  quantity: number;
  minLevel: number;
  weightedAverageCost: number;
  status: StockLevelStatus;
}

/** Fila resumen: Inicial + Entradas − Ventas − Mermas = Final. */
export interface KardexSummaryRow {
  productId: string;
  name: string;
  icon?: string;
  stockInicial: number;
  entradas: number;
  ventas: number;
  mermas: number;
  stockFinal: number;
}

export interface ReplenishAlertPayload {
  productId: string;
  name: string;
  current: number;
  minLevel: number;
}
