import React from 'react';

const NieuwkoopGrid = ({ 
  sortedItems, 
  removeFromStock, 
  updateItemQuantity,
  openAssignModal,
  addedItems 
}) => {
  // Extraire les catégories dynamiquement comme dans la sidebar
  const categories = [...new Set(addedItems.map(item => item.category))].filter(Boolean);
  return (
    <div className="nieuwkoop-grid">
      {sortedItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3 className="empty-title">Aucun résultat</h3>
          <p className="empty-description">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      ) : (
        <div className="stock-grid-4">
          {sortedItems.map((prod, index) => {
            const available = (prod.quantity || 0) - (prod.reservedQuantity || 0);
            const isOutOfStock = available <= 0;
            const isLowStock = available > 0 && available <= 5;

            return (
              <div
                key={prod.code}
                className="stock-card fade-in-up"
                style={{
                  border: isOutOfStock ? '3px solid var(--color-danger)' : 
                         isLowStock ? '3px solid var(--color-warning)' : 
                         '3px solid transparent',
                  cursor: 'pointer'
                }}
              >
                {/* En-tête avec badge et actions */}
                <div style={{
                  background: isOutOfStock ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                             isLowStock ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                             'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  padding: '1.5rem',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-10%',
                    width: '120px',
                    height: '120px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                  }}></div>
                  <div style={{
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        opacity: 0.9,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>Stock Article</span>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {isOutOfStock ? '🚫 Rupture' : isLowStock ? '⚠️ Faible' : '✅ En stock'}
                      </div>
                    </div>
                    
                    {/* Actions buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      <button
                        onClick={() => openAssignModal(prod)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          backdropFilter: 'blur(10px)',
                          fontSize: '1.2rem'
                        }}
                      >
                        📋
                      </button>
                      <button
                        onClick={() => removeFromStock(prod.code)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          backdropFilter: 'blur(10px)',
                          fontSize: '1.2rem'
                        }}
                      >
                        🗑️
                      </button>
                    </div>

                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      margin: 0,
                      lineHeight: '1.3',
                      marginBottom: '0.5rem'
                    }}>
                      {prod.name}
                    </h3>
                    <p style={{
                      fontSize: '0.9rem',
                      opacity: 0.9,
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      Réf: {prod.code || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Corps de la carte */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '0.25rem'
                      }}>Disponible</div>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: isOutOfStock ? 'var(--color-danger)' : 
                               isLowStock ? 'var(--color-warning)' : 'var(--color-success)'
                      }}>
                        {available}
                      </div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '0.25rem'
                      }}>Prix</div>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: 'var(--color-primary)'
                      }}>
                        €{prod.price ? prod.price.toFixed(2) : '0.00'}
                      </div>
                    </div>
                  </div>

                  {/* Contrôles de quantité */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.75rem'
                  }}>
                    <button
                      onClick={() => updateItemQuantity(prod.code, Math.max(0, prod.quantity - 1))}
                      disabled={prod.quantity <= 1}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'var(--color-primary)',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      -
                    </button>
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>
                      {prod.quantity || 0}
                    </span>
                    <button
                      onClick={() => updateItemQuantity(prod.code, prod.quantity + 1)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'var(--color-primary)',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NieuwkoopGrid;