import React, { useState, useEffect, lazy, Suspense } from "react";
import { Search } from 'lucide-react';
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../../../pages/Nieuwkoop.css";
import { ThemeProvider, useTheme, THEMES } from "../../../contexts/ThemeContext";
import { 
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  assignItemToProject,
  getMovements,
  createMovement,
  validateMovement,
  markReturned,
  api,
} from "../../../api/clientApi";

// Lazy loading des composants lourds uniquement
const EntryForm = lazy(() => import('../../../components/EntryForm'));
const ExitForm = lazy(() => import('../../../components/ExitForm'));
const EntryList = lazy(() => import('../../../components/EntryList'));
const ExitList = lazy(() => import('../../../components/ExitList'));
const Mouvements = lazy(() => import('../../../pages/Mouvements'));
const ProjetForm = lazy(() => import('../../../components/ProjetForm'));
const ProjetList = lazy(() => import('../../../components/ProjetList'));
const AssignModal = lazy(() => import('../../../components/AssignModal'));

// Composant pour les boutons de thème individuels
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

const Nieuwkoop = () => {

  // ─── Récupération de l'utilisateur via API (même méthode que PrivateRoute) ───
  const [currentUser, setCurrentUser] = useState('inconnu');

  const [activeSection, setActiveSection] = useState("Stock");
  const [activeCategory, setActiveCategory] = useState("");
  const [productId, setProductId] = useState("4HOFOBX12");
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [price, setPrice] = useState(null);
  const [addedItems, setAddedItems] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState("prix");
  const [mouvements, setMouvements] = useState([]);
  const [projects, setProjects] = useState([]);

  // Option A : assignation stock → projet
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [itemToAssign, setItemToAssign] = useState(null);

  // États pour Entrée/Sortie
  const [refreshEntries, setRefreshEntries] = useState(false);
  const [refreshExits, setRefreshExits] = useState(false);
  const [exitVariant, setExitVariant] = useState('definitive');

  const handleEntrySaved = () => setRefreshEntries(f => !f);
  const handleExitSaved  = () => setRefreshExits(f => !f);

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    api.get('/auth/me')
      .then(response => {
        console.log('🔍 Structure response.data:', response.data);
        // Tester différentes structures possibles
        const user = response.data.user || response.data;
        const username = user.username || user.name || user.email || 'utilisateur';
        setCurrentUser(username);
        console.log('✅ Utilisateur récupéré:', username);
      })
      .catch(error => {
        console.error('❌ Erreur récupération utilisateur:', error);
        setCurrentUser('inconnu');
      });
  }, []);

  const openAssign = (item) => {
    setItemToAssign(item);
    setIsAssignOpen(true);
  };

  const handleAssign = async ({ projectId, quantity, note }) => {
    await assignItemToProject({
      itemId: itemToAssign._id,
      projectId,
      quantity,
      note,
      reference: itemToAssign.reference,
      name: itemToAssign.name,
      createdBy: "currentUser"
    });
    setIsAssignOpen(false);
    fetchStock();    // recharge le stock
    fetchProjects(); // recharge la liste des projets
  };

  const closeAssign = () => {
    setIsAssignOpen(false);
  };

  useEffect(() => {
    if (activeSection === "Projets") fetchProjects();
  }, [activeSection]);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Erreur chargement projets :", err);
    }
  };

  const handleSubmitProject = async (formData) => {
    await createProject(formData);
    fetchProjects();
  };

  const handleUpdateProject = async (id, updateData) => {
    await updateProject(id, updateData);
    fetchProjects();
  };

  const handleDeleteProject = async (id) => {
    await deleteProject(id);
    fetchProjects();
  };

  // 🔄 Chargement du stock
  const fetchStock = async () => {
    try {
      const response = await api.get("/nieuwkoop/stock");
      console.log('✅ Stock response:', response.data);
      
      if (Array.isArray(response.data)) {
        setAddedItems(response.data);
      } else {
        console.error('Format de réponse inattendu:', response.data);
      }
    } catch (err) {
      console.error("❌ Erreur lors du chargement du stock:", err);
      setError("Erreur lors du chargement du stock.");
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const removeFromStock = async (reference) => {
    try {
      await api.delete(`/nieuwkoop/stock/${reference}`);
      console.log(`✅ Article supprimé : ${reference}`);
      fetchStock();
    } catch (err) {
      console.error("❌ Erreur suppression :", err);
    }
  };

  const updateItemQuantity = async (itemId, newQuantity) => {
    try {
      await api.put(`/nieuwkoop/stock/${itemId}`, { quantity: newQuantity });
      console.log(`✅ Quantité mise à jour : ${newQuantity} pour ${itemId}`);
      fetchStock();
    } catch (err) {
      console.error("❌ Erreur mise à jour quantité :", err);
    }
  };

  // Total prix et quantité
  const totalPrice = addedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalQty = addedItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // 1) Filtrer par catégorie active + recherche
  const filteredItems = addedItems.filter(prod =>
    (!activeCategory || prod.category === activeCategory)
    && prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2) Trier ce tableau filtré selon sortBy
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'quantité':
        return b.quantity - a.quantity;
      case 'hauteur':
        return b.height - a.height;
      case 'diamètre':
        return b.diameter - a.diameter;
      case 'prix':
      default:
        return b.price - a.price;
    }
  });

  const fetchMovements = async () => {
    try {
      const data = await getMovements();
      setMouvements(data);
    } catch (err) {
      console.error("Erreur chargement mouvements :", err);
    }
  };

  useEffect(() => {
    if (activeSection === "Mouvements") fetchMovements();
  }, [activeSection]);

  return (
    <ThemeProvider>
      <motion.div 
        className="nieuwkoop-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0 }}
      >
        {/* En-tête avec recherche et thèmes */}
        <motion.div 
          className="nieuwkoop-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="header-left">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="nieuwkoop-title"
            >
              🌱 Nieuwkoop
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="nieuwkoop-subtitle"
            >
              {addedItems.length} plantes en stock • {totalQty} articles • €{totalPrice.toFixed(2)}
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
          </div>
        </motion.div>

        {/* Navigation latérale */}
        <motion.nav
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="nieuwkoop-nav"
        >
          {[
            { key: "Stock", label: "🌱 Stock", count: addedItems.length },
            { key: "Entrées", label: "📥 Entrées" },
            { key: "Sorties", label: "📤 Sorties" },
            { key: "Mouvements", label: "🔄 Mouvements", count: mouvements.length },
            { key: "Projets", label: "📋 Projets", count: projects.length }
          ].map((section) => (
            <motion.button
              key={section.key}
              whileHover={{ scale: 1.05, x: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection(section.key)}
              className={`nav-button ${activeSection === section.key ? 'active' : ''}`}
            >
              <span className="nav-label">{section.label}</span>
              {section.count !== undefined && (
                <span className="nav-count">{section.count}</span>
              )}
            </motion.button>
          ))}
        </motion.nav>

        {/* Zone de tri et filtres */}
        {activeSection === "Stock" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="controls-section"
          >
            <div className="sort-controls">
              <div className="dropdown-container">
                <button
                  className="dropdown-trigger"
                  onClick={() => setShowSortMenu(!showSortMenu)}
                >
                  <span>Trier par {sortBy}</span>
                  <ChevronDown size={16} />
                </button>
                {showSortMenu && (
                  <div className="dropdown-menu">
                    {['prix', 'quantité', 'hauteur', 'diamètre'].map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortMenu(false);
                        }}
                        className={`dropdown-item ${sortBy === option ? 'active' : ''}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="category-filters">
              <button
                onClick={() => setActiveCategory("")}
                className={`category-btn ${!activeCategory ? 'active' : ''}`}
              >
                Toutes
              </button>
              {[...new Set(addedItems.map(item => item.category))].map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contenu principal */}
        <motion.main
          className="nieuwkoop-main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {/* Section Stock */}
          {activeSection === "Stock" && (
            <div className="products-grid">
              <AnimatePresence>
                {sortedItems.map((prod, index) => (
                  <motion.div
                    key={prod._id}
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 100 
                    }}
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    className="product-card"
                  >
                    <div className="product-image">
                      {prod.image ? (
                        <img src={prod.image} alt={prod.name} />
                      ) : (
                        <div className="image-placeholder">
                          <span>🌱</span>
                        </div>
                      )}
                      <div className="category-badge">{prod.category}</div>
                    </div>

                    <div className="product-info">
                      <h3 className="product-name">{prod.name}</h3>
                      <p className="product-code">Réf: {prod.reference}</p>
                      
                      <div className="product-details">
                        <span>H: {prod.height}cm</span>
                        <span>Ø: {prod.diameter}cm</span>
                      </div>

                      <div className="product-price">€{prod.price.toFixed(2)}</div>

                      <div className="quantity-controls">
                        <button
                          onClick={() => updateItemQuantity(prod._id, Math.max(0, prod.quantity - 1))}
                          className="qty-btn"
                          disabled={prod.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity">{prod.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(prod._id, prod.quantity + 1)}
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>

                      <div className="product-actions">
                        <button 
                          onClick={() => openAssign(prod)}
                          className="assign-btn"
                        >
                          Assigner
                        </button>
                        <button 
                          onClick={() => removeFromStock(prod._id)}
                          className="remove-btn"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Section Entrées */}
          {activeSection === "Entrées" && (
            <Suspense fallback={<div className="loading">Chargement des entrées...</div>}>
              <div className="entry-section">
                <EntryForm onEntrySaved={handleEntrySaved} />
                <EntryList refreshTrigger={refreshEntries} />
              </div>
            </Suspense>
          )}

          {/* Section Sorties */}
          {activeSection === "Sorties" && (
            <Suspense fallback={<div className="loading">Chargement des sorties...</div>}>
              <div className="exit-section">
                <ExitForm 
                  onExitSaved={handleExitSaved}
                  variant={exitVariant}
                />
                <ExitList refreshTrigger={refreshExits} />
              </div>
            </Suspense>
          )}

          {/* Section Mouvements */}
          {activeSection === "Mouvements" && (
            <Suspense fallback={<div className="loading">Chargement des mouvements...</div>}>
              <Mouvements />
            </Suspense>
          )}

          {/* Section Projets */}
          {activeSection === "Projets" && (
            <Suspense fallback={<div className="loading">Chargement des projets...</div>}>
              <div className="projects-section">
                <ProjetForm onSubmit={handleSubmitProject} />
                <ProjetList 
                  projects={projects}
                  onUpdate={handleUpdateProject}
                  onDelete={handleDeleteProject}
                />
              </div>
            </Suspense>
          )}
        </motion.main>

        {/* Modal d'assignation */}
        {isAssignOpen && itemToAssign && (
          <Suspense fallback={<div className="loading">Chargement du modal...</div>}>
            <AssignModal
              item={itemToAssign}
              projects={projects}
              onAssign={handleAssign}
              onClose={closeAssign}
            />
          </Suspense>
        )}
      </motion.div>
    </ThemeProvider>
  );
};

export default Nieuwkoop;