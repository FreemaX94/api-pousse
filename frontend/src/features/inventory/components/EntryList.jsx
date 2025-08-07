import React, { useState, useEffect } from 'react'
import { getMovements, getProjects, getStockItems } from '../../../shared/api/domains/inventory/clientApi'
import './EntryList.css'

export default function EntryList({ refreshFlag }) {
  const [entries, setEntries] = useState([])
  const [projects, setProjects] = useState([])
  const [stockMap, setStockMap] = useState({})

  // Charger les projets
  useEffect(() => {
    getProjects()
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(console.error)
  }, [])

  // Charger les mouvements "entrée"
  useEffect(() => {
    getMovements()
      .then(all => setEntries(all.filter(m => m.type === 'entrée')))
      .catch(console.error)
  }, [refreshFlag])

  // Charger tous les items du stock pour avoir prix et image
  useEffect(() => {
    getStockItems('')
      .then(items => {
        const map = {}
        items.forEach(item => { map[item.reference] = item })
        setStockMap(map)
      })
      .catch(console.error)
  }, [])

  if (entries.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '32px',
        border: '2px dashed rgba(148,163,184,0.3)',
        color: '#64748b',
        fontSize: '1.2rem',
        fontWeight: '600'
      }}>
        📝 Aucune entrée enregistrée
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '2rem',
      padding: '1rem'
    }}>
      {entries.map(m => {
        const projectObj = projects.find(p => p._id === m.project)
        const projectLabel = projectObj
          ? (projectObj.client || projectObj.name || 'Projet sans titre')
          : 'Inconnu'

        const stockItem = stockMap[m.reference]
        const price = m.price != null ? m.price : (stockItem?.pricing?.price ?? stockItem?.price ?? 0)
        const imageSrc = m.image || stockItem?.image || `/api/nieuwkoop/items/${m.reference}/image`

        return (
          <div key={m._id} style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 25px rgba(0, 0, 0, 0.05)',
            border: '2px solid rgba(16,185,129,0.1)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 30px rgba(0, 0, 0, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 25px rgba(0, 0, 0, 0.05)';
          }}
          >
            {/* Background decorative element */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-30%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(45deg, rgba(16,185,129,0.03), rgba(59,130,246,0.03))',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />

            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                color: '#047857',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '700',
                border: '2px solid rgba(16,185,129,0.2)'
              }}>
                📅 {new Date(m.eventDate).toLocaleDateString('fr-FR')}
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
              }}>
                ⬇️ Entrée
              </div>
            </div>

            {/* Main content */}
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              position: 'relative',
              zIndex: 1
            }}>
              {/* Image */}
              <div style={{flexShrink: 0}}>
                {imageSrc ? (
                  <img 
                    src={imageSrc} 
                    alt={m.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '16px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      border: '3px solid white',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                ) : (
                  <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    fontSize: '2rem',
                    fontWeight: '700'
                  }}>
                    📦
                  </div>
                )}
              </div>
              
              {/* Information grid */}
              <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem',
                alignContent: 'start'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(248,250,252,0.8))',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(148,163,184,0.2)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.25rem'
                  }}>📋 Réf.</div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    color: '#1e293b'
                  }}>{m.reference}</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(248,250,252,0.8))',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(148,163,184,0.2)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.25rem'
                  }}>💰 Prix U.</div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    color: '#10b981'
                  }}>{price.toFixed(2)} €</div>
                </div>

                <div style={{
                  gridColumn: '1 / -1',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(248,250,252,0.8))',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(148,163,184,0.2)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.25rem'
                  }}>🏷️ Nom</div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#1e293b',
                    lineHeight: '1.3'
                  }}>{m.name}</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(248,250,252,0.8))',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(148,163,184,0.2)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.25rem'
                  }}>📦 Qté</div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#3b82f6'
                  }}>{m.quantity}</div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(248,250,252,0.8))',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(148,163,184,0.2)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.25rem'
                  }}>👤 Créé par</div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>{m.createdBy}</div>
                </div>
              </div>
            </div>

            {/* Project and note section */}
            <div style={{
              marginTop: '1.5rem',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(16,185,129,0.05))',
                padding: '1rem',
                borderRadius: '16px',
                border: '2px solid rgba(59,130,246,0.1)',
                marginBottom: m.note ? '1rem' : '0'
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>🎯 Projet</div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>{projectLabel}</div>
              </div>

              {m.note && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(249,250,251,0.8), rgba(243,244,246,0.8))',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '2px solid rgba(209,213,219,0.3)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.5rem'
                  }}>📝 Note</div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: '#374151',
                    lineHeight: '1.4'
                  }}>{m.note}</div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
