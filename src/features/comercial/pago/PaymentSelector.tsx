import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export const PaymentSelector: React.FC = () => {
  const { metodoPago, setMetodoPago, descuentoGeneral, setDescuentoGeneral, totales } = useCart();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Payment Method */}
      <div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
          MÉTODO DE PAGO
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          {(['EFECTIVO', 'QR'] as const).map((metodo) => (
            <motion.button
              key={metodo}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setMetodoPago(metodo)}
              style={{
                flex: 1, padding: '14px 10px', borderRadius: 14,
                border: '2px solid',
                borderColor: metodoPago === metodo ? 'rgba(167,139,250,0.8)' : 'rgba(255,255,255,0.2)',
                background: metodoPago === metodo ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.08)',
                color: '#fff', fontWeight: 700, fontSize: 15,
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}
            >
              <span style={{ fontSize: 24 }}>{metodo === 'EFECTIVO' ? '💵' : '📱'}</span>
              <span>{metodo}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* General Discount */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, margin: 0 }}>
            DESCUENTO GENERAL
          </p>
          <span style={{ color: '#fde68a', fontWeight: 800, fontSize: 14 }}>{descuentoGeneral}%</span>
        </div>
        <input
          type="range" min={0} max={50} step={1}
          value={descuentoGeneral}
          onChange={(e) => setDescuentoGeneral(+e.target.value)}
          style={{ width: '100%', accentColor: '#a78bfa' }}
        />
        {descuentoGeneral > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            style={{
              marginTop: 8, padding: '8px 12px', borderRadius: 10,
              background: 'rgba(251,191,36,0.15)',
              border: '1px solid rgba(251,191,36,0.3)',
              color: '#fde68a', fontSize: 12,
              display: 'flex', justifyContent: 'space-between',
            }}
          >
            <span>Descuento aplicado:</span>
            <span style={{ fontWeight: 700 }}>−Bs. {totales.montoDescuento.toFixed(2)}</span>
          </motion.div>
        )}
      </div>

      {/* Summary */}
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 12, padding: '12px 14px',
        border: '1px solid rgba(255,255,255,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 4 }}>
          <span>Subtotal</span><span>Bs. {totales.totalBruto.toFixed(2)}</span>
        </div>
        {totales.montoDescuento > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fde68a', fontSize: 12, marginBottom: 4 }}>
            <span>Descuento</span><span>−Bs. {totales.montoDescuento.toFixed(2)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 800, fontSize: 18, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 8, marginTop: 4 }}>
          <span>TOTAL</span>
          <span style={{ color: '#86efac' }}>Bs. {totales.totalNeto.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
