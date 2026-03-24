import type { LineaFactura } from '@/types';

/**
 * PricingService — Single Responsibility: ALL price math lives here.
 * No UI, no context, no side effects. Pure calculation functions.
 */
export class PricingService {
  /**
   * Calculates the net total of a single line after applying line discount.
   */
  static calcularSubtotalLinea(
    cantidad: number,
    precioUnitario: number,
    descuentoLinea: number // 0–100
  ): number {
    const bruto = cantidad * precioUnitario;
    const descuento = bruto * (descuentoLinea / 100);
    return parseFloat((bruto - descuento).toFixed(2));
  }

  /**
   * Calculates global totals from all lines + general discount.
   */
  static calcularTotales(
    lineas: LineaFactura[],
    descuentoGeneral: number // 0–100
  ): {
    totalBruto: number;
    montoDescuento: number;
    totalNeto: number;
  } {
    const totalBruto = parseFloat(
      lineas.reduce((acc, l) => acc + l.subtotalLinea, 0).toFixed(2)
    );
    const montoDescuento = parseFloat(
      (totalBruto * (descuentoGeneral / 100)).toFixed(2)
    );
    const totalNeto = parseFloat((totalBruto - montoDescuento).toFixed(2));
    return { totalBruto, montoDescuento, totalNeto };
  }

  /**
   * Formats a number as Bolivia currency string.
   */
  static formatCurrency(amount: number): string {
    return `Bs. ${amount.toFixed(2)}`;
  }

  /**
   * Generates a unique invoice number.
   */
  static generarNumeroFactura(): string {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(Math.random() * 9000) + 1000;
    return `FCT-${date}-${rand}`;
  }
}
