import { useState } from 'react';
import { motion } from 'framer-motion';
import { StockDashboard } from '@/features/almacen/inventario/StockDashboard';
import { KardexTable } from '@/features/almacen/kardex/KardexTable';
import { EntradaModal } from '@/features/almacen/entrada/EntradaModal';
import { useStock } from '@/context/StockContext';

type Tab = 'inventario' | 'kardex';

export const Almacen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inventario');
  const [showEntrada, setShowEntrada] = useState(false);
  const { articulos, getNivelSemaforo } = useStock();
  const criticos = articulos.filter((a) => getNivelSemaforo(a) === 'ROJO').length;

  return (
    <div style={{ padding: '16px', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
      >
        <div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: 22, fontWeight: 800 }}>📦 Gestión de Almacén</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', margin: 0, fontSize: 12 }}>
            Módulo 2 — Control de Inventario · Nivel Operativo
          </p>
        </div>

        {/* Alert banner if critical */}
        {criticos > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)',
              borderRadius: 12, padding: '8px 16px',
              color: '#fca5a5', fontWeight: 700, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 8,
            }}
            className="pulse-critical"
          >
            🚨 {criticos} producto{criticos > 1 ? 's' : ''} en nivel crítico — ¡Reabastecer!
          </motion.div>
        )}

        {/* Nueva entrada button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowEntrada(true)}
          style={{
            padding: '10px 20px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            color: '#fff', fontWeight: 700, fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(52,211,153,0.35)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          + Nueva Entrada
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {([
          { id: 'inventario', label: '📊 Inventario en Tiempo Real' },
          { id: 'kardex',     label: '📋 Registro Kardex' },
        ] as const).map(({ id, label }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(id)}
            style={{
              padding: '8px 18px', borderRadius: 10, border: '1px solid',
              borderColor: activeTab === id ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
              background: activeTab === id ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)',
              color: '#fff', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="glass"
        style={{ flex: 1, padding: 20, overflowY: 'auto' }}
      >
        {activeTab === 'inventario' ? <StockDashboard /> : <KardexTable />}
      </motion.div>

      {/* Entrada modal */}
      <EntradaModal visible={showEntrada} onClose={() => setShowEntrada(false)} />
    </div>
  );
};
