import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductGrid } from '@/features/comercial/catalogo/ProductGrid';
import { CartPanel } from '@/features/comercial/carrito/CartPanel';
import { PaymentSelector } from '@/features/comercial/pago/PaymentSelector';
import { InvoiceModal } from '@/features/comercial/factura/InvoiceModal';
import { Toast } from '@/components/Toast';

export const POS: React.FC = () => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCheckout = () => setShowInvoice(true);

  const handleConfirm = () => {
    setShowInvoice(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <div style={{ padding: '16px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: 22, fontWeight: 800 }}>🛒 Punto de Venta (POS)</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', margin: 0, fontSize: 12 }}>
            Módulo 1 — Gestión Comercial · Nivel Operativo
          </p>
        </div>
      </motion.div>

      {/* Main layout: Catalog | Cart + Payment */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 16, overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* Left: Product catalog */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass"
          style={{ padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          <h2 style={{ color: '#fff', margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>
            🍦 Catálogo de Productos
          </h2>
          <ProductGrid />
        </motion.div>

        {/* Right: Cart + Payment stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden', minHeight: 0 }}>
          {/* Cart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass"
            style={{ flex: 1, padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}
          >
            <CartPanel onCheckout={handleCheckout} />
          </motion.div>

          {/* Payment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass"
            style={{ padding: 16, flexShrink: 0 }}
          >
            <PaymentSelector />
          </motion.div>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        visible={showInvoice}
        onClose={() => setShowInvoice(false)}
        onConfirm={handleConfirm}
      />

      {/* Success Toast */}
      <Toast
        visible={showToast}
        message="✅ Venta registrada exitosamente"
        type="success"
      />
    </div>
  );
};
