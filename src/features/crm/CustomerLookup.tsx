import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCustomerLookup } from "@/hooks/useCustomerLookup";
import { useCart } from "@/hooks/useCart";

export function CustomerLookup() {
  const [phone, setPhone] = useState("");
  const { loading, hint, searchByPhone, clearCustomer } = useCustomerLookup();
  const { customer } = useCart();

  return (
    <GlassPanel className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-frosty-ink/70">
            Celular (CRM)
          </label>
          <Input
            inputMode="tel"
            autoComplete="tel"
            placeholder="59170000001"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            className="min-w-[120px]"
            disabled={loading}
            onClick={() => void searchByPhone(phone)}
          >
            {loading ? "Buscando…" : "Buscar"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              clearCustomer();
              setPhone("");
            }}
          >
            Limpiar
          </Button>
        </div>
      </div>
      {hint ? (
        <p className="mt-3 text-sm text-frosty-ink/80">{hint}</p>
      ) : null}
      {customer ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {customer.benefits.map((b) => (
            <span
              key={b}
              className="rounded-full bg-frosty-lavender/50 px-3 py-1 text-xs font-medium text-frosty-ink"
            >
              {b}
            </span>
          ))}
        </div>
      ) : null}
    </GlassPanel>
  );
}
