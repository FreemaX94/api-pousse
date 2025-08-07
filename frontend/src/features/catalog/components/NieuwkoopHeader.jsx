import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ThemeButtons from './ThemeButtons';

const NieuwkoopHeader = ({ 
  searchTerm, 
  setSearchTerm, 
  totalNieuwkoopItems, 
  totalPrice, 
  totalQty 
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="nieuwkoop-header"
    >
      <div className="header-content">
        <div className="header-left">
          <motion.h1
            initial={{ opacity: 0, y: -30, scale: 0.8, rotateX: -45 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              rotateX: 0,
              textShadow: [
                '0 0 20px rgba(16, 185, 129, 0.3)',
                '0 0 30px rgba(16, 185, 129, 0.6)',
                '0 0 20px rgba(16, 185, 129, 0.3)'
              ]
            }}
            transition={{ 
              duration: 1.0, 
              delay: 0.2,
              ease: "easeOut"
            }}
            whileHover={{
              scale: 1.05,
              y: -3,
              transition: { 
                type: "spring",
                stiffness: 300,
                damping: 10
              }
            }}
            className="nieuwkoop-title"
            style={{
              fontSize: '2.5rem',
              fontWeight: '400',
              color: '#ffffff',
              letterSpacing: '0.08em',
              fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
              textShadow: `
                1px 1px 0px #059669,
                2px 2px 0px #10b981,
                3px 3px 0px #34d399,
                4px 4px 10px rgba(0,0,0,0.4),
                0 0 25px rgba(16, 185, 129, 0.5)
              `,
              cursor: 'pointer',
              transformStyle: 'preserve-3d'
            }}
          >
            <motion.span
              animate={{
                rotate: [0, 8, -8, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ display: 'inline-block', marginRight: '0.8rem' }}
            >
              🌱
            </motion.span>
            
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              {['N', 'i', 'e', 'u', 'w', 'k', 'o', 'o', 'p'].map((letter, index) => (
                <motion.span
                  key={index}
                  animate={{
                    textShadow: [
                      `1px 1px 0px #059669, 2px 2px 0px #10b981, 3px 3px 0px #34d399, 4px 4px 10px rgba(0,0,0,0.4)`,
                      `2px 2px 0px #059669, 3px 3px 0px #10b981, 4px 4px 0px #34d399, 6px 6px 15px rgba(0,0,0,0.5)`,
                      `1px 1px 0px #059669, 2px 2px 0px #10b981, 3px 3px 0px #34d399, 4px 4px 10px rgba(0,0,0,0.4)`
                    ]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1
                  }}
                  whileHover={{
                    scale: 1.2,
                    y: -8,
                    textShadow: `2px 2px 0px #059669, 4px 4px 0px #10b981, 6px 6px 0px #34d399, 8px 8px 20px rgba(0,0,0,0.6)`,
                    transition: { 
                      type: "spring",
                      stiffness: 400,
                      damping: 12,
                      duration: 0.3
                    }
                  }}
                  style={{
                    color: '#ffffff',
                    display: 'inline-block',
                    cursor: 'pointer'
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="nieuwkoop-subtitle"
          >
            {totalNieuwkoopItems} plantes disponibles
          </motion.p>
        </div>

        <div className="header-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="search-container"
          >
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Rechercher des plantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </motion.div>
        </div>

        <div className="header-right">
          <ThemeButtons />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="cart-summary"
          >
            <div className="cart-items">
              <span className="cart-quantity">{totalQty}</span>
              <span className="cart-label">articles</span>
            </div>
            <div className="cart-total">
              <span className="cart-price">€{totalPrice.toFixed(2)}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default NieuwkoopHeader;