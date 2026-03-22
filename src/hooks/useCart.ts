import { useMemo } from "react";
import { useSale } from "@/context/SaleContext";
import { useServices } from "@/context/ServicesContext";

/** Lógica de carrito + totales delegados a PricingService. */
export function useCart() {
  const sale = useSale();
  const { pricing } = useServices();

  const totals = useMemo(() => {
    const subtotalBeforeTax = sale.lines.reduce(
      (acc, line) =>
        acc + pricing.computeLineSubtotal(line) - line.lineDiscount,
      0
    );
    const afterGlobal = Math.max(0, subtotalBeforeTax - sale.globalDiscount);
    const taxes = afterGlobal * sale.taxRate;
    const grandTotal = afterGlobal + taxes;
    return { subtotalBeforeTax, taxes, grandTotal };
  }, [sale.lines, sale.globalDiscount, sale.taxRate, pricing]);

  return {
    lines: sale.lines,
    stockFlash: sale.stockFlash,
    addProduct: sale.addProduct,
    incrementLine: sale.incrementLine,
    decrementLine: sale.decrementLine,
    removeLine: sale.removeLine,
    clearSale: sale.clearSale,
    completeCheckout: sale.completeCheckout,
    customer: sale.customer,
    setCustomer: sale.setCustomer,
    globalDiscount: sale.globalDiscount,
    taxRate: sale.taxRate,
    ...totals,
  };
}
