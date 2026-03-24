import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { EventBus } from '@/services/EventBus';
import { PricingService } from '@/services/PricingService';
import type { Factura } from '@/types';

interface InvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const EMPRESA = {
  nombre: 'Heladería Frosty S.R.L.',
  ruc: '1234567890',
  direccion: 'Av. Blanco Galindo Km 5, Cochabamba - Bolivia',
  telefono: '+591 4 444-1234',
};

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ visible, onClose, onConfirm }) => {
  const { lineas, descuentoGeneral, metodoPago, totales, limpiarCarrito } = useCart();
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteNit, setClienteNit] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const factura: Factura = {
    numeroFactura: PricingService.generarNumeroFactura(),
    fecha: new Date().toISOString(),
    cabecera: {
      fecha: new Date().toLocaleString('es-BO'),
      empresa: EMPRESA,
      cliente: { nombre: clienteNombre || 'Consumidor Final', nit: clienteNit || '0' },
    },
    lineas,
    pie: {
      totalBruto: totales.totalBruto,
      descuentoGeneral,
      montoDescuento: totales.montoDescuento,
      totalNeto: totales.totalNeto,
      metodoPago,
    },
  };

  const handleConfirm = () => {
    setConfirmed(true);
    EventBus.emit('VENTA_COMPLETADA', { factura });
    setTimeout(() => {
      limpiarCarrito();
      setConfirmed(false);
      setClienteNombre('');
      setClienteNit('');
      onConfirm();
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
              width: '100%', maxWidth: 640, maxHeight: '90vh',
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 20,
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header bar */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(167,139,250,0.5), rgba(244,114,182,0.5))',
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>📄 Documento de Venta</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>N° {factura.numeroFactura}</div>
              </div>
              <button onClick={onClose} style={{
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 8, color: '#fff', cursor: 'pointer', padding: '4px 10px', fontSize: 14,
              }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* ── CABECERA ────────────────────────────────────────────────── */}
              <section>
                <SectionTitle>📋 Cabecera del Documento</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <InfoBlock title="Empresa (Origen)">
                    <strong>{EMPRESA.nombre}</strong>
                    <span>RUC: {EMPRESA.ruc}</span>
                    <span>{EMPRESA.direccion}</span>
                    <span>{EMPRESA.telefono}</span>
                  </InfoBlock>
                  <InfoBlock title="Cliente (Destino)">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <input
                        placeholder="Nombre del cliente"
                        value={clienteNombre}
                        onChange={(e) => setClienteNombre(e.target.value)}
                        style={inputStyle}
                      />
                      <input
                        placeholder="NIT / CI"
                        value={clienteNit}
                        onChange={(e) => setClienteNit(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </InfoBlock>
                </div>
                <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
                  📅 {factura.cabecera.fecha}
                </div>
              </section>

              {/* ── CUERPO ──────────────────────────────────────────────────── */}
              <section>
                <SectionTitle>📦 Líneas de Transacción (Cuerpo)</SectionTitle>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                        {['Código', 'Descripción', 'Cant.', 'P. Unit.', 'Dto%', 'Total'].map((h) => (
                          <th key={h} style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600, padding: '6px 8px', textAlign: 'left' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lineas.map((l, i) => (
                        <motion.tr
                          key={l.articulo.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <td style={tdStyle}><code style={{ color: '#c4b5fd', fontSize: 10 }}>{l.articulo.id}</code></td>
                          <td style={tdStyle}>{l.articulo.emoji} {l.articulo.nombre}</td>
                          <td style={{ ...tdStyle, textAlign: 'center' }}>{l.cantidad}</td>
                          <td style={tdStyle}>Bs. {l.articulo.precioUnitario.toFixed(2)}</td>
                          <td style={{ ...tdStyle, color: l.descuentoLinea > 0 ? '#fde68a' : 'rgba(255,255,255,0.4)' }}>
                            {l.descuentoLinea}%
                          </td>
                          <td style={{ ...tdStyle, fontWeight: 700, color: '#86efac' }}>
                            Bs. {l.subtotalLinea.toFixed(2)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ── PIE ─────────────────────────────────────────────────────── */}
              <section>
                <SectionTitle>💰 Pie del Documento</SectionTitle>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px' }}>
                  <Row label="Total Bruto" value={`Bs. ${totales.totalBruto.toFixed(2)}`} />
                  {totales.montoDescuento > 0 && (
                    <Row label={`Descuento General (${descuentoGeneral}%)`} value={`−Bs. ${totales.montoDescuento.toFixed(2)}`} color="#fde68a" />
                  )}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: 8, paddingTop: 8 }}>
                    <Row label="TOTAL A PAGAR" value={`Bs. ${totales.totalNeto.toFixed(2)}`} large color="#86efac" />
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Forma de pago:</span>
                    <span style={{
                      background: 'rgba(167,139,250,0.3)', border: '1px solid rgba(167,139,250,0.5)',
                      borderRadius: 8, padding: '2px 10px', color: '#fff', fontWeight: 700, fontSize: 12,
                    }}>
                      {metodoPago === 'EFECTIVO' ? '💵' : '📱'} {metodoPago}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Confirm button */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirm}
                disabled={confirmed}
                style={{
                  width: '100%', padding: '14px',
                  borderRadius: 14, border: 'none',
                  background: confirmed
                    ? 'linear-gradient(135deg, #34d399, #059669)'
                    : 'linear-gradient(135deg, #a78bfa, #f472b6)',
                  color: '#fff', fontWeight: 800, fontSize: 16,
                  cursor: confirmed ? 'default' : 'pointer',
                  boxShadow: '0 4px 24px rgba(167,139,250,0.4)',
                  transition: 'background 0.3s',
                }}
              >
                {confirmed ? '✅ Venta Registrada' : '✅ Confirmar Venta'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    color: '#c4b5fd', fontWeight: 700, fontSize: 12, letterSpacing: 0.5,
    marginBottom: 8, textTransform: 'uppercase',
  }}>
    {children}
  </div>
);

const InfoBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{
    background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px',
    border: '1px solid rgba(255,255,255,0.12)',
  }}>
    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>{title}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, color: '#fff', fontSize: 12 }}>
      {children}
    </div>
  </div>
);

const Row: React.FC<{ label: string; value: string; color?: string; large?: boolean }> = ({ label, value, color = 'rgba(255,255,255,0.8)', large }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
    <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: large ? 14 : 12 }}>{label}</span>
    <span style={{ color, fontWeight: large ? 800 : 600, fontSize: large ? 16 : 12 }}>{value}</span>
  </div>
);

const tdStyle: React.CSSProperties = { color: '#fff', padding: '7px 8px' };
const inputStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 8,
  background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
  color: '#fff', fontSize: 12, outline: 'none',
};
