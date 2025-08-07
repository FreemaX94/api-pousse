import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const NieuwkoopSidebar = ({ 
  isNavOpen, 
  setIsNavOpen, 
  sortBy, 
  setSortBy, 
  activeCategory, 
  setActiveCategory,
  addedItems 
}) => {
  const sortOptions = ['prix', 'quantité', 'hauteur', 'diamètre'];
  const categories = [...new Set(addedItems.map(item => item.category))];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className={`nieuwkoop-sidebar ${isNavOpen ? 'open' : ''}`}
    >
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsNavOpen(!isNavOpen)}
        className="sidebar-toggle"
      >
        <span className="toggle-icon">
          {isNavOpen ? '◀' : '▶'}
        </span>
        <span className="toggle-text">
          {isNavOpen ? 'Masquer' : 'Filtres'}
        </span>
      </motion.button>

      {/* Sidebar Content */}
      <motion.div
        className="sidebar-content"
        animate={{ 
          opacity: isNavOpen ? 1 : 0,
          height: isNavOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Sort Section */}
        <div className="filter-section">
          <h3 className="filter-title">Trier par</h3>
          <div className="sort-dropdown">
            <button className="dropdown-trigger">
              <span>{sortBy}</span>
              <ChevronDown size={16} />
            </button>
            <div className="dropdown-menu">
              {sortOptions.map(option => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`dropdown-item ${sortBy === option ? 'active' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-section">
          <h3 className="filter-title">Catégories</h3>
          <div className="category-filters">
            <button
              onClick={() => setActiveCategory('')}
              className={`category-button ${!activeCategory ? 'active' : ''}`}
            >
              Toutes
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`category-button ${activeCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="filter-section">
          <h3 className="filter-title">Statistiques</h3>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Total articles</span>
              <span className="stat-value">{addedItems.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Catégories</span>
              <span className="stat-value">{categories.length}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default NieuwkoopSidebar;