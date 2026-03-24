import { motion, AnimatePresence } from 'framer-motion';
import type { Articulo } from '@/types';
import { catalogo, categoriaLabels } from '@/data/catalogo';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

const categoryColors: Record<Articulo['categoria'], string> = {
  helado: 'rgba(249,198,208,0.35)',
  bebida: 'rgba(198,223,249,0.35)',
  topping: 'rgba(198,249,232,0.35)',
  combo: 'rgba(249,221,198,0.35)',
};

export const ProductGrid: React.FC = () => {
  const { agregarArticulo } = useCart();
  const [activeCategory, setActiveCategory] = useState<Articulo['categoria'] | 'all'>('all');
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? catalogo
    : catalogo.filter((a) => a.categoria === activeCategory);

  const handleAdd = (articulo: Articulo) => {
    agregarArticulo(articulo);
    setRecentlyAdded(articulo.id);
    setTimeout(() => setRecentlyAdded(null), 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['all', 'helado', 'bebida', 'topping', 'combo'].map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveCategory(cat as Articulo['categoria'] | 'all')}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: activeCategory === cat ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
              background: activeCategory === cat ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat === 'all' ? '🍽️ Todo' : categoriaLabels[cat as Articulo['categoria']]}
          </motion.button>
        ))}
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: 10,
        overflowY: 'auto',
        flex: 1,
        paddingRight: 4,
      }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((articulo) => (
            <motion.button
              key={articulo.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleAdd(articulo)}
              style={{
                background: recentlyAdded === articulo.id
                  ? 'rgba(52,211,153,0.35)'
                  : categoryColors[articulo.categoria],
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: recentlyAdded === articulo.id
                  ? 'rgba(52,211,153,0.7)'
                  : 'rgba(255,255,255,0.3)',
                borderRadius: 14,
                padding: '14px 10px',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6,
                transition: 'background 0.25s, border-color 0.25s',
              }}
            >
              <motion.span
                style={{ fontSize: 32 }}
                animate={recentlyAdded === articulo.id ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {articulo.emoji}
              </motion.span>
              <span style={{
                color: '#fff', fontWeight: 700, fontSize: 11,
                textAlign: 'center', lineHeight: 1.3,
              }}>
                {articulo.nombre}
              </span>
              <span style={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 800, fontSize: 13,
                background: 'rgba(0,0,0,0.15)',
                padding: '2px 8px', borderRadius: 10,
              }}>
                Bs. {articulo.precioUnitario.toFixed(2)}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
