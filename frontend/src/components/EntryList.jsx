import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api, { handleApiError } from '../api/axios'
import { getConcepteurs } from '../api/clientApi'
import { 
  EyeIcon, 
  TrashIcon, 
  CalendarDaysIcon,
  TagIcon,
  CurrencyEuroIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  FunnelIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline'
import './EntryList.css'
import '../pages/Nieuwkoop.css'

export default function EntryList({ refreshFlag, onUpdate }) {
  const [entries, setEntries] = useState([])
  const [projects, setProjects] = useState([])
  const [concepteurs, setConcepteurs] = useState([])
  const [stockMap, setStockMap] = useState({})
  const [filteredEntries, setFilteredEntries] = useState([])
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterProject, setFilterProject] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState(null)

  // Charger les projets et concepteurs
  useEffect(() => {
    Promise.all([
      api.get('/projects'),
      getConcepteurs()
    ])
      .then(([projectsRes, concepteursData]) => {
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : [])
        setConcepteurs(Array.isArray(concepteursData) ? concepteursData : [])
      })
      .catch(err => {
        console.error('Erreur chargement données:', err)
        const errorInfo = handleApiError(err)
        console.error('Détails:', errorInfo)
      })
  }, [])

  // Charger les mouvements "entrée"
  useEffect(() => {
    setIsLoading(true)
    api.get('/movements')
      .then(res => {
        const all = Array.isArray(res.data) ? res.data : []
        const entriesData = all.filter(m => m.type === 'entrée')
        setEntries(entriesData)
        setFilteredEntries(entriesData)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Erreur chargement mouvements:', error)
        const errorInfo = handleApiError(error)
        console.error('Détails:', errorInfo)
        setIsLoading(false)
      })
  }, [refreshFlag])

  // Charger tous les items du stock pour avoir prix et image
  useEffect(() => {
    api.get('/stock-items?search=')
      .then(res => {
        const items = Array.isArray(res.data) ? res.data : []
        const map = {}
        items.forEach(item => { map[item.reference] = item })
        setStockMap(map)
      })
      .catch(err => {
        console.error('Erreur chargement stock:', err)
        const errorInfo = handleApiError(err)
        console.error('Détails:', errorInfo)
      })
  }, [])

  // Filtrer et trier les entrées
  useEffect(() => {
    let filtered = [...entries]
    
    if (filterProject) {
      filtered = filtered.filter(entry => entry.project === filterProject)
    }
    
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.eventDate)
          bValue = new Date(b.eventDate)
          break
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'quantity':
          aValue = a.quantity
          bValue = b.quantity
          break
        case 'price':
          aValue = a.price || stockMap[a.reference]?.price || 0
          bValue = b.price || stockMap[b.reference]?.price || 0
          break
        default:
          aValue = a.eventDate
          bValue = b.eventDate
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    setFilteredEntries(filtered)
  }, [entries, sortBy, sortOrder, filterProject, stockMap])

  // Fonction pour ouvrir le modal de suppression
  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry)
    setShowDeleteModal(true)
  }

  // Fonction pour supprimer une entrée
  const handleDelete = async () => {
    if (!entryToDelete) return
    
    setDeletingId(entryToDelete._id)
    try {
      await api.delete(`/movements/${entryToDelete._id}`)
      // Recharger la liste après suppression
      const res = await api.get('/movements')
      const all = Array.isArray(res.data) ? res.data : []
      const entriesData = all.filter(m => m.type === 'entrée')
      setEntries(entriesData)
      setFilteredEntries(entriesData)
      // Appeler onUpdate si fourni
      if (onUpdate) onUpdate()
      setShowDeleteModal(false)
      setEntryToDelete(null)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      const errorInfo = handleApiError(error)
      alert(`Erreur lors de la suppression de l'entrée: ${errorInfo.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          style={{
            background: 'var(--color-surface, rgba(255, 255, 255, 0.6))',
            borderRadius: '24px',
            padding: '2rem',
            border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(12px)',
            height: '320px'
          }}
        >
          <div className="animate-pulse">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-gray-200 rounded-lg w-24"></div>
              <div className="h-6 bg-gray-200 rounded-lg w-16"></div>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  )

  // Empty state component
  if (!isLoading && filteredEntries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          width: '100%',
          maxWidth: '600px',
          margin: '4rem auto'
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-4"
        >
          <ClipboardDocumentListIcon className="w-16 h-16 mx-auto text-gray-400" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {entries.length === 0 ? 'Aucune entrée enregistrée' : 'Aucun résultat trouvé'}
        </h3>
        <p className="text-gray-500">
          {entries.length === 0 
            ? 'Commencez par ajouter votre première entrée de stock'
            : 'Essayez de modifier vos filtres de recherche'
          }
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        width: '100%',
        maxWidth: '100%',
        padding: '0'
      }}
    >
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{
          marginBottom: '1.5rem',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <div className="flex flex-wrap gap-3">
            {/* Sort dropdown */}
            <motion.select
              whileHover={{ scale: 1.02 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl border-2 border-white/40 bg-white/60 backdrop-blur-md text-gray-700 font-medium focus:outline-none focus:border-teal-400 transition-all"
            >
              <option value="date">Trier par date</option>
              <option value="name">Trier par nom</option>
              <option value="quantity">Trier par quantité</option>
              <option value="price">Trier par prix</option>
            </motion.select>
            
            {/* Sort order button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 rounded-xl border-2 border-white/40 bg-white/60 backdrop-blur-md text-gray-700 font-medium hover:bg-white/80 transition-all flex items-center gap-2"
            >
              <ArrowsUpDownIcon className="w-4 h-4" />
              {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
            </motion.button>
            
            {/* Project filter */}
            <motion.select
              whileHover={{ scale: 1.02 }}
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-4 py-2 rounded-xl border-2 border-white/40 bg-white/60 backdrop-blur-md text-gray-700 font-medium focus:outline-none focus:border-teal-400 transition-all"
            >
              <option value="">Tous les projets</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {typeof project.client === 'string' ? project.client : 
                   typeof project.client === 'object' && project.client?.name ? project.client.name :
                   project.name || 'Projet sans titre'}
                </option>
              ))}
            </motion.select>
          </div>
      </motion.div>
      
      {/* Loading state */}
      {isLoading && <LoadingSkeleton />}
      
      {/* Cards grid */}
      {!isLoading && (
        <motion.div
          layout
          className="products-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
            gap: '1.5rem',
            position: 'relative',
            perspective: '1200px',
            transformStyle: 'preserve-3d',
            padding: '0 1rem',
            width: '100%',
            maxWidth: '100%'
          }}
        >
          <AnimatePresence>
            {filteredEntries.map((m, index) => {
              const projectObj = projects.find(p => p._id === m.project)
              const concepteurObj = concepteurs.find(c => c._id === m.concepteur)
              const projectLabel = projectObj
                ? (typeof projectObj.client === 'string' ? projectObj.client : 
                   typeof projectObj.client === 'object' && projectObj.client?.name ? projectObj.client.name :
                   projectObj.name || 'Projet sans titre')
                : 'Inconnu'

              const stockItem = stockMap[m.reference]
              const price = m.price != null ? m.price : (stockItem?.price ?? 0)
              const imageSrc = m.image || stockItem?.image || `/api/nieuwkoop/items/${m.reference}/image`
              const isDeleting = deletingId === m._id

              return (
                <motion.div
                  key={m._id}
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
                    boxShadow: 'var(--shadow-2xl)',
                    borderColor: 'rgba(16, 185, 129, 0.3)'
                  }}
                  className="product-card"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-lg)',
                    overflow: 'hidden',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                    padding: 0
                  }}
                >
                  {/* Loading overlay */}
                  {isDeleting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-500 border-t-transparent"></div>
                        <span className="text-red-600 font-medium">Suppression...</span>
                      </div>
                    </motion.div>
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
                          color: 'var(--color-primary)'
                        }}>
                          {m.name}
                        </h3>
                        <p style={{
                          fontSize: '0.8rem',
                          opacity: 0.7,
                          margin: 0,
                          fontWeight: '500'
                        }}>
                          {m.reference || 'N/A'}
                        </p>
                      </div>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'var(--color-primary)'
                      }}>
                        €{price.toFixed(2)}
                      </div>
                    </div>
                    
                    {/* Badge Entrée */}
                    <div style={{
                      display: 'inline-block',
                      background: 'var(--color-primary)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      📥 Entrée
                    </div>
                  </div>

                  {/* Image avec overlay */}
                  <div style={{position: 'relative'}}>
                    <div style={{
                      position: 'relative',
                      height: '140px',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)'
                    }}>
                      <img 
                        src={imageSrc} 
                        alt={m.name}
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
                          display: imageSrc ? 'none' : 'flex',
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
                    {/* Informations principales */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
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
                        <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>📦</div>
                        <div style={{
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          color: 'var(--color-primary)',
                          marginBottom: '0.25rem'
                        }}>{m.quantity}</div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-secondary)',
                          fontWeight: '600'
                        }}>Quantité</div>
                      </div>
                      
                      <div style={{
                        padding: '1rem',
                        background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
                        borderRadius: '16px',
                        textAlign: 'center',
                        border: '1px solid var(--color-primary)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                      }}>
                        <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>📅</div>
                        <div style={{
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          color: 'var(--color-primary)',
                          marginBottom: '0.25rem'
                        }}>{new Date(m.eventDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-secondary)',
                          fontWeight: '600'
                        }}>Date</div>
                      </div>
                    </div>

                    {/* Informations condensées projet/utilisateur */}
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
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            fontSize: '0.7rem',
                            color: 'var(--color-secondary)',
                            marginBottom: '0.25rem',
                            fontWeight: '600'
                          }}>Projet</div>
                          <div style={{
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            color: 'var(--color-primary)',
                            maxWidth: '120px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {projectLabel}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            fontSize: '0.7rem',
                            color: 'var(--color-secondary)',
                            marginBottom: '0.25rem',
                            fontWeight: '600'
                          }}>Concepteur</div>
                          <div style={{
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            color: 'var(--color-accent)'
                          }}>
                            {concepteurObj ? (concepteurObj.nomComplet || concepteurObj.nom) : (m.createdBy || 'Non défini')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Note section */}
                    {m.note && (
                      <div style={{
                        padding: '0.75rem 1rem',
                        background: 'var(--color-bg-secondary)',
                        borderRadius: '12px',
                        marginBottom: '1rem',
                        border: '1px solid var(--color-border)'
                      }}>
                        <p style={{
                          fontSize: '0.85rem',
                          color: 'var(--color-text-secondary)',
                          margin: 0,
                          fontStyle: 'italic'
                        }}>{m.note}</p>
                      </div>
                    )}

                    {/* Actions condensées */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '0.5rem'
                    }}>
                      <motion.button
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          background: 'var(--color-primary)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.5rem',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          minWidth: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Voir les détails"
                      >
                        👁️
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteClick(m)}
                        disabled={isDeleting}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          background: '#ef4444',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.5rem',
                          color: 'white',
                          cursor: isDeleting ? 'not-allowed' : 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          opacity: isDeleting ? 0.6 : 1,
                          minWidth: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title={isDeleting ? 'Suppression...' : 'Supprimer'}
                      >
                        {isDeleting ? '⏳' : '🗑️'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 m-4 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrashIcon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer cette entrée ? Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deletingId}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {deletingId ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}