import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createMovement, getProjects, getStockItems, getConcepteurs } from '../api/clientApi';
import api, { handleApiError } from '../api/axios';
import { useTheme } from '../contexts/ThemeContext';
import './EntryForm.css';

export default function EntryForm({ onSaved, currentUser }) {
  const { isDark, theme } = useTheme();

  const initialData = {
    type: 'entrée',
    reference: '',
    name: '',
    quantity: 1,
    price: 0,
    image: '',
    coef: 1,
    eventDate: new Date().toISOString().substr(0, 10),
    project: '',
    concepteur: '',
    note: '',
    createdBy: currentUser,
  };

  const [formData, setFormData] = useState(initialData);
  const [projects, setProjects] = useState([]);
  const [concepteurs, setConcepteurs] = useState([]);
  const [stockQuery, setStockQuery] = useState('');
  const [stockOptions, setStockOptions] = useState([]);
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // États pour le mode multiple
  const [isMultipleMode, setIsMultipleMode] = useState(false);
  const [multipleItems, setMultipleItems] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Recherche externe par code (Nieuwkoop)
  const [extCode, setExtCode] = useState('');
  const [extItem, setExtItem] = useState(null);
  const [extPrice, setExtPrice] = useState(null);
  const [extImageUrl, setExtImageUrl] = useState('');
  const [extLoading, setExtLoading] = useState(false);
  const [extError, setExtError] = useState('');

  // Charger projets et concepteurs
  useEffect(() => {
    Promise.all([
      getProjects(),
      getConcepteurs()
    ])
      .then(([projectsData, concepteursData]) => {
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setConcepteurs(Array.isArray(concepteursData) ? concepteursData : []);
      })
      .catch(() => setError('Impossible de charger les données.'));
  }, []);

  // Recherche stock pour saisie manuelle
  useEffect(() => {
    if (stockQuery.length < 2) {
      setStockOptions([]);
      return;
    }
    let cancelled = false;
    getStockItems(stockQuery)
      .then(items => { if (!cancelled) setStockOptions(items); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [stockQuery]);

  // Recherche externe par code
  const handleExtSearch = async () => {
    if (!extCode) return;
    setExtError('');
    setExtLoading(true);
    setExtImageUrl(`/api/nieuwkoop/items/${extCode}/image`);
    
    try {
      const [detailsResponse, pricesResponse] = await Promise.all([
        api.get(`/nieuwkoop/items/${extCode}/details`),
        api.get(`/nieuwkoop/prices/${extCode}`)
      ]);
      
      setExtItem(detailsResponse.data.item);
      setExtPrice(pricesResponse.data.price);
    } catch (err) {
      console.error('Erreur recherche externe:', err);
      const errorInfo = handleApiError(err);
      setExtError(errorInfo.message);
      setExtItem(null);
      setExtPrice(null);
    } finally {
      setExtLoading(false);
    }
  };

  // Ajouter au stock ET créer un mouvement d'entrée
  const handleExtAddToStock = async () => {
    if (!extItem || !extPrice) return;
    const payload = {
      reference: extItem.Itemcode,
      name: extItem.ItemDescription_EN || extItem.ItemDescription_FR,
      height: extItem.Height,
      diameter: extItem.DiameterCulturePot || extItem.PotSize || extItem.Diameter || extItem.Opening || 0,
      price: extPrice.PriceNett,
      image: extImageUrl,
    };
    
    try {
      // 1) On ajoute l'article au stock
      const response = await api.post('/nieuwkoop/stock', payload);
      const newItem = response.data;
      
      // On pré-remplit le formulaire d'entrée
      setStockOptions(opts => [newItem, ...opts]);
      setSelectedStockItem(newItem);
      setFormData(fd => ({
        ...fd,
        reference: newItem.reference,
        name:      newItem.name,
        price:     newItem.price,
      }));
      
      // 2) On crée aussi le mouvement d'entrée
      try {
        await createMovement({
          type:      'entrée',
          reference: newItem.reference,
          name:      newItem.name,
          quantity:  1,
          price:     newItem.price,
          coef:      1,
          eventDate: new Date().toISOString().substr(0, 10),
          project:   '',
          note:      '',
          createdBy: currentUser,
        });
        onSaved();  // rafraîchit EntryList juste en dessous
      } catch (err) {
        console.error('Erreur création entrée :', err);
      }
      
      // Reset recherche externe
      setExtCode('');
      setExtItem(null);
      setExtPrice(null);
      setExtImageUrl('');
    } catch (err) {
      console.error('Erreur ajout au stock:', err);
      const errorInfo = handleApiError(err);
      setExtError(errorInfo.message);
    }
  };

  const handleChange = e => {
    const { name, value: raw } = e.target;
    let value = raw;
    if (name === 'stockSearch') {
      setStockQuery(value);
      const match = stockOptions.find(i => `${i.reference} — ${i.name}` === value);
      if (match) {
        if (isMultipleMode) {
          // En mode multiple, ajouter à la liste
          const newItem = {
            id: Date.now() + Math.random(),
            reference: match.reference,
            name: match.name,
            quantity: 1,
            price: match.price || 0,
            coef: 1,
            image: match.image || '',
            availableQuantity: match.availableQuantity,
            isNewPlant: match.isNewPlant,
            height: match.height,
            diameter: match.diameter,
            category: match.category
          };
          setMultipleItems([...multipleItems, newItem]);
          setStockQuery('');
          setStockOptions([]);
        } else {
          setSelectedStockItem(match);
          setFormData(fd => ({
            ...fd,
            reference: match.reference,
            name:      match.name,
            price:     match.price ?? fd.price,
            image:     match.image  || '',
          }));
        }
      }
      return;
    }
    if (name === 'quantity') value = Math.max(1, parseInt(value, 10) || 1);
    if (name === 'coef')      value = parseFloat(value);

    setFormData(fd => ({ ...fd, [name]: value }));
    setError('');
    if (['reference','name','price'].includes(name)) setSelectedStockItem(null);
  };

  // Gérer le changement de quantité pour un item en mode multiple
  const handleMultipleItemQuantityChange = (itemId, newQuantity) => {
    setMultipleItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Number(newQuantity) }
          : item
      )
    )
  };

  // Gérer le changement de coefficient pour un item en mode multiple
  const handleMultipleItemCoefChange = (itemId, newCoef) => {
    setMultipleItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, coef: Number(newCoef) }
          : item
      )
    )
  };

  // Supprimer un item en mode multiple
  const handleRemoveMultipleItem = (itemId) => {
    setMultipleItems(items => items.filter(item => item.id !== itemId));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (isMultipleMode) {
      // Mode multiple
      if (multipleItems.length === 0) {
        setError('Veuillez ajouter au moins un article.');
        setLoading(false);
        return;
      }

      // Validation du projet (obligatoire pour les entrées)
      if (!formData.project.trim()) {
        setError('Le projet/événement est requis.');
        setLoading(false);
        return;
      }

      // Créer toutes les entrées
      const errors = [];
      const successes = [];
      
      for (const item of multipleItems) {
        const payload = {
          type: 'entrée',
          reference: item.reference,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          coef: item.coef,
          eventDate: formData.eventDate,
          project: formData.project,
          concepteur: formData.concepteur,
          note: formData.note,
          image: item.image,
          createdBy: currentUser,
          isNewPlant: item.isNewPlant || false,
          height: item.height || 0,
          diameter: item.diameter || 0,
          category: item.category || 'autre'
        };

        try {
          await createMovement(payload);
          successes.push(item.reference);
        } catch (error) {
          errors.push(`${item.reference}: ${error.response?.data?.error || 'Erreur inconnue'}`);
        }
      }

      if (errors.length > 0) {
        setError(`Erreurs:\n${errors.join('\n')}`);
      }
      
      if (successes.length > 0) {
        setSuccessMessage(`✅ ${successes.length} entrée(s) créée(s) avec succès!`);
        setMultipleItems([]);
        onSaved();
        
        // Réinitialiser le formulaire après succès
        setTimeout(() => {
          setSuccessMessage('');
          setFormData({
            ...initialData,
            project: formData.project, // Garder le projet
            concepteur: formData.concepteur, // Garder le concepteur
          });
        }, 3000);
      }

    } else {
      // Mode simple (code existant)
      try {
        await createMovement(formData);
        onSaved(); // rafraîchit EntryList
        setFormData(initialData);
        setStockQuery('');
        setStockOptions([]);
        setSelectedStockItem(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'var(--color-bg-secondary, rgba(255, 255, 255, 0.35))',
      borderRadius: '32px',
      padding: '3rem',
      boxShadow: isDark 
        ? '0 20px 40px -5px rgba(0, 0, 0, 0.5), 0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
        : '0 20px 40px -5px rgba(0, 0, 0, 0.15), 0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      color: isDark ? '#ffffff' : 'inherit',
      border: '1px solid var(--color-border-light, rgba(255, 255, 255, 0.3))',
      backdropFilter: 'blur(16px)',
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
        right: '-50%',
        width: '100%',
        height: '100%',
        background: 'var(--color-primary, #0d9488)',
        opacity: '0.08',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      
      {error && (
        <div style={{
          background: 'var(--color-danger, #ef4444)',
          border: '2px solid var(--color-danger, #ef4444)',
          borderRadius: '16px',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          color: 'white',
          fontWeight: '600',
          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.25)'
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
          background: `linear-gradient(135deg, var(--color-primary, #0d9488), var(--color-accent, #14b8a6))`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          ✨ Nouvelle entrée
        </h2>
        <p style={{
          color: 'var(--color-text-secondary, #64748b)',
          fontSize: '1.1rem',
          fontWeight: '500',
          margin: 0
        }}>
          Ajoutez facilement de nouveaux articles à votre inventaire
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
              ? 'linear-gradient(135deg, var(--color-primary, #0d9488), var(--color-accent, #14b8a6))' 
              : 'var(--color-surface, rgba(255, 255, 255, 0.6))',
            border: isMultipleMode 
              ? '2px solid var(--color-primary, #0d9488)' 
              : '2px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isMultipleMode 
              ? '0 8px 25px rgba(13, 148, 136, 0.35)' 
              : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            transform: isMultipleMode ? 'scale(1.05)' : 'scale(1)',
            backdropFilter: 'blur(12px)'
          }}>
            <input
              type="checkbox"
              checked={isMultipleMode}
              onChange={(e) => {
                setIsMultipleMode(e.target.checked);
                if (!e.target.checked) {
                  setMultipleItems([]);
                }
              }}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                accentColor: 'var(--color-primary, #0d9488)'
              }}
            />
            <span style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: isMultipleMode ? 'white' : 'var(--color-text-primary, #0f172a)'
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
        {/* Recherche externe par code */}
        <div style={{gridColumn: '1 / -1', marginBottom: '1rem'}}>
          <div style={{
            background: 'var(--color-surface, rgba(255, 255, 255, 0.6))',
            borderRadius: '24px',
            padding: '2rem',
            border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(12px)'
          }}>
            <label style={{
              display: 'block',
              marginBottom: '1rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: 'var(--color-text-primary, #0f172a)',
              textAlign: 'center',
              background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(5px)'
            }}>
              🔍 Recherche produit Nieuwkoop
            </label>
            <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-end'}}>
              <input
                type="text"
                placeholder="Entrez le code produit Nieuwkoop..."
                value={extCode}
                onChange={e => setExtCode(e.target.value)}
                style={{
                  flex: 1,
                  padding: '1rem 1.5rem',
                  border: '2px solid var(--color-border, #e2e8f0)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  background: 'var(--color-surface, #ffffff)',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  color: 'var(--color-text-primary, #0f172a)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary, #0d9488)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
              />
              <button
                type="button"
                onClick={handleExtSearch}
                disabled={extLoading}
                style={{
                  background: extLoading ? '#94a3b8' : `linear-gradient(135deg, var(--color-primary, #0d9488), var(--color-accent, #14b8a6))`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: extLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: extLoading ? '0 4px 12px rgba(148, 163, 184, 0.25)' : '0 8px 25px rgba(13, 148, 136, 0.35)',
                  transform: extLoading ? 'scale(0.95)' : 'scale(1)'
                }}
              >
                {extLoading ? '⏳ Recherche...' : '🚀 Rechercher'}
              </button>
            </div>
            {extError && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'var(--color-danger, #ef4444)',
                border: '2px solid var(--color-danger, #ef4444)',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '600'
              }}>
                {extError}
              </div>
            )}
          </div>
          {extItem && (
            <div style={{
              display: 'flex', 
              gap: '2rem', 
              marginTop: '2rem', 
              padding: '2rem', 
              background: 'rgba(34, 197, 94, 0.1)', 
              borderRadius: '24px', 
              border: `3px solid var(--color-primary, #0d9488)`, 
              boxShadow: '0 10px 25px rgba(34, 197, 94, 0.25)',
              backdropFilter: 'blur(12px)'
            }}>
              <div style={{flexShrink: 0}}>
                {extImageUrl && (
                  <img 
                    src={extImageUrl} 
                    alt={extItem.Itemcode} 
                    style={{
                      width: '150px', 
                      height: '150px', 
                      objectFit: 'cover', 
                      borderRadius: '20px', 
                      boxShadow: 'var(--shadow-lg)', 
                      border: '4px solid var(--color-bg-primary)',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                )}
              </div>
              <div style={{flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignContent: 'start'}}>
                <div style={{
                  padding: '1.25rem', 
                  background: 'var(--color-surface, rgba(255, 255, 255, 0.9))', 
                  borderRadius: '16px', 
                  border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.5))',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  backdropFilter: 'blur(8px)'
                }}>
                  <strong style={{
                    color: 'var(--color-accent, #14b8a6)', 
                    fontSize: '0.75rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px', 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '800'
                  }}>📝 Description</strong>
                  <p style={{margin: 0, fontWeight: '600', fontSize: '1rem', color: 'var(--color-text-primary, #0f172a)', lineHeight: '1.4'}}>{extItem.ItemDescription_EN || extItem.ItemDescription_FR}</p>
                </div>
                <div style={{
                  padding: '1.25rem', 
                  background: 'var(--color-surface, rgba(255, 255, 255, 0.9))', 
                  borderRadius: '16px', 
                  border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.5))',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  backdropFilter: 'blur(8px)'
                }}>
                  <strong style={{
                    color: 'var(--color-text-accent)', 
                    fontSize: '0.75rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px', 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '800'
                  }}>📏 Hauteur</strong>
                  <p style={{margin: 0, fontWeight: '700', fontSize: '1.2rem', color: 'var(--color-primary, #0d9488)'}}>{extItem.Height} cm</p>
                </div>
                <div style={{
                  padding: '1.25rem', 
                  background: 'var(--color-surface, rgba(255, 255, 255, 0.9))', 
                  borderRadius: '16px', 
                  border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.5))',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  backdropFilter: 'blur(8px)'
                }}>
                  <strong style={{
                    color: 'var(--color-text-accent)', 
                    fontSize: '0.75rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px', 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '800'
                  }}>⭕ Diamètre</strong>
                  <p style={{margin: 0, fontWeight: '700', fontSize: '1.2rem', color: 'var(--color-primary, #0d9488)'}}>{extItem.DiameterCulturePot || extItem.PotSize || extItem.Diameter || extItem.Opening || 0} cm</p>
                </div>
                <div style={{
                  padding: '1.25rem', 
                  background: `linear-gradient(135deg, var(--color-primary, #0d9488), var(--color-accent, #14b8a6))`, 
                  borderRadius: '16px', 
                  color: 'white', 
                  textAlign: 'center',
                  boxShadow: '0 8px 25px rgba(13, 148, 136, 0.35)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <strong style={{fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem', opacity: 0.9}}>💰 Prix</strong>
                  <strong style={{fontSize: '1.8rem', display: 'block', fontWeight: '900'}}>{extPrice?.PriceNett?.toFixed(2)} €</strong>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <button
                  type="button"
                  onClick={handleExtAddToStock}
                  style={{
                    background: `linear-gradient(135deg, var(--color-primary, #0d9488), var(--color-accent, #14b8a6))`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '1.5rem 2.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(13, 148, 136, 0.35)',
                    transition: 'all 0.3s ease',
                    minWidth: '200px',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = '0 12px 35px rgba(13, 148, 136, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(13, 148, 136, 0.35)';
                  }}
                >
                  ✨ Ajouter au stock
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Barre de recherche de plante depuis le stock */}
        <div style={{gridColumn: '1 / -1', marginBottom: '1rem'}}>
          <div style={{
            background: 'var(--color-surface, rgba(255, 255, 255, 0.6))',
            borderRadius: '24px',
            padding: '2rem',
            border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(12px)'
          }}>
            <label style={{
              display: 'block',
              marginBottom: '1rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: 'var(--color-text-primary, #0f172a)',
              textAlign: 'center',
              background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(5px)'
            }}>
              🔍 Rechercher une plante depuis le stock
            </label>
            <input
              name="search"
              type="text"
              placeholder="Tapez au moins 2 caractères pour rechercher..."
              value={stockQuery}
              onChange={(e) => setStockQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: '2px solid var(--color-border, #e2e8f0)',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: '500',
                background: 'var(--color-surface, #ffffff)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
                outline: 'none',
                color: 'var(--color-text-primary, #0f172a)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary, #0d9488)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
            />
            {stockOptions.length > 0 && (
              <div style={{
                marginTop: '1rem',
                background: 'var(--color-surface, #ffffff)',
                borderRadius: '16px',
                border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.5))',
                maxHeight: '300px',
                overflowY: 'auto',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              }}>
                {stockOptions.map(item => (
                  <div
                    key={item._id}
                    onClick={() => {
                      if (isMultipleMode) {
                        // En mode multiple, ajouter à la liste
                        const newItem = {
                          id: Date.now() + Math.random(),
                          reference: item.reference,
                          name: item.name,
                          quantity: 1,
                          price: item.price || 0,
                          coef: 1,
                          image: item.image || '',
                          availableQuantity: item.stock?.availableQuantity || item.availableQuantity || 0,
                          isNewPlant: item.isNewPlant,
                          height: item.height,
                          diameter: item.diameter,
                          category: item.category
                        };
                        setMultipleItems([...multipleItems, newItem]);
                        setStockQuery('');
                        setStockOptions([]);
                      } else {
                        setSelectedStockItem(item)
                        setFormData(fd => ({
                          ...fd,
                          reference: item.reference,
                          name: item.name,
                          price: item.price || 0,
                          image: item.image || ''
                        }))
                        setStockQuery('')
                        setStockOptions([])
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--color-border-light, rgba(255, 255, 255, 0.3))',
                      transition: 'all 0.3s ease',
                      borderLeft: item.isNewPlant ? '4px solid var(--color-primary)' : '4px solid var(--color-secondary)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--color-bg-primary, rgba(248, 250, 252, 0.8))';
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
                        <div style={{fontWeight: '700', color: 'var(--color-text-primary, #0f172a)', fontSize: '1rem'}}>
                          {item.reference}
                        </div>
                        <div style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          background: `linear-gradient(135deg, var(--color-secondary, #06b6d4), var(--color-accent, #14b8a6))`,
                          color: 'white'
                        }}>
                          📦 En stock
                        </div>
                      </div>
                      <div style={{color: 'var(--color-text-secondary, #64748b)', fontSize: '0.9rem', fontWeight: '500'}}>
                        {item.name}
                      </div>

                      {/* DEBUG: Afficher les données brutes */}
                      {console.log('🌱 [ENTRY-FORM-DIMENSIONS]', item.name, {
                        height: item.height,
                        diameter: item.diameter,
                        width: item.width,
                        length: item.length,
                        dimensions: item.dimensions
                      })}
                      <div style={{
                        color: (item.stock?.availableQuantity || item.availableQuantity || 0) > 0 ? 'var(--color-success, #22c55e)' : 'var(--color-text-muted, #9ca3af)', 
                        fontSize: '0.8rem', 
                        fontWeight: '600', 
                        marginTop: '0.25rem'
                      }}>
                        Disponible: {item.stock?.availableQuantity || item.availableQuantity || 0}
                      </div>
                      {/* Dimensions de la plante */}
                      <div style={{
                        color: 'var(--color-text-secondary, #64748b)',
                        fontSize: '0.8rem',
                        marginTop: '0.375rem',
                        display: 'flex',
                        gap: '0.625rem',
                        flexWrap: 'wrap'
                      }}>
                        {item.height && Number(item.height) > 0 && (
                          <span style={{
                            background: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                            color: '#10b981',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            📏 H: {item.height}cm
                          </span>
                        )}
                        {item.diameter && Number(item.diameter) > 0 && (
                          <span style={{
                            background: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                            color: '#6366f1',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            🔵 Ø: {item.diameter}cm
                          </span>
                        )}
                        {(item.width !== undefined && item.width !== null) && (
                          <span style={{
                            background: isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                            color: '#f59e0b',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            ↔️ L: {item.width || 0}cm
                          </span>
                        )}
                        {(item.length !== undefined && item.length !== null) && (
                          <span style={{
                            background: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                            color: '#a855f7',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            ↕️ P: {item.length || 0}cm
                          </span>
                        )}
                      </div>

                      {/* Prix en dessous des dimensions */}
                      {item.price > 0 && (
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#10b981',
                          fontWeight: '600',
                          marginTop: '0.25rem'
                        }}>
                          💰 {item.price}€
                        </div>
                      )}
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
            background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(20, 184, 166, 0.1))',
            borderRadius: '24px',
            padding: '1.5rem',
            border: '2px solid var(--color-primary, #0d9488)',
            boxShadow: '0 8px 25px rgba(13, 148, 136, 0.35)',
            backdropFilter: 'blur(12px)'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: 'var(--color-text-primary, #0f172a)',
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
                color: 'var(--color-primary, #0d9488)',
                background: 'var(--color-surface, rgba(255, 255, 255, 0.8))',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                border: '1px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
                backdropFilter: 'blur(8px)'
              }}>
                💰 Total: {multipleItems.reduce((sum, item) => sum + (item.price * item.quantity * item.coef), 0).toFixed(2)}€
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
                    background: 'var(--color-surface, rgba(255, 255, 255, 0.9))',
                    borderRadius: '16px',
                    border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.5))',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    animation: 'slideIn 0.3s ease-out',
                    position: 'relative',
                    overflow: 'hidden',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: 'linear-gradient(135deg, var(--color-primary, #0d9488), var(--color-accent, #14b8a6))',
                    borderRadius: '4px 0 0 4px'
                  }} />
                  
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: 'var(--color-primary, #0d9488)',
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
                      color: 'var(--color-text-primary, #0f172a)',
                      fontSize: '1rem'
                    }}>
                      {item.reference}
                    </div>
                    <div style={{
                      color: 'var(--color-text-secondary, #64748b)',
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
                          color: 'var(--color-success, #22c55e)',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          💰 {item.price.toFixed(2)}€
                        </span>
                      )}
                      <span style={{
                        color: 'var(--color-primary, #0d9488)',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        Total: {(item.price * item.quantity * item.coef).toFixed(2)}€
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
                      color: 'var(--color-text-secondary, #64748b)',
                      background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      backdropFilter: 'blur(5px)'
                    }}>Qté:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleMultipleItemQuantityChange(item.id, e.target.value)}
                      style={{
                        width: '80px',
                        padding: '0.5rem',
                        border: '2px solid var(--color-border, #e2e8f0)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        textAlign: 'center',
                        background: 'var(--color-surface, #ffffff)',
                        color: 'var(--color-text-primary, #0f172a)'
                      }}
                    />
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <label style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: 'var(--color-text-secondary, #64748b)',
                      background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      backdropFilter: 'blur(5px)'
                    }}>Coef:</label>
                    <select
                      value={item.coef}
                      onChange={(e) => handleMultipleItemCoefChange(item.id, e.target.value)}
                      style={{
                        width: '80px',
                        padding: '0.5rem',
                        border: '2px solid var(--color-border, #e2e8f0)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        textAlign: 'center',
                        background: 'var(--color-surface, #ffffff)',
                        color: 'var(--color-text-primary, #0f172a)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value={1}>1</option>
                      <option value={0.5}>0.5</option>
                      <option value={0.25}>0.25</option>
                    </select>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveMultipleItem(item.id)}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
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
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
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
        <div style={{
          background: 'var(--color-surface, rgba(255, 255, 255, 0.6))',
          borderRadius: '24px',
          padding: '2rem',
          border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(12px)'
        }}>
          <label htmlFor="reference" style={{
            display: 'block',
            marginBottom: '1rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: 'var(--color-text-primary, #0f172a)',
            background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            backdropFilter: 'blur(5px)'
          }}>📋 Référence *</label>
          <input
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="Référence du produit"
            required
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              border: '2px solid var(--color-border, #e2e8f0)',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '500',
              background: 'var(--color-surface, #ffffff)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              outline: 'none',
              color: 'var(--color-text-primary, #0f172a)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary, #0d9488)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
          />
          <div style={{
            height: '1px',
            background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.2))',
            marginTop: '1rem'
          }} />
        </div>

      {/* Nom du produit */}
      <div style={{
        background: 'var(--color-surface, rgba(255, 255, 255, 0.6))',
        borderRadius: '24px',
        padding: '2rem',
        border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)'
      }}>
        <label htmlFor="name" style={{
          display: 'block',
          marginBottom: '1rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: 'var(--color-text-primary, #0f172a)',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          backdropFilter: 'blur(5px)'
        }}>🏷️ Nom du produit {selectedStockItem ? '' : '*'}</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nom du produit"
          required={!selectedStockItem}
          disabled={!!selectedStockItem}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid var(--color-border, #e2e8f0)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: selectedStockItem ? 'var(--color-border, #e2e8f0)' : 'var(--color-surface, #ffffff)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            outline: 'none',
            cursor: selectedStockItem ? 'not-allowed' : 'text',
            color: selectedStockItem ? 'var(--color-text-muted, #9ca3af)' : 'var(--color-text-primary, #0f172a)'
          }}
          onFocus={(e) => !selectedStockItem && (e.target.style.borderColor = 'var(--color-primary, #0d9488)')}
          onBlur={(e) => !selectedStockItem && (e.target.style.borderColor = 'var(--color-border, #e2e8f0)')}
        />
        <div style={{
          height: '1px',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.2))',
          marginTop: '1rem'
        }} />
      </div>

      {/* Quantité */}
      <div style={{
        background: 'var(--color-surface, rgba(255, 255, 255, 0.6))',
        borderRadius: '24px',
        padding: '2rem',
        border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)'
      }}>
        <label htmlFor="quantity" style={{
          display: 'block',
          marginBottom: '1rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: 'var(--color-text-primary, #0f172a)',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          backdropFilter: 'blur(5px)'
        }}>📦 Quantité</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid var(--color-border, #e2e8f0)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'var(--color-surface, #ffffff)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            outline: 'none',
            color: 'var(--color-text-primary, #0f172a)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary, #0d9488)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
        />
        <div style={{
          height: '1px',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.2))',
          marginTop: '1rem'
        }} />
      </div>

      {/* Prix unitaire */}
      <div style={{
        background: 'var(--color-surface, rgba(255, 255, 255, 0.6))',
        borderRadius: '24px',
        padding: '2rem',
        border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)'
      }}>
        <label htmlFor="price" style={{
          display: 'block',
          marginBottom: '1rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: 'var(--color-text-primary, #0f172a)',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          backdropFilter: 'blur(5px)'
        }}>💰 Prix unitaire</label>
        <input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          readOnly
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid var(--color-border, #e2e8f0)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'var(--color-border, #e2e8f0)',
            backdropFilter: 'blur(8px)',
            cursor: 'not-allowed',
            color: 'var(--color-text-muted, #9ca3af)'
          }}
        />
        <div style={{
          height: '1px',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.2))',
          marginTop: '1rem'
        }} />
      </div>

      {/* Coefficient */}
      <div style={{
        background: 'var(--color-surface, rgba(255, 255, 255, 0.6))',
        borderRadius: '24px',
        padding: '2rem',
        border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)'
      }}>
        <label htmlFor="coef" style={{
          display: 'block',
          marginBottom: '1rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: 'var(--color-text-primary, #0f172a)',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          backdropFilter: 'blur(5px)'
        }}>⚖️ Coefficient</label>
        <select
          id="coef"
          name="coef"
          value={formData.coef}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid var(--color-border, #e2e8f0)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'var(--color-surface, #ffffff)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            outline: 'none',
            color: 'var(--color-text-primary, #0f172a)',
            cursor: 'pointer'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary, #0d9488)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
        >
          <option value={1}>1</option>
          <option value={0.5}>0.5</option>
          <option value={0.25}>0.25</option>
        </select>
        <div style={{
          height: '1px',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.2))',
          marginTop: '1rem'
        }} />
      </div>

      {/* Date */}
      <div style={{
        background: 'var(--color-surface, rgba(255, 255, 255, 0.6))',
        borderRadius: '24px',
        padding: '2rem',
        border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)'
      }}>
        <label htmlFor="eventDate" style={{
          display: 'block',
          marginBottom: '1rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: 'var(--color-text-primary, #0f172a)',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          backdropFilter: 'blur(5px)'
        }}>📅 Date</label>
        <input
          id="eventDate"
          name="eventDate"
          type="date"
          value={formData.eventDate}
          onChange={handleChange}
          max={new Date().toISOString().substr(0, 10)}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid var(--color-border, #e2e8f0)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'var(--color-surface, #ffffff)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            outline: 'none',
            color: 'var(--color-text-primary, #0f172a)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary, #0d9488)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
        />
        <div style={{
          height: '1px',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.2))',
          marginTop: '1rem'
        }} />
      </div>

      {/* Projet */}
      <div style={{
        background: 'var(--color-surface, rgba(255, 255, 255, 0.6))',
        borderRadius: '24px',
        padding: '2rem',
        border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)'
      }}>
        <label htmlFor="project" style={{
          display: 'block',
          marginBottom: '1rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: 'var(--color-text-primary, #0f172a)',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          backdropFilter: 'blur(5px)'
        }}>🎯 Projet / Événement *</label>
        <select
          id="project"
          name="project"
          value={formData.project}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid var(--color-border, #e2e8f0)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'var(--color-surface, #ffffff)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            outline: 'none',
            color: 'var(--color-text-primary, #0f172a)',
            cursor: 'pointer'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary, #0d9488)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
        >
          <option value="">-- Sélectionnez un projet --</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>
              {p.client?.name || p.client || p.title || 'Projet sans titre'}
            </option>
          ))}
        </select>
        <div style={{
          height: '1px',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.2))',
          marginTop: '1rem'
        }} />
      </div>

      {/* Concepteur */}
      <div style={{
        background: 'var(--color-surface, rgba(255, 255, 255, 0.6))',
        borderRadius: '24px',
        padding: '2rem',
        border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)'
      }}>
        <label htmlFor="concepteur" style={{
          display: 'block',
          marginBottom: '1rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: 'var(--color-text-primary, #0f172a)',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          backdropFilter: 'blur(5px)'
        }}>👨‍🎨 Concepteur</label>
        <select
          id="concepteur"
          name="concepteur"
          value={formData.concepteur}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid var(--color-border, #e2e8f0)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'var(--color-surface, #ffffff)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            outline: 'none',
            color: 'var(--color-text-primary, #0f172a)',
            cursor: 'pointer'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary, #0d9488)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
        >
          <option value="">-- Sélectionnez un concepteur --</option>
          {concepteurs.map(c => (
            <option key={c._id} value={c._id}>
              {c.nomComplet || c.nom}
            </option>
          ))}
        </select>
        <div style={{
          height: '1px',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.2))',
          marginTop: '1rem'
        }} />
      </div>

      {/* Note */}
      <div style={{
        gridColumn: '1 / -1',
        background: 'var(--color-surface, rgba(255, 255, 255, 0.6))',
        borderRadius: '24px',
        padding: '2rem',
        border: '2px solid var(--color-border-light, rgba(255, 255, 255, 0.4))',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)'
      }}>
        <label htmlFor="note" style={{
          display: 'block',
          marginBottom: '1rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: 'var(--color-text-primary, #0f172a)',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.1))',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          backdropFilter: 'blur(5px)'
        }}>📝 Note</label>
        <textarea
          id="note"
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="Note optionnelle..."
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid var(--color-border, #e2e8f0)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'var(--color-surface, #ffffff)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            outline: 'none',
            color: 'var(--color-text-primary, #0f172a)',
            minHeight: '120px',
            resize: 'vertical'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary, #0d9488)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border, #e2e8f0)'}
        />
        <div style={{
          height: '1px',
          background: 'var(--color-bg-muted, rgba(100, 116, 139, 0.2))',
          marginTop: '1rem'
        }} />
      </div>
          </>
        )}

        {/* Message de succès */}
        {successMessage && (
          <div style={{
            gridColumn: '1 / -1',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            border: '2px solid #22c55e',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            color: 'white',
            fontWeight: '600',
            boxShadow: '0 8px 25px rgba(34, 197, 94, 0.35)',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            {successMessage}
          </div>
        )}

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
            background: loading ? '#94a3b8' : `linear-gradient(135deg, var(--color-primary, #0d9488), var(--color-accent, #14b8a6))`,
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: loading ? '0 4px 12px rgba(148, 163, 184, 0.25)' : '0 8px 25px rgba(13, 148, 136, 0.35)',
            transform: loading ? 'scale(0.98)' : 'scale(1)'
          }}
          onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px) scale(1.02)')}
          onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0) scale(1)')}
        >
          {loading 
            ? '⏳ Création en cours...' 
            : isMultipleMode 
              ? `🚀 Créer ${multipleItems.length} entrée${multipleItems.length > 1 ? 's' : ''}`
              : '✨ Ajouter Entrée'
          }
        </button>
      </div>

        <input type="hidden" name="type" value={formData.type} />
        <input type="hidden" name="createdBy" value={formData.createdBy} />
      </form>
      </div>
    </div>
  );
}

EntryForm.propTypes = {
  onSaved:     PropTypes.func.isRequired,
  currentUser: PropTypes.string.isRequired,
};
