import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api, { handleApiError } from '../api/axios';

// Optimisations temporairement simplifiées pour éviter les erreurs de dépendances

const categories = ['Plantes', 'Contenants', 'Décor', 'Artificiels', 'Séchés'];

const categoryIcons = {
  'Plantes': '🌱',
  'Contenants': '🪴',
  'Décor': '🎨',
  'Artificiels': '🌸',
  'Séchés': '🍂'
};

export default function StockViewer() {
  const [selected, setSelected] = useState("Plantes");
  const [search, setSearch] = useState('');
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // États pour futures fonctionnalités (modal export, filtres avancés, stats)
  // const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  // const [showStats, setShowStats] = useState(false);  
  // const [showExportModal, setShowExportModal] = useState(false);
  const isAdmin = true;

  // Performance monitoring simplifié
  useEffect(() => {
    const startTime = performance.now();
    console.log(`⚡ StockViewer component mounted: ${startTime.toFixed(2)}ms`);
  }, []);

  const fetchStocks = async (categorie) => {
    if (!categorie) return;
    setLoading(true);
    try {
      const res = await api.get(`/stocks?categorie=${categorie}`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];
      setStocks(data);
    } catch (err) {
      console.error('Erreur chargement stocks :', err);
      const errorInfo = handleApiError(err);
      console.error('Détails de l\'erreur :', errorInfo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks(selected);
  }, [selected, refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger((v) => v + 1);

  const handleDelete = async (id) => {
    if (!window.confirm('🗑️ Supprimer cette fiche ?')) return;
    try {
      await api.delete(`/stocks/${encodeURIComponent(id)}`);
      alert('✅ Supprimé avec succès');
      handleRefresh();
    } catch (err) {
      console.error('Erreur suppression :', err);
      const errorInfo = handleApiError(err);
      alert(`❌ Erreur lors de la suppression: ${errorInfo.message}`);
    }
  };

  return (
    <div style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
      minHeight: '100vh'
    }}>
      {/* En-tête avec style premium */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorative element */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(45deg, var(--color-primary-alpha), var(--color-accent-alpha))',
          borderRadius: '50%',
          pointerEvents: 'none',
          opacity: 0.1
        }} />
        
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          color: 'var(--color-primary)',
          marginBottom: '0.5rem',
          margin: 0,
          position: 'relative',
          zIndex: 1
        }}>
          📦 Gestion du Stock
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: '1.1rem',
          fontWeight: '500',
          margin: 0,
          position: 'relative',
          zIndex: 1
        }}>
          Consultez et gérez votre inventaire par catégorie
        </p>
      </div>

      {/* Sélecteur de catégories avec style premium */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setSelected(cat)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '1rem 2rem',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '700',
              border: '2px solid',
              borderColor: selected === cat ? 'var(--color-primary)' : 'var(--color-border)',
              background: selected === cat 
                ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                : 'var(--color-surface)',
              color: selected === cat ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selected === cat ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{categoryIcons[cat]}</span>
            {cat}
          </motion.button>
        ))}
      </div>

      {selected && (
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decorative element */}
          <div style={{
            position: 'absolute',
            top: '-30%',
            right: '-30%',
            width: '80%',
            height: '80%',
            background: 'linear-gradient(45deg, var(--color-primary-alpha), var(--color-accent-alpha))',
            borderRadius: '50%',
            pointerEvents: 'none',
            opacity: 0.05
          }} />
          
          {/* En-tête de section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              padding: '1rem 2rem',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>{categoryIcons[selected]}</span>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: 'var(--color-text-inverse)',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {selected}
              </h3>
            </div>

            {/* Boutons d'action avec style premium */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              <motion.button
                onClick={() =>
                  window.open(`${api.defaults.baseURL}/api/stocks/export?format=csv`, '_blank')
                }
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                📄 CSV
              </motion.button>
              
              <motion.button
                onClick={() =>
                  window.open(`${api.defaults.baseURL}/api/stocks/export?format=pdf`, '_blank')
                }
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                📄 PDF
              </motion.button>

              <motion.button
                onClick={handleRefresh}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, var(--color-success), var(--color-success-dark))',
                  color: 'var(--color-text-inverse)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                🔄 Actualiser
              </motion.button>
              
              <motion.button
                onClick={() => window.print()}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, var(--color-secondary), var(--color-neutral))',
                  color: 'var(--color-text-inverse)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                🖨️ Imprimer
              </motion.button>
            </div>
          </div>

          {/* Barre de recherche avec style premium */}
          <div style={{
            marginBottom: '2rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              position: 'relative',
              maxWidth: '400px'
            }}>
              <input
                type="text"
                placeholder="🔍 Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
                  color: 'var(--color-text-primary)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary)';
                  e.target.style.boxShadow = 'var(--shadow-lg)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'var(--shadow-sm)';
                }}
              />
            </div>
          </div>

          {/* Contenu avec états de chargement */}
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'var(--color-text-secondary)',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              <div style={{
                background: 'linear-gradient(45deg, var(--color-primary), var(--color-accent))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: '2rem',
                marginBottom: '1rem'
              }}>
                ⏳
              </div>
              Chargement en cours...
            </div>
          ) : stocks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
              borderRadius: '16px',
              border: '2px dashed var(--color-border)',
              color: 'var(--color-text-secondary)',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              Aucune donnée enregistrée pour cette catégorie
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
              position: 'relative',
              zIndex: 1
            }}>
              {stocks
                .filter(entry => 
                  !search || 
                  entry.product?.nom?.toLowerCase().includes(search.toLowerCase()) ||
                  entry.categorie?.toLowerCase().includes(search.toLowerCase())
                )
                .map((entry, index) => {
                  const isOutOfStock = parseInt(entry.product?.infos?.['Stock réel']) <= 0;
                  const isLowStock = parseInt(entry.product?.infos?.['Stock réel']) <= 5 && !isOutOfStock;
                  const available = parseInt(entry.product?.infos?.['Stock réel']) || 0;
                  
                  return (
                    <motion.div
                      key={entry._id}
                      className="stock-card fade-in-up"
                      initial={{
                        opacity: 0, 
                        y: 30, 
                        scale: 0.95,
                        rotateX: 25 
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotateX: 0,
                        transition: {
                          delay: index * 0.08,
                          duration: 0.6,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }
                      }}
                      whileHover={{
                        scale: 1.02,
                        y: -6,
                        transition: { duration: 0.2 }
                      }}
                      style={{
                        border: isOutOfStock ? '3px solid var(--color-danger)' : 
                               isLowStock ? '3px solid var(--color-warning)' : 
                               '3px solid transparent',
                        background: 'var(--color-surface)',
                        borderRadius: '16px',
                        boxShadow: 'var(--shadow-lg)',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'grab'
                      }}
                    >
                      {/* Shimmer Effect */}
                      <motion.div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, transparent 20%, var(--glass-bg) 40%, var(--glass-border) 50%, var(--glass-bg) 60%, transparent 80%)',
                          backgroundSize: '200% 100%',
                          borderRadius: 'inherit',
                          pointerEvents: 'none',
                          zIndex: 1,
                          opacity: 0.1
                        }}
                      />

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
                              {entry.product?.nom || '[Sans nom]'}
                            </h3>
                            <p style={{
                              fontSize: '0.8rem',
                              opacity: 0.7,
                              margin: 0,
                              fontWeight: '500'
                            }}>
                              {entry.categorie || 'N/A'}
                            </p>
                          </div>
                          <div style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: 'var(--color-primary)'
                          }}>
                            €{entry.product?.infos?.["Coût d'achat H.T."] || '0.00'}
                          </div>
                        </div>
                        
                        {/* Actions condensées */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: '0.5rem'
                        }}>
                          {isAdmin && (
                            <motion.button
                              onClick={() => handleDelete(entry._id)}
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
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                minWidth: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              🗑️
                            </motion.button>
                          )}
                        </div>
                      </div>

                      {/* Section d'image (placeholder) */}
                      <div style={{
                        position: 'relative',
                        background: 'var(--color-bg-secondary)',
                        overflow: 'hidden',
                        height: '180px'
                      }}>
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem',
                          color: 'var(--color-secondary)',
                          background: 'var(--color-bg-secondary)'
                        }}>
                          {categoryIcons[entry.categorie] || '📦'}
                        </div>
                        
                        {/* Badge de stock en overlay */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: isOutOfStock ? 'var(--badge-error)' : 
                                     isLowStock ? 'var(--badge-warning)' : 
                                     available > 10 ? 'var(--badge-success)' : 'var(--badge-info)',
                          color: 'white',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          zIndex: 2
                        }}>
                          {isOutOfStock ? '🚫 Rupture' : 
                           isLowStock ? '⚠️ Stock bas' : 
                           available > 10 ? '✅ Disponible' : '📦 Limité'}
                        </div>
                      </div>

                      {/* Informations compactes */}
                      <div style={{
                        padding: '1rem',
                        background: 'var(--color-surface)',
                        position: 'relative',
                        zIndex: 2
                      }}>
                        {/* Catégorie et dimensions */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '0.75rem',
                          fontSize: '0.8rem'
                        }}>
                          <span style={{
                            background: 'var(--badge-info)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '12px',
                            fontWeight: '600'
                          }}>
                            {entry.categorie || 'Non classé'}
                          </span>
                          {entry.product?.infos?.['Dimensions'] && (
                            <span style={{
                              color: 'var(--color-secondary)',
                              fontWeight: '600'
                            }}>
                              {entry.product.infos['Dimensions']}
                            </span>
                          )}
                        </div>

                        {/* Informations de stock */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--color-bg-secondary)',
                          borderRadius: '12px',
                          padding: '0.75rem',
                          border: '1px solid var(--color-border)'
                        }}>
                          <div style={{
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: 'var(--color-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            Stock
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <motion.span 
                              key={available}
                              initial={{ scale: 1.2, color: 'var(--color-primary)' }}
                              animate={{ scale: 1, color: 'var(--color-primary)' }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              style={{
                                fontSize: '1rem',
                                fontWeight: '700',
                                minWidth: '32px',
                                textAlign: 'center'
                              }}>
                              {available}
                            </motion.span>
                          </div>
                        </div>

                        {/* Informations supplémentaires */}
                        {(entry.product?.infos?.['Quantité totale'] || entry.product?.infos?.DISPONIBILITÉ || entry.product?.infos?.Couleur) && (
                          <div style={{
                            marginTop: '0.75rem',
                            display: 'grid',
                            gap: '0.5rem',
                            fontSize: '0.8rem'
                          }}>
                            {entry.product.infos['Quantité totale'] && (
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem',
                                background: 'var(--color-bg-primary)',
                                borderRadius: '8px'
                              }}>
                                <span style={{ color: 'var(--color-secondary)', fontWeight: '600' }}>Quantité totale:</span>
                                <span style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>{entry.product.infos['Quantité totale']}</span>
                              </div>
                            )}
                            {entry.product.infos.DISPONIBILITÉ && (
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem',
                                background: 'var(--color-bg-primary)',
                                borderRadius: '8px'
                              }}>
                                <span style={{ color: 'var(--color-secondary)', fontWeight: '600' }}>Disponibilité:</span>
                                <span style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>{entry.product.infos.DISPONIBILITÉ}</span>
                              </div>
                            )}
                            {entry.product.infos.Couleur && (
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem',
                                background: 'var(--color-bg-primary)',
                                borderRadius: '8px'
                              }}>
                                <span style={{ color: 'var(--color-secondary)', fontWeight: '600' }}>Couleur:</span>
                                <span style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>{entry.product.infos.Couleur}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
