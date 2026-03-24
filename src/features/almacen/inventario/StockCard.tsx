import { motion } from 'framer-motion';
import type { ArticuloStock, NivelSemaforo } from '@/types';
import { useStock } from '@/context/StockContext';

interface StockCardProps {
  articulo: ArticuloStock;
}

const semaforoConfig: Record<NivelSemaforo, { bg: string; border: string; badge: string; label: string; pulse: boolean }> = {
  VERDE: {
    bg: 'rgba(52, 211, 153, 0.15)',
    border: 'rgba(52, 211, 153, 0.45)',
    badge: 'rgba(52, 211, 153, 0.3)',
    label: '✅ Óptimo',
    pulse: false,
  },
  NARANJA: {
    bg: 'rgba(251, 191, 36, 0.15)',
    border: 'rgba(251, 191, 36, 0.45)',
    badge: 'rgba(251, 191, 36, 0.3)',
    label: '⚠️ Alerta',
    pulse: false,
  },
  ROJO: {
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.5)',
    badge: 'rgba(239, 68, 68, 0.3)',
    label: '🚨 Crítico',
    pulse: true,
  },
};

export const StockCard: React.FC<StockCardProps> = ({ articulo }) => {
  const { getNivelSemaforo } = useStock();
  const nivel = getNivelSemaforo(articulo);
  const cfg = semaforoConfig[nivel];

  const pct = Math.min(100, (articulo.cantidadActual / articulo.stockMaximo) * 100);

  const barColor =
    nivel === 'VERDE' ? '#34d399' :
    nivel === 'NARANJA' ? '#fbbf24' :
    '#ef4444';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={cfg.pulse ? 'pulse-critical' : ''}
      style={{
        background: cfg.bg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${cfg.border}`,
        borderRadius: 16,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Top: Name + badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>
            {articulo.nombre}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, marginTop: 2 }}>
            {articulo.idArticulo}
          </div>
        </div>
        <span style={{
          background: cfg.badge, borderRadius: 20,
          padding: '3px 8px', color: '#fff',
          fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {cfg.label}
        </span>
      </div>

      {/* Stock number */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 26 }}>
          {articulo.cantidadActual}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{articulo.unidad}</span>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{
          height: 6, background: 'rgba(255,255,255,0.12)',
          borderRadius: 4, overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ height: '100%', background: barColor, borderRadius: 4 }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Mín: {articulo.stockMinimo}</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Máx: {articulo.stockMaximo}</span>
        </div>
      </div>
    </motion.div>
  );
};
