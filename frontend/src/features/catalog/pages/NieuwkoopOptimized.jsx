import React, { useState, useEffect, lazy, Suspense } from "react";
import { Search } from 'lucide-react';
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme, THEMES } from "../../../contexts/ThemeContext";
import "../../../pages/Nieuwkoop.css";
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

// Lazy load heavy components avec preloaders
const NieuwkoopHeader = lazy(() => import('../components/NieuwkoopHeader'));
const NieuwkoopSidebar = lazy(() => import('../components/NieuwkoopSidebar'));
const NieuwkoopGrid = lazy(() => import('../components/NieuwkoopGrid'));
const AssignModal = lazy(() => import('../../../components/AssignModal'));

// Composants chargés conditionnellement par onglet
const EntryForm = lazy(() => import('../../../components/EntryForm'));
const ExitForm = lazy(() => import('../../../components/ExitForm'));
const EntryList = lazy(() => import('../../../components/EntryList'));
const ExitList = lazy(() => import('../../../components/ExitList'));
const Mouvements = lazy(() => import('../../../pages/Mouvements'));
const ProjetForm = lazy(() => import('../../../components/ProjetForm'));
const ProjetList = lazy(() => import('../../../components/ProjetList'));

// Preloaders pour les onglets
const preloadEntryComponents = createPreloader(() => Promise.all([
  import('../../../components/EntryForm'),
  import('../../../components/EntryList')
]));

const preloadExitComponents = createPreloader(() => Promise.all([
  import('../../../components/ExitForm'),
  import('../../../components/ExitList')
]));

const preloadMovements = createPreloader(() => import('../../../pages/Mouvements'));
const preloadProjects = createPreloader(() => Promise.all([
  import('../../../components/ProjetForm'),
  import('../../../components/ProjetList')
]));

// Loading components
const ComponentLoader = ({ children, fallback = "Chargement..." }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mr-2"></div>
      <span className="text-gray-600">{fallback}</span>
    </div>
  }>
    {children}
  </Suspense>
);

const NieuwkoopOptimized = () => {
  // Custom hook pour les données
  const {
    addedItems,
    totalNieuwkoopItems,
    totalPrice,
    totalQty,
    categories,
    loading,
    error,
    removeFromStock,
    updateItemQuantity,
    getFilteredAndSortedItems,
  } = useNieuwkoopData();

  // State management local
  const [searchTerm, setSearchTerm] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [sortBy, setSortBy] = useState('prix');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('search');

  // Preload des composants selon l'onglet survolé
  usePreloader(activeTab === 'entries', [preloadEntryComponents]);
  usePreloader(activeTab === 'exits', [preloadExitComponents]);
  usePreloader(activeTab === 'movements', [preloadMovements]);
  usePreloader(activeTab === 'projects', [preloadProjects]);

  // Filtered and sorted items avec memoization
  const sortedItems = getFilteredAndSortedItems(searchTerm, activeCategory, sortBy);

  const openAssignModal = (item) => {
    setSelectedItem(item);
    setActiveModal('assign');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  // Preload des composants au survol des onglets
  const handleTabHover = (tabKey) => {
    switch (tabKey) {
      case 'entries':
        preloadEntryComponents();
        break;
      case 'exits':
        preloadExitComponents();
        break;
      case 'movements':
        preloadMovements();
        break;
      case 'projects':
        preloadProjects();
        break;
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du catalogue Nieuwkoop...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <motion.div 
        className="nieuwkoop-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <ComponentLoader fallback="Chargement de l'en-tête...">
          <NieuwkoopHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            totalNieuwkoopItems={totalNieuwkoopItems}
            totalPrice={totalPrice}
            totalQty={totalQty}
          />
        </ComponentLoader>

        <div className="nieuwkoop-layout">
          {/* Sidebar */}
          <ComponentLoader fallback="Chargement des filtres...">
            <NieuwkoopSidebar
              isNavOpen={isNavOpen}
              setIsNavOpen={setIsNavOpen}
              sortBy={sortBy}
              setSortBy={setSortBy}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              addedItems={addedItems}
            />
          </ComponentLoader>

          {/* Main Content */}
          <main className="nieuwkoop-main">
            <div className="tab-navigation">
              {[
                { key: 'search', label: '🔍 Recherche', count: sortedItems.length },
                { key: 'entries', label: '📥 Entrées' },
                { key: 'exits', label: '📤 Sorties' },
                { key: 'movements', label: '📊 Mouvements' },
                { key: 'projects', label: '🗂️ Projets', count: projects.length }
              ].map(tab => (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.key)}
                  onMouseEnter={() => handleTabHover(tab.key)}
                  className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="tab-count">{tab.count}</span>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 'search' && (
                <ComponentLoader fallback="Chargement de la grille...">
                  <NieuwkoopGrid
                    sortedItems={sortedItems}
                    removeFromStock={removeFromStock}
                    updateItemQuantity={updateItemQuantity}
                    openAssignModal={openAssignModal}
                    addedItems={addedItems}
                  />
                </ComponentLoader>
              )}

              {activeTab === 'entries' && (
                <ComponentLoader fallback="Chargement des entrées...">
                  <div className="form-container">
                    <EntryForm />
                    <EntryList />
                  </div>
                </ComponentLoader>
              )}

              {activeTab === 'exits' && (
                <ComponentLoader fallback="Chargement des sorties...">
                  <div className="form-container">
                    <ExitForm />
                    <ExitList />
                  </div>
                </ComponentLoader>
              )}

              {activeTab === 'movements' && (
                <ComponentLoader fallback="Chargement des mouvements...">
                  <Mouvements />
                </ComponentLoader>
              )}

              {activeTab === 'projects' && (
                <ComponentLoader fallback="Chargement des projets...">
                  <div className="form-container">
                    <ProjetForm />
                    <ProjetList />
                  </div>
                </ComponentLoader>
              )}
            </div>
          </main>
        </div>

        {/* Modals */}
        {activeModal === 'assign' && selectedItem && (
          <ComponentLoader fallback="Chargement du modal...">
            <AssignModal
              item={selectedItem}
              onClose={closeModal}
              projects={projects}
              onAssign={assignItemToProject}
            />
          </ComponentLoader>
        )}
      </motion.div>
    </ThemeProvider>
  );
};

export default NieuwkoopOptimized;