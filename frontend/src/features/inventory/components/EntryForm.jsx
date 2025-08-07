import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createMovement, getProjects, getStockItems } from '../../../shared/api/domains/inventory/clientApi';
import api, { handleApiError } from '../../../api/axios';
import './EntryForm.css';

export default function EntryForm({ onSaved, currentUser }) {
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
    note: '',
    createdBy: currentUser,
  };

  const [formData, setFormData] = useState(initialData);
  const [projects, setProjects] = useState([]);
  const [stockQuery, setStockQuery] = useState('');
  const [stockOptions, setStockOptions] = useState([]);
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Recherche externe par code (Nieuwkoop)
  const [extCode, setExtCode] = useState('');
  const [extItem, setExtItem] = useState(null);
  const [extPrice, setExtPrice] = useState(null);
  const [extImageUrl, setExtImageUrl] = useState('');
  const [extLoading, setExtLoading] = useState(false);
  const [extError, setExtError] = useState('');

  // Charger projets
  useEffect(() => {
    getProjects()
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setError('Impossible de charger la liste des projets.'));
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
      // Paralléliser les deux appels
      const [detailsResponse, pricesResponse] = await Promise.allSettled([
        api.get(`/nieuwkoop/items/${extCode}/details`),
        api.get(`/nieuwkoop/prices/${extCode}`)
      ]);

      // Traiter les résultats
      if (detailsResponse.status === 'fulfilled') {
        setExtItem(detailsResponse.value.data.item);
      } else {
        setExtItem(null);
      }

      if (pricesResponse.status === 'fulfilled') {
        setExtPrice(pricesResponse.value.data.price);
      } else {
        setExtPrice(null);
      }
    } catch (error) {
      const errorInfo = handleApiError(error);
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
      diameter: extItem.DiameterCulturePot || extItem.PotSize,
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
        onSaved(); // rafraîchit EntryList juste en dessous
      } catch (err) {
        console.error('Erreur création entrée :', err);
      }
      
      // Reset recherche externe
      setExtCode('');
      setExtItem(null);
      setExtPrice(null);
      setExtImageUrl('');
    } catch (err) {
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
        setSelectedStockItem(match);
        setFormData(fd => ({
          ...fd,
          reference: match.reference,
          name:      match.name,
          price:     match.price ?? fd.price,
          image:     match.image  || '',
        }));
      }
      return;
    }
    if (name === 'quantity') value = Math.max(1, parseInt(value, 10) || 1);
    if (name === 'coef')      value = parseFloat(value);

    setFormData(fd => ({ ...fd, [name]: value }));
    setError('');
    if (['reference','name','price'].includes(name)) setSelectedStockItem(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createMovement(formData);
      onSaved(); // rafraîchit EntryList
      setFormData(initialData);
      setStockQuery('');
      setStockOptions([]);
      setSelectedStockItem(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

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
        right: '-50%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, rgba(16,185,129,0.03), rgba(59,130,246,0.03))',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      
      {error && (
        <div style={{
          background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
          border: '2px solid #fca5a5',
          borderRadius: '16px',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          color: '#dc2626',
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
          ✨ Nouvelle entrée
        </h2>
        <p style={{
          color: '#64748b',
          fontSize: '1.1rem',
          fontWeight: '500',
          margin: 0
        }}>
          Ajoutez facilement de nouveaux articles à votre inventaire
        </p>
      </div>
      
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
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            borderRadius: '24px',
            padding: '2rem',
            border: '2px solid rgba(16,185,129,0.1)',
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
                  border: '2px solid rgba(16,185,129,0.2)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(16,185,129,0.2)'}
              />
              <button
                type="button"
                onClick={handleExtSearch}
                disabled={extLoading}
                style={{
                  background: extLoading ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: extLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(16,185,129,0.3)',
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
                background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                border: '2px solid #fca5a5',
                borderRadius: '12px',
                color: '#dc2626',
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
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', 
              borderRadius: '24px', 
              border: '3px solid #10b981', 
              boxShadow: '0 20px 40px rgba(16,185,129,0.2)',
              backdropFilter: 'blur(15px)'
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
                      boxShadow: '0 15px 35px rgba(0,0,0,0.15)', 
                      border: '4px solid white',
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
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9))', 
                  borderRadius: '16px', 
                  border: '2px solid rgba(16,185,129,0.2)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <strong style={{
                    color: '#047857', 
                    fontSize: '0.75rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px', 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '800'
                  }}>📝 Description</strong>
                  <p style={{margin: 0, fontWeight: '600', fontSize: '1rem', color: '#1e293b', lineHeight: '1.4'}}>{extItem.ItemDescription_EN || extItem.ItemDescription_FR}</p>
                </div>
                <div style={{
                  padding: '1.25rem', 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9))', 
                  borderRadius: '16px', 
                  border: '2px solid rgba(16,185,129,0.2)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <strong style={{
                    color: '#047857', 
                    fontSize: '0.75rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px', 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '800'
                  }}>📏 Hauteur</strong>
                  <p style={{margin: 0, fontWeight: '700', fontSize: '1.2rem', color: '#10b981'}}>{extItem.Height} cm</p>
                </div>
                <div style={{
                  padding: '1.25rem', 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9))', 
                  borderRadius: '16px', 
                  border: '2px solid rgba(16,185,129,0.2)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <strong style={{
                    color: '#047857', 
                    fontSize: '0.75rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px', 
                    display: 'block', 
                    marginBottom: '0.5rem',
                    fontWeight: '800'
                  }}>⭕ Diamètre</strong>
                  <p style={{margin: 0, fontWeight: '700', fontSize: '1.2rem', color: '#10b981'}}>{extItem.DiameterCulturePot || extItem.PotSize} cm</p>
                </div>
                <div style={{
                  padding: '1.25rem', 
                  background: 'linear-gradient(135deg, #10b981, #059669)', 
                  borderRadius: '16px', 
                  color: 'white', 
                  textAlign: 'center',
                  boxShadow: '0 15px 35px rgba(16,185,129,0.3)',
                  border: '2px solid rgba(255,255,255,0.2)'
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
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '1.5rem 2.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 15px 35px rgba(16,185,129,0.4)',
                    transition: 'all 0.3s ease',
                    minWidth: '200px',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = '0 20px 40px rgba(16,185,129,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 15px 35px rgba(16,185,129,0.4)';
                  }}
                >
                  ✨ Ajouter au stock
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Saisie manuelle depuis le stock */}
        <div style={{gridColumn: '1 / -1', marginBottom: '1rem'}}>
          <div style={{
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            borderRadius: '24px',
            padding: '2rem',
            border: '2px solid rgba(59,130,246,0.1)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
            backdropFilter: 'blur(10px)'
          }}>
            <label htmlFor="stockSearch" style={{
              display: 'block',
              marginBottom: '1rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#1e293b',
              textAlign: 'center'
            }}>
              🏪 Article depuis le stock
            </label>
            <input
              list="stock-options"
              id="stockSearch"
              name="stockSearch"
              value={stockQuery}
              onChange={handleChange}
              placeholder="Tapez ≥2 lettres pour rechercher dans le stock..."
              autoComplete="off"
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: '2px solid rgba(59,130,246,0.2)',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: '500',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(59,130,246,0.2)'}
            />
            <datalist id="stock-options">
              {stockOptions.map(item => (
                <option key={item._id} value={`${item.reference} — ${item.name}`} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Référence */}
        <div>
          <label htmlFor="reference" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#1e293b'
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
              border: '2px solid rgba(148,163,184,0.3)',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '500',
              background: 'rgba(255,255,255,0.9)',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
          />
        </div>

      {/* Nom du produit */}
      <div>
        <label htmlFor="name" style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: '#1e293b'
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
            border: '2px solid rgba(148,163,184,0.3)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: selectedStockItem ? 'rgba(248,250,252,0.9)' : 'rgba(255,255,255,0.9)',
            transition: 'all 0.3s ease',
            outline: 'none',
            cursor: selectedStockItem ? 'not-allowed' : 'text'
          }}
          onFocus={(e) => !selectedStockItem && (e.target.style.borderColor = '#10b981')}
          onBlur={(e) => !selectedStockItem && (e.target.style.borderColor = 'rgba(148,163,184,0.3)')}
        />
      </div>

      {/* Quantité */}
      <div>
        <label htmlFor="quantity" style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: '#1e293b'
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
            border: '2px solid rgba(148,163,184,0.3)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'rgba(255,255,255,0.9)',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#10b981'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
        />
      </div>

      {/* Prix unitaire */}
      <div>
        <label htmlFor="price" style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: '#1e293b'
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
            border: '2px solid rgba(148,163,184,0.3)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'rgba(248,250,252,0.9)',
            cursor: 'not-allowed',
            color: '#64748b'
          }}
        />
      </div>

      {/* Coefficient */}
      <div>
        <label htmlFor="coef" style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: '#1e293b'
        }}>⚖️ Coefficient</label>
        <select
          id="coef"
          name="coef"
          value={formData.coef}
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
            outline: 'none',
            cursor: 'pointer'
          }}
          onFocus={(e) => e.target.style.borderColor = '#10b981'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
        >
          <option value={1}>1</option>
          <option value={0.5}>0.5</option>
          <option value={0.25}>0.25</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="eventDate" style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: '#1e293b'
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
            border: '2px solid rgba(148,163,184,0.3)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'rgba(255,255,255,0.9)',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#10b981'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
        />
      </div>

      {/* Projet */}
      <div>
        <label htmlFor="project" style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: '#1e293b'
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
            border: '2px solid rgba(148,163,184,0.3)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'rgba(255,255,255,0.9)',
            transition: 'all 0.3s ease',
            outline: 'none',
            cursor: 'pointer'
          }}
          onFocus={(e) => e.target.style.borderColor = '#10b981'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
        >
          <option value="">-- Sélectionnez un projet --</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>
              {p.client || p.name || 'Projet sans titre'}
            </option>
          ))}
        </select>
      </div>

      {/* Note */}
      <div style={{gridColumn: '1 / -1'}}>
        <label htmlFor="note" style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '1rem',
          fontWeight: '700',
          color: '#1e293b'
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
          onFocus={(e) => e.target.style.borderColor = '#10b981'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
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
            background: loading ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 15px 35px rgba(16,185,129,0.3)',
            transform: loading ? 'scale(0.98)' : 'scale(1)'
          }}
          onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px) scale(1.02)')}
          onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0) scale(1)')}
        >
          {loading ? '⏳ Création en cours...' : '✨ Ajouter Entrée'}
        </button>
      </div>

        <input type="hidden" name="type" value={formData.type} />
        <input type="hidden" name="createdBy" value={formData.createdBy} />
      </form>
    </div>
  );
}

EntryForm.propTypes = {
  onSaved:     PropTypes.func.isRequired,
  currentUser: PropTypes.string.isRequired,
};
