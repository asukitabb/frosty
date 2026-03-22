import { useState } from "react";
import { ServicesProvider } from "@/context/ServicesContext";
import { SaleProvider } from "@/context/SaleContext";
import { POSView } from "@/features/pos/POSView";
import { InventoryView } from "@/features/inventory/InventoryView";
import { ReplenishToastHost } from "@/components/ui/ReplenishToastHost";

type Tab = "pos" | "inventory";

function Shell() {
  const [tab, setTab] = useState<Tab>("pos");

  return (
    <div className="relative min-h-screen">
      <nav className="sticky top-0 z-40 border-b border-white/40 bg-white/35 px-4 py-2 shadow-glass backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 sm:justify-start">
          <button
            type="button"
            onClick={() => setTab("pos")}
            className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition touch-manipulation min-h-[48px] ${
              tab === "pos"
                ? "bg-gradient-to-r from-frosty-mint/90 to-frosty-sky/80 text-frosty-ink shadow"
                : "bg-white/30 text-frosty-ink/70 hover:bg-white/45"
            }`}
          >
            POS
          </button>
          <button
            type="button"
            onClick={() => setTab("inventory")}
            className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition touch-manipulation min-h-[48px] ${
              tab === "inventory"
                ? "bg-gradient-to-r from-frosty-lavender/90 to-frosty-rose/70 text-frosty-ink shadow"
                : "bg-white/30 text-frosty-ink/70 hover:bg-white/45"
            }`}
          >
            Inventario
          </button>
        </div>
      </nav>

      <ReplenishToastHost />

      {tab === "pos" ? <POSView /> : <InventoryView />}
    </div>
  );
}

export default function App() {
  return (
    <ServicesProvider>
      <SaleProvider>
        <Shell />
      </SaleProvider>
    </ServicesProvider>
  );
}
