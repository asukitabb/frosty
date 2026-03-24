import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStock } from '@/context/StockContext';

interface EntradaModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EntradaModal: React.FC<EntradaModalProps> = ({ visible, onClose }) => {
  const { articulos, registrarEntrada } = useStock();
  const [idArticulo, setIdArticulo] = useState('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [referencia, setReferencia] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idArticulo || cantidad < 1) return;
    registrarEntrada(idArticulo, cantidad, referencia);
    setSubmitted(true);
    setTimeout(() => {
      setIdArticulo('');
      setCantidad(1);
      setReferencia('');
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 460,
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(52,211,153,0.4), rgba(16,185,129,0.4))',
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>📦 Entrada de Mercancía</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Registro manual de recepción de proveedor</div>
              </div>
              <button onClick={onClose} style={{
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 8, color: '#fff', cursor: 'pointer', padding: '4px 10px', fontSize: 14,
              }}>✕</button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Articulo Select */}
              <div>
                <label style={labelStyle}>Artículo / Insumo</label>
                <select
                  required
                  value={idArticulo}
                  onChange={(e) => setIdArticulo(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="" style={{ background: '#1e1b4b' }}>Seleccionar artículo...</option>
                  {articulos.map((a) => (
                    <option key={a.idArticulo} value={a.idArticulo} style={{ background: '#1e1b4b' }}>
                      {a.nombre} (Stock actual: {a.cantidadActual} {a.unidad})
                    </option>
                  ))}
                </select>
              </div>

              {/* Cantidad */}
              <div>
                <label style={labelStyle}>Cantidad a ingresar</label>
                <input
                  type="number" min={1} required
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, +e.target.value))}
                  style={inputStyle}
                  placeholder="Ej: 20"
                />
              </div>

              {/* Referencia */}
              <div>
                <label style={labelStyle}>Referencia / N° de Orden</label>
                <input
                  type="text"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  style={inputStyle}
                  placeholder="Ej: OC-2026-001"
                />
              </div>

              {/* Preview artículo seleccionado */}
              {idArticulo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
                    borderRadius: 10, padding: '10px 12px',
                    color: 'rgba(255,255,255,0.7)', fontSize: 12,
                  }}
                >
                  {(() => {
                    const art = articulos.find((a) => a.idArticulo === idArticulo);
                    if (!art) return null;
                    return (
                      <>
                        <div><strong style={{ color: '#6ee7b7' }}>{art.nombre}</strong></div>
                        <div>Stock actual: {art.cantidadActual} {art.unidad}</div>
                        <div>Después de ingreso: <strong style={{ color: '#6ee7b7' }}>{art.cantidadActual + cantidad} {art.unidad}</strong></div>
                        <div>Máximo: {art.stockMaximo} {art.unidad}</div>
                      </>
                    );
                  })()}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                style={{
                  padding: '14px', borderRadius: 14, border: 'none',
                  background: submitted
                    ? 'linear-gradient(135deg, #34d399, #059669)'
                    : 'linear-gradient(135deg, #34d399, #10b981)',
                  color: '#fff', fontWeight: 800, fontSize: 15,
                  cursor: submitted ? 'default' : 'pointer',
                  boxShadow: '0 4px 20px rgba(52,211,153,0.3)',
                  marginTop: 4,
                  transition: 'background 0.3s',
                }}
              >
                {submitted ? '✅ Entrada Registrada' : '📦 Registrar Entrada'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block', color: 'rgba(255,255,255,0.65)',
  fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 10,
  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.22)',
  color: '#fff', fontSize: 13, outline: 'none',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
};
