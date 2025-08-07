// frontend/src/components/ExitForm.jsx

import React, { useState, useEffect } from 'react'
import { createMovement, getStockItems } from '../../../shared/api/domains/inventory/clientApi'
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

  // Débounce et fetch des suggestions
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([])
      return
    }
    const handler = setTimeout(async () => {
      try {
        const results = await getStockItems(searchTerm)
        setSuggestions(results)
      } catch (err) {
        console.error('Erreur de recherche stock :', err)
      }
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const handleSearchChange = e => {
    setSearchTerm(e.target.value)
  }

  const handleSelectSuggestion = item => {
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

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(fd => ({
      ...fd,
      [name]: name === 'quantity' ? Number(value) : value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    // Validation de base
    if (!formData.reference.trim()) {
      setError('La référence est requise.')
      return
    }
    if (formData.quantity < 1) {
      setError('Quantité minimale : 1.')
      return
    }
    if (selectedPlant && formData.quantity > selectedPlant.availableQuantity) {
      setError(`Quantité maximale disponible : ${selectedPlant.availableQuantity}.`)
      return
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
      reference: formData.reference,
      name: formData.name,
      quantity: formData.quantity,
      note: formData.note,
      image: selectedPlant?.image,
      createdBy: currentUser
    }
    if (variant === 'definitive') {
      payload.eventDate = formData.exitDate
    } else {
      payload.eventDate = formData.departureDate
      payload.returnPlannedAt = formData.returnDate
      payload.project = formData.project
    }

    // Envoi au back
    try {
      await createMovement(payload)
      onSaved()
    } catch (error) {
      console.error('Erreur détaillée:', error)
      if (error.response?.data?.error) {
        setError(error.response.data.error)
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

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '32px',
      padding: '3rem',
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08), 0 8px 25px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, rgba(239,68,68,0.03), rgba(220,38,38,0.03))',
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
          fontSize: '3rem', 
          fontWeight: '900',
          background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
          textShadow: '0 4px 20px rgba(239,68,68,0.3)'
        }}>
          ⬆️ Nouvelle sortie
        </h2>
        <p style={{
          color: '#64748b',
          fontSize: '1.1rem',
          fontWeight: '500',
          margin: 0
        }}>
          {variant === 'definitive' ? 'Sortie définitive du stock' : 'Sortie locative avec retour prévu'}
        </p>
      </div>

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
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            borderRadius: '24px',
            padding: '2rem',
            border: '2px solid rgba(239,68,68,0.1)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
            backdropFilter: 'blur(10px)'
          }}>
            <label style={{
              display: 'block',
              marginBottom: '1rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#1e293b',
              textAlign: 'center'
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
                border: '2px solid rgba(239,68,68,0.2)',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: '500',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ef4444'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(239,68,68,0.2)'}
            />
            {suggestions.length > 0 && (
              <div style={{
                marginTop: '1rem',
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '16px',
                border: '2px solid rgba(239,68,68,0.1)',
                maxHeight: '300px',
                overflowY: 'auto',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
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
                      borderBottom: '1px solid rgba(239,68,68,0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(239,68,68,0.05), rgba(248,250,252,0.5))';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                    }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '2px solid white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: '700', color: '#1e293b', fontSize: '1rem'}}>
                        {item.reference}
                      </div>
                      <div style={{color: '#64748b', fontSize: '0.9rem', fontWeight: '500'}}>
                        {item.name}
                      </div>
                      <div style={{color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', marginTop: '0.25rem'}}>
                        Disponible: {item.availableQuantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Référence */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#1e293b'
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
              border: '2px solid rgba(148,163,184,0.3)',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '500',
              background: 'rgba(255,255,255,0.9)',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#ef4444'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
          />
        </div>

        {/* Nom du produit */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#1e293b'
          }}>🏷️ Nom du produit</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nom du produit"
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              border: '2px solid rgba(148,163,184,0.3)',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '500',
              background: 'rgba(255,255,255,0.9)',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#ef4444'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
          />
        </div>

        {/* Quantité */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#1e293b'
          }}>📦 Quantité</label>
          <input
            name="quantity"
            type="number"
            min="1"
            max={selectedPlant ? selectedPlant.availableQuantity : undefined}
            value={formData.quantity}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              border: '2px solid rgba(148,163,184,0.3)',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '500',
              background: 'rgba(255,255,255,0.9)',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#ef4444'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
          />
          {selectedPlant && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              📊 Disponible : {selectedPlant.availableQuantity}
            </div>
          )}
        </div>

        {/* Date de sortie définitive */}
        {variant === 'definitive' && (
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#1e293b'
            }}>📅 Date de sortie *</label>
            <input
              name="exitDate"
              type="date"
              value={formData.exitDate}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: '2px solid rgba(148,163,184,0.3)',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: '500',
                background: 'rgba(255,255,255,0.9)',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ef4444'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
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
                color: '#1e293b'
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
                  border: '2px solid rgba(148,163,184,0.3)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  background: 'rgba(255,255,255,0.9)',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700',
                color: '#1e293b'
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
                  border: '2px solid rgba(148,163,184,0.3)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  background: 'rgba(255,255,255,0.9)',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
              />
            </div>
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700',
                color: '#1e293b'
              }}>🎯 Projet / Événement *</label>
              <input
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                placeholder="Nom du projet ou événement"
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  border: '2px solid rgba(148,163,184,0.3)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  background: 'rgba(255,255,255,0.9)',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
              />
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
            color: '#1e293b'
          }}>📝 Note</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Note optionnelle..."
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              border: '2px solid rgba(148,163,184,0.3)',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '500',
              background: 'rgba(255,255,255,0.9)',
              transition: 'all 0.3s ease',
              outline: 'none',
              minHeight: '120px',
              resize: 'vertical'
            }}
            onFocus={(e) => e.target.style.borderColor = '#ef4444'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
          />
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div style={{
            gridColumn: '1 / -1',
            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            border: '2px solid #fca5a5',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            color: '#dc2626',
            fontWeight: '600',
            boxShadow: '0 8px 25px rgba(239, 68, 68, 0.15)'
          }}>
            ⚠️ {error}
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
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 15px 35px rgba(239,68,68,0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 20px 40px rgba(239,68,68,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 15px 35px rgba(239,68,68,0.3)';
            }}
          >
            {variant === 'definitive' ? '🗑️ Sortie Définitive' : '📤 Sortie Locative'}
          </button>
        </div>
      </form>
    </div>
  )
}
