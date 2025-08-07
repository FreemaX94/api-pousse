import React, { useState, useEffect } from "react";
import { Search } from 'lucide-react';
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Nieuwkoop.css";
import EntryForm   from '../components/EntryForm';
import ExitForm    from '../components/ExitForm';
import EntryList   from '../components/EntryList';
import ExitList    from '../components/ExitList';
import Mouvements from '../pages/Mouvements';
import ProjetForm from "../components/ProjetForm";
import ProjetList from "../components/ProjetList";
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
} from "../api/clientApi";
import AssignModal from "../components/AssignModal";
import { ThemeProvider, useTheme, THEMES } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

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


  useEffect(() => {
    if (activeSection === "Stock") {
      fetch("/api/nieuwkoop/stock")
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            const cleaned = data.map(item => ({
              ...item,
              price: item.pricing?.price || (typeof item.price === 'number' ? item.price : Number(item.price) || 0),
              quantity: item.stock?.quantity || item.quantity || 0,
              reservedQuantity: item.stock?.reservedQuantity || item.reservedQuantity || 0,
              // Normaliser les propriétés pour l'affichage
              image: item.images?.[0]?.url || item.image || '',
              height: item.dimensions?.height || item.height || 0,
              diameter: item.dimensions?.diameter || item.diameter || 0,
              note: item.notes || item.note || ''
            }));
            setAddedItems(cleaned);
          } else {
            console.error("Data is not an array:", data);
            setAddedItems([]);
          }
        })
        .catch(err => {
          console.error("Erreur chargement stock local:", err);
          setAddedItems([]);
        });
    }
  }, [activeSection]);

  const handleSearch = () => {
    setError(null);
    setImageUrl(`/api/nieuwkoop/items/${productId}/image`);

    fetch(`/api/nieuwkoop/items/${productId}/details`)
      .then(res => res.json())
      .then(data => setItem(data.item))
      .catch(() => {
        setError("Produit introuvable.");
        setItem(null);
      });

    fetch(`/api/nieuwkoop/prices/${productId}`)
      .then(res => res.json())
      .then(data => setPrice(data.price))
      .catch(() => setPrice(null));
  };

  const handleAddToStock = () => {
    if (!item || !price) return;

    const payload = {
      reference: item.Itemcode,
      name: item.ItemDescription_EN || item.ItemDescription_FR,
      height: item.Height,
      diameter: item.DiameterCulturePot || item.PotSize,
      price: price.PriceNett,
    };

    fetch("/api/nieuwkoop/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de l'ajout");
        return res.json();
      })
      .then(newItem => {
        setAddedItems([newItem, ...addedItems]);

        // Création automatique d'un mouvement d'entrée
        createMovement({
          type:      'entrée',
          reference: newItem.reference,
          name:      newItem.name,
          quantity:  1,
          price:     newItem.price,
          coef:      1,
          eventDate: new Date().toISOString().substr(0,10),
          project:   '',
          note:      '',
          createdBy: currentUser,
        })
          .then(() => handleEntrySaved())
          .catch(err => console.error('Erreur création entrée :', err));
})
      .catch(err => {
        console.error("Erreur ajout stock:", err);
        setError("Déjà dans le stock ou erreur serveur.");
      });
  };

  const updateQuantity = (id, quantity) => {
    fetch(`/api/nieuwkoop/stock/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity })
    })
      .then(res => res.json())
      .then(updated => {
        setAddedItems(prev => prev.map(item => item._id === id ? updated : item));
      });
  };

  const updateNote = (id, note) => {
    fetch(`/api/nieuwkoop/stock/${id}/note`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note })
    })
      .then(res => res.json())
      .then(updated => {
        setAddedItems(prev => prev.map(item => item._id === id ? updated : item));
      });
  };

  const deleteItem = (id) => {
    console.log('🗑️ Tentative de suppression de l\'article avec ID:', id);
    
    fetch(`/api/nieuwkoop/stock/${id}`, { method: "DELETE" })
      .then(res => {
        console.log('📡 Réponse reçue:', res.status, res.statusText);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('✅ Article supprimé avec succès:', data);
        setAddedItems(prev => {
          const filtered = prev.filter(item => item._id !== id);
          console.log('📦 Nombre d\'articles avant suppression:', prev.length);
          console.log('📦 Nombre d\'articles après suppression:', filtered.length);
          return filtered;
        });
      })
      .catch(err => {
        console.error('❌ Erreur suppression:', err);
        alert('Erreur lors de la suppression de l\'article: ' + err.message);
      });
  };

  const handleClearAll = () => {
    fetch("/api/nieuwkoop/stock/all", { method: "DELETE" })
      .then(() => setAddedItems([]))
      .catch(err => console.error("Erreur nettoyage:", err));
  };

  const handleExportCSV = () => {
    const headers = ["Nom", "Hauteur", "Diametre", "Prix", "Quantite", "Total", "Note"];
    const rows = addedItems.map(i => [
      i.name,
      i.height,
      i.diameter,
      i.price,
      i.quantity,
      (i.price * i.quantity).toFixed(2),
      i.note || ""
    ]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "articles_nieuwkoop.csv";
    link.click();
  };

  const totalPrice = addedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalQty = addedItems.reduce((acc, item) => acc + item.quantity, 0);
  // 1) Filtrer par catégorie active + recherche
const filteredItems = addedItems.filter(prod =>
  (!activeCategory || prod.category === activeCategory)
  && prod.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// 2) Trier ce tableau filtré selon sortBy
// Remplace ton bloc de tri par celui-ci :
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




return (
    <ThemeProvider>
      <motion.div 
        className="flex min-h-screen" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ 
          background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)'
        }}>
      <motion.aside 
        className="flex flex-col justify-between p-6 border-r shadow-md w-60" 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          boxShadow: 'var(--shadow-md)'
        }}>
        <div className="flex flex-col gap-8">
          <motion.nav 
            className="flex flex-col gap-2 text-sm font-medium"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {["Catalogue", "Produits", "Stock", "Entrée", "Sortie", "Projets"].map((item, index) => (
              <motion.button
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.8 + (index * 0.1),
                  ease: "easeOut"
                }}
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all var(--transition-base)',
                  textAlign: 'left',
                  background: activeSection === item ? 'var(--color-primary)' : 'transparent',
                  color: activeSection === item ? 'white' : 'var(--color-text-secondary)',
                  fontWeight: activeSection === item ? '600' : '500',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item) {
                    e.target.style.background = 'var(--color-bg-secondary)';
                    e.target.style.color = 'var(--color-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--color-text-secondary)';
                  }
                }}
                onClick={() => setActiveSection(item)}
              >
                {item === "Catalogue" && "🌿"}
                {item === "Produits" && "🧺"}
                {item === "Stock" && "📦"}
                {item === "Entrée" && "📥"}
                {item === "Sortie" && "📤"}
                {item === "Projets" && "📁"}
                {item}
              </motion.button>
            ))}
          </motion.nav>

{activeSection === "Stock" && (
 <div className="flex flex-col gap-1 mt-2 ml-4 text-sm">
  <button
    onClick={() => {
      setActiveSection("Stock");
      setActiveCategory("");
    }}
    className={`pl-4 py-1 text-left rounded ${
      !activeCategory ? "text-green-600 font-semibold bg-green-50" : "text-gray-600"
    } hover:bg-gray-100 border-b border-gray-300 mb-1`}
  >
    📦 Tous les articles
  </button>
  {[
    { label: "Entretien 🧰",   key: "entretien" },
    { label: "[EV] Plantes 🌿",     key: "plante" },
    { label: "[EV] Contenants 🏺",  key: "contenant" },
    { label: "[EV] Noël 🎄",        key: "noel" },
    { label: "[EV] Artificiels 🧠", key: "artificiel" },
    { label: "[EV] Séchés 🍂",      key: "seche" },
    { label: "[EV] Autre 🤷",       key: "autre" }
  ].map(({ label, key }) => (
    <button
      key={key}
      onClick={() => {
        setActiveSection("Stock");
        setActiveCategory(key);
      }}
      className={`pl-4 py-1 text-left rounded ${
        activeCategory === key ? "text-green-600 font-semibold bg-green-50" : "text-gray-600"
      } hover:bg-gray-100 ${
        key === 'entretien' ? 'border-b border-gray-300 mb-1' : ''
      }`}
    >
      {label}
    </button>
  ))}
</div>

)}

        </div>
        
        {/* Bouton de déconnexion en bas de la sidebar */}
        <motion.button
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3, ease: "easeOut" }}
          onClick={async () => {
            try {
              // Appel au backend pour supprimer les cookies
              await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
              });
            } catch (err) {
              console.error('Erreur lors de la déconnexion:', err);
            } finally {
              // Supprimer les tokens locaux
              localStorage.removeItem('authToken');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('rememberedUser');
              
              // Rediriger vers la page de connexion
              window.location.href = '/login';
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            color: 'white',
            background: 'var(--color-danger)',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
            transition: 'all var(--transition-base)',
            width: '100%',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#dc2626';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--color-danger)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          🚪 Se déconnecter
        </motion.button>
      </motion.aside>

      <motion.main 
        className="flex-1 p-8"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        <motion.header
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-1 flex justify-center">
            <h2 style={{ 
              color: 'var(--color-text-primary)',
              fontSize: '2.5rem',
              fontWeight: '800',
              fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
              letterSpacing: '-0.025em',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}>
              Interface Nieuwkoop
            </h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <ThemeButtons />
          </div>
        </motion.header>

        {activeSection === "Entrée" && (
          <motion.div 
            className="nieuwkoop-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="panel panel-left">
              <h2>📥 Formulaire d'Entrée</h2>
              <EntryForm onSaved={handleEntrySaved} currentUser={currentUser} />
            </div>

            <div className="divider" />

            <div className="panel panel-right">
              <h2>📋 Historique des Entrées</h2>
              <EntryList refreshFlag={refreshEntries} />
            </div>
          </motion.div>
        )}

        {activeSection === "Sortie" && (
          <motion.div 
            className="nieuwkoop-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="panel panel-left">
              <h2>📤 Formulaires de Sortie</h2>
              <div className="exit-buttons" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button type="button" onClick={() => setExitVariant('definitive')} className={exitVariant === 'definitive' ? 'tab-button active' : 'tab-button'}>
                  Sortie définitive
                </button>
                <button type="button" onClick={() => setExitVariant('locative')} className={exitVariant === 'locative' ? 'tab-button active' : 'tab-button'}>
                  Sortie locative
                </button>
              </div>
              <ExitForm onSaved={handleExitSaved} currentUser={currentUser} variant={exitVariant} />
            </div>

            <div className="divider" />

            <div className="panel panel-right">
              <h2>📤 Historique des Sorties</h2>
              <ExitList refreshFlag={refreshExits} />
            </div>
          </motion.div>
        )}

        {activeSection === "Stock" && (
          <div style={{ padding: 'var(--space-xl)', minHeight: '100vh' }}>

            <motion.section
              key="stock"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="panel"
            >
              <form style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <input
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="Code produit Nieuwkoop..."
                  style={{ flex: 1 }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="btn btn-success"
                  type="button"
                >
                  🔍 Rechercher
                </motion.button>
              </form>

            {error && <p className="text-red-600">{error}</p>}

            {item && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                style={{
                  maxWidth: '500px',
                  margin: '2rem auto',
                  background: 'white',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
                  border: '3px solid transparent',
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
              >
                {/* En-tête avec badge */}
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  padding: '1.5rem',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-10%',
                    width: '120px',
                    height: '120px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    blur: '20px'
                  }}></div>
                  <div style={{
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        opacity: 0.9,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>Produit Nieuwkoop</span>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        🌿 Nieuwkoop
                      </div>
                    </div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      margin: 0,
                      lineHeight: '1.3'
                    }}>
                      {item.ItemDescription_EN || item.ItemDescription_FR}
                    </h3>
                    <p style={{
                      fontSize: '1rem',
                      opacity: 0.9,
                      margin: '0.5rem 0 0 0',
                      fontWeight: '500'
                    }}>
                      Réf: {item.Itemcode}
                    </p>
                  </div>
                </div>

                {/* Image avec overlay */}
                <div style={{position: 'relative'}}>
                  {imageUrl && (
                    <div style={{
                      position: 'relative',
                      height: '280px',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)'
                    }}>
                      <motion.img
                        src={imageUrl}
                        alt="Product Nieuwkoop"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '1rem'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        backdropFilter: 'blur(10px)'
                      }}>
                        📸 Photo officielle
                      </div>
                    </div>
                  )}
                </div>

                {/* Contenu principal */}
                <div style={{padding: '2rem'}}>
                  {/* Caractéristiques */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    marginBottom: '2rem'
                  }}>
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                      borderRadius: '16px',
                      textAlign: 'center',
                      border: '2px solid #bbf7d0'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        marginBottom: '0.5rem'
                      }}>📏</div>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#15803d',
                        marginBottom: '0.25rem'
                      }}>{item.Height} cm</div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#65a30d',
                        fontWeight: '600'
                      }}>Hauteur</div>
                    </div>
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '16px',
                      textAlign: 'center',
                      border: '2px solid #fcd34d'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        marginBottom: '0.5rem'
                      }}>⭕</div>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#d97706',
                        marginBottom: '0.25rem'
                      }}>{item.DiameterCulturePot || item.PotSize} cm</div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#b45309',
                        fontWeight: '600'
                      }}>Diamètre pot</div>
                    </div>
                  </div>

                  {/* Prix */}
                  {price && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      style={{
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                        borderRadius: '16px',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        border: '2px solid #a5b4fc'
                      }}
                    >
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#4338ca',
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Prix de vente</div>
                      <div style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        color: '#3730a3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}>
                        💰 {price.PriceNett?.toFixed(2)} €
                      </div>
                    </motion.div>
                  )}

                  {/* Bouton d'action */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToStock}
                    style={{
                      width: '100%',
                      padding: '1.25rem 2rem',
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: 'white',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.4)';
                    }}
                  >
                    <span style={{fontSize: '1.5rem'}}>✨</span>
                    Ajouter au stock premium
                    <span style={{fontSize: '1.25rem'}}>→</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {addedItems.length > 0 && (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      textAlign: 'center',
                      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)'
                    }}
                  >
                    <span style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      color: '#2563eb',
                      display: 'block'
                    }}>{filteredItems.length}</span>
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Articles {activeCategory ? `(${activeCategory})` : ''}</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      textAlign: 'center',
                      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)'
                    }}
                  >
                    <span style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      color: '#10b981',
                      display: 'block'
                    }}>{filteredItems.reduce((sum, item) => sum + (item.quantity || 0), 0)}</span>
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Quantité totale</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      textAlign: 'center',
                      boxShadow: '0 4px 20px rgba(245, 158, 11, 0.15)'
                    }}
                  >
                    <span style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      color: '#f59e0b',
                      display: 'block'
                    }}>{filteredItems.filter(item => (item.quantity || 0) - (item.reservedQuantity || 0) > 0).length}</span>
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Disponibles</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      background: 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      textAlign: 'center',
                      boxShadow: '0 4px 20px rgba(147, 51, 234, 0.15)'
                    }}
                  >
                    <span style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      color: '#9333ea',
                      display: 'block'
                    }}>{filteredItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0).toFixed(2)} €</span>
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Valeur totale</span>
                  </motion.div>
                </div>


                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  marginBottom: '3rem',
                  flexWrap: 'wrap',
                  padding: '2rem',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '20px',
                  boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.04)'
                }}>
                  <div style={{flex: 1, minWidth: '300px'}}>
                    <div style={{position: 'relative'}}>
                      <div style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none'
                      }}>
                        <Search size={24} style={{color: '#64748b'}} />
                      </div>
                      <motion.input
                        type="text"
                        placeholder="Rechercher un article..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        whileHover={{ scale: 1.01 }}
                        whileFocus={{ scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        style={{
                          width: '100%',
                          padding: '1rem 1rem 1rem 3.5rem',
                          fontSize: '1rem',
                          fontWeight: '500',
                          border: '2px solid transparent',
                          borderRadius: '16px',
                          background: 'white',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#10b981'}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                      />
                    </div>
                  </div>

                  <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPartnerForm(true)}
                      className="btn btn-success"
                    >
                      <span style={{fontSize: '1.2rem'}}>➕</span> Nouvel article
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleExportCSV}
                      className="btn"
                      style={{
                        color: 'var(--color-text-secondary)',
                        background: 'var(--color-surface)',
                        border: '2px solid var(--color-border)'
                      }}
                    >
                      <span style={{fontSize: '1.2rem'}}>📊</span> Exporter
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClearAll}
                      className="btn btn-danger"
                    >
                      <span style={{fontSize: '1.2rem'}}>🗑️</span> Tout vider
                    </motion.button>

{showPartnerForm && (
  <div className="p-4 mt-4 space-y-4 bg-white rounded shadow">
    <h3 className="text-lg font-semibold">➕ Nouvel article partenaire</h3>
    <input id="partner-name" type="text" placeholder="Nom" className="w-full p-2 border rounded" />
    <input id="partner-ref" type="text" placeholder="Référence" className="w-full p-2 border rounded" />
    <input id="partner-price" type="number" placeholder="Prix (€)" className="w-full p-2 border rounded" />
    <input id="partner-qty" type="number" placeholder="Quantité" className="w-full p-2 border rounded" />
    <input type="file" accept="image/*" className="w-full p-2 border rounded" onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      }
    }} />
    {previewImage && <img src={previewImage} alt="Aperçu" className="object-cover w-32 h-32 rounded" />}
    <div className="flex gap-2">
      <button onClick={handleAddPartnerItem} className="px-4 py-2 text-white bg-green-600 rounded">✅ Ajouter</button>
      <button onClick={() => setShowPartnerForm(false)} className="px-4 py-2 bg-gray-300 rounded">❌ Annuler</button>
    </div>
  </div>
)}

                    {/* Dropdown “Trier par” */}
<div className="relative inline-block text-left">
  <button
    onClick={() => setShowSortMenu(open => !open)}
    className="flex items-center px-3 py-1 text-white bg-gray-600 rounded hover:bg-gray-700 focus:outline-none"
  >
    Trier par <ChevronDown size={16} className="ml-1" />
  </button>

  {showSortMenu && (
    <div
      className="absolute right-0 z-10 w-40 mt-2 bg-white border rounded shadow-lg"
      onMouseLeave={() => setShowSortMenu(false)}
    >
      {["prix", "quantité", "hauteur", "diamètre"].map(option => (
        <div
          key={option}
          onClick={() => {
            setSortBy(option);
            setShowSortMenu(false);
          }}
          className="px-4 py-2 capitalize cursor-pointer hover:bg-gray-100"
        >
          {option}
        </div>
      ))}
    </div>
  )}
</div>

                  </div>
                </div>

                <div className="stock-grid-4" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1.5rem',
                  marginTop: '2rem'
                }}>
                  <AnimatePresence>
                    {sortedItems.filter(prod =>
                      (!activeCategory || prod.category === activeCategory)
                      && prod.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((prod, index) => {
                      const available = (prod.quantity || 0) - (prod.reservedQuantity || 0);
                      const isOutOfStock = available <= 0;
                      const isLowStock = available > 0 && available <= 5;

                      return (
                        <motion.div
                          key={prod._id}
                          layout
                          initial={{ 
                            opacity: 0, 
                            y: 50, 
                            scale: 0.8,
                            rotateX: -15
                          }}
                          animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            rotateX: 0
                          }}
                          exit={{ 
                            opacity: 0, 
                            scale: 0.8, 
                            y: -20,
                            transition: { duration: 0.2 }
                          }}
                          whileHover={{ 
                            y: -8, 
                            scale: 1.02,
                            rotateX: 5,
                            boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                            transition: { 
                              duration: 0.3,
                              ease: "easeOut"
                            }
                          }}
                          transition={{ 
                            duration: 0.6, 
                            delay: index * 0.1,
                            ease: "easeOut"
                          }}
                          className="stock-card fade-in-up"
                          style={{
                            border: isOutOfStock ? '3px solid var(--color-danger)' : 
                                   isLowStock ? '3px solid var(--color-warning)' : 
                                   '3px solid transparent',
                            cursor: 'pointer'
                          }}
                        >
                          {/* En-tête avec badge et actions */}
                          <div style={{
                            background: isOutOfStock ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                                       isLowStock ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                                       'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            padding: '1.5rem',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              position: 'absolute',
                              top: '-50%',
                              right: '-10%',
                              width: '120px',
                              height: '120px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '50%'
                            }}></div>
                            <div style={{
                              position: 'relative',
                              zIndex: 2
                            }}>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.5rem'
                              }}>
                                <span style={{
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  opacity: 0.9,
                                  textTransform: 'uppercase',
                                  letterSpacing: '1px'
                                }}>Stock Article</span>
                                <div style={{
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  padding: '0.5rem 1rem',
                                  borderRadius: '20px',
                                  fontSize: '0.875rem',
                                  fontWeight: '600'
                                }}>
                                  {isOutOfStock ? '🚫 Rupture' : isLowStock ? '⚠️ Faible' : '✅ En stock'}
                                </div>
                              </div>
                              
                              {/* Actions buttons juste après l'indication du stock */}
                              <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                marginBottom: '1rem'
                              }}>
                                <motion.button
                                  whileHover={{ 
                                    scale: 1.2, 
                                    rotate: 360,
                                    backgroundColor: "rgba(255, 255, 255, 0.4)"
                                  }}
                                  whileTap={{ scale: 0.8 }}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ 
                                    delay: 1.2 + (index * 0.05),
                                    duration: 0.4,
                                    type: "spring",
                                    stiffness: 200
                                  }}
                                  onClick={() => openAssign(prod)}
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)',
                                    fontSize: '1.2rem'
                                  }}
                                >
                                  📋
                                </motion.button>
                                <motion.button
                                  whileHover={{ 
                                    scale: 1.2, 
                                    rotate: [0, -10, 10, 0],
                                    backgroundColor: "rgba(255, 100, 100, 0.4)"
                                  }}
                                  whileTap={{ scale: 0.8 }}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ 
                                    delay: 1.3 + (index * 0.05),
                                    duration: 0.4,
                                    type: "spring",
                                    stiffness: 200
                                  }}
                                  onClick={() => deleteItem(prod._id)}
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)',
                                    fontSize: '1.2rem'
                                  }}
                                >
                                  🗑️
                                </motion.button>
                              </div>

                              <motion.h3 
                                style={{
                                  fontSize: '1.25rem',
                                  fontWeight: '700',
                                  margin: 0,
                                  lineHeight: '1.3',
                                  marginBottom: '0.5rem'
                                }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                  delay: 0.8 + (index * 0.05),
                                  duration: 0.4
                                }}
                              >
                                {prod.name}
                              </motion.h3>
                              <p style={{
                                fontSize: '0.9rem',
                                opacity: 0.9,
                                margin: 0,
                                fontWeight: '500'
                              }}>
                                Réf: {prod.reference || 'N/A'}
                              </p>
                            </div>
                          </div>

                          {/* Image avec overlay */}
                          <div style={{position: 'relative'}}>
                            <div style={{
                              position: 'relative',
                              height: '200px',
                              overflow: 'hidden',
                              background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)'
                            }}>
                              <motion.img 
                                src={prod.image} 
                                alt={prod.name} 
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  padding: '1rem'
                                }}
                                onError={e => {
                                  e.target.style.display = 'none'
                                  e.target.nextSibling.style.display = 'flex'
                                }}
                              />
                              <div
                                style={{ 
                                  display: 'none',
                                  position: 'absolute',
                                  inset: 0,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '4rem',
                                  background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                                }}
                              >
                                🌱
                              </div>
                            </div>
                          </div>

                          {/* Contenu principal */}
                          <div style={{padding: '1.5rem'}}>
                            {/* Caractéristiques */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2, 1fr)',
                              gap: '1rem',
                              marginBottom: '1.5rem'
                            }}>
                              <div style={{
                                padding: '1rem',
                                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                borderRadius: '12px',
                                textAlign: 'center',
                                border: '2px solid #bbf7d0'
                              }}>
                                <div style={{
                                  fontSize: '1.5rem',
                                  marginBottom: '0.25rem'
                                }}>📏</div>
                                <div style={{
                                  fontSize: '1.25rem',
                                  fontWeight: '700',
                                  color: '#15803d',
                                  marginBottom: '0.25rem'
                                }}>{prod.height} cm</div>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: '#65a30d',
                                  fontWeight: '600'
                                }}>Hauteur</div>
                              </div>
                              <div style={{
                                padding: '1rem',
                                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                borderRadius: '12px',
                                textAlign: 'center',
                                border: '2px solid #fcd34d'
                              }}>
                                <div style={{
                                  fontSize: '1.5rem',
                                  marginBottom: '0.25rem'
                                }}>⭕</div>
                                <div style={{
                                  fontSize: '1.25rem',
                                  fontWeight: '700',
                                  color: '#d97706',
                                  marginBottom: '0.25rem'
                                }}>{prod.diameter} cm</div>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: '#b45309',
                                  fontWeight: '600'
                                }}>Diamètre</div>
                              </div>
                            </div>

                            {/* Statistiques quantité */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(3, 1fr)',
                              gap: '0.75rem',
                              marginBottom: '1.5rem'
                            }}>
                              <div style={{
                                padding: '0.75rem',
                                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                borderRadius: '12px',
                                textAlign: 'center'
                              }}>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: '#64748b',
                                  marginBottom: '0.25rem',
                                  fontWeight: '600'
                                }}>Quantité</div>
                                <input
                                  type="number"
                                  min={1}
                                  value={prod.quantity}
                                  onChange={e => updateQuantity(prod._id, parseInt(e.target.value))}
                                  style={{
                                    border: 'none',
                                    background: 'transparent',
                                    fontWeight: '700',
                                    fontSize: '1.25rem',
                                    color: '#2563eb',
                                    width: '100%',
                                    textAlign: 'center',
                                    outline: 'none'
                                  }}
                                />
                              </div>
                              <div style={{
                                padding: '0.75rem',
                                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                borderRadius: '12px',
                                textAlign: 'center'
                              }}>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: '#64748b',
                                  marginBottom: '0.25rem',
                                  fontWeight: '600'
                                }}>Réservé</div>
                                <div style={{
                                  fontWeight: '700',
                                  fontSize: '1.25rem',
                                  color: '#f59e0b'
                                }}>{prod.reservedQuantity || 0}</div>
                              </div>
                              <div style={{
                                padding: '0.75rem',
                                background: available > 0 ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                borderRadius: '12px',
                                textAlign: 'center'
                              }}>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: '#64748b',
                                  marginBottom: '0.25rem',
                                  fontWeight: '600'
                                }}>Disponible</div>
                                <div style={{
                                  fontWeight: '700',
                                  fontSize: '1.25rem',
                                  color: available > 0 ? '#10b981' : '#ef4444'
                                }}>{available}</div>
                              </div>
                            </div>

                            {/* Catégorie */}
                            <div style={{marginBottom: '1rem'}}>
                              <div style={{
                                fontSize: '0.875rem',
                                color: '#64748b',
                                marginBottom: '0.5rem',
                                fontWeight: '600'
                              }}>Catégorie</div>
                              <select
                                value={prod.category || 'autre'}
                                onChange={e => updateCategory(prod._id, e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '0.75rem',
                                  borderRadius: '12px',
                                  border: '2px solid #e2e8f0',
                                  background: 'white',
                                  fontWeight: '600',
                                  fontSize: '0.9rem',
                                  color: '#1e293b',
                                  cursor: 'pointer',
                                  outline: 'none',
                                  transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                              >
                                <option value="plante">🌱 Plante</option>
                                <option value="contenant">🏺 Contenant</option>
                                <option value="noel">🎄 Noël</option>
                                <option value="artificiel">🌺 Artificiel</option>
                                <option value="seche">🌾 Séchés</option>
                                <option value="entretien">🧽 Entretien</option>
                                <option value="autre">📦 Autre</option>
                              </select>
                            </div>

                            {/* Note */}
                            <div style={{marginBottom: '1.5rem'}}>
                              <div style={{
                                fontSize: '0.875rem',
                                color: '#64748b',
                                marginBottom: '0.5rem',
                                fontWeight: '600'
                              }}>Note</div>
                              <textarea
                                placeholder="Ajouter une note..."
                                value={prod.note || ""}
                                onChange={e => updateNote(prod._id, e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '0.75rem',
                                  borderRadius: '12px',
                                  border: '2px solid #e2e8f0',
                                  background: 'white',
                                  resize: 'vertical',
                                  minHeight: '60px',
                                  fontFamily: 'inherit',
                                  fontSize: '0.9rem',
                                  color: '#1e293b',
                                  outline: 'none',
                                  transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                              />
                            </div>

                            {/* Prix total */}
                            <div style={{
                              padding: '1.5rem',
                              background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                              borderRadius: '16px',
                              textAlign: 'center',
                              border: '2px solid #a5b4fc'
                            }}>
                              <div style={{
                                fontSize: '0.875rem',
                                color: '#4338ca',
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>Valeur totale</div>
                              <div style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#3730a3',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                              }}>
                                💰 {(Number(prod.price || 0) * Number(prod.quantity || 0)).toFixed(2)} €
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </>
            )}
            </motion.section>
          </div>
        )}

        {activeSection === "Projets" && (
          <motion.section key="projets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
            <ProjetForm onSubmit={handleSubmitProject} />
            <ProjetList projects={projects} onUpdate={handleUpdateProject} onDelete={handleDeleteProject} />
          </motion.section>
        )}
        
        {/* Modal d'assignation */}
        <AssignModal
          isOpen={isAssignOpen}
          onClose={closeAssign}
          item={itemToAssign}
          projects={projects}
          onConfirm={handleAssign}
        />
      </motion.main>
    </motion.div>
    </ThemeProvider>
  );
};

  const updateCategory = (id, category) => {
    fetch(`/api/nieuwkoop/stock/${id}/category`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category })
    })
      .then(res => res.json())
      .then(updated => {
        setAddedItems(prev => prev.map(item => item._id === id ? updated : item));
      })
      .catch(err => console.error("Erreur mise à jour catégorie:", err));
  };

const fetchMovements = async () => {
    try {
      const data = await getMovements();
      setMouvements(data);
    } catch (err) {
      console.error("Erreur chargement mouvements:", err);
    }
  };

  const handleSubmitMouvement = async (formData) => {
    await createMovement(formData);
    fetchMovements();
  };

  const handleValidate = async (id) => {
    await validateMovement(id);
    fetchMovements();
  };


  const handleAddPartnerItem = async () => {
    const name = document.querySelector("#partner-name")?.value;
    const reference = document.querySelector("#partner-ref")?.value;
    const price = parseFloat(document.querySelector("#partner-price")?.value || 0);
    const quantity = parseInt(document.querySelector("#partner-qty")?.value || 1);

    if (!name || !reference) return alert("Nom et référence requis");

    const payload = {
      name,
      reference,
      price,
      quantity,
      image: previewImage,
    };

    try {
      const newItem = await createPartnerItem(payload);
      setAddedItems(prev => [newItem, ...prev]);
      setShowPartnerForm(false);
      setPreviewImage(null);
    } catch (err) {
      alert("Erreur ajout partenaire");
      console.error(err);
    }
  };

  const handleReturn = async (id) => {
    await markReturned(id);
    fetchMovements();
  };
export default Nieuwkoop;
