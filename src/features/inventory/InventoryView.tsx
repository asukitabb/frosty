import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { InventoryDashboard } from "./InventoryDashboard";

/**
 * Vista contenedora del módulo inventario: semáforos, Kardex y controles T4/T6.
 */
export function InventoryView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-frosty-cream via-frosty-lavender/35 to-frosty-mint/40 p-4 font-sans text-frosty-ink">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-6 max-w-6xl"
      >
        <GlassPanel className="px-5 py-4">
          <h1 className="text-2xl font-bold tracking-tight text-frosty-ink">
            Frosty Inventario
          </h1>
          <p className="mt-1 text-sm text-frosty-ink/70">
            Kardex automático, CPP en entradas, mermas auditadas y alertas de
            reabastecimiento. Objetivo: mermas controladas hacia el 0.2%.
          </p>
        </GlassPanel>
      </motion.header>
      <InventoryDashboard />
    </div>
  );
}
