import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.25)',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', gap: 16,
        height: 64,
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 16 }}>
        <motion.span
          style={{ fontSize: 28 }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          🍦
        </motion.span>
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>Frosty</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 500, lineHeight: 1, letterSpacing: 1 }}>SISTEMA ERP</div>
        </div>
      </div>

      {/* Separator */}
      <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.2)', marginRight: 8 }} />

      {/* Nav links */}
      {[
        { to: '/', label: '🛒 Caja / POS', badge: 'Módulo 1' },
        { to: '/almacen', label: '📦 Almacén', badge: 'Módulo 2' },
      ].map(({ to, label, badge }) => (
        <NavLink
          key={to}
          to={to}
          end
          style={({ isActive }) => ({
            textDecoration: 'none',
            background: isActive ? 'rgba(255,255,255,0.22)' : 'transparent',
            border: '1px solid',
            borderColor: isActive ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)',
            borderRadius: 10,
            padding: '6px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s',
          })}
        >
          {({ isActive }) => (
            <>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{label}</span>
              <span style={{
                background: isActive ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 20,
                letterSpacing: 0.5,
              }}>{badge}</span>
            </>
          )}
        </NavLink>
      ))}

      {/* Spacer + Date */}
      <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 500 }}>
        {new Date().toLocaleDateString('es-BO', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
      </div>
    </motion.nav>
  );
};
