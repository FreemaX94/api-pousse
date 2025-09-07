// frontend/src/components/ProjetList.jsx

import React from "react";
import { motion } from "framer-motion";

const STATUS_GRADIENT = {
  "En cours": { from: "from-blue-400", to: "to-blue-600" },  // <-- changé en bleu
  Terminé:  { from: "from-green-400", to: "to-green-600"  },
  Archivé:  { from: "from-gray-400",  to: "to-gray-600"   }
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

export default function ProjetList({ projects, onUpdate, onDelete }) {
  if (!projects?.length) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '32px',
        border: '2px dashed rgba(148,163,184,0.3)',
        color: '#64748b',
        fontSize: '1.2rem',
        fontWeight: '600',
        margin: '2rem auto',
        maxWidth: '600px'
      }}>
        🏗️ Aucun projet pour le moment
      </div>
    );
  }

  const now = Date.now();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '2rem auto',
      padding: '1rem'
    }}>
      {projects.map((p) => {
        const grad = STATUS_GRADIENT[p.statut] || STATUS_GRADIENT["En cours"];
        const start = new Date(p.dateDebut).getTime();
        const end   = new Date(p.dateFin).getTime();
        const pct   = Math.min(Math.max(((now - start) / (end - start)) * 100, 0), 100);

        return (
          <motion.div
            key={p._id}
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)", 
              y: -8 
            }}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 25px rgba(0, 0, 0, 0.05)',
              border: '2px solid rgba(59,130,246,0.1)',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Background decorative element */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-30%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(45deg, rgba(59,130,246,0.03), rgba(16,185,129,0.03))',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />

            {/* En-tête premium */}
            <div style={{
              background: p.statut === 'En cours' 
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                : p.statut === 'Terminé'
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6b7280, #4b5563)',
              padding: '1.5rem 2rem',
              position: 'relative',
              zIndex: 1
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '800',
                color: 'white',
                margin: 0,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {p.client}
              </h3>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '700',
                display: 'inline-block',
                marginTop: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {p.statut === 'En cours' && '⚡ En cours'}
                {p.statut === 'Terminé' && '✅ Terminé'}
                {p.statut === 'Archivé' && '📁 Archivé'}
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
              {p.description && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(249,250,251,0.8), rgba(243,244,246,0.8))',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '2px solid rgba(209,213,219,0.3)',
                  backdropFilter: 'blur(10px)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.5rem'
                  }}>📝 Description</div>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#374151',
                    lineHeight: '1.5',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {p.description}
                  </p>
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
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(248,250,252,0.8))',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(148,163,184,0.2)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.5rem'
                  }}>🚀 Début</div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    color: '#1e293b'
                  }}>
                    {new Date(p.dateDebut).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(248,250,252,0.8))',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(148,163,184,0.2)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.5rem'
                  }}>🏁 Fin</div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    color: '#1e293b'
                  }}>
                    {new Date(p.dateFin).toLocaleDateString('fr-FR')}
                  </div>
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
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>📊 Progression</div>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: p.statut === 'En cours' ? '#3b82f6' : p.statut === 'Terminé' ? '#10b981' : '#6b7280'
                  }}>
                    {Math.round(pct)}%
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(148,163,184,0.2)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div
                    style={{
                      height: '100%',
                      background: p.statut === 'En cours' 
                        ? 'linear-gradient(90deg, #3b82f6, #1d4ed8)' 
                        : p.statut === 'Terminé'
                        ? 'linear-gradient(90deg, #10b981, #059669)'
                        : 'linear-gradient(90deg, #6b7280, #4b5563)',
                      borderRadius: '10px',
                      width: `${pct}%`,
                      transition: 'width 0.5s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
              </div>

              {/* Fichiers premium */}
              {p.files?.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(16,185,129,0.05))',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '2px solid rgba(59,130,246,0.1)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#3b82f6',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.75rem'
                  }}>📎 Fichiers ({p.files.length})</div>
                  <div style={{
                    display: 'grid',
                    gap: '0.5rem'
                  }}>
                    {p.files.map((f, i) => (
                      <a
                        key={i}
                        href={`/api/uploads/${f}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          padding: '0.5rem 0.75rem',
                          background: 'rgba(255,255,255,0.8)',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: '#3b82f6',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          border: '1px solid rgba(59,130,246,0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(59,130,246,0.1)';
                          e.target.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(255,255,255,0.8)';
                          e.target.style.transform = 'translateX(0)';
                        }}
                      >
                        📄 {f}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Section des plantes */}
              {p.materials?.nieuwkoopItems?.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(34,197,94,0.05))',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '2px solid rgba(16,185,129,0.1)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#059669',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.75rem'
                  }}>🌱 Plantes ({p.materials.nieuwkoopItems.length})</div>
                  <div style={{
                    display: 'grid',
                    gap: '0.5rem'
                  }}>
                    {p.materials.nieuwkoopItems.map((plant, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem',
                          background: 'rgba(255,255,255,0.8)',
                          borderRadius: '12px',
                          border: '1px solid rgba(16,185,129,0.2)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(16,185,129,0.1)';
                          e.target.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(255,255,255,0.8)';
                          e.target.style.transform = 'translateX(0)';
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#1e293b',
                            marginBottom: '0.25rem'
                          }}>
                            {plant.name}
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            color: '#64748b'
                          }}>
                            Réf: {plant.itemCode} • {plant.category}
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <div style={{
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: '#059669',
                            background: 'rgba(16,185,129,0.1)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px'
                          }}>
                            Qté: {plant.quantity}
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            color: '#059669'
                          }}>
                            {plant.totalPrice?.toFixed(2)}€
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Résumé des plantes */}
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(16,185,129,0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16,185,129,0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: '#059669'
                    }}>
                      Total: {p.materials.nieuwkoopItems.reduce((sum, plant) => sum + (plant.quantity || 0), 0)} plantes
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: '#059669'
                    }}>
                      {p.materials.nieuwkoopItems.reduce((sum, plant) => sum + (plant.totalPrice || 0), 0).toFixed(2)}€
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
                      statut: p.statut === "En cours" ? "Terminé" : "En cours"
                    })
                  }
                  title={p.statut === "En cours" ? "Terminer" : "Réactiver"}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(16,185,129,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
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
                  <CheckIcon style={{width: '16px', height: '16px'}} />
                  {p.statut === "En cours" ? "Terminer" : "Réactiver"}
                </button>
                
                <button
                  onClick={() => onDelete(p._id)}
                  title="Supprimer"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(239,68,68,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.05)';
                    e.target.style.boxShadow = '0 12px 30px rgba(239,68,68,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 8px 25px rgba(239,68,68,0.3)';
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
  );
}
