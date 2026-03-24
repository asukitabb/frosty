import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
}

const icons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

const colors = {
  success: 'rgba(52, 211, 153, 0.25)',
  error: 'rgba(248, 113, 113, 0.25)',
  info: 'rgba(167, 139, 250, 0.25)',
};

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -60, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999, minWidth: 280, textAlign: 'center',
            background: colors[type],
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 14,
            padding: '14px 28px',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>{icons[type]}</span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
