import { useState } from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ProductGrid } from "./ProductGrid";
import { CartPanel } from "./CartPanel";
import { CustomerLookup } from "@/features/crm/CustomerLookup";
import { CheckoutModal } from "./CheckoutModal";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export function POSView() {
  const { addProduct, stockFlash } = useCart();
  const { session } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-frosty-cream via-frosty-peach/40 to-frosty-sky/50 p-4 pb-24 font-sans text-frosty-ink">
      <header className="mx-auto mb-6 flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight"
          >
            Frosty POS
          </motion.h1>
          <p className="text-sm text-frosty-ink/65">
            Flujo rápido para meta de atención{" "}
            <span className="font-semibold text-frosty-ink">≤ 90 s</span>
            {session ? (
              <span className="ml-2 rounded-full bg-white/40 px-2 py-0.5 text-xs">
                {session.name}
              </span>
            ) : null}
          </p>
        </div>
        <GlassPanel className="px-4 py-2 text-xs text-frosty-ink/70">
          Selección → stock · CRM · cobro SFE (QR / efectivo)
        </GlassPanel>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <CustomerLookup />
          <ProductGrid
            products={PRODUCTS}
            onSelect={(p) => void addProduct(p)}
            flashProductId={stockFlash?.productId}
            flashKind={stockFlash?.kind}
          />
        </div>
        <CartPanel onCheckout={() => setCheckoutOpen(true)} />
      </div>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
}
