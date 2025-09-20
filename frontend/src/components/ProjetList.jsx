// frontend/src/components/ProjetList.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useTheme } from "../contexts/ThemeContext";

const STATUS_GRADIENT = {
  "En cours": { from: "from-blue-400", to: "to-blue-600" },  // <-- changé en bleu
  Terminé:  { from: "from-green-400", to: "to-green-600"  },
  Archivé:  { from: "from-gray-400",  to: "to-gray-600"   }
};

// Mapper les statuts du modèle vers l'affichage frontend
const mapStatus = (status) => {
  switch(status) {
    case 'active': return 'En cours';
    case 'completed': return 'Terminé';
    case 'archived': return 'Archivé';
    case 'draft': return 'Brouillon';
    case 'planned': return 'Planifié';
    case 'on_hold': return 'En attente';
    case 'cancelled': return 'Annulé';
    default: return status || 'En cours';
  }
};

// Mapper les statuts frontend vers le modèle
const mapStatusToModel = (displayStatus) => {
  switch(displayStatus) {
    case 'En cours': return 'active';
    case 'Terminé': return 'completed';
    case 'Archivé': return 'archived';
    case 'Brouillon': return 'draft';
    case 'Planifié': return 'planned';
    case 'En attente': return 'on_hold';
    case 'Annulé': return 'cancelled';
    default: return 'active';
  }
};

const CheckIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none"
       viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M5 13l4 4L19 7" />
  </svg>
);
const TrashIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none"
       viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
         01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1
         1 0 00-1-1m-4 0h4" />
  </svg>
);

export default function ProjetList({
  projects,
  onUpdate,
  onDelete,
  showHistory,
  onEdit,
  onCopy,
  onShowMenu,
  onContextMenu
}) {
  const [pdfViewerData, setPdfViewerData] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [showChargeProjetDropdown, setShowChargeProjetDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const buttonRefs = useRef({});

  // États pour l'édition inline
  const [editingProject, setEditingProject] = useState(null);
  const [editingFields, setEditingFields] = useState({});
  const [showPlantSelector, setShowPlantSelector] = useState(null);
  const [availablePlants, setAvailablePlants] = useState([]);
  const [plantSearchTerm, setPlantSearchTerm] = useState('');

  // Liste des chargés de projet disponibles avec leurs couleurs
  const chargesProjet = [
    { name: 'Amélie', color: '#10b981', bgColor: '#dcfce7' }, // Vert
    { name: 'Hugo', color: '#3b82f6', bgColor: '#dbeafe' },   // Bleu
    { name: 'Baptiste', color: '#facc15', bgColor: '#fef08a' } // Jaune pur (plus proche du citron)
  ];

  // Fonction pour obtenir la couleur d'un chargé
  const getChargeColor = (chargeName) => {
    const charge = chargesProjet.find(c => c.name === chargeName);
    return charge ? charge.color : '#6b7280';
  };

  // Fonction pour obtenir la couleur de fond d'un chargé
  const getChargeBgColor = (chargeName) => {
    const charge = chargesProjet.find(c => c.name === chargeName);
    return charge ? charge.bgColor : '#f3f4f6';
  };

  // Fonction pour convertir hex en rgba
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Fonction pour assigner un chargé de projet
  const handleAssignChargeProjet = async (project, chargeProjet) => {
    if (onUpdate) {
      await onUpdate(project._id, { chargeProjet });
    }
    setShowChargeProjetDropdown(null);
    setDropdownPosition(null);
  };

  // Fonction pour ouvrir le dropdown avec positionnement
  const handleOpenDropdown = (projectId, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
      projectId
    });
    setShowChargeProjetDropdown(projectId);
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showChargeProjetDropdown) {
        setShowChargeProjetDropdown(null);
        setDropdownPosition(null);
      }
      if (showPlantSelector && !event.target.closest('.plant-selector')) {
        setShowPlantSelector(null);
        setPlantSearchTerm('');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showChargeProjetDropdown, showPlantSelector]);

  // Fonction pour démarrer l'édition d'un projet
  const startEditing = (project) => {
    console.log('🎯 [EDITION] Démarrage édition pour projet:', project._id, project);
    setEditingProject(project._id);
    const fields = {
      'client.name': project.client?.name || project.client || '',
      description: project.description || '',
      'dates.start': project.dates?.start ? new Date(project.dates.start).toISOString().split('T')[0] : '',
      'dates.end': project.dates?.end ? new Date(project.dates.end).toISOString().split('T')[0] : '',
      status: project.status || 'active',
      chargeProjet: project.chargeProjet || '',
      type: project.type || 'Création',
      'location.address': project.location?.address || ''
    };
    console.log('🎯 [EDITION] Champs d\'édition initialisés:', fields);
    setEditingFields(fields);
  };

  // Fonction pour annuler l'édition
  const cancelEditing = () => {
    setEditingProject(null);
    setEditingFields({});
    setShowPlantSelector(null);
    setPlantSearchTerm('');
  };

  // Fonction pour sauvegarder les modifications
  const saveProjectEdits = async (projectId) => {
    try {
      console.log('💾 [SAVE] Sauvegarde projet:', projectId);
      console.log('💾 [SAVE] Champs à sauvegarder:', editingFields);

      const updateData = {};

      // Construire l'objet de mise à jour
      Object.keys(editingFields).forEach(key => {
        const value = editingFields[key];
        if (key.includes('.')) {
          const [parent, child] = key.split('.');
          if (!updateData[parent]) updateData[parent] = {};
          updateData[parent][child] = value;
        } else {
          updateData[key] = value;
        }
      });

      // Convertir les dates
      if (updateData.dates) {
        if (updateData.dates.start) {
          updateData.dates.start = new Date(updateData.dates.start);
        }
        if (updateData.dates.end) {
          updateData.dates.end = new Date(updateData.dates.end);
        }
      }

      console.log('💾 [SAVE] Données finales à envoyer:', updateData);
      console.log('💾 [SAVE] onUpdate function:', typeof onUpdate);

      if (onUpdate) {
        await onUpdate(projectId, updateData);
        console.log('✅ [SAVE] Sauvegarde réussie');
      } else {
        console.error('❌ [SAVE] onUpdate function manquante!');
        alert('Erreur: fonction de mise à jour manquante');
        return;
      }

      cancelEditing();
    } catch (error) {
      console.error('❌ [SAVE] Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des modifications: ' + error.message);
    }
  };

  // Fonction pour mettre à jour un champ en cours d'édition
  const updateEditingField = (field, value) => {
    setEditingFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fonction pour chercher des plantes
  const searchPlants = async (searchTerm) => {
    try {
      console.log('🔍 [PLANT-SEARCH] =============== DÉBUT RECHERCHE FRONTEND ===============');
      console.log('🔍 [PLANT-SEARCH] Terme de recherche:', searchTerm);
      console.log('🔍 [PLANT-SEARCH] Longueur:', searchTerm.length);

      // Récupérer tous les items (l'API de production ne filtre pas encore)
      const url = `/api/catalog/nieuwkoop/stock`;
      console.log('🔍 [PLANT-SEARCH] URL:', url);

      const response = await fetch(url);
      console.log('🔍 [PLANT-SEARCH] Réponse status:', response.status);

      if (response.ok) {
        const allData = await response.json();
        console.log('🔍 [PLANT-SEARCH] Tous les items reçus:', allData.length);

        // 🎯 FILTRAGE CÔTÉ FRONTEND: priorité aux items qui commencent par le terme
        let filteredData = [];

        if (searchTerm && searchTerm.trim().length >= 1) {
          const trimmedSearch = searchTerm.trim().toLowerCase();
          console.log('🔍 [PLANT-SEARCH] Recherche pour:', trimmedSearch);

          // Séparer les résultats: ceux qui commencent par le terme vs ceux qui le contiennent
          const startsWith = [];
          const contains = [];

          allData.forEach(plant => {
            const name = (plant.name || '').toLowerCase();
            const reference = (plant.reference || '').toLowerCase();

            if (name.startsWith(trimmedSearch) || reference.startsWith(trimmedSearch)) {
              startsWith.push(plant);
            } else if (name.includes(trimmedSearch) || reference.includes(trimmedSearch)) {
              contains.push(plant);
            }
          });

          // Priorité: items qui commencent par le terme, puis ceux qui le contiennent
          filteredData = [...startsWith, ...contains].slice(0, 10); // Limiter à 10 résultats

          console.log('🔍 [PLANT-SEARCH] ✅ Items qui commencent par le terme:', startsWith.length);
          console.log('🔍 [PLANT-SEARCH] ✅ Items qui contiennent le terme:', contains.length);
          console.log('🔍 [PLANT-SEARCH] ✅ Total filtré:', filteredData.length);

          if (filteredData.length > 0) {
            console.log('🔍 [PLANT-SEARCH] Premiers résultats filtrés:');
            filteredData.slice(0, 5).forEach((plant, i) => {
              console.log(`🔍 [PLANT-SEARCH] ${i + 1}. ${plant.name} (${plant.reference})`);
            });
          } else {
            console.log('🔍 [PLANT-SEARCH] ⚠️ AUCUN RÉSULTAT pour:', trimmedSearch);
          }
        } else {
          // Si pas de terme de recherche, prendre les 10 premiers
          filteredData = allData.slice(0, 10);
          console.log('🔍 [PLANT-SEARCH] Pas de recherche, affichage des 10 premiers items');
        }

        setAvailablePlants(filteredData);
      } else {
        const errorText = await response.text();
        console.error('🔍 [PLANT-SEARCH] Erreur HTTP:', response.status, response.statusText);
        console.error('🔍 [PLANT-SEARCH] Erreur body:', errorText);
        setAvailablePlants([]);
      }

      console.log('🔍 [PLANT-SEARCH] =============== FIN RECHERCHE FRONTEND ===============');
    } catch (error) {
      console.error('🔍 [PLANT-SEARCH] Erreur lors de la recherche de plantes:', error);
      setAvailablePlants([]);
    }
  };

  // Fonction pour ajouter une plante au projet
  const addPlantToProject = async (projectId, plant, quantity = 1) => {
    try {
      const materialData = {
        catalogueItem: plant._id,
        reference: plant.reference,
        name: plant.name,
        quantity: quantity,
        unitPrice: plant.price || 0,
        supplier: 'Nieuwkoop',
        status: 'needed',
        image: plant.image
      };

      const project = projects.find(p => p._id === projectId);
      const updatedMaterials = [...(project.materials || []), materialData];

      if (onUpdate) {
        await onUpdate(projectId, { materials: updatedMaterials });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la plante:', error);
      alert('Erreur lors de l\'ajout de la plante');
    }
  };

  // Fonction pour enlever une plante du projet
  const removePlantFromProject = async (projectId, materialIndex) => {
    try {
      const project = projects.find(p => p._id === projectId);
      const updatedMaterials = project.materials.filter((_, index) => index !== materialIndex);

      if (onUpdate) {
        await onUpdate(projectId, { materials: updatedMaterials });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la plante:', error);
      alert('Erreur lors de la suppression de la plante');
    }
  };

  // Effet pour rechercher les plantes quand le terme change
  useEffect(() => {
    if (plantSearchTerm.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchPlants(plantSearchTerm);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setAvailablePlants([]);
    }
  }, [plantSearchTerm]);

  if (!projects?.length) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '2px dashed var(--color-border)',
        color: 'var(--color-text-secondary)',
        fontSize: '1.2rem',
        fontWeight: '600',
        margin: '2rem auto',
        maxWidth: '600px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        🏗️ Aucun projet pour le moment
      </div>
    );
  }

  const now = Date.now();

  // Composant pour le sélecteur de plantes
  const PlantSelector = ({ projectId, onClose }) => {
    const { isDark } = useTheme();

    return (
    <div className="plant-selector" style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: isDark
        ? 'linear-gradient(135deg, rgba(31,41,55,0.98), rgba(17,24,39,0.95))'
        : 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: isDark
        ? '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.3)'
        : '0 25px 50px rgba(0,0,0,0.15)',
      border: isDark ? '2px solid rgba(139,92,246,0.3)' : 'none',
      zIndex: 10000,
      width: '600px',
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <h3 style={{
        marginBottom: '1rem',
        color: isDark ? '#f9fafb' : '#1f2937',
        fontSize: '1.5rem',
        fontWeight: '700',
        textAlign: 'center'
      }}>🌱 Ajouter des plantes au projet</h3>

      <input
        type="text"
        placeholder="Rechercher une plante..."
        value={plantSearchTerm}
        onChange={(e) => {
          console.log('🔍 [PLANT-SEARCH] Recherche:', e.target.value);
          setPlantSearchTerm(e.target.value);
        }}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '8px',
          border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db',
          background: isDark ? '#374151' : 'white',
          color: isDark ? '#f9fafb' : '#1f2937',
          marginBottom: '1rem',
          fontSize: '1rem',
          outline: 'none',
          transition: 'all 0.2s ease'
        }}
        autoFocus
      />

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {availablePlants.length > 0 ? (
          availablePlants.map((plant, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem',
              border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
              background: isDark ? '#374151' : 'white',
              borderRadius: '8px',
              marginBottom: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => {
              console.log('🌱 [PLANT-ADD] Ajout de la plante:', plant);
              addPlantToProject(projectId, plant);
              onClose();
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? '#4b5563' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? '#374151' : 'white';
            }}
            >
              {plant.image && (
                <img
                  src={plant.image}
                  alt={plant.name}
                  style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginRight: '1rem'
                  }}
                  onError={(e) => {
                    console.log('🌱 [PLANT-IMG] Erreur image pour:', plant.name);
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: '600',
                  color: isDark ? '#f9fafb' : '#1f2937'
                }}>{plant.name}</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: isDark ? '#9ca3af' : '#6b7280'
                }}>{plant.reference}</div>

                {/* DEBUG: Afficher les données brutes */}
                {console.log('🌱 [PLANT-DIMENSIONS]', plant.name, {
                  height: plant.height,
                  diameter: plant.diameter,
                  width: plant.width,
                  length: plant.length,
                  dimensions: plant.dimensions
                })}

                {/* Dimensions de la plante */}
                <div style={{
                  fontSize: '0.875rem',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  marginTop: '0.375rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.625rem'
                }}>
                  {plant.height && Number(plant.height) > 0 && (
                    <span style={{
                      background: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      color: '#10b981',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      📏 H: {plant.height}cm
                    </span>
                  )}
                  {plant.diameter && Number(plant.diameter) > 0 && (
                    <span style={{
                      background: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                      color: '#6366f1',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      🔵 Ø: {plant.diameter}cm
                    </span>
                  )}
                  {(plant.width !== undefined && plant.width !== null) && (
                    <span style={{
                      background: isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                      color: '#f59e0b',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      ↔️ L: {plant.width || 0}cm
                    </span>
                  )}
                  {(plant.length !== undefined && plant.length !== null) && (
                    <span style={{
                      background: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                      color: '#a855f7',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      ↕️ P: {plant.length || 0}cm
                    </span>
                  )}
                </div>

                {plant.price && (
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#10b981',
                    fontWeight: '600',
                    marginTop: '0.25rem'
                  }}>
                    💰 {plant.price}€
                  </div>
                )}
              </div>
            </div>
          ))
        ) : plantSearchTerm.length >= 2 ? null : (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: isDark ? '#9ca3af' : '#6b7280',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            🌱 Tapez au moins 2 caractères pour rechercher des plantes
          </div>
        )}

        {plantSearchTerm.length >= 2 && availablePlants.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: isDark ? '#9ca3af' : '#6b7280',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            🔍 Aucune plante trouvée pour "{plantSearchTerm}"
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        marginTop: '1rem'
      }}>
        <button
          onClick={onClose}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: isDark ? '1px solid #4b5563' : '1px solid #d1d5db',
            background: isDark ? '#374151' : 'white',
            color: isDark ? '#f9fafb' : '#374151',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = isDark ? '#4b5563' : '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = isDark ? '#374151' : 'white';
          }}
        >
          ❌ Fermer
        </button>
      </div>
    </div>
    );
  };

  return (
    <>
      {/* Titre dynamique */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
          padding: '1.5rem',
          background: showHistory 
            ? 'linear-gradient(135deg, var(--color-warning), var(--color-warning-dark))' 
            : 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-xl)',
          color: 'var(--color-text-inverse)'
        }}
      >
        <h2 style={{
          margin: 0,
          fontSize: '1.8rem',
          fontWeight: '800',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '2rem' }}>
            {showHistory ? '📚' : '🏗️'}
          </span>
          {showHistory ? 'Historique complet des projets' : 'Projets actifs'}
        </h2>
        <p style={{
          margin: '0.5rem 0 0 0',
          fontSize: '1rem',
          opacity: 0.9,
          fontWeight: '500'
        }}>
          {showHistory
            ? `${projects.length} projet${projects.length > 1 ? 's' : ''} au total (tous statuts confondus)`
            : `${projects.length} projet${projects.length > 1 ? 's' : ''} en cours`
          }
        </p>
        <p style={{
          margin: '0.5rem 0 0 0',
          fontSize: '0.85rem',
          opacity: 0.8,
          fontStyle: 'italic'
        }}>
          📝 Double-cliquez sur une carte pour l'éditer | 📱 Cliquez sur ✏️ pour l'édition rapide
          {editingProject && (
            <span style={{ color: '#8b5cf6', fontWeight: '600', marginLeft: '1rem' }}>
              ✏️ MODE ÉDITION ACTIF - Projet {editingProject}
            </span>
          )}
        </p>
      </motion.div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '2rem auto',
      padding: '1rem'
    }}>
      {projects.map((p) => {
        const displayStatus = mapStatus(p.status);
        const grad = STATUS_GRADIENT[displayStatus] || STATUS_GRADIENT["En cours"];
        const start = new Date(p.dates?.start || p.dateDebut).getTime();
        const end   = new Date(p.dates?.end || p.dateFin).getTime();
        const pct   = Math.min(Math.max(((now - start) / (end - start)) * 100, 0), 100);

        return (
          <motion.div
            key={p._id}
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            whileHover={{
              scale: editingProject === p._id ? 1 : 1.02,
              boxShadow: 'var(--shadow-2xl)',
              y: editingProject === p._id ? 0 : -6
            }}
            onMouseEnter={() => !editingProject && setHoveredProject(p._id)}
            onMouseLeave={() => !editingProject && setHoveredProject(null)}
            onContextMenu={(e) => onContextMenu && onContextMenu(e, p)}
            onDoubleClick={(e) => {
              console.log('🖱️ [DOUBLE-CLICK] Double-clic détecté sur projet:', p._id);
              if (!editingProject) {
                console.log('🖱️ [DOUBLE-CLICK] Démarrage édition...');
                startEditing(p);
              } else {
                console.log('🖱️ [DOUBLE-CLICK] Édition déjà en cours, ignoré');
              }
            }}
            style={{
              background: editingProject === p._id
                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))'
                : 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: editingProject === p._id
                ? '0 0 0 2px rgba(139, 92, 246, 0.3), var(--shadow-lg)'
                : 'var(--shadow-lg)',
              border: editingProject === p._id
                ? '2px solid rgba(139, 92, 246, 0.5)'
                : '1px solid var(--color-border)',
              position: 'relative',
              overflow: showChargeProjetDropdown === p._id ? 'visible' : 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Indicateur d'édition */}
            {editingProject === p._id && (
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                left: '0.5rem',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: '600',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                animation: 'pulse 2s infinite'
              }}>
                <span>✏️</span>
                ÉDITION
              </div>
            )}

            {/* Background decorative element */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-30%',
              width: '100%',
              height: '100%',
              background: (() => {
                if (!p.chargeProjet) {
                  return 'linear-gradient(45deg, var(--color-primary-alpha), var(--color-accent-alpha))';
                }
                const color = getChargeColor(p.chargeProjet);
                console.log(`Chargé: ${p.chargeProjet}, Couleur: ${color}`);
                return `linear-gradient(45deg, ${hexToRgba(color, 0.2)}, ${hexToRgba(color, 0.4)})`;
              })(),
              borderRadius: '50%',
              pointerEvents: 'none',
              opacity: editingProject === p._id ? 0.1 : 0.3
            }} />

            {/* Boutons d'actions au survol ou d'édition */}
            {(hoveredProject === p._id || editingProject === p._id) && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: editingProject === p._id ? '2rem' : (p.chargeProjet ? '11rem' : '5rem'),
                zIndex: 10,
                display: 'flex',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '0.5rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                {editingProject === p._id ? (
                  // Boutons de sauvegarde et annulation en mode édition
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        saveProjectEdits(p._id);
                      }}
                      title="Sauvegarder les modifications"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #047857)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px'
                      }}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEditing();
                      }}
                      title="Annuler les modifications"
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px'
                      }}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                ) : (
                  // Boutons normaux en mode consultation
                  <>
                    {/* Bouton d'édition rapide - toujours affiché */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('✏️ [EDIT-BTN] Bouton édition rapide cliqué pour projet:', p._id);
                        startEditing(p);
                      }}
                      title="Édition rapide"
                        style={{
                          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>

                    {/* Autres boutons - affichés selon les props */}
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(p);
                        }}
                        title="Modifier le projet (formulaire complet)"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}

                    {onCopy && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCopy(p);
                        }}
                        title="Dupliquer le projet"
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #047857)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    )}

                    {onShowMenu && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowMenu(p, e);
                        }}
                        title="Plus d'options"
                        style={{
                          background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* En-tête premium */}
            <div style={{
              background: (() => {
                if (p.chargeProjet && displayStatus === 'En cours') {
                  const color = getChargeColor(p.chargeProjet);
                  // Créer une variante plus foncée pour le dégradé
                  const darkerColor = color === '#10b981' ? '#047857' :
                                     color === '#3b82f6' ? '#1d4ed8' :
                                     color === '#facc15' ? '#eab308' : color;
                  return `linear-gradient(135deg, ${color}, ${darkerColor})`;
                }
                return displayStatus === 'En cours'
                  ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                  : displayStatus === 'Terminé'
                  ? 'linear-gradient(135deg, var(--color-success), var(--color-success-dark))'
                  : 'linear-gradient(135deg, var(--color-secondary), var(--color-neutral))';
              })(),
              padding: '1.5rem 2rem',
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                {/* Nom du client - éditable */}
                {editingProject === p._id ? (
                  <input
                    type="text"
                    value={editingFields['client.name'] || ''}
                    onChange={(e) => updateEditingField('client.name', e.target.value)}
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: '800',
                      color: 'var(--color-text-primary)',
                      margin: 0,
                      background: 'var(--color-bg-input)',
                      border: '2px solid var(--color-border-input)',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      width: '100%',
                      backdropFilter: 'blur(10px)'
                    }}
                    placeholder="Nom du client"
                  />
                ) : (
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '800',
                    color: 'var(--color-text-inverse)',
                    margin: 0,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {p.client?.name || p.client}
                  </h3>
                )}

                {/* Statut - éditable */}
                {editingProject === p._id ? (
                  <select
                    value={editingFields.status || ''}
                    onChange={(e) => updateEditingField('status', e.target.value)}
                    style={{
                      background: 'var(--color-bg-input)',
                      color: 'var(--color-text-primary)',
                      padding: '0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      border: '1px solid var(--color-border)',
                      marginTop: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="draft">📝 Brouillon</option>
                    <option value="planned">📅 Planifié</option>
                    <option value="active">⚡ En cours</option>
                    <option value="on_hold">⏸️ En attente</option>
                    <option value="completed">✅ Terminé</option>
                    <option value="cancelled">❌ Annulé</option>
                    <option value="archived">📁 Archivé</option>
                  </select>
                ) : (
                  <div style={{
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    display: 'inline-block',
                    marginTop: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--color-border)'
                  }}>
                    {displayStatus === 'En cours' && '⚡ En cours'}
                    {displayStatus === 'Terminé' && '✅ Terminé'}
                    {displayStatus === 'Archivé' && '📁 Archivé'}
                    {displayStatus === 'Brouillon' && '📝 Brouillon'}
                    {displayStatus === 'Planifié' && '📅 Planifié'}
                    {displayStatus === 'En attente' && '⏸️ En attente'}
                    {displayStatus === 'Annulé' && '❌ Annulé'}
                  </div>
                )}
              </div>

              {/* Chargé de projet en haut à droite */}
              <div style={{ position: 'relative' }}>
                {editingProject === p._id ? (
                  // Sélecteur de chargé en mode édition
                  <select
                    value={editingFields.chargeProjet || ''}
                    onChange={(e) => updateEditingField('chargeProjet', e.target.value)}
                    style={{
                      background: 'var(--color-bg-input)',
                      backdropFilter: 'blur(10px)',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: '2px solid rgba(139, 92, 246, 0.5)',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1rem',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="">📋 Aucun chargé</option>
                    <option value="Amélie">👩‍💼 Amélie</option>
                    <option value="Hugo">👨‍💼 Hugo</option>
                    <option value="Baptiste">👨‍💼 Baptiste</option>
                  </select>
                ) : p.chargeProjet ? (
                  <div style={{
                    background: getChargeBgColor(p.chargeProjet),
                    backdropFilter: 'blur(10px)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: getChargeColor(p.chargeProjet),
                    border: `2px solid ${getChargeColor(p.chargeProjet)}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showChargeProjetDropdown === p._id) {
                      setShowChargeProjetDropdown(null);
                      setDropdownPosition(null);
                    } else {
                      handleOpenDropdown(p._id, e);
                    }
                  }}
                  >
                    <span>👨‍💼</span>
                    {p.chargeProjet}
                    <span style={{ fontSize: '0.6rem', opacity: 0.8 }}>▼</span>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (showChargeProjetDropdown === p._id) {
                        setShowChargeProjetDropdown(null);
                        setDropdownPosition(null);
                      } else {
                        handleOpenDropdown(p._id, e);
                      }
                    }}
                    style={{
                      background: 'var(--color-bg-secondary)',
                      backdropFilter: 'blur(10px)',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--color-bg-hover)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--color-bg-secondary)';
                      e.target.style.transform = 'scale(1)';
                    }}
                    title="Ajouter un chargé de projet"
                  >
                    +
                  </button>
                )}

              </div>
            </div>

            {/* Contenu */}
            <div style={{
              padding: '2rem',
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              flex: 1
            }}>
              {/* Description - éditable */}
              {(p.description || editingProject === p._id) && (
                <div style={{
                  background: 'linear-gradient(135deg, var(--color-bg-primary), var(--color-bg-secondary))',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                  backdropFilter: 'blur(10px)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.5rem'
                  }}>📝 Description</div>
                  {editingProject === p._id ? (
                    <textarea
                      value={editingFields.description || ''}
                      onChange={(e) => updateEditingField('description', e.target.value)}
                      placeholder="Description du projet..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        fontSize: '0.9rem',
                        color: 'var(--color-text-primary)',
                        lineHeight: '1.5',
                        margin: 0,
                        fontWeight: '500',
                        background: 'var(--color-bg-input)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        resize: 'vertical'
                      }}
                    />
                  ) : (
                    <p style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-text-primary)',
                      lineHeight: '1.5',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      {p.description}
                    </p>
                  )}
                </div>
              )}


              {/* Dates et informations */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, var(--color-bg-primary), var(--color-bg-secondary))',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.5rem'
                  }}>🚀 Début</div>
                  {editingProject === p._id ? (
                    <input
                      type="date"
                      value={editingFields['dates.start'] || ''}
                      onChange={(e) => updateEditingField('dates.start', e.target.value)}
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        color: 'var(--color-text-primary)',
                        background: 'var(--color-bg-input)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        padding: '0.25rem',
                        width: '100%'
                      }}
                    />
                  ) : (
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: 'var(--color-text-primary)'
                    }}>
                      {new Date(p.dates?.start || p.dateDebut).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, var(--color-bg-primary), var(--color-bg-secondary))',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.5rem'
                  }}>🏁 Fin</div>
                  {editingProject === p._id ? (
                    <input
                      type="date"
                      value={editingFields['dates.end'] || ''}
                      onChange={(e) => updateEditingField('dates.end', e.target.value)}
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        color: 'var(--color-text-primary)',
                        background: 'var(--color-bg-input)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        padding: '0.25rem',
                        width: '100%'
                      }}
                    />
                  ) : (
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: 'var(--color-text-primary)'
                    }}>
                      {new Date(p.dates?.end || p.dateFin).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>

              {/* Barre de progression premium */}
              <div style={{
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>📊 Progression</div>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: displayStatus === 'En cours' ? 'var(--color-primary)' : displayStatus === 'Terminé' ? 'var(--color-success)' : 'var(--color-secondary)'
                  }}>
                    {Math.round(pct)}%
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--color-bg-secondary)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div
                    style={{
                      height: '100%',
                      background: displayStatus === 'En cours' 
                        ? 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' 
                        : displayStatus === 'Terminé'
                        ? 'linear-gradient(90deg, var(--color-success), var(--color-success-dark))'
                        : 'linear-gradient(90deg, var(--color-secondary), var(--color-neutral))',
                      borderRadius: '10px',
                      width: `${pct}%`,
                      transition: 'width 0.5s ease',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  />
                </div>
              </div>

              {/* Fichiers premium */}
              {p.documents?.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, var(--color-bg-primary), var(--color-bg-secondary))',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#3b82f6',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.75rem'
                  }}>📎 Fichiers ({p.documents.length})</div>
                  <div style={{
                    display: 'grid',
                    gap: '0.5rem'
                  }}>
                    {p.documents.map((doc, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const filename = doc.path || doc.name || doc;
                          const baseUrl = import.meta.env.MODE === 'development' 
                            ? 'http://localhost:3001' 
                            : 'https://api-pousse-app-5y2wo.ondigitalocean.app';
                          const fullUrl = `${baseUrl}/api/uploads/${filename}`;
                          console.log('🔗 Opening PDF in viewer:', fullUrl);
                          console.log('🔗 doc:', doc);
                          setPdfViewerData({
                            url: fullUrl,
                            name: doc.originalname || filename,
                            projectTitle: p.title
                          });
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          background: 'var(--color-surface)',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: '#3b82f6',
                          border: '1px solid var(--color-border)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--color-bg-secondary)';
                          e.target.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'var(--color-surface)';
                          e.target.style.transform = 'translateX(0)';
                        }}
                      >
                        📄 {doc.name || doc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matériaux (Plantes) premium - éditable */}
              {(p.materials?.length > 0 || editingProject === p._id) && (
                <div style={{
                  background: 'linear-gradient(135deg, var(--color-bg-primary), var(--color-bg-secondary))',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      color: 'var(--color-success)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>🌱 Plantes du projet ({p.materials?.length || 0})</div>
                    {editingProject === p._id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPlantSelector(p._id);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #047857)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        + Ajouter une plante
                      </button>
                    )}
                  </div>
                  <div style={{
                    display: 'grid',
                    gap: '0.75rem'
                  }}>
                    {p.materials.map((material, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          background: 'var(--color-surface)',
                          borderRadius: '12px',
                          border: '1px solid var(--color-border)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--color-bg-secondary)';
                          e.target.style.transform = 'translateX(2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'var(--color-surface)';
                          e.target.style.transform = 'translateX(0)';
                        }}
                      >
                        {(material.image || material.reference) && (
                          <img
                            src={material.image || `/api/nieuwkoop/items/${material.reference}/image`}
                            alt={material.name}
                            style={{
                              width: '45px',
                              height: '45px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '2px solid rgba(34,197,94,0.2)'
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: 'var(--color-text-primary)',
                            marginBottom: '0.25rem'
                          }}>
                            {material.reference} — {material.name}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            gap: '1rem'
                          }}>
                            <span>Qty: {material.quantity}</span>
                            <span>{material.unitPrice}€/u</span>
                            <span style={{
                              fontWeight: '600',
                              color: 'var(--color-success)'
                            }}>
                              Total: {(material.quantity * material.unitPrice).toFixed(2)}€
                            </span>
                          </div>
                        </div>

                        {/* Bouton de suppression en mode édition */}
                        {editingProject === p._id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removePlantFromProject(p._id, i);
                            }}
                            style={{
                              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '30px',
                              height: '30px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              transition: 'all 0.2s ease',
                              marginLeft: '0.5rem'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                            title="Supprimer cette plante"
                          >
                            ×
                          </button>
                        )}

                        {/* Statut de la plante */}
                        {material.status !== 'needed' && (
                          <div style={{
                            background: material.status === 'ordered' ? 'var(--color-primary)' :
                                       material.status === 'delivered' ? 'var(--color-success)' : 'var(--color-secondary)',
                            color: 'var(--color-text-inverse)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            marginLeft: editingProject === p._id ? '0' : '0.5rem'
                          }}>
                            {material.status === 'ordered' && '📦 Commandé'}
                            {material.status === 'delivered' && '✅ Livré'}
                            {material.status === 'used' && '🔧 Utilisé'}
                            {material.status === 'returned' && '↩️ Retourné'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Total des matériaux */}
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, var(--color-bg-primary), var(--color-bg-secondary))',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'var(--color-primary)',
                      marginBottom: '0.25rem'
                    }}>
                      Coût total des plantes
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: '800',
                      color: 'var(--color-success)'
                    }}>
                      {p.materials.reduce((total, m) => total + (m.quantity * m.unitPrice), 0).toFixed(2)}€
                    </div>
                  </div>
                </div>
              )}

              {/* Actions premium */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                marginTop: 'auto'
              }}>
                <button
                  onClick={() =>
                    onUpdate(p._id, {
                      statut: displayStatus === "En cours" ? "Terminé" : "En cours"
                    })
                  }
                  title={displayStatus === "En cours" ? "Terminer" : "Réactiver"}
                  style={{
                    background: 'linear-gradient(135deg, var(--color-success), var(--color-success-dark))',
                    color: 'var(--color-text-inverse)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.05)';
                    e.target.style.boxShadow = 'var(--shadow-2xl)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = 'var(--shadow-lg)';
                  }}
                >
                  <CheckIcon style={{width: '16px', height: '16px'}} />
                  {displayStatus === "En cours" ? "Terminer" : "Réactiver"}
                </button>
                
                <button
                  onClick={() => onDelete(p._id)}
                  title="Supprimer"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-error), var(--color-error-dark))',
                    color: 'var(--color-text-inverse)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.05)';
                    e.target.style.boxShadow = 'var(--shadow-2xl)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = 'var(--shadow-lg)';
                  }}
                >
                  <TrashIcon style={{width: '16px', height: '16px'}} />
                  Supprimer
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
    
    {/* PDF Viewer Modal */}
    {pdfViewerData && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setPdfViewerData(null);
          }
        }}
      >
        {/* Header avec titre et bouton fermer */}
        <div style={{
          background: '#fff',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
              Projet: {pdfViewerData.projectTitle}
            </h3>
          </div>
          <button
            onClick={() => setPdfViewerData(null)}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>
        
        {/* Viewer PDF */}
        <div style={{ flex: 1, background: '#f3f4f6', padding: '1rem' }}>
          <iframe
            src={`${pdfViewerData.url}#toolbar=1&navpanes=1&scrollbar=1`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '8px',
              background: '#fff'
            }}
            title={`PDF: ${pdfViewerData.name}`}
          />
        </div>
      </div>
    )}

    {/* Dropdown en portail */}
    {dropdownPosition && showChargeProjetDropdown && createPortal(
      <div style={{
        position: 'fixed',
        top: `${dropdownPosition.top}px`,
        right: `${dropdownPosition.right}px`,
        background: 'var(--color-surface)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--color-border)',
        minWidth: '150px',
        zIndex: 999999,
        overflow: 'hidden'
      }}>
        {chargesProjet.map((charge) => {
          const currentProject = projects.find(p => p._id === showChargeProjetDropdown);
          return (
            <button
              key={charge.name}
              onClick={(e) => {
                e.stopPropagation();
                handleAssignChargeProjet(currentProject, charge.name);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: currentProject?.chargeProjet === charge.name ? charge.bgColor : 'transparent',
                border: 'none',
                color: charge.color,
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = charge.bgColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = currentProject?.chargeProjet === charge.name ? charge.bgColor : 'transparent';
              }}
            >
              <span>👨‍💼</span>
              {charge.name}
              {currentProject?.chargeProjet === charge.name && (
                <span style={{ marginLeft: 'auto', color: charge.color }}>✓</span>
              )}
            </button>
          );
        })}
        {projects.find(p => p._id === showChargeProjetDropdown)?.chargeProjet && (
          <>
            <div style={{
              height: '1px',
              background: 'var(--color-border)',
              margin: '0.25rem 0'
            }} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentProject = projects.find(p => p._id === showChargeProjetDropdown);
                handleAssignChargeProjet(currentProject, null);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-error)',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--color-bg-secondary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              <span>❌</span>
              Retirer le chargé
            </button>
          </>
        )}
      </div>,
      document.body
    )}

    {/* Modal du sélecteur de plantes */}
    {showPlantSelector && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <PlantSelector
          projectId={showPlantSelector}
          onClose={() => setShowPlantSelector(null)}
        />
      </div>
    )}
    </>
  );
}
