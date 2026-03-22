import { useCallback, useState } from "react";
import { useServices } from "@/context/ServicesContext";
import { useSale } from "@/context/SaleContext";
import type { Customer } from "@/types";

export function useCustomerLookup() {
  const { crm } = useServices();
  const { setCustomer } = useSale();
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const searchByPhone = useCallback(
    async (rawPhone: string) => {
      const digits = rawPhone.replace(/\D/g, "");
      if (digits.length < 7) {
        setHint("Ingresa al menos 7 dígitos");
        setCustomer(null);
        return null as Customer | null;
      }
      setLoading(true);
      setHint(null);
      try {
        const found = await crm.findByPhone(digits);
        setCustomer(found);
        setHint(found ? `${found.name} · ${found.points} pts` : "Cliente no encontrado");
        return found;
      } finally {
        setLoading(false);
      }
    },
    [crm, setCustomer]
  );

  const clearCustomer = useCallback(() => {
    setCustomer(null);
    setHint(null);
  }, [setCustomer]);

  return { loading, hint, searchByPhone, clearCustomer };
}
