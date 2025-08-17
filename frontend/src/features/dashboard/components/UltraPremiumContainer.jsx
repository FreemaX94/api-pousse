import React from 'react';
import { motion } from 'framer-motion';
import useThemeUltraPremium from '../hooks/useThemeUltraPremium';

const UltraPremiumContainer = ({ 
  children, 
  title, 
  icon: Icon,
  className = '',
  showThemeSelector = true,
  specialEffect = true 
}) => {
  const { theme, currentTheme, themes, changeTheme, getClasses, getSpecialEffect } = useThemeUltraPremium();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={getClasses('container', className)}
    >
      {/* Effet spécial de fond */}
      {specialEffect && getSpecialEffect() && (
        <div className={`fixed inset-0 ${getSpecialEffect()} pointer-events-none`} />
      )}

      {/* Header avec titre et sélecteur de thème */}
      <div className="relative z-10 mb-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center"
        >
          {/* Titre */}
          {title && (
            <div className="flex items-center gap-4">
              {Icon && (
                <div className={`p-3 rounded-xl ${theme.glass} ${theme.border}`}>
                  <Icon className={`w-8 h-8 ${theme.accent}`} />
                </div>
              )}
              <h1 className={`text-4xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                {title}
              </h1>
            </div>
          )}

          {/* Sélecteur de thème */}
          {showThemeSelector && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={getClasses('glass', 'p-2 flex gap-2 flex-wrap max-w-md')}
            >
              {Object.entries(themes).map(([key, themeOption]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => changeTheme(key)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${currentTheme === key 
                      ? `bg-gradient-to-r ${themeOption.primary} text-white shadow-lg ${themeOption.glow}`
                      : `${theme.glass} ${theme.hover} ${theme.text}`
                    }
                  `}
                  title={themeOption.name}
                >
                  {themeOption.name}
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Contenu principal */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Effet de lueur néon si activé */}
      {theme.neon && (
        <div className="fixed inset-0 pointer-events-none">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r ${theme.primary} opacity-20 blur-3xl animate-pulse`} />
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r ${theme.primary} opacity-20 blur-3xl animate-pulse delay-1000`} />
        </div>
      )}
    </motion.div>
  );
};

export default UltraPremiumContainer;