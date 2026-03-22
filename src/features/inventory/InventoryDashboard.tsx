import { useState } from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useInventorySnapshot } from "@/hooks/useInventorySnapshot";
import { useServices } from "@/context/ServicesContext";
import { PRODUCTS } from "@/data/products";
import type { ProductStockLevel } from "@/types/inventory";

function semaphoreStyles(level: ProductStockLevel): string {
  if (level.status === "critical") {
    return "border-red-300/80 bg-gradient-to-br from-red-100/90 to-frosty-peach/70 text-red-900";
  }
  if (level.status === "warning") {
    return "border-amber-200/90 bg-gradient-to-br from-amber-100/80 to-frosty-peach/60 text-amber-950";
  }
  return "border-emerald-200/80 bg-gradient-to-br from-emerald-100/70 to-frosty-mint/50 text-emerald-950";
}

export function InventoryDashboard() {
  const snap = useInventorySnapshot();
  const { inventory } = useServices();
  const [pid, setPid] = useState(PRODUCTS[0]?.id ?? "");
  const [entryQty, setEntryQty] = useState("6");
  const [entryCost, setEntryCost] = useState("3.25");
  const [mermaQty, setMermaQty] = useState("1");
  const [mermaReason, setMermaReason] = useState("Vencimiento controlado");

  const handleEntry = () => {
    try {
      inventory.registerEntry(pid, Number(entryQty), Number(entryCost));
    } catch (e) {
      window.alert((e as Error).message);
    }
  };

  const handleMerma = () => {
    try {
      inventory.registerMerma(
        pid,
        Number(mermaQty),
        mermaReason.trim() || "Sin motivo"
      );
    } catch (e) {
      window.alert((e as Error).message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-28">
      <div className="rounded-3xl border border-white/40 bg-white/25 px-4 py-3 text-sm text-frosty-ink/75 shadow-inner backdrop-blur-md">
        <span className="font-semibold text-frosty-ink">Simulación T3:</span> al
        cobrar en el POS, el bus emite{" "}
        <code className="rounded bg-white/50 px-1.5 py-0.5 text-xs">SALE_COMPLETED</code>{" "}
        y el inventario descuenta de forma atómica. Esta vista se actualiza en
        vivo (v{snap.version}).
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-frosty-ink">
          Grilla de semáforos (T5)
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {snap.levels.map((level) => (
            <motion.div
              key={level.productId}
              layout
              animate={
                level.status === "critical"
                  ? { x: [0, -4, 4, -3, 3, 0], rotate: [0, -0.5, 0.5, 0] }
                  : { x: 0, rotate: 0 }
              }
              transition={{
                repeat: level.status === "critical" ? Infinity : 0,
                duration: 0.45,
                ease: "easeInOut",
              }}
              className={`rounded-3xl border p-4 shadow-glass backdrop-blur-xl ${semaphoreStyles(level)}`}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-2xl">{level.icon ?? "📦"}</span>
                <span
                  className={`h-3 w-3 rounded-full ${
                    level.status === "critical"
                      ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]"
                      : level.status === "warning"
                        ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                        : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                  }`}
                  title={
                    level.status === "critical"
                      ? "Crítico"
                      : level.status === "warning"
                        ? "Atención"
                        : "OK"
                  }
                />
              </div>
              <p className="line-clamp-2 text-sm font-semibold">{level.name}</p>
              <p className="mt-1 text-xs opacity-80">
                Stock {level.quantity} · mín. {level.minLevel}
              </p>
              <p className="mt-2 text-xs font-medium opacity-90">
                CPP Bs {level.weightedAverageCost.toFixed(4)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <GlassPanel className="p-5">
          <h3 className="mb-3 font-semibold text-frosty-ink">
            T4 — Entrada (CPP)
          </h3>
          <div className="space-y-3">
            <label className="block text-xs font-medium uppercase tracking-wide text-frosty-ink/60">
              Producto
            </label>
            <select
              className="w-full rounded-2xl border border-white/50 bg-white/45 px-4 py-3 text-frosty-ink min-h-[48px]"
              value={pid}
              onChange={(e) => setPid(e.target.value)}
            >
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.icon} {p.name}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs text-frosty-ink/60">
                  Cantidad
                </label>
                <Input
                  inputMode="decimal"
                  value={entryQty}
                  onChange={(e) => setEntryQty(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-frosty-ink/60">
                  Costo unitario
                </label>
                <Input
                  inputMode="decimal"
                  value={entryCost}
                  onChange={(e) => setEntryCost(e.target.value)}
                />
              </div>
            </div>
            <Button type="button" className="w-full" onClick={handleEntry}>
              Registrar entrada
            </Button>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <h3 className="mb-3 font-semibold text-frosty-ink">
            T6 — Merma (auditoría)
          </h3>
          <div className="space-y-3">
            <label className="block text-xs font-medium uppercase tracking-wide text-frosty-ink/60">
              Producto
            </label>
            <select
              className="w-full rounded-2xl border border-white/50 bg-white/45 px-4 py-3 text-frosty-ink min-h-[48px]"
              value={pid}
              onChange={(e) => setPid(e.target.value)}
            >
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.icon} {p.name}
                </option>
              ))}
            </select>
            <div>
              <label className="mb-1 block text-xs text-frosty-ink/60">
                Unidades
              </label>
              <Input
                inputMode="numeric"
                value={mermaQty}
                onChange={(e) => setMermaQty(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-frosty-ink/60">
                Motivo (log)
              </label>
              <Input
                value={mermaReason}
                onChange={(e) => setMermaReason(e.target.value)}
                placeholder="Ej. merma operativa 0.2% meta"
              />
            </div>
            <Button type="button" variant="danger" className="w-full" onClick={handleMerma}>
              Registrar merma
            </Button>
          </div>
        </GlassPanel>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-frosty-ink">
          Kardex digital (resumen)
        </h2>
        <GlassPanel className="overflow-x-auto p-4">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/40 text-xs uppercase tracking-wide text-frosty-ink/55">
                <th className="py-2 pr-3">Producto</th>
                <th className="py-2 pr-3 text-right">Inicial</th>
                <th className="py-2 pr-3 text-right text-emerald-800">+ Entradas</th>
                <th className="py-2 pr-3 text-right text-sky-900">− Ventas</th>
                <th className="py-2 pr-3 text-right text-rose-900">− Mermas</th>
                <th className="py-2 text-right font-semibold text-frosty-ink">
                  = Final
                </th>
              </tr>
            </thead>
            <tbody>
              {snap.summary.map((row) => {
                const check =
                  row.stockInicial +
                  row.entradas -
                  row.ventas -
                  row.mermas;
                const ok = Math.abs(check - row.stockFinal) < 0.001;
                return (
                  <tr
                    key={row.productId}
                    className="border-b border-white/25 last:border-0"
                  >
                    <td className="py-2 pr-3">
                      <span className="mr-1">{row.icon}</span>
                      {row.name}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      {row.stockInicial}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums text-emerald-800">
                      {row.entradas}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums text-sky-900">
                      {row.ventas}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums text-rose-900">
                      {row.mermas}
                    </td>
                    <td className="py-2 text-right font-semibold tabular-nums">
                      {row.stockFinal}
                      {!ok ? (
                        <span className="ml-2 text-xs text-red-600">⚠</span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-frosty-ink/55">
            Ecuación: Stock inicial + entradas − ventas (POS) − mermas = stock
            final. El descuento por venta se refleja al confirmar el cobro en el
            módulo POS.
          </p>
        </GlassPanel>
      </section>

      {snap.auditMerma.length > 0 ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-frosty-ink">
            Auditoría de mermas (T6)
          </h2>
          <GlassPanel className="p-4">
            <ul className="space-y-2 text-sm">
              {snap.auditMerma.slice(0, 12).map((m) => (
                <li
                  key={m.id}
                  className="rounded-2xl bg-white/35 px-3 py-2 text-frosty-ink"
                >
                  <span className="text-frosty-ink/60">
                    {new Date(m.ts).toLocaleString()}
                  </span>{" "}
                  · <strong>{m.productLabel}</strong> −{m.quantity} u. ·{" "}
                  <em>{m.reason}</em>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </section>
      ) : null}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-frosty-ink">
          Movimientos recientes
        </h2>
        <GlassPanel className="max-h-80 overflow-y-auto p-4">
          <ul className="space-y-2 text-sm">
            {snap.kardex.slice(0, 40).map((k) => (
              <li
                key={k.id}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-2xl bg-white/30 px-3 py-2"
              >
                <span className="text-frosty-ink/70">
                  {new Date(k.ts).toLocaleString()}
                </span>
                <span className="font-medium text-frosty-ink">
                  {k.productLabel}{" "}
                  <span className="text-xs opacity-70">({k.kind})</span>
                </span>
                <span className="tabular-nums">
                  {k.quantityIn > 0 ? `+${k.quantityIn}` : ""}
                  {k.quantityOut > 0 ? ` −${k.quantityOut}` : ""}
                  {" → "}
                  <strong>{k.balanceAfter}</strong>
                </span>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </section>
    </div>
  );
}
