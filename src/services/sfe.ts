import type { CartLine, Customer, PaymentMethod, SaleReceipt } from "@/types";
import { PricingService } from "./pricing";

export interface SfeSubmitInput {
  lines: CartLine[];
  customer: Customer | null;
  taxRate: number;
  globalDiscount: number;
  paymentMethod: PaymentMethod;
}

/**
 * Simulador de Facturación Electrónica (SFE) — reemplazar por integración real.
 */
export class SfeService {
  constructor(private pricing: PricingService) {}

  async submitElectronicInvoice(input: SfeSubmitInput): Promise<SaleReceipt> {
    await this.simulateLatency();
    const total = this.pricing.computeSaleTotal(
      input.lines,
      input.taxRate,
      input.globalDiscount
    );
    const saleId = `SFE-${Date.now().toString(36).toUpperCase()}`;
    const rnd =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const cuf = `CUF-${rnd.replace(/-/g, "").slice(0, 12).toUpperCase()}`;
    return {
      saleId,
      cuf,
      qrPayload: `SFE|${saleId}|${total.toFixed(2)}|${input.paymentMethod}`,
      total,
      issuedAt: new Date().toISOString(),
    };
  }

  private simulateLatency(): Promise<void> {
    return new Promise((r) => setTimeout(r, 450 + Math.random() * 200));
  }
}
