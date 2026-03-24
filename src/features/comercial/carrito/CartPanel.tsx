import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { PricingService } from '@/services/PricingService';

export const CartPanel: React.FC<{ onCheckout: () => void }> = ({ onCheckout }) => {
  const { lineas, totales, quitarArticulo, cambiarCantidad, cambiarDescuentoLinea } = useCart();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ color: '#fff', margin: 0, fontSize: 16, fontWeight: 700 }}>
          🛒 Carrito
        </h3>
        <span style={{
          background: 'rgba(167,139,250,0.4)',
          color: '#fff', fontSize: 12, fontWeight: 700,
          padding: '2px 10px', borderRadius: 20,
        }}>
          {lineas.length} ítem{lineas.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Lines */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <AnimatePresence mode="popLayout">
          {lineas.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginTop: 40, fontSize: 13 }}
            >
              <div style={{ fontSize: 36 }}>🛒</div>
              <p>El carrito está vacío</p>
            </motion.div>
          )}
          {lineas.map((linea) => (
            <motion.div
              key={linea.articulo.id}
              layout
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 12,
                padding: '10px 12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{linea.articulo.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                    {linea.articulo.nombre}
                  </div>
                  {/* Quantity + discount controls */}
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Quantity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button onClick={() => cambiarCantidad(linea.articulo.id, linea.cantidad - 1)}
                        disabled={linea.cantidad <= 1}
                        style={btnSmall}>−</button>
                      <span style={{ color: '#fff', fontWeight: 700, minWidth: 20, textAlign: 'center', fontSize: 14 }}>
                        {linea.cantidad}
                      </span>
                      <button onClick={() => cambiarCantidad(linea.articulo.id, linea.cantidad + 1)}
                        style={btnSmall}>+</button>
                    </div>
                    {/* Discount */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Dto%</span>
                      <input
                        type="number" min={0} max={100}
                        value={linea.descuentoLinea}
                        onChange={(e) => cambiarDescuentoLinea(linea.articulo.id, Math.min(100, Math.max(0, +e.target.value)))}
                        style={{
                          width: 44, padding: '2px 4px', borderRadius: 6,
                          background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                          color: '#fff', fontSize: 12, textAlign: 'center',
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 4 }}>
                    {linea.cantidad} × {PricingService.formatCurrency(linea.articulo.precioUnitario)}
                    {linea.descuentoLinea > 0 && ` − ${linea.descuentoLinea}%`}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>
                    {PricingService.formatCurrency(linea.subtotalLinea)}
                  </span>
                  <button onClick={() => quitarArticulo(linea.articulo.id)} style={btnRemove}>✕</button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Totals bar */}
      {lineas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>
            <span>Subtotal bruto</span>
            <span>{PricingService.formatCurrency(totales.totalBruto)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 800, fontSize: 16 }}>
            <span>Total estimado</span>
            <span style={{ color: '#86efac' }}>{PricingService.formatCurrency(totales.totalBruto)}</span>
          </div>
        </motion.div>
      )}

      {/* Checkout button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={lineas.length === 0}
        onClick={onCheckout}
        style={{
          padding: '14px',
          borderRadius: 14,
          border: 'none',
          background: lineas.length === 0
            ? 'rgba(255,255,255,0.1)'
            : 'linear-gradient(135deg, #a78bfa, #f472b6)',
          color: '#fff', fontWeight: 800, fontSize: 15,
          cursor: lineas.length === 0 ? 'not-allowed' : 'pointer',
          opacity: lineas.length === 0 ? 0.4 : 1,
          boxShadow: lineas.length > 0 ? '0 4px 20px rgba(167,139,250,0.4)' : 'none',
          transition: 'all 0.25s',
        }}
      >
        💳 Proceder al Pago
      </motion.button>
    </div>
  );
};

const btnSmall: React.CSSProperties = {
  width: 26, height: 26, borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)',
  background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
  padding: 0,
};

const btnRemove: React.CSSProperties = {
  background: 'rgba(248,113,113,0.2)', border: '1px solid rgba(248,113,113,0.4)',
  borderRadius: 8, width: 24, height: 24, color: '#fca5a5',
  cursor: 'pointer', fontSize: 11, fontWeight: 700, padding: 0,
};
