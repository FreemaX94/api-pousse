import React from 'react';
import { motion } from 'framer-motion';
import { useTheme, THEMES } from '../../../contexts/ThemeContext';

const ThemeButtons = () => {
  const { theme, setTheme } = useTheme();

  const themeButtons = [
    { key: THEMES.LIGHT, icon: '☀️', label: 'Clair' },
    { key: THEMES.DARK, icon: '🌙', label: 'Sombre' },
    { key: THEMES.BEIGE, icon: '🏜️', label: 'Beige' }
  ];

  return (
    <motion.div 
      className="flex items-center space-x-2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {themeButtons.map(({ key, icon, label }, index) => (
        <motion.button
          key={key}
          whileHover={{ 
            scale: 1.1, 
            y: -3, 
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 1.0 + (index * 0.1),
            ease: "easeOut"
          }}
          onClick={() => setTheme(key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: theme === key ? 'var(--color-primary)' : 'var(--glass-bg)',
            backdropFilter: 'var(--glass-backdrop)',
            border: `2px solid ${theme === key ? 'var(--color-primary)' : 'var(--glass-border)'}`,
            borderRadius: 'var(--radius-xl)',
            color: theme === key ? 'white' : 'var(--color-text-primary)',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: theme === key ? 'var(--shadow-lg)' : 'var(--shadow-md)',
            transition: 'all var(--transition-base)'
          }}
          onMouseEnter={(e) => {
            if (theme !== key) {
              e.target.style.background = 'var(--color-bg-secondary)';
              e.target.style.borderColor = 'var(--color-primary)';
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (theme !== key) {
              e.target.style.background = 'var(--glass-bg)';
              e.target.style.borderColor = 'var(--glass-border)';
              e.target.style.transform = 'translateY(0) scale(1)';
            }
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>{icon}</span>
          <span>{label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default ThemeButtons;