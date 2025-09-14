// frontend/src/components/ProjetList.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";

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
              scale: 1.02,
              boxShadow: 'var(--shadow-2xl)',
              y: -6
            }}
            onMouseEnter={() => setHoveredProject(p._id)}
            onMouseLeave={() => setHoveredProject(null)}
            onContextMenu={(e) => onContextMenu && onContextMenu(e, p)}
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
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
              background: 'linear-gradient(45deg, var(--color-primary-alpha), var(--color-accent-alpha))',
              borderRadius: '50%',
              pointerEvents: 'none',
              opacity: 0.1
            }} />

            {/* Boutons d'actions au survol */}
            {hoveredProject === p._id && onEdit && onCopy && onShowMenu && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(p);
                  }}
                  title="Modifier le projet"
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
              </div>
            )}

            {/* En-tête premium */}
            <div style={{
              background: displayStatus === 'En cours' 
                ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' 
                : displayStatus === 'Terminé'
                ? 'linear-gradient(135deg, var(--color-success), var(--color-success-dark))'
                : 'linear-gradient(135deg, var(--color-secondary), var(--color-neutral))',
              padding: '1.5rem 2rem',
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '800',
                  color: 'var(--color-text-inverse)',
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {p.client?.name || p.client}
                </h3>
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
              </div>
              
              {/* Concepteur en haut à droite */}
              {p.chargeProjet && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--color-text-inverse)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>👨‍💼</span>
                  {p.chargeProjet}
                </div>
              )}
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
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-text-primary)',
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
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)'
                  }}>
                    {new Date(p.dates?.start || p.dateDebut).toLocaleDateString('fr-FR')}
                  </div>
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
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)'
                  }}>
                    {new Date(p.dates?.end || p.dateFin).toLocaleDateString('fr-FR')}
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

              {/* Matériaux (Plantes) premium */}
              {p.materials?.length > 0 && (
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
                    color: 'var(--color-success)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.75rem'
                  }}>🌱 Plantes du projet ({p.materials.length})</div>
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
                        {material.status !== 'needed' && (
                          <div style={{
                            background: material.status === 'ordered' ? 'var(--color-primary)' :
                                       material.status === 'delivered' ? 'var(--color-success)' : 'var(--color-secondary)',
                            color: 'var(--color-text-inverse)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            textTransform: 'uppercase'
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
    </>
  );
}
