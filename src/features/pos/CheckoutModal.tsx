import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { PaymentMethod } from "@/types";
import { useCart } from "@/hooks/useCart";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { completeCheckout, grandTotal } = useCart();
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<{
    saleId: string;
    cuf: string;
    total: number;
  } | null>(null);

  const pay = async (m: PaymentMethod) => {
    setMethod(m);
    setBusy(true);
    try {
      const r = await completeCheckout(m);
      setReceipt(r);
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    setReceipt(null);
    setMethod(null);
    onClose();
  };

  return (
    <Modal open={open} title="Cobro" onClose={handleClose}>
      {!receipt ? (
        <div className="space-y-4">
          <p className="text-sm text-frosty-ink/75">
            Total a cobrar:{" "}
            <span className="font-bold text-frosty-ink">
              Bs {grandTotal.toFixed(2)}
            </span>
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl border border-white/50 bg-white/40 p-4"
            >
              <p className="mb-2 text-sm font-semibold text-frosty-ink">
                QR / Digital
              </p>
              <div className="mb-3 flex aspect-square max-h-40 items-center justify-center rounded-xl bg-white/80 text-frosty-ink/40">
                QR simulado
              </div>
              <Button
                type="button"
                className="w-full"
                disabled={busy}
                onClick={() => void pay("qr")}
              >
                {busy && method === "qr" ? "Facturando…" : "Confirmar QR"}
              </Button>
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl border border-white/50 bg-white/40 p-4"
            >
              <p className="mb-2 text-sm font-semibold text-frosty-ink">
                Efectivo
              </p>
              <p className="mb-3 text-xs text-frosty-ink/60">
                Registra el pago en efectivo y emite comprobante SFE.
              </p>
              <Button
                type="button"
                className="w-full"
                disabled={busy}
                onClick={() => void pay("cash")}
              >
                {busy && method === "cash" ? "Facturando…" : "Confirmar efectivo"}
              </Button>
            </motion.div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 text-sm text-frosty-ink"
        >
          <p className="font-semibold text-emerald-700">Venta registrada</p>
          <p>
            <span className="text-frosty-ink/60">SFE ID:</span>{" "}
            {receipt.saleId}
          </p>
          <p>
            <span className="text-frosty-ink/60">CUF:</span> {receipt.cuf}
          </p>
          <p>
            <span className="text-frosty-ink/60">Total:</span> Bs{" "}
            {receipt.total.toFixed(2)}
          </p>
          <p className="text-xs text-frosty-ink/55">
            T3: inventario ajustado · T8: puntos CRM si había cliente
          </p>
          <Button type="button" className="mt-2 w-full" onClick={handleClose}>
            Listo
          </Button>
        </motion.div>
      )}
    </Modal>
  );
}
