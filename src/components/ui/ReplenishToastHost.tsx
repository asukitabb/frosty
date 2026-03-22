import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useServices } from "@/context/ServicesContext";
import { SALE_EVENTS } from "@/services";
import type { ReplenishAlertPayload } from "@/types/inventory";

interface ToastItem {
  id: string;
  message: string;
}

/**
 * T5: escucha alertas de reabastecimiento emitidas por InventoryService vía EventBus.
 */
export function ReplenishToastHost() {
  const { eventBus } = useServices();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return eventBus.on<ReplenishAlertPayload>(
      SALE_EVENTS.INVENTORY_REPLENISH_ALERT,
      (p) => {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`;
        const message = `Reabastecer: ${p.name} — stock ${p.current} (mín. ${p.minLevel})`;
        setToasts((prev) => [...prev, { id, message }]);
        window.setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5200);
      }
    );
  }, [eventBus]);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="pointer-events-auto rounded-2xl border border-frosty-rose/60 bg-gradient-to-br from-frosty-peach/95 to-frosty-rose/80 px-4 py-3 text-sm font-medium text-frosty-ink shadow-glass backdrop-blur-md"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
