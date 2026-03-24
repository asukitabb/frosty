import { motion } from 'framer-motion';
import { useStock } from '@/context/StockContext';

export const KardexTable: React.FC = () => {
  const { movimientos } = useStock();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ color: '#fff', margin: 0, fontSize: 15, fontWeight: 700 }}>
          📋 Registro Kardex — Historial de Movimientos
        </h3>
        <span style={{
          background: 'rgba(167,139,250,0.3)', borderRadius: 20,
          padding: '3px 12px', color: '#fff', fontSize: 11, fontWeight: 700,
        }}>
          {movimientos.length} registros
        </span>
      </div>

      {movimientos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            textAlign: 'center', padding: '40px 20px',
            color: 'rgba(255,255,255,0.4)', fontSize: 13,
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
          <p>No hay movimientos registrados aún.</p>
          <p style={{ fontSize: 11 }}>Los movimientos aparecerán aquí al confirmar ventas o registrar entradas.</p>
        </motion.div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                {['Tipo', 'Artículo', 'Cantidad', 'Referencia', 'Descripción', 'Fecha'].map((h) => (
                  <th key={h} style={{
                    color: 'rgba(255,255,255,0.6)', fontWeight: 600,
                    padding: '8px 10px', textAlign: 'left', whiteSpace: 'nowrap',
                    background: 'rgba(255,255,255,0.05)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov, i) => (
                <motion.tr
                  key={mov.idMovimiento}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.5) }}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)',
                  }}
                >
                  <td style={{ padding: '8px 10px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20,
                      fontWeight: 700, fontSize: 11,
                      background: mov.tipoMovimiento === 'ENTRADA'
                        ? 'rgba(52,211,153,0.25)'
                        : 'rgba(248,113,113,0.25)',
                      color: mov.tipoMovimiento === 'ENTRADA' ? '#6ee7b7' : '#fca5a5',
                      border: `1px solid ${mov.tipoMovimiento === 'ENTRADA' ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)'}`,
                    }}>
                      {mov.tipoMovimiento === 'ENTRADA' ? '⬆ ENTRADA' : '⬇ SALIDA'}
                    </span>
                  </td>
                  <td style={{ padding: '8px 10px', color: '#fff', fontWeight: 600 }}>
                    {mov.nombreArticulo}
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{mov.idArticulo}</div>
                  </td>
                  <td style={{
                    padding: '8px 10px', fontWeight: 800, fontSize: 14,
                    color: mov.tipoMovimiento === 'ENTRADA' ? '#6ee7b7' : '#fca5a5',
                  }}>
                    {mov.tipoMovimiento === 'ENTRADA' ? '+' : '−'}{mov.cantidad}
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <code style={{ color: '#c4b5fd', fontSize: 10, background: 'rgba(167,139,250,0.15)', padding: '2px 6px', borderRadius: 4 }}>
                      {mov.referenciaDocumento}
                    </code>
                  </td>
                  <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.6)', maxWidth: 200 }}>
                    {mov.descripcion}
                  </td>
                  <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', fontSize: 11 }}>
                    {new Date(mov.fecha).toLocaleString('es-BO')}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
