import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  CrmService,
  EventBus,
  InventoryService,
  PricingService,
  SfeService,
  SALE_EVENTS,
} from "@/services";
import type { SaleCompletedInventoryPayload } from "@/types/inventory";
import { PRODUCTS } from "@/data/products";

export interface AppServices {
  pricing: PricingService;
  inventory: InventoryService;
  sfe: SfeService;
  crm: CrmService;
  eventBus: EventBus;
}

const ServicesContext = createContext<AppServices | null>(null);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AppServices>(() => {
    const pricing = new PricingService();
    const eventBus = new EventBus();
    const inventory = new InventoryService({
      products: PRODUCTS,
      seedQuantity: 24,
      onReplenishAlert: (a) => {
        void eventBus.emit(SALE_EVENTS.INVENTORY_REPLENISH_ALERT, a);
      },
    });
    return {
      pricing,
      inventory,
      sfe: new SfeService(pricing),
      crm: new CrmService(),
      eventBus,
    };
  }, []);

  useEffect(() => {
    const { eventBus, inventory } = value;
    const off = eventBus.on<SaleCompletedInventoryPayload>(
      SALE_EVENTS.SALE_COMPLETED,
      (payload) => {
        try {
          inventory.processSaleCompletedAtomic(payload);
        } catch (e) {
          console.error("[T3] Fallo al aplicar venta al inventario:", e);
        }
      }
    );
    return off;
  }, [value]);

  return (
    <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>
  );
}

export function useServices(): AppServices {
  const ctx = useContext(ServicesContext);
  if (!ctx) {
    throw new Error("useServices debe usarse dentro de ServicesProvider");
  }
  return ctx;
}
