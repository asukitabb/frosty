import type { CartLine } from "@/types";

/**
 * Single Responsibility: solo cálculo de totales de línea y venta.
 * Total = (Precio × Cantidad) − Descuento + Impuestos sobre base imponible.
 */
export class PricingService {
  computeLineSubtotal(line: CartLine): number {
    return line.product.price * line.quantity;
  }

  computeLineTotal(line: CartLine, taxRate: number): number {
    const subtotal = this.computeLineSubtotal(line);
    const afterDiscount = Math.max(0, subtotal - line.lineDiscount);
    const tax = afterDiscount * taxRate;
    return afterDiscount + tax;
  }

  computeSaleTotal(
    lines: CartLine[],
    taxRate: number,
    globalDiscount: number
  ): number {
    const linesTotal = lines.reduce(
      (acc, line) => acc + this.computeLineSubtotal(line) - line.lineDiscount,
      0
    );
    const taxable = Math.max(0, linesTotal - globalDiscount);
    return taxable + taxable * taxRate;
  }

  computeTaxes(
    lines: CartLine[],
    taxRate: number,
    globalDiscount: number
  ): number {
    const linesTotal = lines.reduce(
      (acc, line) => acc + this.computeLineSubtotal(line) - line.lineDiscount,
      0
    );
    const taxable = Math.max(0, linesTotal - globalDiscount);
    return taxable * taxRate;
  }
}
