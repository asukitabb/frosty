import type { Customer } from "@/types";

const MOCK_DB: Customer[] = [
  {
    id: "c1",
    name: "María López",
    phone: "59170000001",
    points: 120,
    tier: "gold",
    benefits: ["10% en conos", "Doble puntos martes"],
  },
  {
    id: "c2",
    name: "Carlos Vega",
    phone: "59170000002",
    points: 40,
    tier: "silver",
    benefits: ["5% en bebidas"],
  },
];

/**
 * CRM — búsqueda por celular (T7). Sustituir por API real.
 */
export class CrmService {
  async findByPhone(phone: string): Promise<Customer | null> {
    await this.delay();
    const normalized = phone.replace(/\D/g, "");
    return MOCK_DB.find((c) => c.phone.replace(/\D/g, "") === normalized) ?? null;
  }

  async addPoints(customerId: string, points: number): Promise<number> {
    await this.delay();
    const c = MOCK_DB.find((x) => x.id === customerId);
    if (!c) return 0;
    c.points += points;
    return c.points;
  }

  private delay(): Promise<void> {
    return new Promise((r) => setTimeout(r, 280 + Math.random() * 200));
  }
}
