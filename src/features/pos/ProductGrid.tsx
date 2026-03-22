import { motion } from "framer-motion";
import type { Product } from "@/types";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface ProductGridProps {
  products: Product[];
  onSelect: (p: Product) => void;
  flashProductId?: string | null;
  flashKind?: "ok" | "error" | null;
}

export function ProductGrid({
  products,
  onSelect,
  flashProductId,
  flashKind,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {products.map((p) => {
        const isFlash = flashProductId === p.id;
        const flashState = isFlash ? flashKind : null;
        return (
          <motion.button
            type="button"
            key={p.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: flashState === "ok" ? [1, 1.04, 1] : 1,
              x: flashState === "error" ? [0, -6, 6, -4, 4, 0] : 0,
            }}
            transition={{
              layout: { type: "spring", stiffness: 380, damping: 32 },
              scale: { duration: 0.35 },
              x: { duration: 0.4 },
            }}
            onClick={() => onSelect(p)}
            className="text-left touch-manipulation"
          >
            <GlassPanel className="flex h-full flex-col gap-2 p-3 transition hover:bg-white/70">
              <div className="flex h-16 items-center justify-center text-4xl">
                {p.icon ?? "🍦"}
              </div>
              <div>
                <p className="line-clamp-2 text-sm font-semibold text-frosty-ink">
                  {p.name}
                </p>
                <p className="mt-1 text-xs text-frosty-ink/60">{p.category}</p>
              </div>
              <p className="mt-auto text-lg font-bold text-frosty-ink">
                Bs {p.price.toFixed(2)}
              </p>
            </GlassPanel>
          </motion.button>
        );
      })}
    </div>
  );
}
