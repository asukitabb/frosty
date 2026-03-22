import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Customer, PaymentMethod, Product } from "@/types";
import { SALE_EVENTS } from "@/services";
import { useServices } from "./ServicesContext";

const TAX_RATE = 0.13;

type StockFlash = { productId: string; kind: "ok" | "error" } | null;

interface SaleContextValue {
  lines: CartLine[];
  customer: Customer | null;
  globalDiscount: number;
  taxRate: number;
  stockFlash: StockFlash;
  addProduct: (product: Product) => Promise<void>;
  incrementLine: (productId: string) => Promise<void>;
  decrementLine: (productId: string) => void;
  removeLine: (productId: string) => void;
  setCustomer: (c: Customer | null) => void;
  clearSale: () => void;
  completeCheckout: (method: PaymentMethod) => Promise<{
    saleId: string;
    cuf: string;
    total: number;
  }>;
}

const SaleContext = createContext<SaleContextValue | null>(null);

export function SaleProvider({ children }: { children: ReactNode }) {
  const { inventory, sfe, crm, eventBus } = useServices();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [stockFlash, setStockFlash] = useState<StockFlash>(null);

  const globalDiscount = useMemo(() => {
    if (!customer) return 0;
    if (customer.tier === "gold") return 2;
    if (customer.tier === "silver") return 1;
    return 0;
  }, [customer]);

  useEffect(() => {
    const offPts = eventBus.on<{ customerId: string; points: number }>(
      SALE_EVENTS.CRM_POINTS,
      async (p) => {
        await crm.addPoints(p.customerId, p.points);
      }
    );
    return () => {
      offPts();
    };
  }, [eventBus, crm]);

  const triggerFlash = useCallback((productId: string, kind: "ok" | "error") => {
    setStockFlash({ productId, kind });
    window.setTimeout(() => setStockFlash(null), 450);
  }, []);

  const addProduct = useCallback(
    async (product: Product) => {
      const currentQty =
        lines.find((l) => l.product.id === product.id)?.quantity ?? 0;
      const nextQty = currentQty + 1;
      const check = await inventory.checkStock(product.id, nextQty);
      if (!check.ok) {
        triggerFlash(product.id, "error");
        return;
      }
      triggerFlash(product.id, "ok");
      setLines((prev) => {
        const idx = prev.findIndex((l) => l.product.id === product.id);
        if (idx === -1) {
          return [...prev, { product, quantity: 1, lineDiscount: 0 }];
        }
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      });
    },
    [inventory, lines, triggerFlash]
  );

  const incrementLine = useCallback(
    async (productId: string) => {
      const line = lines.find((l) => l.product.id === productId);
      if (!line) return;
      const nextQty = line.quantity + 1;
      const check = await inventory.checkStock(productId, nextQty);
      if (!check.ok) {
        triggerFlash(productId, "error");
        return;
      }
      triggerFlash(productId, "ok");
      setLines((prev) =>
        prev.map((l) =>
          l.product.id === productId ? { ...l, quantity: nextQty } : l
        )
      );
    },
    [inventory, lines, triggerFlash]
  );

  const decrementLine = useCallback((productId: string) => {
    setLines((prev) => {
      const line = prev.find((l) => l.product.id === productId);
      if (!line) return prev;
      if (line.quantity <= 1) {
        return prev.filter((l) => l.product.id !== productId);
      }
      return prev.map((l) =>
        l.product.id === productId
          ? { ...l, quantity: l.quantity - 1 }
          : l
      );
    });
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  }, []);

  const clearSale = useCallback(() => {
    setLines([]);
    setCustomer(null);
  }, []);

  const completeCheckout = useCallback(
    async (method: PaymentMethod) => {
      const receipt = await sfe.submitElectronicInvoice({
        lines,
        customer,
        taxRate: TAX_RATE,
        globalDiscount,
        paymentMethod: method,
      });

      await eventBus.emit(SALE_EVENTS.SALE_COMPLETED, {
        saleId: receipt.saleId,
        lines: lines.map((l) => ({
          productId: l.product.id,
          quantity: l.quantity,
        })),
      });

      if (customer) {
        const points = Math.max(
          1,
          Math.round(receipt.total * (customer.tier === "gold" ? 1.2 : 1))
        );
        await eventBus.emit(SALE_EVENTS.CRM_POINTS, {
          customerId: customer.id,
          points,
        });
      }

      setLines([]);
      setCustomer(null);

      return {
        saleId: receipt.saleId,
        cuf: receipt.cuf,
        total: receipt.total,
      };
    },
    [sfe, lines, customer, globalDiscount, eventBus]
  );

  const value: SaleContextValue = {
    lines,
    customer,
    globalDiscount,
    taxRate: TAX_RATE,
    stockFlash,
    addProduct,
    incrementLine,
    decrementLine,
    removeLine,
    setCustomer,
    clearSale,
    completeCheckout,
  };

  return (
    <SaleContext.Provider value={value}>{children}</SaleContext.Provider>
  );
}

export function useSale(): SaleContextValue {
  const ctx = useContext(SaleContext);
  if (!ctx) {
    throw new Error("useSale debe usarse dentro de SaleProvider");
  }
  return ctx;
}
