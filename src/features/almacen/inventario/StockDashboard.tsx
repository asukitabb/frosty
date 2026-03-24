import { motion } from 'framer-motion';
import { useStock } from '@/context/StockContext';
import { StockCard } from './StockCard';

export const StockDashboard: React.FC = () => {
  const { articulos, getNivelSemaforo } = useStock();

  const criticos = articulos.filter((a) => getNivelSemaforo(a) === 'ROJO').length;
  const alertas  = articulos.filter((a) => getNivelSemaforo(a) === 'NARANJA').length;
  const optimos  = articulos.filter((a) => getNivelSemaforo(a) === 'VERDE').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Óptimo', count: optimos, color: '#34d399', bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.35)', icon: '✅' },
          { label: 'Alerta',  count: alertas,  color: '#fbbf24', bg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.35)',  icon: '⚠️' },
          { label: 'Crítico', count: criticos, color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',    icon: '🚨' },
        ].map(({ label, count, color, bg, border, icon }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: bg, border: `1px solid ${border}`,
              borderRadius: 14, padding: '12px 14px',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}
          >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ color, fontWeight: 800, fontSize: 28 }}>{count}</span>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 600 }}>
              {label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
        gap: 12,
      }}>
        {articulos.map((art) => (
          <StockCard key={art.idArticulo} articulo={art} />
        ))}
      </div>
    </div>
  );
};
