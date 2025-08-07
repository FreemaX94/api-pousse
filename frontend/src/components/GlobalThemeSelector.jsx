import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTheme, THEMES } from '../contexts/ThemeContext';

const GlobalThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const themeButtons = [
    { key: THEMES.DARK, icon: '🌙', label: 'Sombre' },
    { key: THEMES.LIGHT, icon: '☀️', label: 'Clair' },
    { key: THEMES.BEIGE, icon: '🏜️', label: 'Beige' },
    { key: THEMES.DAWN, icon: '🌸', label: 'Rosé' },
    { key: THEMES.NEON, icon: '🔮', label: 'Néon' },
    { key: THEMES.OCEAN, icon: '🌊', label: 'Océan' },
    { key: THEMES.TROPICAL, icon: '🌺', label: 'Tropical' },
    { key: THEMES.LAVENDER, icon: '💜', label: 'Lavande' },
    { key: THEMES.GALAXY, icon: '🌌', label: 'Galaxie' },
    { key: THEMES.AUTUMN, icon: '🍂', label: 'Automne' },
    { key: THEMES.GLACIER, icon: '❄️', label: 'Glacier' },
    { key: THEMES.SAKURA, icon: '🌸', label: 'Sakura' },
    { key: THEMES.MIDNIGHT, icon: '🌙', label: 'Minuit' },
    { key: THEMES.LAVA, icon: '🔥', label: 'Lave' }
  ];

  const currentTheme = themeButtons.find(t => t.key === theme) || themeButtons[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div 
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          padding: '0.8rem 1.2rem',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          border: '2px solid var(--glass-border)',
          borderRadius: '15px',
          color: 'var(--color-text-primary)',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          minWidth: '160px',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>{currentTheme.icon}</span>
          <span>{currentTheme.label}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              border: '2px solid var(--glass-border)',
              borderRadius: '15px',
              padding: '0.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              minWidth: '180px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            {themeButtons.map(({ key, icon, label }, index) => (
              <motion.button
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ 
                  x: 5,
                  backgroundColor: 'var(--color-primary-alpha)'
                }}
                onClick={() => {
                  setTheme(key);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  background: theme === key ? 'var(--color-primary)' : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  color: theme === key ? 'white' : 'var(--color-text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: theme === key ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                <span>{label}</span>
                {theme === key && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      marginLeft: 'auto',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'white'
                    }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GlobalThemeSelector;