export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  icon?: string;
  category: string;
}

export interface CartLine {
  product: Product;
  quantity: number;
  lineDiscount: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  points: number;
  tier: "bronze" | "silver" | "gold";
  benefits: string[];
}

export type PaymentMethod = "qr" | "cash";

export interface SaleDraft {
  lines: CartLine[];
  customer: Customer | null;
  taxRate: number;
  globalDiscount: number;
}

export interface SaleReceipt {
  saleId: string;
  cuf: string;
  qrPayload: string;
  total: number;
  issuedAt: string;
}

export interface SaleCompletedPayload {
  saleId: string;
  customerId: string | null;
  lines: CartLine[];
  total: number;
  paymentMethod: PaymentMethod;
}

export type StockCheckResult =
  | { ok: true; available: number }
  | { ok: false; available: number; reason: string };

export * from "./inventory";
