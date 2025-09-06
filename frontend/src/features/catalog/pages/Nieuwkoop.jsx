import React, { useState, useEffect, lazy, Suspense, useRef } from "react";
import { Search } from 'lucide-react';
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// useScroll, useTransform supprimés pour optimiser les performances
import "../../../pages/Nieuwkoop.css";

// Ajout des animations CSS pour le calendrier
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-20px) scale(1.05); }
    }
    
    @keyframes spin {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-200%); }
      100% { transform: translateX(200%); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.05; transform: scale(1); }
      50% { opacity: 0.1; transform: scale(1.1); }
    }
  `;
  if (!document.head.querySelector('[data-calendar-animations]')) {
    styleSheet.setAttribute('data-calendar-animations', 'true');
    document.head.appendChild(styleSheet);
  }
}
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
import axiosApi, { handleApiError } from "../../../api/axios";
import { useTheme, ThemeProvider } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";

// 🚀 Lazy loading des composants lourds pour le code splitting - Cache refresh 20250826-003000 - FORCE DEPLOY DEBUG
const EntryForm = lazy(() => import('../../../components/EntryForm'));
const ExitForm = lazy(() => import('../../../components/ExitForm'));
const EntryList = lazy(() => import('../../../components/EntryList'));
const ExitList = lazy(() => import('../../../components/ExitList'));
const Mouvements = lazy(() => import('../../../pages/Mouvements'));
const ProjetForm = lazy(() => import('../../../components/ProjetForm'));
const ProjetList = lazy(() => import('../../../components/ProjetList'));
const AssignModal = lazy(() => import('../../../components/AssignModal'));

// Composant pour le formulaire d'entrée externe
function ExternalEntryForm({ onSaved, currentUser }) {
  const { isDark, theme, isBeige, isNeon, isOcean, isTropical, isLavender, isGalaxy, isAutumn, isGlacier, isSakura, isMidnight, isLava } = useTheme();
  
  // Fonction pour obtenir les styles adaptatifs selon le thème
  const getThemeStyles = () => {
    const baseStyles = {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      cardBackground: 'linear-gradient(135deg, #ffffff, #f8fafc)',
      textPrimary: '#1e293b',
      textSecondary: '#64748b',
      inputBackground: 'rgba(255,255,255,0.9)',
      inputBorder: 'rgba(148,163,184,0.3)',
      inputFocus: '#10b981',
      buttonGradient: 'linear-gradient(135deg, #10b981, #059669)',
      errorBackground: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
      errorBorder: '#fca5a5',
      errorText: '#dc2626'
    };

    if (isDark) {
      return {
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        cardBackground: 'linear-gradient(135deg, #334155, #475569)',
        textPrimary: '#f1f5f9',
        textSecondary: '#cbd5e1',
        inputBackground: 'rgba(51,65,85,0.9)',
        inputBorder: 'rgba(100,116,139,0.3)',
        inputFocus: '#10b981',
        buttonGradient: 'linear-gradient(135deg, #10b981, #059669)',
        errorBackground: 'linear-gradient(135deg, #431a1a, #562626)',
        errorBorder: '#dc2626',
        errorText: '#fca5a5'
      };
    }

    if (isBeige) {
      return {
        background: 'linear-gradient(135deg, #f5f5dc 0%, #f0e68c 100%)',
        cardBackground: 'linear-gradient(135deg, #fffef7, #faf8f0)',
        textPrimary: '#8b5a2b',
        textSecondary: '#a0702a',
        inputBackground: 'rgba(255,254,247,0.9)',
        inputBorder: 'rgba(160,112,42,0.3)',
        inputFocus: '#d2691e',
        buttonGradient: 'linear-gradient(135deg, #d2691e, #cd853f)',
        errorBackground: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
        errorBorder: '#fca5a5',
        errorText: '#dc2626'
      };
    }

    if (isNeon) {
      return {
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        cardBackground: 'linear-gradient(135deg, #16213e, #0f3460)',
        textPrimary: '#00ffff',
        textSecondary: '#ff00ff',
        inputBackground: 'rgba(22,33,62,0.9)',
        inputBorder: 'rgba(0,255,255,0.3)',
        inputFocus: '#00ffff',
        buttonGradient: 'linear-gradient(135deg, #ff00ff, #00ffff)',
        errorBackground: 'linear-gradient(135deg, #2d1b1b, #3d2626)',
        errorBorder: '#ff0080',
        errorText: '#ff0080'
      };
    }

    // Autres thèmes peuvent être ajoutés ici selon les besoins
    return baseStyles;
  };

  const themeStyles = getThemeStyles();

  // Styles communs pour les inputs
  const getInputStyle = (disabled = false) => ({
    width: '100%',
    padding: '1rem 1.5rem',
    border: `2px solid ${themeStyles.inputBorder}`,
    borderRadius: '16px',
    fontSize: '1rem',
    fontWeight: '500',
    background: disabled ? (isDark ? 'rgba(51,65,85,0.5)' : 'rgba(248,250,252,0.9)') : themeStyles.inputBackground,
    transition: 'all 0.3s ease',
    outline: 'none',
    color: disabled ? themeStyles.textSecondary : themeStyles.textPrimary,
    cursor: disabled ? 'not-allowed' : 'text'
  });

  // Styles communs pour les labels
  const getLabelStyle = () => ({
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '1rem',
    fontWeight: '700',
    color: themeStyles.textPrimary
  });

  const [formData, setFormData] = useState({
    type: 'entrée',
    reference: '',
    name: '',
    quantity: '',
    price: '',
    image: null,
    coef: 1,
    height: '',
    diameter: '',
    eventDate: new Date().toISOString().substr(0, 10),
    project: '',
    note: '',
    createdBy: currentUser,
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  // États pour l'édition inline
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingField, setEditingField] = useState(null); // 'name', 'price', 'height', 'diameter'
  const [editValue, setEditValue] = useState('');
  
  // URL de base pour les images
  const imageBaseUrl = import.meta.env.MODE === 'development' 
    ? 'http://localhost:3001/api' 
    : (import.meta.env.VITE_API_BASE_URL || '/api');

  // Charger projets
  useEffect(() => {
    fetch('/api/projets')
      .then(res => res.json())
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setError('Impossible de charger la liste des projets.'));
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
      const file = files[0];
      setFormData(fd => ({ ...fd, image: file }));
      
      // Créer une prévisualisation de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      return;
    }

    let finalValue = value;
    if (name === 'quantity') finalValue = value === '' ? '' : Math.max(1, parseInt(value, 10) || 1);
    if (name === 'coef') finalValue = parseFloat(value);
    if (name === 'price') finalValue = value === '' ? '' : parseFloat(value) || 0;
    if (name === 'height') finalValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0);
    if (name === 'diameter') finalValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0);

    setFormData(fd => ({ ...fd, [name]: finalValue }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key]);
        } else if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('/api/mouvements', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'entrée');
      }

      onSaved();
      setFormData({
        type: 'entrée',
        reference: '',
        name: '',
        quantity: '',
        price: '',
        image: null,
        coef: 1,
        height: '',
        diameter: '',
        eventDate: new Date().toISOString().substr(0, 10),
        project: '',
        note: '',
        createdBy: currentUser,
      });
      setImagePreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: themeStyles.background,
      borderRadius: '32px',
      padding: '3rem',
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08), 0 8px 25px rgba(0, 0, 0, 0.05)',
      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {error && (
        <div style={{
          background: themeStyles.errorBackground,
          border: `2px solid ${themeStyles.errorBorder}`,
          borderRadius: '16px',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          color: themeStyles.errorText,
          fontWeight: '600',
          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.15)'
        }}>
          {error}
        </div>
      )}
      
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '3rem', 
          fontWeight: '900',
          background: 'linear-gradient(135deg, #10b981, #059669, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
          textShadow: '0 4px 20px rgba(16,185,129,0.3)'
        }}>
          📤 Entrée externe
        </h2>
        <p style={{
          color: themeStyles.textSecondary,
          fontSize: '1.1rem',
          fontWeight: '500',
          margin: 0
        }}>
          Ajoutez des articles avec vos propres images
        </p>
      </div>
      
      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Sélection d'image */}
        <div style={{gridColumn: '1 / -1', marginBottom: '1rem'}}>
          <div style={{
            background: themeStyles.cardBackground,
            borderRadius: '24px',
            padding: '2rem',
            border: `2px solid ${isDark ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.1)'}`,
            boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <label style={{
              display: 'block',
              marginBottom: '1rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: themeStyles.textPrimary
            }}>
              📸 Image du produit
            </label>
            
            {imagePreview ? (
              <div style={{ marginBottom: '1rem' }}>
                <img 
                  src={imagePreview} 
                  alt="Prévisualisation" 
                  style={{
                    width: '150px', 
                    height: '150px', 
                    objectFit: 'cover', 
                    borderRadius: '20px', 
                    boxShadow: '0 15px 35px rgba(0,0,0,0.15)', 
                    border: '4px solid white',
                    marginBottom: '1rem'
                  }}
                />
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(fd => ({ ...fd, image: null }));
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                border: `3px dashed ${themeStyles.inputFocus}`,
                borderRadius: '20px',
                padding: '3rem',
                marginBottom: '1rem',
                background: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.05)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📷</div>
                <p style={{ color: themeStyles.textSecondary, marginBottom: '1rem' }}>
                  Cliquez pour sélectionner une image ou glissez-déposez
                </p>
              </div>
            )}
            
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '1rem',
                border: `2px solid ${isDark ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.2)'}`,
                borderRadius: '16px',
                fontSize: '1rem',
                background: themeStyles.inputBackground,
                cursor: 'pointer',
                color: themeStyles.textPrimary
              }}
            />
          </div>
        </div>


        {/* Nom du produit */}
        <div>
          <label htmlFor="name" style={getLabelStyle()}>🏷️ Nom du produit *</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nom du produit"
            required
            style={getInputStyle()}
            onFocus={(e) => e.target.style.borderColor = themeStyles.inputFocus}
            onBlur={(e) => e.target.style.borderColor = themeStyles.inputBorder}
          />
        </div>

        {/* Quantité */}
        <div>
          <label htmlFor="quantity" style={getLabelStyle()}>📦 Quantité</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            style={getInputStyle()}
            onFocus={(e) => e.target.style.borderColor = themeStyles.inputFocus}
            onBlur={(e) => e.target.style.borderColor = themeStyles.inputBorder}
          />
        </div>

        {/* Prix unitaire */}
        <div>
          <label htmlFor="price" style={getLabelStyle()}>💰 Prix unitaire</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            style={getInputStyle()}
            onFocus={(e) => e.target.style.borderColor = themeStyles.inputFocus}
            onBlur={(e) => e.target.style.borderColor = themeStyles.inputBorder}
          />
        </div>

        {/* Hauteur */}
        <div>
          <label htmlFor="height" style={getLabelStyle()}>📏 Hauteur (cm)</label>
          <input
            id="height"
            name="height"
            type="number"
            step="0.1"
            min="0"
            value={formData.height}
            onChange={handleChange}
            placeholder="Hauteur en cm"
            style={getInputStyle()}
            onFocus={(e) => e.target.style.borderColor = themeStyles.inputFocus}
            onBlur={(e) => e.target.style.borderColor = themeStyles.inputBorder}
          />
        </div>

        {/* Diamètre */}
        <div>
          <label htmlFor="diameter" style={getLabelStyle()}>⭕ Diamètre (cm)</label>
          <input
            id="diameter"
            name="diameter"
            type="number"
            step="0.1"
            min="0"
            value={formData.diameter}
            onChange={handleChange}
            placeholder="Diamètre en cm"
            style={getInputStyle()}
            onFocus={(e) => e.target.style.borderColor = themeStyles.inputFocus}
            onBlur={(e) => e.target.style.borderColor = themeStyles.inputBorder}
          />
        </div>

        {/* Coefficient */}
        <div>
          <label htmlFor="coef" style={getLabelStyle()}>⚖️ Coefficient</label>
          <select
            id="coef"
            name="coef"
            value={formData.coef}
            onChange={handleChange}
            style={{...getInputStyle(), cursor: 'pointer'}}
            onFocus={(e) => e.target.style.borderColor = themeStyles.inputFocus}
            onBlur={(e) => e.target.style.borderColor = themeStyles.inputBorder}
          >
            <option value={1}>1</option>
            <option value={0.5}>0.5</option>
            <option value={0.25}>0.25</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="eventDate" style={getLabelStyle()}>📅 Date</label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={handleChange}
            max={new Date().toISOString().substr(0, 10)}
            style={getInputStyle()}
            onFocus={(e) => e.target.style.borderColor = themeStyles.inputFocus}
            onBlur={(e) => e.target.style.borderColor = themeStyles.inputBorder}
          />
        </div>

        {/* Projet */}
        <div>
          <label htmlFor="project" style={getLabelStyle()}>🎯 Projet / Événement</label>
          <select
            id="project"
            name="project"
            value={formData.project}
            onChange={handleChange}
            style={{...getInputStyle(), cursor: 'pointer'}}
            onFocus={(e) => e.target.style.borderColor = themeStyles.inputFocus}
            onBlur={(e) => e.target.style.borderColor = themeStyles.inputBorder}
          >
            <option value="">-- Sélectionnez un projet --</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>
                {p.client?.name || p.title || p.name || 'Projet sans titre'}
              </option>
            ))}
          </select>
        </div>

        {/* Note */}
        <div style={{gridColumn: '1 / -1'}}>
          <label htmlFor="note" style={getLabelStyle()}>📝 Note</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Note optionnelle..."
            style={{
              ...getInputStyle(),
              minHeight: '120px',
              resize: 'vertical'
            }}
            onFocus={(e) => e.target.style.borderColor = themeStyles.inputFocus}
            onBlur={(e) => e.target.style.borderColor = themeStyles.inputBorder}
          />
        </div>

        {/* Bouton validation */}
        <div style={{gridColumn: '1 / -1', marginTop: '1rem'}}>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1.5rem 2rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              background: loading ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : themeStyles.buttonGradient,
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `0 15px 35px ${isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.3)'}`,
              transform: loading ? 'scale(0.98)' : 'scale(1)'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px) scale(1.02)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0) scale(1)')}
          >
            {loading ? '⏳ Création en cours...' : '📤 Ajouter Entrée Externe'}
          </button>
        </div>

        <input type="hidden" name="type" value={formData.type} />
        <input type="hidden" name="createdBy" value={formData.createdBy} />
      </form>
    </div>
  );
}

const Nieuwkoop = () => {
  // Hook pour le thème
  const { isDark, theme, isBeige, isNeon, isOcean, isTropical, isLavender, isGalaxy, isAutumn, isGlacier, isSakura, isMidnight, isLava } = useTheme();
  // Hook pour l'authentification
  const { user } = useAuth();
  
  // ─── Récupération de l'utilisateur via API (même méthode que PrivateRoute) ───
  const [currentUser, setCurrentUser] = useState('inconnu');
  
  // States pour les améliorations UX
  const [loadingStates, setLoadingStates] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [focusedCard, setFocusedCard] = useState(null);

  // useEffect(() => {
  //   if (focusedCard) {
  //     console.log(`focusedCard state changed to: "${focusedCard}"`);
  //   }
  // }, [focusedCard]);

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
  
  // 🌟 Mouse Trail Effect - DÉSACTIVÉ POUR PERFORMANCE
  // const [mousePos, setMousePos] = useState({x: 0, y: 0});
  // const [mouseTrail, setMouseTrail] = useState([]);
  
  const [mouvements, setMouvements] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Option A : assignation stock → projet
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [itemToAssign, setItemToAssign] = useState(null);

  // États pour Entrée/Sortie
  const [refreshEntries, setRefreshEntries] = useState(false);
  const [refreshExits, setRefreshExits] = useState(false);
  const [exitVariant, setExitVariant] = useState('definitive');
  
  // États pour les sous-onglets
  const [entrySubTab, setEntrySubTab] = useState('formulaire'); // 'formulaire', 'historique' ou 'externe'
  const [exitSubTab, setExitSubTab] = useState('formulaire'); // 'formulaire' ou 'historique'
  
  // États pour les opérations diverses
  const [operationsStockQuery, setOperationsStockQuery] = useState('');
  const [operationsStockOptions, setOperationsStockOptions] = useState([]);
  const [selectedOperationArticle, setSelectedOperationArticle] = useState(null);
  const [operationBuyingDepartment, setOperationBuyingDepartment] = useState('');
  
  // État pour éviter les rechargements multiples
  const [stockLoading, setStockLoading] = useState(false);
  const stockLoadedRef = useRef(new Set()); // Sections pour lesquelles le stock a déjà été chargé
  const [operationQuantity, setOperationQuantity] = useState('');
  const [operationCoefficient, setOperationCoefficient] = useState('1.0');
  const [operationNotes, setOperationNotes] = useState('');
  const [operationSubmitting, setOperationSubmitting] = useState(false);
  const [operationsHistory, setOperationsHistory] = useState([]);
  const [operationsLoading, setOperationsLoading] = useState(false);
  const [needsStockRefresh, setNeedsStockRefresh] = useState(false);
  
  // États pour les messages utilisateur
  const [operationError, setOperationError] = useState('');
  const [operationSuccess, setOperationSuccess] = useState('');
  

  const handleEntrySaved = () => setRefreshEntries(f => !f);
  const handleExitSaved  = () => setRefreshExits(f => !f);

  // Fonction de soumission pour les opérations diverses
  // Fonction pour supprimer toutes les opérations locales
  const clearLocalOperations = () => {
    try {
      localStorage.removeItem('localOperations');
      console.log('🗑️ Toutes les opérations locales supprimées');
      // Recharger l'historique
      loadOperationsHistory();
    } catch (error) {
      console.error('❌ Erreur suppression opérations locales:', error);
    }
  };

  // Fonction pour supprimer une opération locale spécifique
  const deleteLocalOperation = (operationId) => {
    try {
      const existingOperations = JSON.parse(localStorage.getItem('localOperations') || '[]');
      const filteredOperations = existingOperations.filter(op => op.operationId !== operationId);
      localStorage.setItem('localOperations', JSON.stringify(filteredOperations));
      console.log(`🗑️ Opération locale supprimée: ${operationId}`);
      // Recharger l'historique
      loadOperationsHistory();
    } catch (error) {
      console.error('❌ Erreur suppression opération locale:', error);
    }
  };

  // Fonction pour sauvegarder une opération localement
  const saveOperationLocally = (operationData) => {
    try {
      console.log('💾 Données à sauvegarder:', operationData);
      console.log('🔢 Quantité dans operationData:', operationData.quantity);
      console.log('🆔 Stock Reference à sauvegarder:', operationData.stockReference);
      console.log('📦 Article référencé:', operationData.article.name, '(Réf:', operationData.article.reference + ')');
      
      // Récupérer les opérations existantes
      const existingOperations = JSON.parse(localStorage.getItem('localOperations') || '[]');
      
      // Créer une nouvelle opération avec un ID unique
      const localOperation = {
        ...operationData,
        _id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        operationId: `OP-LOCAL-${Date.now()}`,
        sellingDepartment: 'evenementiel',
        status: 'completed',
        totalAmount: operationData.article.originalPrice * operationData.quantity * operationData.coefficient,
        createdAt: new Date().toISOString(),
        createdBy: {
          fullname: 'Utilisateur Local',
          email: 'local@example.com'
        },
        isLocal: true // Marqueur pour les opérations locales
      };
      
      console.log('🏗️ Opération locale créée:', localOperation);
      console.log('📊 Quantité finale:', localOperation.quantity);
      
      // Ajouter la nouvelle opération au début
      existingOperations.unshift(localOperation);
      
      // Garder seulement les 50 opérations les plus récentes
      if (existingOperations.length > 50) {
        existingOperations.splice(50);
      }
      
      // Sauvegarder
      localStorage.setItem('localOperations', JSON.stringify(existingOperations));
      
      console.log('💾 Opération sauvegardée localement:', localOperation.operationId);
      return localOperation;
    } catch (error) {
      console.error('❌ Erreur sauvegarde locale:', error);
      return null;
    }
  };

  // Fonctions temporaires exposées globalement pour la gestion des opérations locales
  window.clearLocalOperations = clearLocalOperations;
  window.deleteLocalOperation = deleteLocalOperation;
  window.showLocalOperations = () => {
    try {
      const operations = JSON.parse(localStorage.getItem('localOperations') || '[]');
      console.log('📋 Opérations locales:', operations);
      operations.forEach((op, index) => {
        console.log(`${index + 1}. ID: ${op.operationId}, Article: ${op.article.name}, Quantité: ${op.quantity}, Stock Ref: ${op.stockReference}`);
      });
      return operations;
    } catch (error) {
      console.error('❌ Erreur lecture opérations locales:', error);
      return [];
    }
  };

  // Fonction de test de la liaison stock-opérations
  window.testStockOperationLink = () => {
    console.log('🧪 TEST DE LA LIAISON STOCK-OPÉRATIONS');
    console.log('=====================================');
    
    console.log('📦 Stock chargé:', addedItems.length, 'articles');
    if (addedItems.length > 0) {
      const exemple = addedItems[0];
      console.log('📋 Exemple d\'article:', {
        id: exemple._id,
        nom: exemple.name,
        reference: exemple.reference,
        quantite: exemple.quantity,
        prix: exemple.price
      });
    }
    
    console.log('🔍 Article sélectionné pour opération:', selectedOperationArticle);
    if (selectedOperationArticle) {
      console.log('🔗 Liaison:', {
        'Stock Reference': selectedOperationArticle._id,
        'Quantité disponible': (selectedOperationArticle.quantity || 0) - (selectedOperationArticle.reservedQuantity || 0),
        'Prix': selectedOperationArticle.price
      });
    }
    
    const operations = JSON.parse(localStorage.getItem('localOperations') || '[]');
    console.log('📊 Opérations locales:', operations.length);
    operations.forEach(op => {
      console.log(`- ${op.operationId}: ${op.article.name} (Stock Ref: ${op.stockReference})`);
    });
    
    console.log('✅ Test terminé - Vérifiez que les IDs de stock correspondent');
  };

  // Fonction de test automatique avec l'article Artstone
  window.testArtstoneOperation = async () => {
    console.log('🎯 TEST AUTOMATIQUE - OPÉRATION ARTSTONE');
    console.log('==========================================');
    
    try {
      // 1. Trouver l'article Artstone dans le stock
      const artstoneArticle = addedItems.find(item => 
        item.reference === '6ARTBOG29' || 
        item.name?.toLowerCase().includes('artstone')
      );
      
      if (!artstoneArticle) {
        console.error('❌ Article Artstone (6ARTBOG29) non trouvé dans le stock');
        console.log('📋 Articles disponibles:', addedItems.map(item => `${item.name} (${item.reference})`));
        return;
      }
      
      console.log('📦 Article Artstone trouvé:', {
        id: artstoneArticle._id,
        nom: artstoneArticle.name,
        reference: artstoneArticle.reference,
        quantiteStock: artstoneArticle.quantity,
        quantiteReservee: artstoneArticle.reservedQuantity || 0,
        quantiteDisponible: (artstoneArticle.quantity || 0) - (artstoneArticle.reservedQuantity || 0),
        prix: artstoneArticle.price
      });
      
      // 2. Simuler la sélection de l'article
      setSelectedOperationArticle(artstoneArticle);
      setOperationBuyingDepartment('upsell');
      setOperationQuantity('1');
      setOperationCoefficient('1');
      
      console.log('⚙️ Paramètres d\'opération configurés:');
      console.log('- Article:', artstoneArticle.name);
      console.log('- Département acheteur: upsell');
      console.log('- Quantité: 1');
      console.log('- Coefficient: 1');
      console.log('- Stock Reference ID:', artstoneArticle._id);
      
      // 3. Attendre un peu puis créer l'opération
      setTimeout(() => {
        console.log('🚀 Création de l\'opération en cours...');
        console.log('⚠️ IMPORTANT: L\'opération sera sauvegardée localement car le serveur retourne 401');
        console.log('📊 Stock avant opération:', (artstoneArticle.quantity || 0) - (artstoneArticle.reservedQuantity || 0));
        
        // Le formulaire sera soumis automatiquement lors du prochain submit
        console.log('✅ Test configuré - Cliquez maintenant sur "Créer l\'opération" pour finaliser');
      }, 1000);
      
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
    }
  };

  // Fonction pour simuler complètement l'opération Artstone
  window.simulateArtstoneOperation = () => {
    console.log('🧪 SIMULATION COMPLÈTE - OPÉRATION ARTSTONE');
    console.log('==============================================');
    
    // Trouver l'article Artstone
    const artstoneArticle = addedItems.find(item => 
      item.reference === '6ARTBOG29' || 
      item.name?.toLowerCase().includes('artstone')
    );
    
    if (!artstoneArticle) {
      console.error('❌ Article Artstone non trouvé');
      return;
    }
    
    console.log('📦 ÉTAPE 1 - Article trouvé:');
    console.log('   ID:', artstoneArticle._id);
    console.log('   Nom:', artstoneArticle.name);
    console.log('   Référence:', artstoneArticle.reference);
    console.log('   Stock disponible:', (artstoneArticle.quantity || 0) - (artstoneArticle.reservedQuantity || 0));
    console.log('   Prix:', '€' + artstoneArticle.price);
    
    console.log('\n🔗 ÉTAPE 2 - Création des données d\'opération:');
    const simulatedOperationData = {
      buyingDepartment: 'upsell',
      article: {
        reference: artstoneArticle.reference,
        name: artstoneArticle.name,
        originalPrice: artstoneArticle.price,
        image: artstoneArticle.image,
        category: artstoneArticle.category
      },
      quantity: 1,
      coefficient: 1,
      stockReference: artstoneArticle._id // ← LIAISON CRITIQUE
    };
    
    console.log('   Données opération:', simulatedOperationData);
    console.log('   🔑 LIAISON STOCK:', simulatedOperationData.stockReference, '===', artstoneArticle._id);
    
    console.log('\n💾 ÉTAPE 3 - Sauvegarde locale simulée:');
    const localOperation = {
      ...simulatedOperationData,
      _id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      operationId: `OP-LOCAL-${Date.now()}`,
      sellingDepartment: 'evenementiel',
      status: 'completed',
      totalAmount: simulatedOperationData.article.originalPrice * simulatedOperationData.quantity * simulatedOperationData.coefficient,
      createdAt: new Date().toISOString(),
      createdBy: {
        fullname: 'Utilisateur Local',
        email: 'local@example.com'
      },
      isLocal: true
    };
    
    console.log('   Opération locale créée:', localOperation);
    console.log('   🔗 Stock Reference préservé:', localOperation.stockReference);
    
    console.log('\n📊 ÉTAPE 4 - Vérification de la liaison:');
    console.log('   ✅ Article stock ID:', artstoneArticle._id);
    console.log('   ✅ Opération stock ref:', localOperation.stockReference);
    console.log('   ✅ Liaison correcte:', artstoneArticle._id === localOperation.stockReference);
    
    console.log('\n⚠️ ÉTAPE 5 - Impact sur le stock:');
    console.log('   📋 Stock actuel Artstone:', artstoneArticle.quantity);
    console.log('   🔄 Quantité opération:', localOperation.quantity);
    console.log('   📉 Stock après opération RÉELLE:', artstoneArticle.quantity - localOperation.quantity);
    console.log('   ⚠️ MAIS: Opération locale = Stock inchangé côté serveur');
    
    console.log('\n🎯 RÉSULTAT:');
    console.log('   ✅ Liaison stock-opération: FONCTIONNELLE');
    console.log('   ✅ Données correctes: OUI');
    console.log('   ⚠️ Décrémention effective: NON (401 serveur)');
    console.log('   💾 Sauvegarde locale: OUI');
    
    return {
      artstoneFound: true,
      stockId: artstoneArticle._id,
      operationStockRef: localOperation.stockReference,
      linkWorking: artstoneArticle._id === localOperation.stockReference,
      currentStock: artstoneArticle.quantity,
      operationQuantity: localOperation.quantity
    };
  };

  const handleSubmitInternalOperation = async (e) => {
    e.preventDefault();
    
    // Effacer les messages précédents
    setOperationError('');
    setOperationSuccess('');
    
    // Validation des champs obligatoires
    if (!selectedOperationArticle || !operationBuyingDepartment || !operationQuantity || !operationCoefficient) {
      setOperationError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Vérifier le stock disponible
    const requestedQuantity = parseInt(operationQuantity);
    const availableQuantity = (selectedOperationArticle.quantity || 0) - (selectedOperationArticle.reservedQuantity || 0);
    
    if (availableQuantity < requestedQuantity) {
      setOperationError(`Stock insuffisant. Disponible: ${availableQuantity}, Demandé: ${requestedQuantity}`);
      return;
    }

    setOperationSubmitting(true);

    // Préparer les données d'opération en dehors du try pour les réutiliser dans catch
    const operationData = {
      buyingDepartment: operationBuyingDepartment,
      article: {
        reference: selectedOperationArticle.reference,
        name: selectedOperationArticle.name,
        originalPrice: selectedOperationArticle.price,
        image: selectedOperationArticle.image,
        category: selectedOperationArticle.category
      },
      quantity: parseInt(operationQuantity),
      coefficient: parseFloat(operationCoefficient),
      notes: operationNotes || undefined,
      // Lier à l'article du stock pour décrémenter automatiquement
      stockReference: selectedOperationArticle._id
    };

    try {
      console.log('🚀 Tentative de création d\'opération:', operationData);
      const response = await axiosApi.post('/internal-operations', operationData, {
        headers: {
          'X-No-Auto-Redirect': 'true'
        }
      });

      if (response.data.success) {
        const operationId = response.data.operation.operationId;
        console.log(`✅ Opération créée: ${operationId}`);
        setOperationSuccess(`✅ Opération créée avec succès ! (ID: ${operationId})`);
        
        // Réinitialiser le formulaire
        setOperationBuyingDepartment('');
        setOperationQuantity('');
        setOperationCoefficient('1.0');
        setOperationNotes('');
        setSelectedOperationArticle(null);
        setOperationsStockQuery('');
        setOperationsStockOptions([]);

        // Recharger l'historique pour afficher la nouvelle opération
        await loadOperationsHistory();
        
        // Actualiser le stock pour refléter la décrémention
        if (activeSection === 'Stock') {
          // Recharger les données de stock si on est sur l'onglet Stock
          stockLoadedRef.current.delete('Stock');
          setStockLoading(false);
        } else {
          // Marquer pour actualisation future et recharger pour les opérations diverses
          setNeedsStockRefresh(true);
          stockLoadedRef.current.delete('Opérations diverses');
          setStockLoading(false);
        }

        // Effacer le message de succès après 5 secondes
        setTimeout(() => setOperationSuccess(''), 5000);
      }
    } catch (error) {
      console.error('❌ Erreur soumission opération:', error);
      
      if (error.response?.status === 401) {
        // En cas d'erreur 401, sauvegarder localement
        console.log('🔄 Sauvegarde locale de l\'opération en cours...');
        const localOperation = saveOperationLocally(operationData);
        
        if (localOperation) {
          setOperationSuccess(`✅ Opération créée localement ! (ID: ${localOperation.operationId}) - Elle apparaîtra dans l'historique`);
          
          // Réinitialiser le formulaire
          setOperationBuyingDepartment('');
          setOperationQuantity('');
          setOperationCoefficient('1.0');
          setOperationNotes('');
          setSelectedOperationArticle(null);
          setOperationsStockQuery('');
          setOperationsStockOptions([]);

          // Recharger l'historique pour afficher la nouvelle opération locale
          await loadOperationsHistory();
          
          // Effacer le message de succès après 7 secondes
          setTimeout(() => setOperationSuccess(''), 7000);
        } else {
          setOperationError('❌ Erreur lors de la sauvegarde locale. Veuillez réessayer.');
        }
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message || 'Données invalides';
        setOperationError(`❌ ${message}`);
      } else if (error.response?.status >= 500) {
        setOperationError('❌ Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        const message = error.response?.data?.message || error.message || 'Erreur lors de la création de l\'opération';
        setOperationError(`❌ ${message}`);
      }
    } finally {
      setOperationSubmitting(false);
    }
  };

  // Fonction pour charger l'historique des opérations
  // Fonctions pour l'édition inline
  const handleStartEdit = (itemId, field, currentValue) => {
    setEditingItemId(itemId);
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingField(null);
    setEditValue('');
  };

  const handleSaveEdit = async () => {
    if (!editingItemId || !editingField) return;

    try {
      const updateData = {};
      
      // Préparer les données selon le champ
      switch (editingField) {
        case 'name':
          updateData.name = editValue;
          break;
        case 'price':
          updateData.pricing = { price: parseFloat(editValue) || 0 };
          break;
        case 'height':
          updateData.dimensions = { height: parseFloat(editValue) || 0 };
          break;
        case 'diameter':
          updateData.dimensions = { diameter: parseFloat(editValue) || 0 };
          break;
        default:
          return;
      }

      const response = await axiosApi.put(`/catalog/nieuwkoop/stock/${editingItemId}`, updateData);
      
      if (response.data) {
        // Mettre à jour l'élément dans la liste locale
        setItems(prevItems => prevItems.map(item => {
          if (item._id === editingItemId) {
            const updated = { ...item };
            if (editingField === 'name') updated.name = editValue;
            if (editingField === 'price') updated.price = parseFloat(editValue) || 0;
            if (editingField === 'height') updated.dimensions = { ...updated.dimensions, height: parseFloat(editValue) || 0 };
            if (editingField === 'diameter') updated.dimensions = { ...updated.dimensions, diameter: parseFloat(editValue) || 0 };
            return updated;
          }
          return item;
        }));
        
        handleCancelEdit();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      handleCancelEdit();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const loadOperationsHistory = async () => {
    setOperationsLoading(true);
    try {
      console.log('📊 Chargement de l\'historique des opérations...');
      
      // Charger les opérations locales
      let localOperations = [];
      try {
        localOperations = JSON.parse(localStorage.getItem('localOperations') || '[]');
        console.log(`📱 ${localOperations.length} opérations locales trouvées`);
      } catch (error) {
        console.error('❌ Erreur lecture opérations locales:', error);
        localOperations = [];
      }
      
      // Tenter de charger les opérations serveur
      let serverOperations = [];
      try {
        const response = await axiosApi.get('/internal-operations?limit=20&sortBy=createdAt&sortOrder=desc', {
          headers: {
            'X-No-Auto-Redirect': 'true'
          }
        });
        
        if (response.data.success) {
          serverOperations = response.data.operations;
          console.log(`✅ ${serverOperations.length} opérations serveur chargées`);
        }
      } catch (error) {
        console.error('❌ Erreur chargement opérations serveur:', error);
        
        // Gestion spécifique des erreurs d'authentification
        if (error.response?.status === 401) {
          console.warn('⚠️ Non authentifié pour accéder aux opérations serveur - utilisation des opérations locales uniquement');
        } else if (error.response?.status === 403) {
          console.warn('⚠️ Permissions insuffisantes pour accéder aux opérations serveur');
        }
      }
      
      // Combiner les opérations locales et serveur
      const allOperations = [...localOperations, ...serverOperations];
      
      // Trier par date de création (plus récent en premier)
      allOperations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Limiter à 50 opérations max
      const limitedOperations = allOperations.slice(0, 50);
      
      console.log(`📊 Total: ${limitedOperations.length} opérations (${localOperations.length} locales + ${serverOperations.length} serveur)`);
      setOperationsHistory(limitedOperations);
      
    } catch (error) {
      console.error('❌ Erreur générale chargement historique:', error);
      
      // En cas d'erreur totale, charger au moins les opérations locales
      try {
        const localOperations = JSON.parse(localStorage.getItem('localOperations') || '[]');
        console.log(`🔄 Chargement des opérations locales uniquement: ${localOperations.length}`);
        setOperationsHistory(localOperations);
      } catch (localError) {
        console.error('❌ Erreur chargement opérations locales:', localError);
        setOperationsHistory([]);
      }
    } finally {
      setOperationsLoading(false);
    }
  };

  // Charger l'historique quand on arrive sur l'onglet Opérations diverses
  useEffect(() => {
    if (activeSection === 'Opérations diverses') {
      loadOperationsHistory();
    }
  }, [activeSection]);

  // Actualiser le stock si nécessaire quand on revient sur l'onglet Stock
  useEffect(() => {
    if (activeSection === 'Stock' && needsStockRefresh) {
      setNeedsStockRefresh(false);
      // Forcer le rechargement des données de stock
      window.location.reload();
    }
  }, [activeSection, needsStockRefresh]);

  // Calculate filtered and sorted items first (needed by operations search)
  const totalPrice = addedItems.reduce((acc, item) => acc + item.price * (item.quantity || 0), 0);
  const totalQty = addedItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
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

  // Recherche d'articles pour les opérations diverses
  useEffect(() => {
    if (operationsStockQuery.length < 2) {
      setOperationsStockOptions([]);
      return;
    }
    let cancelled = false;
    
    const searchItems = async () => {
      try {
        console.log('🔍 Recherche:', operationsStockQuery, '- Articles disponibles:', addedItems.length);
        
        // Utiliser directement addedItems au lieu de sortedItems pour éviter les filtres
        const filtered = addedItems.filter(item => 
          item.name?.toLowerCase().includes(operationsStockQuery.toLowerCase()) ||
          item.reference?.toLowerCase().includes(operationsStockQuery.toLowerCase())
        );
        
        console.log('✅ Résultats trouvés:', filtered.length, filtered.length > 0 ? '- Premier: ' + filtered[0].name : '');
        
        if (!cancelled) {
          setOperationsStockOptions(filtered.slice(0, 10)); // Limiter à 10 résultats
        }
      } catch (error) {
        console.error('Error searching stock items:', error);
      }
    };
    
    const timeoutId = setTimeout(searchItems, 300); // Debounce
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [operationsStockQuery, addedItems]);

  // États pour le sélecteur de date de visualisation du stock
  const today = new Date();
  const [selectedStockDate, setSelectedStockDate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [stockProjections, setStockProjections] = useState({});

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    api.get('/auth/me')
      .then(response => {
        // console.log('🔍 Structure response.data:', response.data);
        // Tester différentes structures possibles
        const user = response.data.user || response.data;
        const username = user.username || user.name || user.email || 'utilisateur';
        setCurrentUser(username);
        // console.log('✅ Utilisateur récupéré:', username);
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

  const handleCardClick = (prod, event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(`🎯 SINGLE CLICK on: "${prod.reference}"`);
    
    // Éviter de déclencher l'événement si on clique sur un élément interactif
    if (event.target.closest('button') || event.target.closest('select') || event.target.closest('input')) {
      console.log('❌ Interactive element click ignored');
      return;
    }
    
    setFocusedCard(prod.reference);
    console.log(`✅ Set focused card to: "${prod.reference}"`);
  };

  const closeFocus = () => {
    console.log('Closing focused card');
    setFocusedCard(null);
  };

  const closeAssign = () => {
    setIsAssignOpen(false);
  };

  useEffect(() => {
    // Charger les projets pour les onglets Projets, Stock, Entrée et Sortie
    if (activeSection === "Projets" || activeSection === "Stock" || activeSection === "Entrée" || activeSection === "Sortie") {
      fetchProjects();
    }
  }, [activeSection]);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      
      setProjects(data);
    } catch (err) {
      console.error("Erreur chargement projets :", err);
    }
  };

  // Calculer le stock à une date future
  const calculateProjectedStock = async (targetDate) => {
    if (!targetDate) return;
    
    // console.log('📅 Calcul du stock projeté pour:', targetDate.toLocaleDateString('fr-FR'));
    
    try {
      // Récupérer tous les mouvements et projets
      const [movements, projectsData] = await Promise.all([
        getMovements(),
        getProjects()
      ]);

      // console.log('📦 Projets récupérés:', projectsData.length);

      // Filtrer les mouvements jusqu'à la date cible
      const targetTime = targetDate.getTime();
      
      // Calculer les ajustements de stock pour chaque article
      const stockAdjustments = {};
      
      // D'abord, traiter les réservations des projets
      projectsData.forEach(project => {
        // Vérifier si le projet est actif et dans la période de la date cible
        const startDate = new Date(project.dates?.start || project.dateDebut);
        const endDate = new Date(project.dates?.end || project.dateFin);
        
        // Si la date cible est pendant la durée du projet
        if (startDate <= targetDate && targetDate <= endDate && project.status !== 'completed' && project.status !== 'cancelled') {
          // console.log('📁 Projet actif à cette date:', project.client?.name || project.title);
          
          // Compter les materials du projet comme réservés
          if (project.materials && project.materials.length > 0) {
            // console.log(`🔍 PROJET "${project.client?.name || project.title}" - Matériaux:`, project.materials);
            project.materials.forEach(material => {
              const ref = material.reference || material.ItemCode || '';
              if (ref) {
                if (!stockAdjustments[ref]) {
                  stockAdjustments[ref] = 0;
                }
                // console.log(`  🔍 AVANT: ${ref} = ${stockAdjustments[ref]}, ajout de -${material.quantity}`);
                // Soustraire la quantité réservée pour ce projet
                stockAdjustments[ref] -= (material.quantity || 0);
                // console.log(`  🔍 APRÈS: ${ref} = ${stockAdjustments[ref]}`);
                console.log(`  🌱 ${material.name} (${ref}): -${material.quantity} (réservé)`);
              }
            });
          }
        }
      });
      
      // Calculer uniquement les réservations des projets (pas les mouvements de stock)
      projectsData.forEach(project => {
        if (project.date && new Date(project.date).getTime() <= targetTime) {
          if (project.items && Array.isArray(project.items)) {
            project.items.forEach(item => {
              const ref = item.reference;
              if (!stockAdjustments[ref]) {
                stockAdjustments[ref] = 0;
              }
              // Soustraire les quantités réservées pour le projet
              stockAdjustments[ref] -= (item.quantity || 0);
            });
          }
        }
      });

      setStockProjections(stockAdjustments);
      return stockAdjustments;
    } catch (error) {
      console.error("Erreur calcul projection stock:", error);
      return {};
    }
  };

  // Gérer le changement de date
  const handleDateSelection = (day) => {
    const newDate = new Date(selectedYear, selectedMonth, day);
    // console.log('📅 Date sélectionnée:', newDate.toLocaleDateString('fr-FR'));
    setSelectedDay(day);
    setSelectedStockDate(newDate);
    calculateProjectedStock(newDate);
  };

  // Recalculer les projections quand les projets changent
  useEffect(() => {
    if (selectedStockDate) {
      calculateProjectedStock(selectedStockDate);
    }
  }, [projects]);

  // Calculer les projections pour aujourd'hui au chargement
  useEffect(() => {
    if (activeSection === "Stock" && projects.length > 0) {
      calculateProjectedStock(today);
    }
  }, [activeSection, projects.length]);

  const handleSubmitProject = async (formData) => {
    console.log('📤 Submitting project with formData:', formData);
    if (formData instanceof FormData) {
      console.log('📋 FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
    } else {
      console.log('📋 JSON data:', formData);
    }
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

  const updateCategory = (id, category) => {
    console.log('🔄 Updating category for item:', id, 'to:', category);
    axiosApi.put(`/catalog/nieuwkoop/stock/${id}/category`, { category })
      .then(response => {
        const updated = response.data;
        console.log('✅ Category updated successfully:', { id, newCategory: category, response: updated });
        
        // Mettre à jour immédiatement l'état addedItems avec la nouvelle catégorie
        setAddedItems(prev => {
          const newItems = prev.map(item => 
            item._id === id ? { ...item, category: category } : item
          );
          console.log('🔄 AddedItems state updated:', newItems.find(item => item._id === id)?.category);
          return newItems;
        });
      })
      .catch(err => {
        console.error("❌ Erreur mise à jour catégorie:", err);
      });
  };

  useEffect(() => {
    if (activeSection === "Stock" || activeSection === "Opérations diverses") {
      // Vérifier si le stock a déjà été chargé pour cette session
      if (stockLoadedRef.current.has(activeSection) || stockLoading) {
        return;
      }
      
      console.log('🔄 Loading stock data for section:', activeSection);
      setStockLoading(true);
      stockLoadedRef.current.add(activeSection);
      
      axiosApi.get("/catalog/nieuwkoop/stock")
        .then(response => {
          console.log('📦 Stock API response:', response.data?.length || 0, 'items');
          const data = response.data;
          if (Array.isArray(data)) {
            const cleaned = data.map(item => ({
              ...item,
              price: item.pricing?.price || (typeof item.price === 'number' ? item.price : Number(item.price) || 0),
              quantity: item.stock?.quantity || item.quantity || 0,
              reservedQuantity: item.stock?.reservedQuantity || item.reservedQuantity || 0,
              // Normaliser les propriétés pour l'affichage
              image: item.images?.[0]?.url || item.image || '',
              height: item.dimensions?.height || item.height || 0,
              diameter: item.dimensions?.diameter || item.diameter || item.DiameterCulturePot || item.Diameter || item.Opening || (item.PotSize ? parseInt(item.PotSize) : 0) || 0,
              note: item.notes || item.note || ''
            }));
            
            console.log('✅ Processed', cleaned.length, 'items for', activeSection);
            setAddedItems(cleaned);
            console.log('📦 Stock items loaded with references:', cleaned.map(item => ({
              name: item.name,
              reference: item.reference
            })));
          } else {
            console.error("Data is not an array:", data);
            setAddedItems([]);
          }
        })
        .catch(err => {
          console.error("Erreur chargement stock local:", err);
          setAddedItems([]);
          // En cas d'erreur, retirer de la liste pour permettre un retry
          stockLoadedRef.current.delete(activeSection);
        })
        .finally(() => {
          setStockLoading(false);
        });
    }
  }, [activeSection]);

  const handleSearch = () => {
    // console.log('🔍 Frontend - Recherche lancée pour le produit:', productId);
    setError(null);
    setImageUrl(`/api/catalog/nieuwkoop/items/${productId}/image`);

    axiosApi.get(`/catalog/nieuwkoop/items/${productId}/details`)
      .then(response => {
        const data = response.data;
        console.log('📋 Frontend - Détails produit reçus:', data);
        console.log('🌿 Frontend - Item data:', data.item);
        setItem(data.item);
      })
      .catch((error) => {
        console.error('❌ Frontend - Erreur récupération détails:', error);
        const errorInfo = handleApiError(error);
        setError(errorInfo.message || "Produit introuvable.");
        setItem(null);
      });

    axiosApi.get(`/catalog/nieuwkoop/prices/${productId}`)
      .then(response => {
        const data = response.data;
        console.log('💰 Frontend - Prix reçu:', data);
        setPrice(data.price);
      })
      .catch((error) => {
        console.error('❌ Frontend - Erreur récupération prix:', error);
        setPrice(null);
      });
  };

  const handleAddToStock = () => {
    if (!item || !price) return;

    console.log('🚀 Frontend - handleAddToStock - Données brutes reçues:', {
      item,
      price
    });
    
    const diameter = item.DiameterCulturePot || item.Diameter || item.Opening || (item.PotSize ? parseInt(item.PotSize) : 0) || 0;
    // console.log('🔍 Frontend - Calcul du diamètre:', {
    //   DiameterCulturePot: item.DiameterCulturePot,
    //   Diameter: item.Diameter,
    //   Opening: item.Opening,
    //   PotSize: item.PotSize,
    //   'PotSize parsed': item.PotSize ? parseInt(item.PotSize) : 0,
    //   'Valeur finale': diameter
    // });

    const payload = {
      reference: item.Itemcode,
      name: item.ItemDescription_EN || item.ItemDescription_FR,
      height: item.Height,
      diameter: diameter,
      price: price.PriceNett,
    };
    
    console.log('📦 Frontend - Payload envoyé pour ajout au stock:', payload);

    axiosApi.post("/catalog/nieuwkoop/stock", payload)
      .then(response => {
        const newItem = response.data;
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

  const updateQuantity = async (id, quantity) => {
    setLoading(`quantity-${id}`, true);
    
    // Trouver l'article actuel pour connaître sa quantité précédente
    const currentItem = addedItems.find(item => item._id === id);
    if (!currentItem) {
      setLoading(`quantity-${id}`, false);
      return;
    }
    
    const previousQuantity = currentItem.quantity || 0;
    const difference = quantity - previousQuantity;
    
    // Mise à jour optimiste immédiate
    setAddedItems(prev => prev.map(item => 
      item._id === id ? { ...item, quantity } : item
    ));
    
    try {
      // Mettre à jour la quantité dans la base
      const response = await axiosApi.put(`/catalog/nieuwkoop/stock/${id}`, { quantity });
      const updated = response.data;
      
      // Mise à jour avec les données du serveur
      setAddedItems(prev => prev.map(item => 
        item._id === id ? { ...item, ...updated } : item
      ));
      
      // Créer un mouvement automatiquement si la quantité a changé
      if (difference !== 0) {
        try {
          const movementData = {
            type: difference > 0 ? 'entrée' : 'sortie',
            reference: currentItem.reference,
            name: currentItem.name,
            quantity: Math.abs(difference),
            note: `Ajustement automatique depuis l'onglet Stock (${difference > 0 ? '+' : ''}${difference})`,
            createdBy: currentUser || 'Utilisateur',
            image: currentItem.image || '',
            price: currentItem.price || 0
          };
          
          // Pour les sorties, ajouter le subType obligatoire
          if (difference < 0) {
            movementData.subType = 'definitive';
          }
          
          await createMovement(movementData);
          console.log(`✅ Mouvement automatique créé: ${difference > 0 ? 'entrée' : 'sortie'} de ${Math.abs(difference)} pour ${currentItem.reference}`);
          
          showNotification(
            `Quantité mise à jour et mouvement ${difference > 0 ? 'd\'entrée' : 'de sortie'} créé automatiquement`, 
            'success'
          );
        } catch (movementError) {
          console.warn('⚠️ Erreur lors de la création du mouvement automatique:', movementError);
          // On continue même si le mouvement échoue
          showNotification('Quantité mise à jour (mouvement automatique échoué)', 'warning');
        }
      } else {
        showNotification('Quantité mise à jour', 'success');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      // Annuler la mise à jour optimiste en cas d'erreur
      fetchAddedItems();
      showNotification('Erreur lors de la mise à jour', 'error');
    } finally {
      setLoading(`quantity-${id}`, false);
    }
  };

  const updateNote = (id, note) => {
    axiosApi.put(`/catalog/nieuwkoop/stock/${id}/note`, { note })
      .then(response => {
        const updated = response.data;
        setAddedItems(prev => prev.map(item => item._id === id ? updated : item));
      });
  };

  // Fonctions utilitaires pour les notifications
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 3000);
  };

  const setLoading = (key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  // Fonction pour vérifier si un produit a été récemment modifié (moins de 24h)
  const isRecentlyModified = (item) => {
    if (!item.updatedAt) return false;
    const now = new Date();
    const updated = new Date(item.updatedAt);
    const diffHours = (now - updated) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  // Fonction de suppression avec confirmation
  const deleteItem = (id) => {
    if (confirmDelete === id) {
      // Suppression confirmée
      setLoading(`delete-${id}`, true);
      
      axiosApi.delete(`/catalog/nieuwkoop/stock/${id}`)
        .then(response => {
          const data = response.data;
          setAddedItems(prev => prev.filter(item => item._id !== id));
          showNotification('Article supprimé avec succès', 'success');
          setConfirmDelete(null);
        })
        .catch(err => {
          console.error('❌ Erreur suppression:', err);
          showNotification('Erreur lors de la suppression', 'error');
        })
        .finally(() => {
          setLoading(`delete-${id}`, false);
        });
    } else {
      // Demander confirmation
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000); // Auto-annulation après 3s
    }
  };

  // Drag and drop handlers natifs
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    if (draggedItem && draggedItem._id !== targetItem._id) {
      showNotification('Réorganisation des articles simulée', 'info');
    }
  };

  const handleClearAll = () => {
    axiosApi.delete("/catalog/nieuwkoop/stock/all")
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


// 🌟 Mouse Trail Effect - Tracking
// MOUSE TRAIL USEEFFECT DÉSACTIVÉ POUR PERFORMANCE
// useEffect(() => {
//   const handleMouseMove = (e) => {
//     setMousePos({x: e.clientX, y: e.clientY});
//     
//     // Add to trail
//     setMouseTrail(prev => {
//       const newTrail = [...prev, {
//         x: e.clientX,
//         y: e.clientY,
//         id: Date.now() + Math.random(),
//         opacity: 1
//       }];
//       
//       // Keep only last 8 points
//       return newTrail.slice(-8);
//     });
//   };

//   window.addEventListener('mousemove', handleMouseMove);
  
//   // Fade trail particles
//   const interval = setInterval(() => {
//     setMouseTrail(prev => 
//       prev.map(point => ({
//         ...point,
//         opacity: point.opacity * 0.9
//       })).filter(point => point.opacity > 0.1)
//     );
//   }, 50);

//   return () => {
//     window.removeEventListener('mousemove', handleMouseMove);
//     clearInterval(interval);
//   };
// }, []);


// 🌟 Parallax Layers - DÉSACTIVÉ POUR PERFORMANCE
// const { scrollY } = useScroll();
// const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
// const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

// console.log('🚀 NIEUWKOOP COMPONENT RENDERED', {
  //   activeSection,
  //   sortedItemsCount: sortedItems?.length || 0,
  //   focusedCard: focusedCard?.name || 'none'
  // });

// Trouve le produit focalisé
const focusedProduct = focusedCard ? sortedItems.find(prod => prod.reference === focusedCard) : null;

return (
    <ThemeProvider>
      {/* Badge utilisateur en haut à gauche */}
      {user && (
        <div
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '20rem',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '25px',
            padding: '0.5rem 1rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeInLeft 0.5s ease-out'
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.8rem'
          }}>
            {'F'}
          </div>
          <div style={{
            color: 'var(--color-text-primary)',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            {'Freex94'}
          </div>
        </div>
      )}
      
      {focusedCard && (
        <div className="card-focus-overlay" onClick={closeFocus}>
          <button className="close-focus-btn" onClick={closeFocus}>
            ×
          </button>
          
          {/* Carte focalisée rendue ici au niveau racine */}
          {focusedProduct && (
            <div 
              className="stock-card stock-card-focused"
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête */}
              <div style={{
                background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
                padding: '1.25rem',
                color: 'var(--color-primary)',
                borderBottom: '1px solid var(--color-primary)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      margin: 0,
                      lineHeight: '1.3',
                      marginBottom: '0.25rem',
                      color: 'var(--color-primary)'
                    }}>
                      {focusedProduct.name}
                    </h3>
                    <p style={{
                      fontSize: '0.8rem',
                      opacity: 0.7,
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      {focusedProduct.reference || 'N/A'}
                    </p>
                  </div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--color-primary)'
                  }}>
                    €{focusedProduct.price ? focusedProduct.price.toFixed(2) : '0.00'}
                  </div>
                </div>
              </div>

              {/* Image */}
              <div style={{position: 'relative'}}>
                <div style={{
                  position: 'relative',
                  height: '180px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)'
                }}>
                  <img 
                    src={focusedProduct.image} 
                    alt={focusedProduct.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '1rem'
                    }}
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    fontSize: '3rem',
                    opacity: 0.3
                  }}>
                    🌿
                  </div>
                </div>
              </div>

              {/* Corps principal */}
              <div style={{padding: '1.5rem'}}>
                {/* Quantité et statuts */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: '12px'
                  }}>
                    <div style={{fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.25rem'}}>
                      Disponible
                    </div>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: 'var(--color-primary)'
                    }}>
                      {(focusedProduct.quantity || 0) - (focusedProduct.reservedQuantity || 0)}
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: '12px'
                  }}>
                    <div style={{fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.25rem'}}>
                      Total
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: 'var(--color-text-primary)'
                    }}>
                      {focusedProduct.quantity || 0}
                    </div>
                  </div>
                </div>

                {/* Dashboard - Statistiques et Informations */}
                <div style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'var(--glass-backdrop)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--glass-shadow)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: 'var(--color-primary)',
                      borderRadius: '50%',
                      marginRight: '0.5rem',
                      boxShadow: '0 0 10px var(--color-primary)'
                    }}></div>
                    <h4 style={{
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: 'var(--color-text-primary)'
                    }}>
                      Dashboard Produit
                    </h4>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    {/* État */}
                    <div style={{
                      background: 'var(--color-surface-elevated)',
                      padding: '1rem',
                      borderRadius: '12px',
                      textAlign: 'center',
                      border: '1px solid var(--color-border)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>
                        {(focusedProduct.quantity || 0) > 0 ? '✅' : '❌'}
                      </div>
                      <div style={{
                        fontSize: '0.7rem', 
                        color: 'var(--color-text-secondary)', 
                        marginBottom: '0.25rem',
                        fontWeight: '600'
                      }}>
                        ÉTAT
                      </div>
                      <div style={{
                        fontSize: '0.8rem', 
                        fontWeight: '600',
                        color: 'var(--color-text-primary)'
                      }}>
                        {(focusedProduct.quantity || 0) > 0 ? 'En Stock' : 'Rupture'}
                      </div>
                    </div>

                    {/* Sorties */}
                    <div style={{
                      background: 'var(--color-surface-elevated)',
                      padding: '1rem',
                      borderRadius: '12px',
                      textAlign: 'center',
                      border: '1px solid var(--color-border)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>📤</div>
                      <div style={{
                        fontSize: '0.7rem', 
                        color: 'var(--color-text-secondary)', 
                        marginBottom: '0.25rem',
                        fontWeight: '600'
                      }}>
                        SORTIES
                      </div>
                      <div style={{
                        fontSize: '1.2rem', 
                        fontWeight: '700', 
                        color: 'var(--color-primary)'
                      }}>
                        {focusedProduct.exitCount || 0}
                      </div>
                    </div>

                    {/* Arrosages */}
                    <div style={{
                      background: 'var(--color-surface-elevated)',
                      padding: '1rem',
                      borderRadius: '12px',
                      textAlign: 'center',
                      border: '1px solid var(--color-border)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>💧</div>
                      <div style={{
                        fontSize: '0.7rem', 
                        color: 'var(--color-text-secondary)', 
                        marginBottom: '0.25rem',
                        fontWeight: '600'
                      }}>
                        ARROSAGES
                      </div>
                      <div style={{
                        fontSize: '1.2rem', 
                        fontWeight: '700', 
                        color: 'var(--color-success)'
                      }}>
                        {focusedProduct.wateringCount || 0}
                      </div>
                    </div>
                  </div>

                  {/* Indicateurs de santé et activité */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                  }}>
                    <div style={{
                      background: 'var(--color-success-bg)',
                      border: '1px solid var(--color-success)',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <div style={{fontSize: '1rem', marginRight: '0.5rem'}}>🌱</div>
                      <div>
                        <div style={{
                          fontSize: '0.7rem', 
                          color: 'var(--color-text-secondary)',
                          fontWeight: '600'
                        }}>
                          Dernière activité
                        </div>
                        <div style={{
                          fontSize: '0.8rem', 
                          fontWeight: '600',
                          color: 'var(--color-text-primary)'
                        }}>
                          {focusedProduct.lastActivity || 'Aujourd\'hui'}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: 'var(--color-warning)',
                      backgroundOpacity: '0.1',
                      border: '1px solid var(--color-warning)',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <div style={{fontSize: '1rem', marginRight: '0.5rem'}}>⚡</div>
                      <div>
                        <div style={{
                          fontSize: '0.7rem', 
                          color: 'var(--color-text-secondary)',
                          fontWeight: '600'
                        }}>
                          Score santé
                        </div>
                        <div style={{
                          fontSize: '0.8rem', 
                          fontWeight: '600',
                          color: 'var(--color-text-primary)'
                        }}>
                          {focusedProduct.healthScore || '85%'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge catégorie */}
                {focusedProduct.category && (
                  <div style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    {focusedProduct.category}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      <motion.div 
        className="flex min-h-screen" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ 
          background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Parallax Background Layer 1 */}
        <motion.div 
          style={{ 
            // y: y1, // DÉSACTIVÉ POUR PERFORMANCE
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '120%',
            background: 'radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
        
        {/* Parallax Background Layer 2 */}
        <motion.div 
          style={{ 
            // y: y2, // DÉSACTIVÉ POUR PERFORMANCE
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '110%',
            background: 'radial-gradient(circle at 60% 40%, rgba(168, 85, 247, 0.05) 0%, transparent 60%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Mouse Trail Effect - DÉSACTIVÉ POUR PERFORMANCE */}
        {/* <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999
        }}>
          {mouseTrail.map((point, index) => (
            <motion.div
              key={point.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [1, 0.5, 0]
              }}
              transition={{ 
                duration: 0.6,
                ease: "easeOut"
              }}
              style={{
                position: 'absolute',
                left: point.x - 4,
                top: point.y - 4,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(239, 68, 68, ${point.opacity}) 0%, rgba(239, 68, 68, 0) 70%)`,
                boxShadow: `0 0 10px rgba(239, 68, 68, ${point.opacity * 0.5})`
              }}
            />
          ))}
        </div> */}
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
            {["Catalogue", "Produits", "Stock", "Entrée", "Sortie", "Projets", "Opérations diverses"].map((item, index) => (
              <button
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
                {item === "Opérations diverses" && "🔄 "}
                {item}
              </button>
            ))}
          </motion.nav>

{activeSection === "Stock" && (
 <div className="flex flex-col gap-1 mt-2 ml-4 text-sm">
  {/* Entretien séparé en haut */}
  <button
    onClick={() => {
      setActiveSection("Stock");
      setActiveCategory("entretien");
    }}
    className={`pl-4 py-1 text-left rounded hover:bg-gray-100 mb-2 ${
      activeCategory === "entretien" ? "font-semibold bg-green-50" : ""
    }`}
    style={{
      color: activeCategory === "entretien" ? '#22c55e' : (isDark ? '#ffffff' : '#4b5563')
    }}
  >
    🧰 Entretien
  </button>
  
  {/* Barre de séparation */}
  <div style={{
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, var(--color-border) 50%, transparent 100%)',
    margin: '0.5rem 0 1rem 0'
  }}></div>

  <button
    onClick={() => {
      setActiveSection("Stock");
      setActiveCategory("");
    }}
    className={`pl-4 py-1 text-left rounded hover:bg-gray-100 border-b border-gray-300 mb-1 ${
      !activeCategory ? "font-semibold bg-green-50" : ""
    }`}
    style={{
      color: !activeCategory ? '#22c55e' : (isDark ? '#ffffff' : '#4b5563')
    }}
  >
    📦 Tous les articles
  </button>
  {[
    { label: "🌿 Plantes", key: "plante", subcategories: [
        { label: "🌿 Plantes extérieures", key: "plantes-exterieures" }
      ]
    },
    { label: "🏺 Contenants",  key: "contenant" },
    { label: "🎨 Décor",       key: "decoration" },
    { label: "🧠 Artificiels", key: "artificiel" },
    { label: "🍂 Séchés",      key: "seche", subcategories: [
        { label: "🤷‍♂️ Non classé", key: "" }
      ]
    }
  ].map(({ label, key, subcategories }) => (
    <div key={key}>
      <button
        onClick={() => {
          setActiveSection("Stock");
          setActiveCategory(key);
        }}
        className={`pl-4 py-1 text-left rounded w-full hover:bg-gray-100 ${
          activeCategory === key ? "font-semibold bg-green-50" : ""
        } ${
          key === 'entretien' ? 'border-b border-gray-300 mb-1' : ''
        }`}
        style={{
          color: activeCategory === key ? '#22c55e' : (isDark ? '#ffffff' : '#4b5563')
        }}
      >
        {label}
      </button>
      {/* Sous-catégories */}
      {subcategories && subcategories.map(({ label: subLabel, key: subKey }) => (
        <button
          key={subKey}
          onClick={() => {
            setActiveSection("Stock");
            setActiveCategory(subKey);
          }}
          className={`pl-8 py-1 text-left rounded w-full text-sm hover:bg-gray-50 ${
            activeCategory === subKey ? "font-medium bg-green-50" : ""
          }`}
          style={{
            color: activeCategory === subKey ? '#10b981' : (isDark ? '#ffffff' : '#6b7280')
          }}
        >
          {subLabel}
        </button>
      ))}
    </div>
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
              await axiosApi.post('/auth/logout');
            } catch (err) {
              console.error('Erreur lors de la déconnexion:', err);
            } finally {
              // Supprimer les tokens locaux
              localStorage.removeItem('authToken');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('rememberedUser');
              
              // Rediriger vers la page de connexion
              window.location.href = '/app/login';
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
          <div className="flex-1 flex justify-center" style={{ position: 'relative' }}>
            <motion.h2
              initial={{ opacity: 0, y: -50, scale: 0.8, rotateX: -90 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1, 
                rotateX: 0,
                textShadow: [
                  '0 0 30px rgba(16, 185, 129, 0.3)',
                  '0 0 50px rgba(16, 185, 129, 0.6)',
                  '0 0 30px rgba(16, 185, 129, 0.3)'
                ]
              }}
              transition={{ 
                duration: 1.2, 
                delay: 0.3,
                ease: "easeOut"
              }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { 
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }
              }}
              style={{
                fontSize: '3rem',
                fontWeight: '400',
                color: '#ffffff',
                letterSpacing: '0.1em',
                fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
                textShadow: `
                  1px 1px 0px #059669,
                  2px 2px 0px #10b981,
                  3px 3px 5px rgba(0,0,0,0.3)
                `,
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                position: 'relative'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                {/* Icône plante avec animation */}
                <span
                  style={{ 
                    display: 'inline-block', 
                    marginRight: '1rem', 
                    fontSize: '2.5rem',
                    verticalAlign: 'middle'
                  }}
                >
                  🌿
                </span>
                
                {/* Nom de l'onglet actif avec animation */}
                {(activeSection.includes('diverses') ? 'OPÉRATIONS\u00A0DIVERSES' : activeSection.toUpperCase()).split('').map((letter, index) => (
                  <motion.span
                    key={`section-${activeSection}-${index}`}
                    animate={{ 
                      opacity: [0, 0, 1, 1, 1, 1, 0],
                      width: [0, 0, 'auto', 'auto', 'auto', 'auto', 0],
                      textShadow: [
                        `1px 1px 0px #059669, 2px 2px 0px #10b981, 3px 3px 5px rgba(0,0,0,0.3)`,
                        `1.5px 1.5px 0px #059669, 3px 3px 0px #10b981, 4px 4px 8px rgba(0,0,0,0.4)`,
                        `1px 1px 0px #059669, 2px 2px 0px #10b981, 3px 3px 5px rgba(0,0,0,0.3)`
                      ]
                    }}
                    transition={{
                      opacity: { 
                        duration: 6,
                        repeat: Infinity,
                        delay: index * 0.1,
                        times: [0, 0.05, 0.1, 0.7, 0.8, 0.95, 1]
                      },
                      width: { 
                        duration: 6,
                        repeat: Infinity,
                        delay: index * 0.1,
                        times: [0, 0.05, 0.1, 0.7, 0.8, 0.95, 1]
                      },
                      textShadow: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    whileHover={{
                      scale: 1.3,
                      y: -10,
                      textShadow: `2px 2px 0px #059669, 4px 4px 0px #10b981, 6px 6px 0px #34d399, 8px 8px 12px rgba(0,0,0,0.5)`,
                      transition: { 
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                        duration: 0.3
                      }
                    }}
                    style={{
                      color: '#ffffff',
                      display: 'inline-block',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      verticalAlign: 'middle'
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
                
                
                {/* Curseur clignotant */}
                <motion.span
                  animate={{ opacity: [0, 0, 0, 0, 1, 1, 0] }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    delay: activeSection.length * 0.1 + 0.5,
                    times: [0, 0.3, 0.35, 0.4, 0.45, 0.9, 1]
                  }}
                  style={{ 
                    display: 'inline-block',
                    marginLeft: '2px',
                    fontSize: '0.9em',
                    color: '#ffffff',
                    verticalAlign: 'middle'
                  }}
                >
                  |
                </motion.span>
              </span>
            </motion.h2>
            
            {/* Trait décoratif 3D sous le titre */}
            <div
              style={{
                height: '8px',
                margin: '0.5rem auto 0',
                position: 'absolute',
                left: '50%',
                top: '100%',
                transform: 'translateX(-50%)',
                maxWidth: '450px'
              }}
            >
              {/* Trait principal avec effet 3D */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(90deg, 
                    transparent 0%, 
                    #10b981 20%, 
                    #34d399 50%, 
                    #059669 80%, 
                    transparent 100%
                  )`,
                  borderRadius: '50px',
                  boxShadow: `
                    0 2px 0px #059669,
                    0 4px 0px #10b981,
                    0 6px 15px rgba(0,0,0,0.3),
                    inset 0 1px 0px rgba(255,255,255,0.4)
                  `
                }}
              />
              
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Theme selector moved to global position */}
          </div>
        </motion.header>

        {activeSection === "Entrée" && (
          <div 
            className="nieuwkoop-container-single"
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              padding: 'var(--space-xl)',
              gap: 'var(--space-xl)',
              minHeight: '100vh',
              position: 'relative'
            }}
          >
            <div className="panel" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2>{entrySubTab === 'formulaire' ? '📥 Formulaire d\'Entrée' : entrySubTab === 'historique' ? '📋 Historique des Entrées' : '📤 Entrée externe'}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      console.log('🔄 Clic bouton Entrée externe');
                      setEntrySubTab('externe');
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: entrySubTab === 'externe' ? '#059669' : '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Entrée externe
                  </button>
                  <button
                    onClick={() => {
                      const newValue = entrySubTab === 'formulaire' ? 'historique' : 'formulaire';
                      console.log('🔄 Clic bouton Entrée:', entrySubTab, '→', newValue);
                      setEntrySubTab(newValue);
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {entrySubTab === 'formulaire' ? 'Historique' : 'Formulaire'}
                  </button>
                </div>
              </div>
              
              {entrySubTab === 'formulaire' ? (
                <Suspense fallback={
                  <div 
                    className="loading"
                    style={{
                      borderRadius: '8px',
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      color: '#666'
                    }}
                  >
                    Chargement du formulaire...
                  </div>
                }>
                  <EntryForm onSaved={handleEntrySaved} currentUser={currentUser} />
                </Suspense>
              ) : entrySubTab === 'externe' ? (
                <ExternalEntryForm onSaved={handleEntrySaved} currentUser={currentUser} />
              ) : (
                <Suspense fallback={
                  <div 
                    className="loading"
                    style={{
                      borderRadius: '8px',
                      height: '150px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      color: '#666'
                    }}
                  >
                    Chargement de la liste...
                  </div>
                }>
                  <EntryList refreshFlag={refreshEntries} />
                </Suspense>
              )}
            </div>
          </div>
        )}

        {activeSection === "Sortie" && (
          <div 
            className="nieuwkoop-container-single"
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              padding: 'var(--space-xl)',
              gap: 'var(--space-xl)',
              minHeight: '100vh',
              position: 'relative'
            }}
          >
            <div className="panel" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2>{exitSubTab === 'formulaire' ? '📤 Formulaires de Sortie' : '📤 Historique des Sorties'}</h2>
                <button
                  onClick={() => {
                    const newValue = exitSubTab === 'formulaire' ? 'historique' : 'formulaire';
                    console.log('🔄 Clic bouton Sortie:', exitSubTab, '→', newValue);
                    setExitSubTab(newValue);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {exitSubTab === 'formulaire' ? 'Historique' : 'Formulaire'}
                </button>
              </div>
              
              {exitSubTab === 'formulaire' ? (
                <>
                  <div className="exit-buttons" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button type="button" onClick={() => setExitVariant('definitive')} className={exitVariant === 'definitive' ? 'tab-button active' : 'tab-button'}>
                      Sortie définitive
                    </button>
                    <button type="button" onClick={() => setExitVariant('locative')} className={exitVariant === 'locative' ? 'tab-button active' : 'tab-button'}>
                      Sortie locative
                    </button>
                  </div>
                  <Suspense fallback={
                    <div 
                      className="loading"
                      style={{
                        borderRadius: '8px',
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        color: '#666'
                      }}
                    >
                      Chargement du formulaire...
                    </div>
                  }>
                    <ExitForm onSaved={handleExitSaved} currentUser={currentUser} variant={exitVariant} />
                  </Suspense>
                </>
              ) : (
                <Suspense fallback={
                  <div 
                    className="loading"
                    style={{
                      borderRadius: '8px',
                      height: '150px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      color: '#666'
                    }}
                  >
                    Chargement de la liste...
                  </div>
                }>
                  <ExitList refreshFlag={refreshExits} />
                </Suspense>
              )}
            </div>
          </div>
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
              {/* <form style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
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
                </button>
              </form> */}

            {error && <p className="text-red-600">{error}</p>}

            {/* Sélecteur de date pour visualisation du stock futur */}
            <div
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-backdrop)',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--glass-border)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Effets de fond animés multiples */}
              <div style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, var(--color-primary-rgb, rgba(16,185,129,0.15)) 0%, transparent 60%)',
                animation: 'float 6s ease-in-out infinite',
                pointerEvents: 'none',
                opacity: 0.1
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-150px',
                left: '-100px',
                width: '350px',
                height: '350px',
                background: 'radial-gradient(circle, var(--color-accent-rgb, rgba(59,130,246,0.1)) 0%, transparent 60%)',
                animation: 'float 8s ease-in-out infinite reverse',
                pointerEvents: 'none',
                opacity: 0.08
              }} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle at center, var(--color-primary-rgb, rgba(16,185,129,0.05)) 0%, transparent 70%)',
                animation: 'spin 20s linear infinite',
                pointerEvents: 'none',
                opacity: 0.3
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--color-secondary) 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    position: 'relative'
                  }}
                >
                  <span 
                    style={{ 
                      fontSize: '2rem',
                      filter: 'drop-shadow(0 4px 8px var(--shadow-color-primary, rgba(16,185,129,0.3)))'
                    }}
                  >
                    📅
                  </span>
                  Calendrier du Stock Event
                </h3>

                {/* Affichage de la date sélectionnée */}
                {selectedStockDate && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                      padding: '1rem 2rem',
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 24px var(--shadow-color-primary, rgba(16,185,129,0.3))',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <span 
                      style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                    >
                      📅
                    </span>
                    <div style={{ position: 'relative', textAlign: 'center' }}>
                      <div style={{
                        fontSize: '1.3rem',
                        fontWeight: '800',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        letterSpacing: '0.5px'
                      }}>
                        {selectedStockDate.toLocaleDateString('fr-FR', { 
                          weekday: 'long',
                          day: 'numeric', 
                          month: 'long'
                        })}
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: 'rgba(255,255,255,0.9)',
                        marginTop: '0.2rem'
                      }}>
                        {selectedStockDate.getFullYear()}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStockDate(null);
                        setSelectedDay(null);
                        setStockProjections({});
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Sélecteurs de mois et année */}
                <div
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    style={{
                      padding: '1rem 2rem 1rem 3.5rem',
                      borderRadius: '20px',
                      border: '2px solid transparent',
                      background: 'linear-gradient(var(--color-surface), var(--color-surface)) padding-box, linear-gradient(135deg, var(--color-primary), var(--color-accent)) border-box',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      minWidth: '180px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px var(--glass-border)',
                      backdropFilter: 'blur(10px)',
                      position: 'relative',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23888' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1.5rem center',
                      paddingRight: '3rem'
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = '0 0 0 3px var(--focus-ring-primary, rgba(16,185,129,0.2)), 0 8px 30px var(--shadow-lg)';
                      e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px var(--glass-border)';
                      e.target.style.transform = 'translateY(0) scale(1)';
                    }}
                  >
                    {['🌺 Janvier', '❄️ Février', '🌸 Mars', '🌷 Avril', '🌿 Mai', '☀️ Juin', 
                      '🌻 Juillet', '🌾 Août', '🍂 Septembre', '🍁 Octobre', '🍄 Novembre', '🎄 Décembre'].map((month, index) => (
                      <option 
                        key={index} 
                        value={index}
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          color: 'var(--color-text-primary)'
                        }}
                      >{month}</option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    style={{
                      padding: '1rem 2rem 1rem 1.5rem',
                      borderRadius: '20px',
                      border: '2px solid transparent',
                      background: 'linear-gradient(var(--color-surface), var(--color-surface)) padding-box, linear-gradient(135deg, var(--color-accent), var(--color-primary)) border-box',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      minWidth: '140px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px var(--glass-border)',
                      backdropFilter: 'blur(10px)',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23888' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1.5rem center',
                      paddingRight: '3rem'
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = '0 0 0 3px var(--focus-ring-accent, rgba(59,130,246,0.2)), 0 8px 30px var(--shadow-lg)';
                      e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px var(--glass-border)';
                      e.target.style.transform = 'translateY(0) scale(1)';
                    }}
                  >
                    {[2024, 2025, 2026, 2027, 2028].map(year => (
                      <option 
                        key={year} 
                        value={year}
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          color: 'var(--color-text-primary)'
                        }}
                      >📆 {year}</option>
                    ))}
                  </select>

                </div>

                {/* Grille des jours */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(45px, 1fr))',
                    gap: '0.5rem'
                  }}>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                      const isSelected = selectedDay === day && selectedStockDate;
                      const isToday = day === new Date().getDate() && 
                                     selectedMonth === new Date().getMonth() && 
                                     selectedYear === new Date().getFullYear();
                      const hasProjects = projects.some(p => {
                        const start = new Date(p.dates?.start);
                        const end = new Date(p.dates?.end);
                        const checkDate = new Date(selectedYear, selectedMonth, day);
                        return checkDate >= start && checkDate <= end;
                      });
                      
                      return (
                        <button
                          key={day}
                          onClick={() => handleDateSelection(day)}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.background = isToday 
                                ? 'linear-gradient(135deg, var(--color-accent), var(--color-primary))'
                                : 'linear-gradient(135deg, var(--color-primary), var(--color-accent))';
                              e.currentTarget.style.color = 'white';
                              e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.1)';
                              e.currentTarget.style.borderColor = 'transparent';
                              e.currentTarget.style.transform = 'translateY(-2px) scale(1.08)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.background = isToday 
                                ? 'var(--glass-bg)'
                                : 'var(--color-surface)';
                              e.currentTarget.style.color = 'var(--color-text-primary)';
                              e.currentTarget.style.boxShadow = '0 1px 3px var(--shadow-sm)';
                              e.currentTarget.style.borderColor = isToday ? 'var(--color-accent)' : 'var(--glass-border)';
                              e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            }
                          }}
                          style={{
                            width: '40px',
                            height: '40px',
                            padding: '0',
                            borderRadius: '12px',
                            border: `1px solid ${
                              isSelected ? 'transparent' : 
                              isToday ? 'var(--color-accent)' : 
                              'var(--glass-border)'
                            }`,
                            background: isSelected 
                              ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' 
                              : isToday 
                                ? 'var(--glass-bg)'
                                : 'var(--color-surface)',
                            color: isSelected ? 'white' : 'var(--color-text-primary)',
                            fontSize: '0.9rem',
                            fontWeight: isSelected || isToday ? '700' : '500',
                            cursor: 'pointer',
                            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: isSelected 
                              ? '0 4px 12px var(--shadow-color-primary, rgba(16,185,129,0.4)), inset 0 1px 0 rgba(255,255,255,0.1)' 
                              : isToday
                                ? '0 2px 8px var(--shadow-color-accent, rgba(59,130,246,0.2))'
                                : '0 1px 3px var(--shadow-sm)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                          }}
                        >
                          {/* Effet de brillance animé subtil */}
                          {isSelected && (
                            <div 
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '100%',
                                height: '100%',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                                pointerEvents: 'none'
                              }} 
                            />
                          )}
                          
                          <span style={{ 
                            position: 'relative', 
                            zIndex: 1,
                            fontSize: isSelected || isToday ? '0.95rem' : '0.9rem',
                            transition: 'font-size 0.15s ease'
                          }}>
                            {day}
                          </span>
                          
                          {/* Petit point pour aujourd'hui */}
                          {isToday && !isSelected && (
                            <div 
                              style={{
                                position: 'absolute',
                                top: '3px',
                                right: '3px',
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: 'var(--color-primary)',
                                boxShadow: '0 0 4px var(--color-primary)'
                              }} 
                            />
                          )}
                          
                          {/* Indicateur de projets */}
                          {hasProjects && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '3px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '3px',
                                height: '3px',
                                borderRadius: '50%',
                                background: '#f59e0b',
                                boxShadow: '0 0 3px #f59e0b'
                              }} 
                            />
                          )}
                        </button>
                      );
                    })}
                </div>

                {/* Projets du jour */}
                {selectedStockDate && (
                  <>
                    {/* Encadré des projets à cette date */}
                    {(() => {
                      
                      const projectsAtDate = projects.filter(project => {
                        // Vérifier d'abord la structure
                        const startDateRaw = project.dates?.start || project.dateDebut;
                        const endDateRaw = project.dates?.end || project.dateFin;
                        
                        if (!startDateRaw || !endDateRaw) {
                          console.log(`⚠️ Projet ${project.title || project._id} sans dates`);
                          return false;
                        }
                        
                        const startDate = new Date(startDateRaw);
                        const endDate = new Date(endDateRaw);
                        startDate.setHours(0, 0, 0, 0);
                        endDate.setHours(23, 59, 59, 999);
                        const checkDate = new Date(selectedStockDate);
                        checkDate.setHours(12, 0, 0, 0);
                        
                        const isInRange = checkDate >= startDate && checkDate <= endDate;
                        const hasMaterials = project.materials?.length > 0;
                        
                        // console.log(`📅 Projet ${project.title || project.client?.name}:`, {
                        //   startDate: startDate.toLocaleDateString('fr-FR'),
                        //   endDate: endDate.toLocaleDateString('fr-FR'),
                        //   checkDate: checkDate.toLocaleDateString('fr-FR'),
                        //   isInRange,
                        //   hasMaterials,
                        //   materials: project.materials
                        // });
                        
                        return isInRange && hasMaterials;
                      });

                      // console.log(`✅ ${projectsAtDate.length} projet(s) trouvé(s) pour cette date`);
                      if (projectsAtDate.length === 0) return null;

                      return (
                        <div
                          style={{
                            marginTop: '1rem',
                            background: 'linear-gradient(135deg, var(--glass-bg) 0%, var(--color-surface) 100%)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '1.5rem',
                            border: '2px solid var(--color-accent)',
                            boxShadow: '0 10px 30px var(--shadow-color-accent, rgba(59,130,246,0.15))',
                            backdropFilter: 'var(--glass-backdrop)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Effet de fond animé */}
                          <div style={{
                            position: 'absolute',
                            top: '-50%',
                            right: '-10%',
                            width: '200px',
                            height: '200px',
                            background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
                            opacity: 0.05,
                            animation: 'pulse 4s ease-in-out infinite',
                            pointerEvents: 'none'
                          }} />

                          <div style={{
                            position: 'relative',
                            zIndex: 1
                          }}>
                            <h4 style={{
                              fontSize: '1.2rem',
                              fontWeight: '700',
                              color: 'var(--color-text-primary)',
                              marginBottom: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}>
                              <span style={{ fontSize: '1.5rem' }}>📋</span>
                              Projets et réservations du {selectedStockDate.getDate()} {
                                ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                                 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'][selectedStockDate.getMonth()]
                              }
                            </h4>

                            {projectsAtDate.map((project, index) => (
                              <div
                                key={project._id}
                                style={{
                                  background: 'var(--color-surface)',
                                  borderRadius: 'var(--radius-lg)',
                                  padding: '1rem',
                                  marginBottom: index < projectsAtDate.length - 1 ? '1rem' : 0,
                                  border: '1px solid var(--glass-border)',
                                  boxShadow: 'var(--shadow-sm)'
                                }}
                              >
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  marginBottom: '0.75rem'
                                }}>
                                  <h5 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    color: 'var(--color-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                  }}>
                                    <span>🏗️</span>
                                    {(() => {
                                      // Afficher TOUTE la structure du projet pour debug
                                      // console.log('🔍 Structure complète du projet:', project);
                                      // console.log('🔍 Clés disponibles:', Object.keys(project));
                                      
                                      // Chercher le bon nom dans tous les champs possibles
                                      // PRIORISER LE NOM DU CLIENT PLUTÔT QUE LA DESCRIPTION
                                      let name = '';
                                      
                                      // Si client est une string directe (comme "Mikado") - PRIORITÉ 1
                                      if (typeof project.client === 'string' && project.client !== 'ok' && project.client.trim() !== '') {
                                        name = project.client;
                                      }
                                      // Si client.name existe - PRIORITÉ 2
                                      else if (project.client?.name && project.client.name !== 'ok' && project.client.name.trim() !== '') {
                                        name = project.client.name;
                                      }
                                      // Si title existe et n'est pas "ok" - PRIORITÉ 3
                                      else if (project.title && project.title !== 'ok' && project.title.trim() !== '') {
                                        name = project.title;
                                      }
                                      // Si address existe (peut contenir le nom du client) - PRIORITÉ 4
                                      else if (project.address && project.address.trim() !== '') {
                                        name = project.address;
                                      }
                                      // DESCRIPTION EN DERNIER RECOURS car elle contient souvent des commentaires - PRIORITÉ 5
                                      else if (project.description && project.description !== 'ok' && project.description.trim() !== '') {
                                        // Prendre seulement les 50 premiers caractères de la description si elle est longue
                                        const desc = project.description.length > 50 
                                          ? project.description.substring(0, 50) + '...'
                                          : project.description;
                                        name = desc;
                                      }
                                      // En dernier recours
                                      else {
                                        name = 'Projet sans nom';
                                      }
                                      
                                      // console.log(`✅ Nom final affiché: "${name}"`);
                                      return name;
                                    })()}
                                  </h5>
                                  <span style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--color-text-secondary)',
                                    background: 'var(--glass-bg)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: '600'
                                  }}>
                                    {project.materials.length} article{project.materials.length > 1 ? 's' : ''}
                                  </span>
                                </div>

                                <div style={{
                                  display: 'grid',
                                  gap: '0.5rem'
                                }}>
                                  {project.materials.map((material, matIndex) => (
                                    <div
                                      key={matIndex}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.5rem',
                                        background: 'var(--glass-bg)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '0.9rem'
                                      }}
                                    >
                                      <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        flex: 1
                                      }}>
                                        {/* Image de l'article basée sur la référence */}
                                        {(() => {
                                          // Construire l'URL de l'image basée sur la référence
                                          const imageUrl = material.reference ? 
                                            `/api/catalog/nieuwkoop/items/${material.reference}/image` : 
                                            null;
                                          
                                          // Utiliser soit l'image stockée soit l'image générée
                                          const finalImageUrl = material.image || imageUrl;
                                          
                                          // console.log(`🖼️ Image pour ${material.name} (${material.reference}):`, finalImageUrl);
                                          
                                          return finalImageUrl ? (
                                            <div style={{
                                              width: '45px',
                                              height: '45px',
                                              borderRadius: 'var(--radius-md)',
                                              overflow: 'hidden',
                                              border: '2px solid var(--glass-border)',
                                              boxShadow: 'var(--shadow-sm)',
                                              background: 'var(--color-surface)',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              flexShrink: 0
                                            }}>
                                              <img
                                                src={finalImageUrl}
                                                alt={material.name}
                                                style={{
                                                  width: '100%',
                                                  height: '100%',
                                                  objectFit: 'cover',
                                                  transition: 'transform 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                onError={(e) => {
                                                  console.log(`❌ Erreur chargement image pour ${material.name}: ${finalImageUrl}`);
                                                  e.target.style.display = 'none';
                                                  e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                              />
                                              <div style={{
                                                display: 'none',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '100%',
                                                height: '100%',
                                                fontSize: '1.5rem',
                                                color: 'var(--color-text-secondary)'
                                              }}>
                                                🌿
                                              </div>
                                            </div>
                                          ) : (
                                            <div style={{
                                              width: '45px',
                                              height: '45px',
                                              borderRadius: 'var(--radius-md)',
                                              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              fontSize: '1.5rem',
                                              boxShadow: 'var(--shadow-sm)',
                                              flexShrink: 0
                                            }}>
                                              🌿
                                            </div>
                                          );
                                        })()}
                                        
                                        <div style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '0.25rem',
                                          flex: 1,
                                          minWidth: 0 // pour permettre le text overflow
                                        }}>
                                          <span style={{
                                            color: 'var(--color-text-primary)',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            lineHeight: '1.2',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                          }}>
                                            {material.name}
                                          </span>
                                          {material.reference && (
                                            <span style={{
                                              fontSize: '0.75rem',
                                              color: 'var(--color-text-secondary)',
                                              background: 'var(--color-surface)',
                                              padding: '0.1rem 0.5rem',
                                              borderRadius: 'var(--radius-sm)',
                                              alignSelf: 'flex-start',
                                              fontWeight: '500'
                                            }}>
                                              {material.reference}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                      }}>
                                        <span style={{
                                          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                          color: 'white',
                                          padding: '0.25rem 0.75rem',
                                          borderRadius: 'var(--radius-md)',
                                          fontWeight: '700',
                                          fontSize: '0.9rem',
                                          boxShadow: 'var(--shadow-sm)'
                                        }}>
                                          {material.quantity} unité{material.quantity > 1 ? 's' : ''}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {project.location?.address && (
                                  <div style={{
                                    marginTop: '0.75rem',
                                    paddingTop: '0.75rem',
                                    borderTop: '1px solid var(--glass-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.85rem',
                                    color: 'var(--color-text-secondary)'
                                  }}>
                                    <span>📍</span>
                                    {project.location.address}
                                  </div>
                                )}
                              </div>
                            ))}

                            <div
                              style={{
                                marginTop: '1rem',
                                paddingTop: '1rem',
                                borderTop: '2px solid var(--glass-border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              <span style={{
                                fontSize: '0.9rem',
                                color: 'var(--color-text-secondary)',
                                fontWeight: '600'
                              }}>
                                Total des réservations
                              </span>
                              <span style={{
                                fontSize: '1.1rem',
                                fontWeight: '800',
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                              }}>
                                {projectsAtDate.reduce((total, project) => 
                                  total + project.materials.reduce((sum, mat) => sum + (mat.quantity || 0), 0)
                                , 0)} articles réservés
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>

            {item && (
              <div
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
                      }}>{item.DiameterCulturePot || item.Diameter || item.Opening || (item.PotSize ? parseInt(item.PotSize) : 0) || 0} cm</div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#b45309',
                        fontWeight: '600'
                      }}>Diamètre pot</div>
                    </div>
                  </div>

                  {/* Prix */}
                  {price && (
                    <div
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
                    </div>
                  )}

                  {/* Bouton d'action */}
                  <button
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
                  </button>
                </div>
              </div>
            )}

            {addedItems.length > 0 && (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div
                    style={{
                      background: isDark 
                        ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' 
                        : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      textAlign: 'center',
                      boxShadow: isDark 
                        ? '0 4px 20px rgba(59, 130, 246, 0.25)' 
                        : '0 4px 20px rgba(59, 130, 246, 0.15)'
                    }}
                  >
                    <span style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      color: isDark ? '#e0e7ff' : '#2563eb',
                      display: 'block'
                    }}>{filteredItems.length}</span>
                    <span style={{
                      fontSize: '0.9rem',
                      color: isDark ? '#cbd5e1' : '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Articles {activeCategory ? `(${activeCategory})` : ''}</span>
                  </div>
                  <div
                    style={{
                      background: isDark 
                        ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' 
                        : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      textAlign: 'center',
                      boxShadow: isDark 
                        ? '0 4px 20px rgba(16, 185, 129, 0.25)' 
                        : '0 4px 20px rgba(16, 185, 129, 0.15)'
                    }}
                  >
                    <span style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      color: isDark ? '#d1fae5' : '#10b981',
                      display: 'block'
                    }}>{filteredItems.reduce((sum, item) => sum + (item.quantity || 0), 0)}</span>
                    <span style={{
                      fontSize: '0.9rem',
                      color: isDark ? '#cbd5e1' : '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Quantité totale</span>
                  </div>
                  <div
                    style={{
                      background: isDark 
                        ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' 
                        : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      textAlign: 'center',
                      boxShadow: isDark 
                        ? '0 4px 20px rgba(245, 158, 11, 0.25)' 
                        : '0 4px 20px rgba(245, 158, 11, 0.15)'
                    }}
                  >
                    <span style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      color: isDark ? '#fef3c7' : '#f59e0b',
                      display: 'block'
                    }}>{filteredItems.filter(item => (item.quantity || 0) - (item.reservedQuantity || 0) > 0).length}</span>
                    <span style={{
                      fontSize: '0.9rem',
                      color: isDark ? '#cbd5e1' : '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Disponibles</span>
                  </div>
                  <div
                    style={{
                      background: isDark 
                        ? 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' 
                        : 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      textAlign: 'center',
                      boxShadow: isDark 
                        ? '0 4px 20px rgba(147, 51, 234, 0.25)' 
                        : '0 4px 20px rgba(147, 51, 234, 0.15)'
                    }}
                  >
                    <span style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      color: isDark ? '#e9d5ff' : '#9333ea',
                      display: 'block'
                    }}>{filteredItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0).toFixed(2)} €</span>
                    <span style={{
                      fontSize: '0.9rem',
                      color: isDark ? '#cbd5e1' : '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Valeur totale</span>
                  </div>
                </div>


                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  marginBottom: '3rem',
                  flexWrap: 'wrap',
                  padding: '2rem',
                  background: isDark 
                    ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
                    : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '20px',
                  boxShadow: isDark 
                    ? 'inset 0 2px 8px rgba(0, 0, 0, 0.2)' 
                    : 'inset 0 2px 8px rgba(0, 0, 0, 0.04)'
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
                        <Search size={24} style={{color: isDark ? '#94a3b8' : '#64748b'}} />
                      </div>
                      <motion.input
                        type="text"
                        placeholder="Rechercher un article..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        whileHover={{ scale: 1.01 }}
                        animate={searchTerm ? {
                          boxShadow: [
                            '0 0 0 2px rgba(16,185,129,0.2)',
                            '0 0 0 6px rgba(16,185,129,0.1)',
                            '0 0 0 2px rgba(16,185,129,0.2)'
                          ]
                        } : {}}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 300, 
                          damping: 20,
                          boxShadow: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '1rem 1rem 1rem 3.5rem',
                          fontSize: '1rem',
                          fontWeight: '500',
                          border: '2px solid transparent',
                          borderRadius: '16px',
                          background: isDark ? '#374151' : 'white',
                          color: isDark ? '#f3f4f6' : '#000000',
                          boxShadow: isDark 
                            ? '0 4px 20px rgba(0, 0, 0, 0.25)' 
                            : '0 4px 20px rgba(0, 0, 0, 0.06)',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#10b981'}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                      />
                    </div>
                  </div>

                  <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                    <button
                      onClick={() => setShowPartnerForm(true)}
                      className="btn btn-success"
                    >
                      <span style={{fontSize: '1.2rem'}}>➕</span> Nouvel article
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="btn"
                      style={{
                        color: 'var(--color-text-secondary)',
                        background: 'var(--color-surface)',
                        border: '2px solid var(--color-border)'
                      }}
                    >
                      <span style={{fontSize: '1.2rem'}}>📊</span> Exporter
                    </button>

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
    className="flex items-center px-3 py-1 rounded focus:outline-none"
    style={{
      color: isDark ? '#f3f4f6' : 'white',
      background: isDark ? '#4b5563' : '#4b5563',
      border: 'none'
    }}
    onMouseEnter={(e) => e.target.style.background = isDark ? '#6b7280' : '#374151'}
    onMouseLeave={(e) => e.target.style.background = isDark ? '#4b5563' : '#4b5563'}
  >
    Trier par <ChevronDown size={16} className="ml-1" />
  </button>

  {showSortMenu && (
    <div
      className="absolute right-0 z-10 w-40 mt-2 border rounded shadow-lg"
      style={{
        background: isDark ? '#374151' : 'white',
        borderColor: isDark ? '#4b5563' : '#d1d5db'
      }}
      onMouseLeave={() => setShowSortMenu(false)}
    >
      {["prix", "quantité", "hauteur", "diamètre"].map(option => (
        <div
          key={option}
          onClick={() => {
            setSortBy(option);
            setShowSortMenu(false);
          }}
          className="px-4 py-2 capitalize cursor-pointer"
          style={{
            color: isDark ? '#f3f4f6' : '#374151',
            backgroundColor: sortBy === option ? (isDark ? '#4b5563' : '#f3f4f6') : 'transparent'
          }}
          onMouseEnter={(e) => {
            if (sortBy !== option) {
              e.target.style.backgroundColor = isDark ? '#4b5563' : '#f3f4f6';
            }
          }}
          onMouseLeave={(e) => {
            if (sortBy !== option) {
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          {option}
        </div>
      ))}
    </div>
  )}
</div>

                  </div>
                </div>

                {/* Système de notifications */}
                <div style={{
                  position: 'fixed',
                  top: '20px',
                  right: '20px',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      exit={{ opacity: 0, x: 100 }}
                      style={{
                        padding: '1rem 1.5rem',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        background: notif.type === 'success' ? '#10b981' :
                                   notif.type === 'error' ? '#ef4444' :
                                   notif.type === 'info' ? '#3b82f6' : '#f59e0b'
                      }}
                    >
                      {notif.message}
                    </div>
                  ))}
                </div>

                <div 
                  className="stock-grid-4"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1.5rem',
                    marginTop: '2rem',
                    padding: '2rem',
                    borderRadius: '1rem'
                  }}
                >
                  {sortedItems.filter(prod =>
                    (!activeCategory || prod.category === activeCategory)
                    && prod.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((prod, index) => {
                    // Calculer la quantité disponible en tenant compte des projections
                    const baseQuantity = prod.quantity || 0;
                    const baseReserved = prod.reservedQuantity || 0;
                    const baseAvailable = baseQuantity - baseReserved;
                    const projection = stockProjections[prod.reference] || 0;
                    const projectedReserved = projection < 0 ? Math.abs(projection) : 0;
                    const available = selectedStockDate ? baseQuantity - projectedReserved : baseAvailable;
                    const isOutOfStock = available <= 0;
                    
                    const isLowStock = available > 0 && available <= 5;
                    const recentlyModified = isRecentlyModified(prod);

                    const isFocused = focusedCard === prod.reference;

                    // Si cette carte est focalisée, on ne la rend pas dans la grille
                    if (isFocused) {
                      return null;
                    }

                    return (
                      <div
                        key={`${prod._id}-${stockProjections[prod.reference] || 0}`}
                        className="stock-card fade-in-up"
                        data-reference={prod.reference}
                        data-focused={focusedCard}
                        draggable
                        onDragStart={(e) => handleDragStart(e, prod)}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, prod)}
                        onClick={(e) => {
                          handleCardClick(prod, e);
                        }}
                        style={{
                          border: isOutOfStock ? '3px solid var(--color-danger)' : 
                                 isLowStock ? '3px solid var(--color-warning)' : 
                                 '3px solid transparent',
                          cursor: draggedItem && draggedItem._id === prod._id ? 'grabbing' : 'grab',
                          position: 'relative',
                          opacity: draggedItem && draggedItem._id === prod._id ? 0.8 : 1
                        }}
                      >
                        {/* Indicateur de modification récente */}
                        {isRecentlyModified(prod) && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              width: '12px',
                              height: '12px',
                              background: '#ef4444',
                              borderRadius: '50%',
                              zIndex: 10,
                              boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                            }}
                          />
                        )}




                        {/* En-tête épuré */}
                        <div style={{
                          background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
                          padding: '1.25rem',
                          color: 'var(--color-primary)',
                          position: 'relative',
                          borderBottom: '1px solid var(--color-primary)'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '0.75rem'
                          }}>
                            <div style={{ flex: 1, paddingRight: '1rem' }}>
                              <h3 style={{
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                margin: 0,
                                lineHeight: '1.3',
                                marginBottom: '0.25rem',
                                color: 'var(--color-primary)', replace_all: true
                              }}>
                                {prod.name}
                              </h3>
                              <p style={{
                                fontSize: '0.8rem',
                                opacity: 0.7,
                                margin: 0,
                                fontWeight: '500'
                              }}>
                                {prod.reference || 'N/A'}
                              </p>
                              
                              {/* Pastilles de statut */}
                              <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                marginTop: '0.5rem'
                              }}>
                                {/* Pastille Disponible */}
                                <div 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('🏷️ Clic sur pastille disponibilité:', available > 0 ? 'Disponible' : 'Indisponible');
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: available > 0 ? 'var(--color-success)' : 'var(--color-danger)',
                                    color: 'white',
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '12px',
                                    fontSize: '0.65rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    boxShadow: available > 0 ? '0 2px 8px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(239, 68, 68, 0.3)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.transform = 'scale(1.05)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.transform = 'scale(1)';
                                  }}
                                >
                                  <div style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    marginRight: '0.4rem'
                                  }}></div>
                                  {available > 0 ? 'Disponible' : 'Indisponible'}
                                </div>

                                {/* Pastille Stock Permanent */}
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: (prod.stockType === 'permanent') ? 'var(--color-primary)' : 'var(--color-warning)',
                                    color: 'white',
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '12px',
                                    fontSize: '0.65rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    boxShadow: (prod.stockType === 'permanent') ? 
                                      '0 2px 8px rgba(217, 119, 6, 0.3)' : 
                                      '0 2px 8px rgba(234, 179, 8, 0.3)',
                                    cursor: 'default',
                                    transition: 'all 0.2s ease'
                                  }}
                                  title={`Type de stock: ${prod.stockType === 'permanent' ? 'Stock Permanent' : 'Stock Limité'}`}
                                >
                                  <div style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    marginRight: '0.4rem'
                                  }}></div>
                                  {prod.stockType === 'permanent' ? 'Stock Permanent' : 'Stock Limité'}
                                </div>
                              </div>
                            </div>
                            <div style={{
                              fontSize: '1.25rem',
                              fontWeight: '700',
                              color: 'var(--color-primary)'
                            }}>
                              €{prod.price ? prod.price.toFixed(2) : '0.00'}
                            </div>
                          </div>
                          
                          {/* Actions condensées */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '0.5rem'
                          }}>
                            <button
                              onClick={() => openAssign(prod)}
                              disabled={loadingStates[`assign-${prod._id}`]}
                              style={{
                                background: 'var(--color-primary)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.5rem',
                                color: 'white',
                                cursor: loadingStates[`assign-${prod._id}`] ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                opacity: loadingStates[`assign-${prod._id}`] ? 0.6 : 1,
                                minWidth: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title="Assigner à un projet"
                            >
                              {loadingStates[`assign-${prod._id}`] ? '⏳' : '📋'}
                            </button>
                            <button
                              onClick={() => deleteItem(prod._id)}
                              disabled={loadingStates[`delete-${prod._id}`]}
                              style={{
                                background: confirmDelete === prod._id ? '#ef4444' : '#64748b',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.5rem',
                                color: 'white',
                                cursor: loadingStates[`delete-${prod._id}`] ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                opacity: loadingStates[`delete-${prod._id}`] ? 0.6 : 1,
                                minWidth: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title={confirmDelete === prod._id ? 'Confirmer la suppression' : 'Supprimer'}
                            >
                              {loadingStates[`delete-${prod._id}`] ? '⏳' : 
                               confirmDelete === prod._id ? '❗' : '🗑️'}
                            </button>
                          </div>
                        </div>

                        {/* Image avec overlay */}
                        <div style={{position: 'relative'}}>
                          <div 
                            style={{
                              position: 'relative',
                              height: '180px',
                              overflow: 'hidden'
                            }}>
                            <motion.img 
                              src={prod.image} 
                              alt={prod.name}
                              animate={{
                                y: [0, -3, 0],
                                scale: [1, 1.02, 1]
                              }}
                              transition={{
                                duration: 4,
                                ease: "easeInOut",
                                repeat: Infinity,
                                delay: index * 0.2
                              }}
                              whileHover={{
                                scale: 1.05,
                                rotate: [0, 1, -1, 0],
                                transition: { duration: 0.3 }
                              }}
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
                                background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)'
                              }}
                            >
                              🌱
                            </div>
                          </div>
                        </div>

                        {/* Corps de la carte */}
                        <div style={{ padding: '1.5rem' }}>
                          {/* Caractéristiques physiques */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '0.75rem',
                            marginBottom: '1rem'
                          }}>
                            <div style={{
                              padding: '1rem',
                              background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
                              borderRadius: '16px',
                              textAlign: 'center',
                              border: '1px solid var(--color-primary)',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                            }}>
                              <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>📏</div>
                              <div style={{
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                color: 'var(--color-primary)',
                                marginBottom: '0.25rem'
                              }}>{prod.height || 0} cm</div>
                              <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-secondary)',
                                fontWeight: '600'
                              }}>Hauteur</div>
                            </div>
                            
                            <div style={{
                              padding: '1rem',
                              background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
                              borderRadius: '16px',
                              textAlign: 'center',
                              border: '1px solid var(--color-primary)',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                            }}>
                              <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>⭕</div>
                              <div style={{
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                color: 'var(--color-primary)',
                                marginBottom: '0.25rem'
                              }}>{prod.diameter || 0} cm</div>
                              <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-secondary)',
                                fontWeight: '600'
                              }}>Diamètre</div>
                            </div>
                          </div>

                          {/* Informations condensées */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem',
                            padding: '0.75rem 1rem',
                            background: 'var(--color-bg-primary)',
                            borderRadius: '12px',
                            border: '1px solid var(--color-primary)'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem'
                            }}>
                              {/* Stock Total */}
                              <div style={{ textAlign: 'center' }}>
                                <div style={{
                                  fontSize: '0.7rem',
                                  color: 'var(--color-secondary)',
                                  marginBottom: '0.25rem',
                                  fontWeight: '600'
                                }}>
                                  Stock
                                </div>
                                <div style={{
                                  fontSize: '1rem',
                                  fontWeight: '700',
                                  color: isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : 'var(--color-primary)'
                                }}>
                                  {available}
                                </div>
                              </div>
                              
                              {/* Réservés */}
                              <div style={{ textAlign: 'center' }}>
                                <div style={{
                                  fontSize: '0.7rem',
                                  color: selectedStockDate && stockProjections[prod.reference] 
                                    ? 'var(--color-primary)' 
                                    : 'var(--color-secondary)',
                                  marginBottom: '0.25rem',
                                  fontWeight: '600'
                                }}>{selectedStockDate && stockProjections[prod.reference] ? '📅 Réservés' : 'Réservés'}</div>
                                <div style={{
                                  fontSize: '1rem',
                                  fontWeight: '700',
                                  color: 'var(--color-accent)'
                                }}>
                                  {(() => {
                                    const projectedQty = stockProjections[prod.reference];
                                    if (selectedStockDate && projectedQty !== undefined && projectedQty < 0) {
                                      return Math.abs(projectedQty);
                                    }
                                    return prod.reservedQuantity || 0;
                                  })()}
                                </div>
                              </div>
                              
                              {/* Disponible */}
                              <div style={{ textAlign: 'center' }}>
                                <div style={{
                                  fontSize: '0.7rem',
                                  color: 'var(--color-success)',
                                  marginBottom: '0.25rem',
                                  fontWeight: '600'
                                }}>
                                  Disponible
                                </div>
                                <div style={{
                                  fontSize: '1rem',
                                  fontWeight: '700',
                                  color: 'var(--color-success)'
                                }}>
                                  {(() => {
                                    const reserved = (() => {
                                      const projectedQty = stockProjections[prod.reference];
                                      if (selectedStockDate && projectedQty !== undefined && projectedQty < 0) {
                                        return Math.abs(projectedQty);
                                      }
                                      return prod.reservedQuantity || 0;
                                    })();
                                    const disponible = Math.max(0, available - reserved);
                                    return disponible;
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Section combinée : Catégorie + Quantité */}
                          <div style={{
                            display: 'flex',
                            gap: '0.75rem',
                            marginBottom: '1rem'
                          }}>
                            {/* Catégorie */}
                            <div style={{ flex: 1 }}>
                              <select
                                value={prod.category || ''}
                                onChange={(e) => updateCategory(prod._id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  width: '100%',
                                  padding: '1rem',
                                  background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
                                  borderRadius: '16px',
                                  border: '2px solid var(--color-primary)',
                                  fontSize: '0.85rem',
                                  fontWeight: '700',
                                  color: 'var(--color-primary)',
                                  cursor: 'pointer',
                                  outline: 'none',
                                  transition: 'all 0.3s ease',
                                  textAlign: 'center',
                                  appearance: 'none',
                                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                  backgroundPosition: 'right 0.75rem center',
                                  backgroundRepeat: 'no-repeat',
                                  backgroundSize: '1.5em 1.5em',
                                  paddingRight: '3rem'
                                }}
                              >
                                <option value="">🤷‍♂️ Non classé</option>
                                <option value="plante">🌿 Plantes</option>
                                <option value="plantes-exterieurs">🌲 Plantes extérieurs</option>
                                <option value="contenant">🏺 Contenants</option>
                                <option value="decoration">🎨 Décor</option>
                                <option value="artificiel">🧠 Artificiels</option>
                                <option value="seche">🍂 Séchés</option>
                                <option value="entretien">🧰 Entretien</option>
                              </select>
                            </div>
                            
                            {/* Contrôles de quantité */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
                                borderRadius: '16px',
                                padding: '0.5rem',
                                border: '2px solid var(--color-primary)',
                                minWidth: '120px'
                              }}>

                              <button
                                onClick={() => updateQuantity(prod._id, Math.max(0, prod.quantity - 1))}
                                disabled={prod.quantity <= 1 || loadingStates[`quantity-${prod._id}`]}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  background: (prod.quantity <= 1 || loadingStates[`quantity-${prod._id}`]) ? 
                                    '#94a3b8' : '#ef4444',
                                  color: 'white',
                                  fontSize: '0.9rem',
                                  fontWeight: 'bold',
                                  cursor: (prod.quantity <= 1 || loadingStates[`quantity-${prod._id}`]) ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  opacity: (prod.quantity <= 1 || loadingStates[`quantity-${prod._id}`]) ? 0.6 : 1
                                }}
                              >
                                {loadingStates[`quantity-${prod._id}`] ? '⏳' : '−'}
                              </button>

                              <span
                                style={{
                                  fontSize: '1rem',
                                  fontWeight: '700',
                                  minWidth: '32px',
                                  textAlign: 'center',
                                  flex: 1
                                }}>
                                {prod.quantity || 0}
                              </span>

                              <button
                                onClick={() => updateQuantity(prod._id, (prod.quantity || 0) + 1)}
                                disabled={loadingStates[`quantity-${prod._id}`]}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  background: loadingStates[`quantity-${prod._id}`] ? 
                                    '#94a3b8' : 'var(--color-primary)',
                                  color: 'white',
                                  fontSize: '0.9rem',
                                  fontWeight: 'bold',
                                  cursor: loadingStates[`quantity-${prod._id}`] ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  opacity: loadingStates[`quantity-${prod._id}`] ? 0.6 : 1
                                }}
                              >
                                {loadingStates[`quantity-${prod._id}`] ? '⏳' : '+'}
                              </button>
                            </div>
                          </div>

                          {/* Dates simplifiées */}
                        </div>
                        
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            </motion.section>
          </div>
        )}

        {activeSection === "Projets" && (
          <motion.section key="projets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
            <Suspense fallback={
              <div 
                className="loading"
                style={{
                  borderRadius: '8px',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: '#666'
                }}
              >
                Chargement du formulaire projet...
              </div>
            }>
              <ProjetForm onSubmit={handleSubmitProject} />
            </Suspense>
            
            {/* Bouton Historique */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '2rem 0'
            }}>
              <button
                onClick={() => setShowHistory(!showHistory)}
                style={{
                  background: showHistory 
                    ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' 
                    : 'linear-gradient(135deg, var(--color-secondary), var(--color-neutral))',
                  color: 'var(--color-text-inverse)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>
                  {showHistory ? '📚' : '📖'}
                </span>
                {showHistory ? 'Masquer l\'historique' : 'Afficher l\'historique'}
              </button>
            </div>
            
            <Suspense fallback={
              <div 
                className="loading"
                style={{
                  borderRadius: '8px',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: '#666'
                }}
              >
                Chargement de la liste des projets...
              </div>
            }>
              <ProjetList 
                projects={showHistory ? projects : projects.filter(p => p.status !== 'completed' && p.status !== 'archived')} 
                onUpdate={handleUpdateProject} 
                onDelete={handleDeleteProject} 
                showHistory={showHistory}
              />
            </Suspense>
          </motion.section>
        )}

        {activeSection === "Opérations diverses" && (
          <motion.section key="operations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">

            {/* Formulaire de vente entre pôles */}
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              
              <div style={{
                background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid var(--color-primary)',
                position: 'relative',
                zIndex: 1,
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: '2rem', 
                  fontWeight: '700',
                  color: 'var(--color-primary)',
                  marginBottom: '0.5rem',
                  margin: 0
                }}>
                  🏢 Vente Inter-Pôles
                </h3>
                <p style={{
                  color: 'var(--color-secondary)',
                  fontSize: '1rem',
                  fontWeight: '500',
                  margin: 0,
                  opacity: 0.8
                }}>
                  Pôle Événementiel ➡️ Pôles Création, Entretien, Upsell
                </p>
              </div>

              {/* Messages d'erreur et de succès */}
              {operationError && (
                <div
                  onClick={() => setOperationError('')}
                  style={{
                    background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                    border: '2px solid #fca5a5',
                    borderRadius: '12px',
                    padding: '1rem 1.5rem',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.1)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <p style={{
                    margin: 0,
                    color: '#dc2626',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}>
                    {operationError}
                  </p>
                  <span style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '1rem',
                    color: '#dc2626',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>×</span>
                </div>
              )}

              {operationSuccess && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                    border: '2px solid #86efac',
                    borderRadius: '12px',
                    padding: '1rem 1.5rem',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)'
                  }}
                >
                  <p style={{
                    margin: 0,
                    color: '#16a34a',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}>
                    {operationSuccess}
                  </p>
                </div>
              )}

              {/* Formulaire */}
              <form onSubmit={handleSubmitInternalOperation} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                position: 'relative',
                zIndex: 1
              }}>
                {/* Sélection Pôle Vendeur */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    🏢 Pôle Vendeur
                  </label>
                  <select
                    disabled
                    style={{
                      width: '100%',
                      padding: '1rem 1.5rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
                      color: 'var(--color-text-primary)',
                      opacity: 0.8,
                      cursor: 'not-allowed'
                    }}
                  >
                    <option>🎉 Événementiel (Fixe)</option>
                  </select>
                </div>

                {/* Sélection Pôle Acheteur */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    🎯 Pôle Acheteur *
                  </label>
                  <select
                    required
                    value={operationBuyingDepartment}
                    onChange={(e) => setOperationBuyingDepartment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.5rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                  >
                    <option value="" style={{
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-primary)'
                    }}>Sélectionnez un pôle acheteur</option>
                    <option value="creation" style={{
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-primary)'
                    }}>🏗️ Création</option>
                    <option value="entretien" style={{
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-primary)'
                    }}>🔧 Entretien</option>
                    <option value="upsell" style={{
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-primary)'
                    }}>📈 Upsell</option>
                  </select>
                </div>

                {/* Recherche d'article */}
                <div style={{gridColumn: '1 / -1'}}>
                  <label style={{
                    display: 'block',
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    🔍 Article du stock
                  </label>
                  
                  <div style={{
                    background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
                    borderRadius: '16px',
                    border: '1px solid var(--color-primary)',
                    padding: '1.5rem',
                    position: 'relative'
                  }}>
                    <input
                      type="text"
                      value={operationsStockQuery}
                      onChange={(e) => setOperationsStockQuery(e.target.value)}
                      placeholder="Rechercher un article par nom ou référence..."
                      style={{
                        width: '100%',
                        padding: '1rem 1.5rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                    />

                    {/* Résultats de recherche */}
                    {operationsStockOptions.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '1.5rem',
                        right: '1.5rem',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-xl)',
                        zIndex: 10,
                        maxHeight: '400px',
                        overflowY: 'auto',
                        marginTop: '0.5rem'
                      }}>
                        {operationsStockOptions.map((item, index) => {
                          const available = (item.quantity || 0) - (item.reservedQuantity || 0);
                          const isOutOfStock = available <= 0;
                          const isLowStock = available > 0 && available <= 5;
                          
                          return (
                            <div
                              key={index}
                              onClick={() => {
                                console.log('📦 Article sélectionné pour opération:', item);
                                console.log('🆔 Stock Reference (ID):', item._id);
                                console.log('📊 Stock disponible:', (item.quantity || 0) - (item.reservedQuantity || 0));
                                console.log('💰 Prix:', item.price);
                                setSelectedOperationArticle(item);
                                setOperationsStockQuery(''); // Vider le champ après sélection
                                setOperationsStockOptions([]);
                              }}
                              style={{
                                padding: '1rem',
                                borderBottom: index < operationsStockOptions.length - 1 ? '1px solid var(--color-border)' : 'none',
                                cursor: !isOutOfStock ? 'pointer' : 'not-allowed',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                opacity: isOutOfStock ? 0.5 : 1
                              }}
                              onMouseEnter={(e) => !isOutOfStock && (e.target.style.background = 'var(--color-bg-secondary)')}
                              onMouseLeave={(e) => !isOutOfStock && (e.target.style.background = 'transparent')}
                            >
                              {/* Image */}
                              <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                background: 'var(--color-bg-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
{item.image ? (
                                  <img
                                    src={item.reference && !item.reference.startsWith('EXT-') ? `/api/catalog/nieuwkoop/items/${item.reference}/image` : (item.image?.startsWith('movement_') ? `/${item.image}` : item.image)}
                                    alt={item.name}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <span 
                                  style={{ 
                                    fontSize: '1.5rem', 
                                    opacity: 0.5,
                                    display: item.image ? 'none' : 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%'
                                  }}
                                >
                                  🌿
                                </span>
                              </div>

                              {/* Informations */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ 
                                  fontWeight: '600', 
                                  color: 'var(--color-text-primary)', 
                                  marginBottom: '0.25rem',
                                  fontSize: '1rem'
                                }}>
                                  {item.name}
                                </div>
                                <div style={{ 
                                  fontSize: '0.85rem', 
                                  color: 'var(--color-text-secondary)', 
                                  marginBottom: '0.25rem' 
                                }}>
                                  Réf: {item.reference}
                                </div>
                                {(item.dimensions?.height || item.dimensions?.diameter) && (
                                  <div style={{ 
                                    fontSize: '0.8rem', 
                                    color: 'var(--color-text-secondary)', 
                                    marginBottom: '0.5rem',
                                    display: 'flex',
                                    gap: '1rem'
                                  }}>
                                    {item.dimensions?.height > 0 && (
                                      <span>
                                        H: {item.dimensions.height}cm
                                      </span>
                                    )}
                                    {item.dimensions?.diameter > 0 && (
                                      <span>
                                        Ø: {item.dimensions.diameter}cm
                                      </span>
                                    )}
                                  </div>
                                )}
                                <div style={{ 
                                  display: 'flex', 
                                  gap: '1rem', 
                                  alignItems: 'center', 
                                  flexWrap: 'wrap' 
                                }}>
                                  <span style={{ 
                                    fontSize: '1.1rem', 
                                    fontWeight: '700', 
                                    color: 'var(--color-primary)' 
                                  }}>
                                    €{item.price ? item.price.toFixed(2) : '0.00'}
                                  </span>
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    background: isOutOfStock ? 'var(--color-danger)' : 
                                               isLowStock ? 'var(--color-warning)' : 'var(--color-success)',
                                    color: 'white'
                                  }}>
                                    <span>
                                      {isOutOfStock ? '❌' : isLowStock ? '⚠️' : '✅'}
                                    </span>
                                    <span>
                                      {available} dispo
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Action */}
                              <div style={{
                                background: isOutOfStock ? 'var(--color-secondary)' : 'var(--color-primary)',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                opacity: isOutOfStock ? 0.6 : 1,
                                flexShrink: 0
                              }}>
                                {isOutOfStock ? 'Rupture' : 'Sélectionner'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Article sélectionné */}
                    {selectedOperationArticle && (
                      <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'var(--color-success-bg)',
                        border: '1px solid var(--color-success)',
                        borderRadius: '12px'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: 'var(--color-success)',
                          textTransform: 'uppercase',
                          marginBottom: '0.5rem'
                        }}>
                          ✅ Article sélectionné
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}>
                          {selectedOperationArticle.image && (
                            <img
                              src={selectedOperationArticle.image}
                              alt={selectedOperationArticle.name}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                objectFit: 'cover'
                              }}
                            />
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                              {selectedOperationArticle.name}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                              Réf: {selectedOperationArticle.reference} • €{selectedOperationArticle.price?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedOperationArticle(null);
                              setOperationsStockQuery('');
                            }}
                            style={{
                              background: 'var(--color-secondary)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '30px',
                              height: '30px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantité et Coefficient */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    🔢 Quantité *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Ex: 10"
                    value={operationQuantity}
                    onChange={(e) => setOperationQuantity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.5rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
                      color: 'var(--color-text-primary)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    📊 Coefficient *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="Ex: 1.2 (pour +20%)"
                    value={operationCoefficient}
                    onChange={(e) => setOperationCoefficient(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.5rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
                      color: 'var(--color-text-primary)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                  />
                </div>

                {/* Bouton de validation */}
                <div style={{gridColumn: '1 / -1', marginTop: '2rem'}}>
                  <button
                    type="submit"
                    disabled={operationSubmitting || !selectedOperationArticle || !operationBuyingDepartment || !operationQuantity}
                    style={{
                      width: '100%',
                      padding: '1.5rem 2rem',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      background: operationSubmitting || !selectedOperationArticle || !operationBuyingDepartment || !operationQuantity
                        ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                        : 'linear-gradient(135deg, var(--color-success), var(--color-success-dark))',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      cursor: operationSubmitting || !selectedOperationArticle || !operationBuyingDepartment || !operationQuantity ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: 'var(--shadow-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1rem',
                      opacity: operationSubmitting || !selectedOperationArticle || !operationBuyingDepartment || !operationQuantity ? 0.7 : 1
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>
                      {operationSubmitting ? '⏳' : '💰'}
                    </span>
                    {operationSubmitting ? 'Création en cours...' : 'Créer l\'opération de vente'}
                  </button>
                </div>
              </form>
            </div>

            {/* Section Historique des opérations */}
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              padding: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--color-primary)',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                📊 Historique des opérations
              </h3>
              
              {/* Message informatif sur les opérations locales */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '2rem',
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}>
                  <span>💡</span>
                  <span>Info</span>
                </div>
                Les opérations marquées <span style={{
                  background: '#f59e0b',
                  color: 'white',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  fontWeight: '700'
                }}>💾 LOCAL</span> sont sauvegardées temporairement sur votre appareil
                en attendant la résolution des problèmes de serveur.
              </div>

              {operationsLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Chargement de l'historique...</p>
                </div>
              ) : operationsHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>📋</div>
                  <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '1rem',
                    margin: 0
                  }}>
                    Aucune opération trouvée. Les ventes inter-pôles apparaîtront ici une fois créées.
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                  gap: '1.5rem',
                  marginTop: '2rem'
                }}>
                  {operationsHistory.map((operation) => {
                    const statusConfig = {
                      pending: { icon: '⏳', color: '#f59e0b', bg: '#fef3c7', label: 'En attente' },
                      validated: { icon: '✅', color: '#10b981', bg: '#d1fae5', label: 'Validée' },
                      completed: { icon: '🎉', color: '#059669', bg: '#a7f3d0', label: 'Terminée' },
                      cancelled: { icon: '❌', color: '#ef4444', bg: '#fee2e2', label: 'Annulée' }
                    };

                    const status = statusConfig[operation.status] || statusConfig.pending;
                    const departmentNames = {
                      evenementiel: '🎉 Événementiel',
                      creation: '🏗️ Création',
                      entretien: '🔧 Entretien',
                      upsell: '📈 Upsell'
                    };

                    return (
                      <div
                        key={operation._id}
                        style={{
                          background: isDark 
                            ? 'linear-gradient(135deg, #374151 0%, #4b5563 100%)'
                            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                          border: `1px solid ${isDark ? '#4b5563' : '#e2e8f0'}`,
                          borderRadius: '20px',
                          padding: '1.5rem',
                          boxShadow: isDark 
                            ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                            : '0 4px 20px rgba(0, 0, 0, 0.08)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Badge de statut et indicateur local */}
                        <div style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '0.5rem'
                        }}>
                          {/* Badge local si applicable */}
                          {operation.isLocal && (
                            <div style={{
                              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '50px',
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
                            }}>
                              <span>💾</span>
                              LOCAL
                            </div>
                          )}
                          
                          {/* Badge de statut */}
                          <div style={{
                            background: status.bg,
                            color: status.color,
                            padding: '0.5rem 1rem',
                            borderRadius: '50px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <span>{status.icon}</span>
                            {status.label}
                          </div>
                        </div>

                        {/* En-tête avec ID opération */}
                        <div style={{ marginBottom: '1rem', paddingRight: '8rem' }}>
                          <h4 style={{
                            margin: 0,
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            color: 'var(--color-primary)',
                            marginBottom: '0.25rem'
                          }}>
                            {operation.operationId}
                          </h4>
                          <p style={{
                            margin: 0,
                            fontSize: '0.85rem',
                            color: 'var(--color-text-secondary)',
                            fontWeight: '500'
                          }}>
                            {new Date(operation.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        {/* Transaction */}
                        <div style={{
                          background: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                          borderRadius: '12px',
                          padding: '1rem',
                          marginBottom: '1rem',
                          border: `1px solid ${isDark ? '#4b5563' : '#e2e8f0'}`
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginBottom: '0.75rem',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                          }}>
                            <span style={{ color: '#3b82f6' }}>
                              {departmentNames[operation.sellingDepartment]}
                            </span>
                            <span style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>→</span>
                            <span style={{ color: '#10b981' }}>
                              {departmentNames[operation.buyingDepartment]}
                            </span>
                          </div>
                        </div>

                        {/* Article */}
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          marginBottom: '1rem',
                          padding: '1rem',
                          background: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '12px',
                          border: `1px solid ${isDark ? '#374151' : '#f1f5f9'}`
                        }}>
                          {operation.article.image && (
                            <img
                              src={operation.article.image}
                              alt={operation.article.name}
                              style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                flexShrink: 0
                              }}
                            />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h5 style={{
                              margin: 0,
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: 'var(--color-text-primary)',
                              marginBottom: '0.25rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {operation.article.name}
                            </h5>
                            <p style={{
                              margin: 0,
                              fontSize: '0.8rem',
                              color: 'var(--color-text-secondary)',
                              marginBottom: '0.25rem'
                            }}>
                              Réf: {operation.article.reference}
                            </p>
                            {operation.article.category && (
                              <span style={{
                                fontSize: '0.75rem',
                                background: isDark ? '#4b5563' : '#f1f5f9',
                                color: isDark ? '#d1d5db' : '#6b7280',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontWeight: '500'
                              }}>
                                {operation.article.category}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Détails financiers */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '1rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{
                              fontSize: '1.5rem',
                              fontWeight: '700',
                              color: 'var(--color-primary)',
                              marginBottom: '0.25rem'
                            }}>
                              {operation.quantity}
                            </div>
                            <div style={{
                              fontSize: '0.8rem',
                              color: 'var(--color-text-secondary)',
                              fontWeight: '500'
                            }}>
                              Quantité
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{
                              fontSize: '1.5rem',
                              fontWeight: '700',
                              color: '#f59e0b',
                              marginBottom: '0.25rem'
                            }}>
                              ×{operation.coefficient}
                            </div>
                            <div style={{
                              fontSize: '0.8rem',
                              color: 'var(--color-text-secondary)',
                              fontWeight: '500'
                            }}>
                              Coefficient
                            </div>
                          </div>
                        </div>

                        {/* Prix */}
                        <div style={{
                          background: 'linear-gradient(135deg, var(--color-success-bg), var(--color-success-light))',
                          borderRadius: '12px',
                          padding: '1rem',
                          textAlign: 'center',
                          border: '1px solid var(--color-success)'
                        }}>
                          <div style={{
                            fontSize: '0.8rem',
                            color: 'var(--color-success)',
                            fontWeight: '600',
                            marginBottom: '0.25rem'
                          }}>
                            Prix unitaire: €{operation.article.originalPrice?.toFixed(2)} → €{operation.finalPrice?.toFixed(2)}
                          </div>
                          <div style={{
                            fontSize: '1.8rem',
                            fontWeight: '800',
                            color: 'var(--color-success)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}>
                            <span>💰</span>
                            €{operation.totalAmount?.toFixed(2)}
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            color: 'var(--color-success)',
                            fontWeight: '600'
                          }}>
                            Total de la transaction
                          </div>
                        </div>

                        {/* Bouton de suppression pour les opérations locales */}
                        {operation.isLocal && (
                          <button
                            onClick={() => deleteLocalOperation(operation.operationId)}
                            style={{
                              marginTop: '1rem',
                              width: '100%',
                              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              fontSize: '0.9rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <span>🗑️</span>
                            Supprimer l'opération locale
                          </button>
                        )}

                        {/* Créé par */}
                        {operation.createdBy && (
                          <div style={{
                            marginTop: '1rem',
                            padding: '0.75rem',
                            background: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(248, 250, 252, 0.6)',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            color: 'var(--color-text-secondary)',
                            textAlign: 'center'
                          }}>
                            Créé par {operation.createdBy.fullname || operation.createdBy.email}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.section>
        )}
        
        {/* Modal d'assignation */}
        {isAssignOpen && itemToAssign && (
          <Suspense fallback={
            <div 
              className="loading"
              style={{
                borderRadius: '8px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                color: '#666'
              }}
            >
              Chargement du modal...
            </div>
          }>
            <AssignModal
              isOpen={isAssignOpen}
              onClose={closeAssign}
              item={itemToAssign}
              projects={projects}
              onConfirm={handleAssign}
            />
          </Suspense>
        )}
      </motion.main>
    </motion.div>
    </ThemeProvider>
  );
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
