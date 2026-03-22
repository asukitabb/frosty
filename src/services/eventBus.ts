export const SALE_EVENTS = {
  /** T3: venta cerrada — el listener descuenta stock de forma atómica */
  SALE_COMPLETED: "sale:completed",
  /** T8: acumulación de puntos CRM */
  CRM_POINTS: "crm:points",
  /** T5: alerta de reabastecimiento (toast en UI) */
  INVENTORY_REPLENISH_ALERT: "inventory:replenish",
} as const;

export type SaleEventName = (typeof SALE_EVENTS)[keyof typeof SALE_EVENTS];

type Handler<T> = (payload: T) => void | Promise<void>;

/**
 * Bus de eventos para señales entre POS, inventario y CRM.
 */
export class EventBus {
  private listeners = new Map<string, Set<Handler<unknown>>>();

  on<T>(event: SaleEventName, handler: Handler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const set = this.listeners.get(event)!;
    const wrapped = handler as Handler<unknown>;
    set.add(wrapped);
    return () => set.delete(wrapped);
  }

  async emit<T>(event: SaleEventName, payload: T): Promise<void> {
    const set = this.listeners.get(event);
    if (!set) return;
    await Promise.all([...set].map((fn) => Promise.resolve(fn(payload))));
  }
}
