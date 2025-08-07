// frontend/src/components/ExitList.jsx

import React, { useState, useEffect, useCallback } from 'react'
import { getMovements, validateMovement, markReturned } from '../../../shared/api/domains/inventory/clientApi'
import './ExitList.css'

export default function ExitList({ refreshFlag }) {
  const [exits, setExits] = useState([])

  const fetchExits = useCallback(async () => {
    try {
      const all = await getMovements()
      setExits(all.filter(m => m.type === 'sortie'))
    } catch (err) {
      console.error("Erreur chargement sorties :", err)
    }
  }, [])

  useEffect(() => {
    fetchExits()
  }, [fetchExits, refreshFlag])

  if (exits.length === 0) {
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
        📤 Aucune sortie enregistrée
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
      gap: '2rem',
      padding: '1rem'
    }}>
      {exits.map(m => (
        <div key={m._id} style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 25px rgba(0, 0, 0, 0.05)',
          border: '2px solid rgba(239,68,68,0.1)',
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
            left: '-30%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, rgba(239,68,68,0.03), rgba(220,38,38,0.03))',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          {/* Header avec statuts */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            position: 'relative',
            zIndex: 1,
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
              color: '#dc2626',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: '700',
              border: '2px solid rgba(239,68,68,0.2)'
            }}>
              📅 {new Date(m.eventDate).toLocaleDateString('fr-FR')}
            </div>
            
            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <div style={{
                background: m.validated 
                  ? 'linear-gradient(135deg, #10b981, #059669)' 
                  : 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: '0.4rem 0.8rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: '700',
                boxShadow: m.validated 
                  ? '0 4px 12px rgba(16,185,129,0.3)' 
                  : '0 4px 12px rgba(245,158,11,0.3)'
              }}>
                {m.validated ? '✅ Validé' : '⏳ En attente'}
              </div>
              
              <div style={{
                background: m.returnPlannedAt 
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                  : 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                padding: '0.4rem 0.8rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: '700',
                boxShadow: m.returnPlannedAt 
                  ? '0 4px 12px rgba(59,130,246,0.3)' 
                  : '0 4px 12px rgba(239,68,68,0.3)'
              }}>
                {m.returnPlannedAt ? '🔄 Locative' : '🗑️ Définitive'}
              </div>
            </div>
          </div>

          {/* Corps principal */}
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Image */}
            <div style={{flexShrink: 0}}>
              {m.image ? (
                <img 
                  src={m.image} 
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
                  background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  fontSize: '2rem',
                  fontWeight: '700'
                }}>
                  📦
                </div>
              )}
            </div>
            
            {/* Informations principales */}
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
                }}>📦 Qté</div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#ef4444'
                }}>{m.quantity}</div>
              </div>

              <div style={{
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.25rem'
                }}>💰 Prix</div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#059669'
                }}>{((m.price != null ? m.price : 0) * m.quantity).toFixed(2)}€</div>
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
            </div>
          </div>

          {/* Section dates pour sorties locatives */}
          {m.returnPlannedAt && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginTop: '1.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(5,150,105,0.05))',
                padding: '1rem',
                borderRadius: '16px',
                border: '2px solid rgba(16,185,129,0.1)'
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>📅 Départ</div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>{new Date(m.departureDate || m.eventDate).toLocaleDateString('fr-FR')}</div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(37,99,235,0.05))',
                padding: '1rem',
                borderRadius: '16px',
                border: '2px solid rgba(59,130,246,0.1)'
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>🔄 Retour prévu</div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>{new Date(m.returnPlannedAt).toLocaleDateString('fr-FR')}</div>
              </div>
              
              {m.returnedAt && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.05), rgba(22,163,74,0.05))',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '2px solid rgba(34,197,94,0.1)'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.5rem'
                  }}>✅ Retourné le</div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>{new Date(m.returnedAt).toLocaleDateString('fr-FR')}</div>
                </div>
              )}
            </div>
          )}

          {/* Section projet et note */}
          <div style={{
            marginTop: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            {m.project && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(239,68,68,0.05))',
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
                }}>{typeof m.project === 'object' ? m.project.name : m.project}</div>
                {typeof m.project === 'object' && m.project.client && (
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    marginTop: '0.25rem'
                  }}>Client: {m.project.client}</div>
                )}
              </div>
            )}

            {m.note && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(249,250,251,0.8), rgba(243,244,246,0.8))',
                padding: '1rem',
                borderRadius: '16px',
                border: '2px solid rgba(209,213,219,0.3)',
                backdropFilter: 'blur(10px)',
                marginBottom: '1rem'
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

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginTop: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            {!m.validated && (
              <button
                onClick={async () => {
                  await validateMovement(m._id)
                  fetchExits()
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '0.8rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(16,185,129,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 12px 30px rgba(16,185,129,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(16,185,129,0.3)';
                }}
              >
                ✅ Valider
              </button>
            )}
            {m.returnPlannedAt && !m.returned && (
              <button
                onClick={async () => {
                  await markReturned(m._id)
                  fetchExits()
                }}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '0.8rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(59,130,246,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 12px 30px rgba(59,130,246,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(59,130,246,0.3)';
                }}
              >
                🔄 Revenu
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
)
}
