// frontend/src/components/ExitForm.jsx

import React, { useState, useEffect } from 'react'
import { createMovement, getStockItems, getProjects } from '../api/clientApi'
import './ExitForm.css'

export default function ExitForm({ onSaved, currentUser, variant = 'definitive' }) {
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    reference: '',
    name: '',
    quantity: 1,
    exitDate: '',
    departureDate: '',
    returnDate: '',
    project: '',
    note: '',
  })

  // Nouveaux états pour recherche de plante
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedPlant, setSelectedPlant] = useState(null)
  
  // État pour les projets
  const [projects, setProjects] = useState([])
  
  // États pour le mode multiple
  const [isMultipleMode, setIsMultipleMode] = useState(false)
  const [multipleItems, setMultipleItems] = useState([])
  const [successMessage, setSuccessMessage] = useState('')

  // Charger projets
  useEffect(() => {
    getProjects()
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setError('Impossible de charger la liste des projets.'));
  }, []);

  // Fonction pour les styles d'input adaptés au thème (utilise les variables CSS)
  const getInputStyles = () => ({
    width: '100%',
    padding: '1rem 1.5rem',
    border: '2px solid var(--color-border-input)',
    borderRadius: '16px',
    fontSize: '1rem',
    fontWeight: '500',
    background: 'var(--color-bg-input)',
    transition: 'all 0.3s ease',
    outline: 'none',
    color: 'var(--color-text-input)'
  });

  // Débounce et fetch des suggestions
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([])
      return
    }
    const handler = setTimeout(async () => {
      try {
        const results = await getStockItems(searchTerm)
        console.log('🔍 Frontend - Résultats de recherche reçus:', results)
        
        if (results && results.length > 0) {
          console.log('📦 Frontend - Premier item avant enrichissement:', {
            reference: results[0].reference,
            name: results[0].name,
            price: results[0].price,
            height: results[0].height,
            diameter: results[0].diameter,
            availableQuantity: results[0].availableQuantity,
            isNewPlant: results[0].isNewPlant
          })
          
          // Enrichir les résultats avec les dimensions si manquantes
          const enrichedResults = await Promise.all(results.map(async (item) => {
            // Si les dimensions manquent, essayer de les récupérer depuis l'API
            if ((!item.height || !item.diameter) && item.reference) {
              try {
                console.log(`📡 Frontend - Récupération dimensions pour ${item.reference}...`)
                const response = await fetch(`/api/nieuwkoop/items/${item.reference}/details`)
                if (response.ok) {
                  const details = await response.json()
                  const nieuwkoopItem = details.item
                  console.log(`📦 Frontend - Détails reçus pour ${item.reference}:`, nieuwkoopItem)
                  
                  // Chercher toutes les propriétés possibles pour le diamètre
                  const possibleDiameters = [
                    nieuwkoopItem?.DiameterCulturePot,
                    nieuwkoopItem?.PotSize,
                    nieuwkoopItem?.Diameter,
                    nieuwkoopItem?.PotDiameter,
                    nieuwkoopItem?.Width,  // Parfois la largeur = diamètre pour les pots
                    nieuwkoopItem?.Size
                  ].filter(val => val && val > 0)
                  
                  console.log(`🔍 Frontend - Propriétés diamètre trouvées pour ${item.reference}:`, {
                    DiameterCulturePot: nieuwkoopItem?.DiameterCulturePot,
                    PotSize: nieuwkoopItem?.PotSize,
                    Diameter: nieuwkoopItem?.Diameter,
                    PotDiameter: nieuwkoopItem?.PotDiameter,
                    Width: nieuwkoopItem?.Width,
                    Size: nieuwkoopItem?.Size,
                    possibleDiameters
                  })
                  
                  const enrichedItem = {
                    ...item,
                    height: nieuwkoopItem?.Height || item.height || 0,
                    diameter: possibleDiameters[0] || item.diameter || 0
                  }
                  
                  console.log(`✅ Frontend - Item enrichi ${item.reference}:`, {
                    height: enrichedItem.height,
                    diameter: enrichedItem.diameter
                  })
                  
                  return enrichedItem
                }
              } catch (error) {
                console.log(`⚠️ Frontend - Erreur récupération dimensions pour ${item.reference}:`, error)
              }
            }
            return item
          }))
          
          setSuggestions(enrichedResults)
        } else {
          setSuggestions(results || [])
        }
      } catch (err) {
        console.error('Erreur de recherche stock :', err)
        setSuggestions([])
      }
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const handleSearchChange = e => {
    setSearchTerm(e.target.value)
  }

  const handleSelectSuggestion = item => {
    if (isMultipleMode) {
      // En mode multiple, ajouter à la liste
      const newItem = {
        id: Date.now() + Math.random(),
        reference: item.reference,
        name: item.name,
        quantity: 1,
        image: item.image,
        availableQuantity: item.availableQuantity,
        isNewPlant: item.isNewPlant,
        price: item.price,
        height: item.height,
        diameter: item.diameter,
        category: item.category
      }
      setMultipleItems([...multipleItems, newItem])
      setSearchTerm('')
      setSuggestions([])
    } else {
      // Mode simple
      setSelectedPlant(item)
      setFormData(fd => ({
        ...fd,
        reference: item.reference,
        name: item.name,
        quantity: 1
      }))
      setSearchTerm('')
      setSuggestions([])
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(fd => ({
      ...fd,
      [name]: name === 'quantity' ? Number(value) : value
    }))
  }

  // Gérer le changement de quantité pour un item en mode multiple
  const handleMultipleItemQuantityChange = (itemId, newQuantity) => {
    setMultipleItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Number(newQuantity) }
          : item
      )
    )
  }

  // Supprimer un item en mode multiple
  const handleRemoveMultipleItem = (itemId) => {
    setMultipleItems(items => items.filter(item => item.id !== itemId))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (isMultipleMode) {
      // Mode multiple
      if (multipleItems.length === 0) {
        setError('Veuillez ajouter au moins un article.')
        return
      }

      // Validation des dates communes
      if (variant === 'definitive') {
        if (!formData.exitDate) {
          setError('La date de sortie est requise.')
          return
        }
      } else {
        if (!formData.departureDate) {
          setError('La date de départ est requise.')
          return
        }
        if (!formData.returnDate) {
          setError('La date de retour est requise.')
          return
        }
        if (!formData.project.trim()) {
          setError('Le projet/événement est requis.')
          return
        }
      }

      // Validation de l'utilisateur
      if (!currentUser) {
        setError('Utilisateur non connecté.')
        return
      }

      // Créer toutes les sorties
      const errors = []
      const successes = []
      
      for (const item of multipleItems) {
        // Validation du stock pour chaque item
        if (!item.isNewPlant && item.quantity > item.availableQuantity) {
          errors.push(`${item.reference}: Quantité maximale disponible : ${item.availableQuantity}`)
          continue
        }

        const payload = {
          type: 'sortie',
          subType: variant,
          reference: item.reference,
          name: item.name,
          quantity: item.quantity,
          note: formData.note,
          image: item.image,
          createdBy: currentUser,
          isNewPlant: item.isNewPlant || false,
          price: item.price || 0,
          height: item.height || 0,
          diameter: item.diameter || 0,
          category: item.category || 'autre'
        }

        if (variant === 'definitive') {
          payload.eventDate = formData.exitDate
        } else {
          payload.eventDate = formData.departureDate
          payload.returnPlannedAt = formData.returnDate
          payload.project = formData.project
        }

        try {
          await createMovement(payload)
          successes.push(item.reference)
        } catch (error) {
          errors.push(`${item.reference}: ${error.response?.data?.error || 'Erreur inconnue'}`)
        }
      }

      if (errors.length > 0) {
        setError(`Erreurs:\n${errors.join('\n')}`)
      }
      
      if (successes.length > 0) {
        setSuccessMessage(`✅ ${successes.length} sortie(s) créée(s) avec succès!`)
        setMultipleItems([])
        onSaved()
        
        // Réinitialiser le formulaire après succès
        setTimeout(() => {
          setSuccessMessage('')
          setFormData({
            reference: '',
            name: '',
            quantity: 1,
            exitDate: '',
            departureDate: '',
            returnDate: '',
            project: formData.project, // Garder le projet
            note: '',
          })
        }, 3000)
      }

    } else {
      // Mode simple (code existant)
      // Validation de base
      if (!formData.reference.trim()) {
        setError('La référence est requise.')
        return
      }
      if (formData.quantity < 1) {
        setError('Quantité minimale : 1.')
        return
      }
      // Validation du stock uniquement pour les plantes déjà en stock
      if (selectedPlant && !selectedPlant.isNewPlant && formData.quantity > selectedPlant.availableQuantity) {
        setError(`Quantité maximale disponible : ${selectedPlant.availableQuantity}.`)
        return
      }

      // Pour les nouvelles plantes, avertir l'utilisateur
      if (selectedPlant && selectedPlant.isNewPlant && selectedPlant.availableQuantity === 0) {
        console.log('⚠️ Sortie d\'une nouvelle plante sans stock existant')
      }

      // Validation de l'utilisateur
      if (!currentUser) {
        setError('Utilisateur non connecté.')
        return
      }

      // Validation selon le variant
      if (variant === 'definitive') {
        if (!formData.exitDate) {
          setError('La date de sortie est requise.')
          return
        }
      } else {
        if (!formData.departureDate) {
          setError('La date de départ est requise.')
          return
        }
        if (!formData.returnDate) {
          setError('La date de retour est requise.')
          return
        }
        if (!formData.project.trim()) {
          setError('Le projet/événement est requis.')
          return
        }
      }

      // Construction du payload, avec image si présente
      const payload = {
        type: 'sortie',
        subType: variant, // 'definitive' ou 'locative'
        reference: formData.reference,
        name: formData.name,
        quantity: formData.quantity,
        note: formData.note,
        image: selectedPlant?.image,
        createdBy: currentUser,
        // Informations pour les nouvelles plantes
        isNewPlant: selectedPlant?.isNewPlant || false,
        price: selectedPlant?.price || 0,
        height: selectedPlant?.height || 0,
        diameter: selectedPlant?.diameter || 0,
        category: selectedPlant?.category || 'autre'
      }
      if (variant === 'definitive') {
        payload.eventDate = formData.exitDate
      } else {
        payload.eventDate = formData.departureDate
        payload.returnPlannedAt = formData.returnDate
        payload.project = formData.project
      }

      // Debug: vérifier le payload avant envoi
      console.log('🚀 Payload envoyé au backend:', payload);
      console.log('🔍 currentUser détaillé:', currentUser);
      
      // Envoi au back
      try {
        await createMovement(payload)
        onSaved()
      } catch (error) {
        console.error('Erreur détaillée:', error)
        console.error('🔍 Réponse erreur complète:', error.response?.data)
        if (error.response?.data?.error) {
          setError(error.response.data.error)
        } else if (error.response?.data?.details) {
          setError(`${error.response.data.error}: ${JSON.stringify(error.response.data.details)}`)
        } else {
          setError('Erreur lors de la création du mouvement')
        }
        return
      }

      // Réinitialisation du form
      setFormData({
        reference: '',
        name: '',
        quantity: 1,
        exitDate: '',
        departureDate: '',
        returnDate: '',
        project: '',
        note: '',
      })
      setSelectedPlant(null)
    }
  }

  return (
    <div style={{
      background: 'var(--glass-bg)',
      borderRadius: '32px',
      padding: '3rem',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--glass-border)',
      backdropFilter: 'var(--glass-backdrop)',
      position: 'relative',
      overflow: 'auto',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '100%',
        height: '100%',
        background: 'var(--gradient-primary-subtle)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '3.5rem', 
          fontWeight: '800',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
          color: 'var(--color-text-primary)',
          marginBottom: '0.5rem',
          textAlign: 'center',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          animation: 'textFloat 2s ease-in-out infinite alternate',
          textShadow: 'var(--shadow-text-primary)',
          position: 'relative'
        }}>
          Nouvelle sortie
        </h2>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: '1.1rem',
          fontWeight: '500',
          margin: 0,
          textAlign: 'center',
          letterSpacing: '1px'
        }}>
          {variant === 'definitive' ? '🗑️ Sortie définitive du stock' : '🔄 Sortie locative avec retour prévu'}
        </p>
        
        {/* Toggle Mode Multiple */}
        <div style={{
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 2rem',
            background: isMultipleMode 
              ? 'var(--gradient-primary)' 
              : 'var(--color-bg-secondary)',
            border: isMultipleMode 
              ? '2px solid var(--color-primary)' 
              : '2px solid var(--color-border-subtle)',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isMultipleMode 
              ? 'var(--shadow-primary)' 
              : 'var(--shadow-md)',
            transform: isMultipleMode ? 'scale(1.05)' : 'scale(1)'
          }}>
            <input
              type="checkbox"
              checked={isMultipleMode}
              onChange={(e) => {
                setIsMultipleMode(e.target.checked)
                if (!e.target.checked) {
                  setMultipleItems([])
                }
              }}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                accentColor: 'var(--color-primary)'
              }}
            />
            <span style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: isMultipleMode ? 'var(--color-text-inverse)' : 'var(--color-text-primary)'
            }}>
              {isMultipleMode ? '🚀 Mode Multiple Activé' : '📦 Mode Multiple'}
            </span>
          </label>
        </div>
      </div>

      <div style={{
        flex: 1,
        overflow: 'auto',
        paddingRight: '8px'
      }}>
      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        position: 'relative',
        zIndex: 1
      }}>

        {/* Barre de recherche de plante */}
        <div style={{gridColumn: '1 / -1', marginBottom: '1rem'}}>
          <div style={{
            background: 'var(--color-bg-secondary)',
            borderRadius: '24px',
            padding: '2rem',
            border: '2px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-md)',
            backdropFilter: 'var(--glass-backdrop)'
          }}>
            <label style={{
              display: 'block',
              marginBottom: '1rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              textAlign: 'center',
              background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(5px)'
            }}>
              🔍 Rechercher une plante
            </label>
            <input
              name="search"
              type="text"
              placeholder="Tapez au moins 2 caractères pour rechercher..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: '2px solid var(--color-border-input)',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: '500',
                background: 'var(--color-bg-input)',
                backdropFilter: 'var(--glass-backdrop)',
                transition: 'all 0.3s ease',
                outline: 'none',
                color: 'var(--color-text-input)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border-input)'}
            />
            {suggestions.length > 0 && (
              <div style={{
                marginTop: '1rem',
                background: 'var(--color-bg-dropdown)',
                borderRadius: '16px',
                border: '2px solid var(--color-border-subtle)',
                maxHeight: '300px',
                overflowY: 'auto',
                boxShadow: 'var(--shadow-dropdown)'
              }}>
                {suggestions.map(item => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectSuggestion(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      transition: 'all 0.3s ease',
                      borderLeft: item.isNewPlant ? '4px solid var(--color-success)' : '4px solid var(--color-primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--color-bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                    }}
                  >
                    <img 
                      src={item.image || `/api/nieuwkoop/items/${item.reference}/image`} 
                      alt={item.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '2px solid var(--color-bg-primary)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div style={{flex: 1}}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                      }}>
                        <div style={{fontWeight: '700', color: 'var(--color-text-primary)', fontSize: '1rem'}}>
                          {item.reference}
                        </div>
                        <div style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          background: item.isNewPlant ? 'var(--gradient-success)' : 'var(--gradient-primary)',
                          color: 'var(--color-text-inverse)'
                        }}>
                          {item.isNewPlant ? '🆕 Nouvelle' : '📦 En stock'}
                        </div>
                      </div>
                      <div style={{color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: '500'}}>
                        {item.name}
                      </div>
                      <div style={{
                        color: item.availableQuantity > 0 ? 'var(--color-success)' : 'var(--color-text-muted)', 
                        fontSize: '0.8rem', 
                        fontWeight: '600', 
                        marginTop: '0.25rem'
                      }}>
                        Disponible: {item.availableQuantity || 0}
                      </div>
                      <div style={{
                        color: 'var(--color-text-secondary)', 
                        fontSize: '0.7rem', 
                        marginTop: '0.25rem',
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        {item.price > 0 && <span>💰 {item.price}€</span>}
                        {item.height > 0 && <span>📏 H: {item.height}cm</span>}
                        {item.diameter > 0 && <span>📐 Ø: {item.diameter}cm</span>}
                        {(!item.height || !item.diameter) && (
                          <span style={{color: '#666', fontStyle: 'italic'}}>
                            Dimensions en cours de récupération...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Liste des items en mode multiple */}
        {isMultipleMode && multipleItems.length > 0 && (
          <div style={{
            gridColumn: '1 / -1',
            marginBottom: '2rem',
            background: 'var(--gradient-primary-subtle)',
            borderRadius: '24px',
            padding: '1.5rem',
            border: '2px solid var(--color-border-primary)'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📦 Articles sélectionnés ({multipleItems.length})
              </span>
              <span style={{
                fontSize: '1.1rem',
                color: 'var(--color-primary)',
                background: 'var(--gradient-primary-subtle)',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                border: '1px solid var(--color-border-primary)'
              }}>
                💰 Total: {multipleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}€
              </span>
            </h3>
            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              {multipleItems.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'var(--color-bg-primary)',
                    borderRadius: '16px',
                    border: '2px solid var(--color-border-primary)',
                    boxShadow: 'var(--shadow-md)',
                    animation: 'slideIn 0.3s ease-out',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: 'var(--gradient-primary)',
                    borderRadius: '4px 0 0 4px'
                  }} />
                  
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: 'var(--color-primary)',
                    minWidth: '30px'
                  }}>
                    {index + 1}.
                  </span>
                  
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '2px solid var(--color-bg-primary)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    />
                  )}
                  
                  <div style={{flex: 1}}>
                    <div style={{
                      fontWeight: '700',
                      color: 'var(--color-text-primary)',
                      fontSize: '1rem'
                    }}>
                      {item.reference}
                    </div>
                    <div style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.9rem'
                    }}>
                      {item.name}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      marginTop: '0.25rem'
                    }}>
                      {item.price > 0 && (
                        <span style={{
                          color: 'var(--color-success)',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          💰 {item.price.toFixed(2)}€
                        </span>
                      )}
                      <span style={{
                        color: 'var(--color-primary)',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        Total: {(item.price * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <label style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: 'var(--color-text-secondary)',
                      background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      backdropFilter: 'blur(5px)'
                    }}>Qté:</label>
                    <input
                      type="number"
                      min="1"
                      max={item.availableQuantity}
                      value={item.quantity}
                      onChange={(e) => handleMultipleItemQuantityChange(item.id, e.target.value)}
                      style={{
                        width: '80px',
                        padding: '0.5rem',
                        border: '2px solid var(--color-border-input)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        textAlign: 'center',
                        background: 'var(--color-bg-input)',
                        color: 'var(--color-text-input)'
                      }}
                    />
                    <span style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted)'
                    }}>
                      / {item.availableQuantity}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveMultipleItem(item.id)}
                    style={{
                      background: 'var(--gradient-error)',
                      color: 'var(--color-text-inverse)',
                      border: 'none',
                      borderRadius: '12px',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      boxShadow: 'var(--shadow-error)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1) rotate(90deg)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1) rotate(0deg)';
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Champs du formulaire simple (masqués en mode multiple) */}
        {!isMultipleMode && (
          <>
            {/* Référence */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                backdropFilter: 'blur(5px)'
              }}>📋 Référence *</label>
              <input
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                required
                placeholder="Référence du produit"
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  border: '2px solid var(--color-border-input)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  background: 'var(--color-bg-input)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  color: 'var(--color-text-input)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border-input)'}
              />
            </div>

            {/* Nom du produit */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                backdropFilter: 'blur(5px)'
              }}>🏷️ Nom du produit</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom du produit"
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  border: '2px solid var(--color-border-input)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  background: 'var(--color-bg-input)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  color: 'var(--color-text-input)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border-input)'}
              />
            </div>

            {/* Quantité */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                backdropFilter: 'blur(5px)'
              }}>📦 Quantité</label>
              <input
                name="quantity"
                type="number"
                min="1"
                max={selectedPlant ? selectedPlant.availableQuantity : undefined}
                value={formData.quantity}
                onChange={handleChange}
                style={getInputStyles()}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border-input)'}
              />
              {selectedPlant && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'var(--gradient-error-subtle)',
                  border: '1px solid var(--color-border-error)',
                  borderRadius: '8px',
                  color: 'var(--color-text-error)',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  📊 Disponible : {selectedPlant.availableQuantity}
                </div>
              )}
            </div>
          </>
        )}

        {/* Date de sortie définitive */}
        {variant === 'definitive' && (
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backdropFilter: 'blur(5px)'
            }}>📅 Date de sortie *</label>
            <input
              name="exitDate"
              type="date"
              value={formData.exitDate}
              onChange={handleChange}
              required
              style={getInputStyles()}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border-input)'}
            />
          </div>
        )}

        {/* Sortie locative */}
        {variant === 'locative' && (
          <>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                backdropFilter: 'blur(5px)'
              }}>🚀 Date départ *</label>
              <input
                name="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  border: '2px solid var(--color-border-input)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  background: 'var(--color-bg-input)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  color: 'var(--color-text-input)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border-input)'}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                backdropFilter: 'blur(5px)'
              }}>🔄 Date retour prévu *</label>
              <input
                name="returnDate"
                type="date"
                value={formData.returnDate}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  border: '2px solid var(--color-border-input)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  background: 'var(--color-bg-input)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  color: 'var(--color-text-input)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border-input)'}
              />
            </div>
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                backdropFilter: 'blur(5px)'
              }}>🎯 Projet / Événement *</label>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  border: '2px solid var(--color-border-input)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  background: 'var(--color-bg-input)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-input)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border-input)'}
              >
                <option value="">-- Sélectionnez un projet --</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.client?.name || p.client || p.title || 'Projet sans titre'}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Note */}
        <div style={{gridColumn: '1 / -1'}}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            backdropFilter: 'blur(5px)'
          }}>📝 Note</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Note optionnelle..."
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              border: '2px solid var(--color-border-input)',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '500',
              background: 'var(--color-bg-input)',
              transition: 'all 0.3s ease',
              outline: 'none',
              minHeight: '120px',
              resize: 'vertical',
              color: 'var(--color-text-input)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border-input)'}
          />
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div style={{
            gridColumn: '1 / -1',
            background: 'var(--gradient-error)',
            border: '2px solid var(--color-border-error)',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            color: 'var(--color-text-error)',
            fontWeight: '600',
            boxShadow: 'var(--shadow-error)',
            whiteSpace: 'pre-line'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Message de succès */}
        {successMessage && (
          <div style={{
            gridColumn: '1 / -1',
            background: 'var(--gradient-success)',
            border: '2px solid var(--color-border-success)',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            color: 'var(--color-text-success)',
            fontWeight: '600',
            boxShadow: 'var(--shadow-success)',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            {successMessage}
          </div>
        )}

        {/* Bouton de soumission */}
        <div style={{gridColumn: '1 / -1', marginTop: '1rem'}}>
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '1.5rem 2rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              background: 'var(--gradient-primary)',
              color: 'var(--color-text-inverse)',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--shadow-primary)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = 'var(--shadow-primary-hover)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'var(--shadow-primary)';
            }}
          >
            {isMultipleMode 
              ? `🚀 Créer ${multipleItems.length} sortie${multipleItems.length > 1 ? 's' : ''}`
              : variant === 'definitive' ? '🗑️ Sortie Définitive' : '📤 Sortie Locative'
            }
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}
