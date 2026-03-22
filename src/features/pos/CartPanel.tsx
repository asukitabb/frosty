import { AnimatePresence, motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";

export function CartPanel({ onCheckout }: { onCheckout: () => void }) {
  const {
    lines,
    incrementLine,
    decrementLine,
    grandTotal,
    taxes,
    globalDiscount,
    customer,
    clearSale,
  } = useCart();

  return (
    <GlassPanel className="flex h-full min-h-[320px] flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-frosty-ink">Carrito</h2>
        <Button
          type="button"
          variant="ghost"
          className="!min-h-0 !px-3 !py-2 text-sm"
          onClick={clearSale}
          disabled={lines.length === 0}
        >
          Vaciar
        </Button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {lines.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-frosty-ink/50"
            >
              Toca un producto para agregarlo. Validamos stock al instante.
            </motion.p>
          ) : (
            lines.map((line) => (
              <motion.div
                key={line.product.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between gap-2 rounded-2xl bg-white/35 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-frosty-ink">
                    {line.product.icon} {line.product.name}
                  </p>
                  <p className="text-xs text-frosty-ink/60">
                    Bs {line.product.price.toFixed(2)} c/u
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="!min-h-0 !min-w-0 !px-3 !py-2 text-lg"
                    onClick={() => decrementLine(line.product.id)}
                  >
                    −
                  </Button>
                  <span className="w-6 text-center text-sm font-bold">
                    {line.quantity}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    className="!min-h-0 !min-w-0 !px-3 !py-2 text-lg"
                    onClick={() => void incrementLine(line.product.id)}
                  >
                    +
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 space-y-1 border-t border-white/40 pt-3 text-sm">
        {customer ? (
          <div className="flex justify-between text-frosty-ink/80">
            <span>Cliente</span>
            <span className="font-medium">{customer.name}</span>
          </div>
        ) : null}
        <div className="flex justify-between text-frosty-ink/80">
          <span>Descuento global</span>
          <span>- Bs {globalDiscount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-frosty-ink/80">
          <span>Impuestos</span>
          <span>Bs {taxes.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-frosty-ink">
          <span>Total</span>
          <span>Bs {grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <Button
        type="button"
        className="mt-4 w-full"
        disabled={lines.length === 0}
        onClick={onCheckout}
      >
        Cobrar
      </Button>
    </GlassPanel>
  );
}
