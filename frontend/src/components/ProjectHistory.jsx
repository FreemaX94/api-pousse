// Composant pour afficher l'historique d'un projet
import React, { useState } from 'react';
import { useProjectHistory } from '../hooks/useProjectsApi';

const ProjectHistory = ({ projectId, onClose }) => {
  const {
    history,
    stats,
    loading,
    error,
    undoAction,
    redoAction,
    searchHistory
  } = useProjectHistory(projectId);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState(null);
  const [undoReason, setUndoReason] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchHistory(searchTerm);
    }
  };

  const handleUndo = async (historyId) => {
    const success = await undoAction(historyId, undoReason);
    if (success) {
      setSelectedAction(null);
      setUndoReason('');
    }
  };

  const handleRedo = async (historyId) => {
    const success = await redoAction(historyId, undoReason);
    if (success) {
      setSelectedAction(null);
      setUndoReason('');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action) => {
    const icons = {
      'create': '✨',
      'update': '📝',
      'delete': '🗑️',
      'status_change': '🔄',
      'task_add': '➕',
      'task_update': '📋',
      'task_delete': '❌',
      'material_add': '🌱',
      'comment_add': '💬',
      'export': '📄'
    };
    return icons[action] || '📊';
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Chargement de l'historique...
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--color-bg-secondary)',
            borderTop: '4px solid var(--color-primary)',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '20px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: '1px solid var(--color-border)'
      }}>
        {/* En-tête */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          padding: '1.5rem 2rem',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
              📚 Historique du Projet
            </h2>
            {stats && (
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                {stats.totalChanges} modification{stats.totalChanges > 1 ? 's' : ''} •
                {stats.undoableCount} annulable{stats.undoableCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            ×
          </button>
        </div>

        {/* Barre de recherche */}
        <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--color-border)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans l'historique..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                fontSize: '0.9rem'
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🔍
            </button>
          </form>
        </div>

        {/* Liste de l'historique */}
        <div style={{
          maxHeight: '500px',
          overflowY: 'auto',
          padding: '1rem 2rem'
        }}>
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
              border: '1px solid #f87171',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem',
              color: '#dc2626'
            }}>
              ❌ Erreur : {error}
            </div>
          )}

          {history.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--color-text-secondary)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <div>Aucun historique disponible</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map((entry) => (
                <div
                  key={entry._id}
                  style={{
                    background: 'var(--color-bg-primary)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid var(--color-border)',
                    transition: 'all 0.2s ease',
                    cursor: entry.canUndo ? 'pointer' : 'default'
                  }}
                  onClick={() => entry.canUndo && setSelectedAction(entry)}
                  onMouseEnter={(e) => {
                    if (entry.canUndo) {
                      e.target.style.background = 'var(--color-bg-secondary)';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--color-bg-primary)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>
                        {getActionIcon(entry.action)}
                      </span>
                      <div>
                        <div style={{
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          color: 'var(--color-text-primary)',
                          marginBottom: '0.25rem'
                        }}>
                          {entry.description}
                        </div>
                        <div style={{
                          fontSize: '0.8rem',
                          color: 'var(--color-text-secondary)'
                        }}>
                          Par {entry.performedBy?.username || 'Système'} • {formatDate(entry.createdAt)}
                        </div>
                      </div>
                    </div>

                    {entry.canUndo && !entry.undoRedoInfo?.isUndone && (
                      <div style={{
                        background: 'var(--color-warning)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '600'
                      }}>
                        ANNULABLE
                      </div>
                    )}

                    {entry.undoRedoInfo?.isUndone && (
                      <div style={{
                        background: 'var(--color-error)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '600'
                      }}>
                        ANNULÉ
                      </div>
                    )}
                  </div>

                  {/* Détails des changements */}
                  {entry.changes?.properties?.length > 0 && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      background: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: '8px',
                      fontSize: '0.8rem'
                    }}>
                      <strong>Propriétés modifiées :</strong> {entry.changes.properties.map(p => p.field).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal d'action undo/redo */}
        {selectedAction && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}>
            <div style={{
              background: 'var(--color-surface)',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
                {selectedAction.undoRedoInfo?.isUndone ? 'Refaire l\'action' : 'Annuler l\'action'}
              </h3>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                {selectedAction.description}
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                  Raison (optionnel) :
                </label>
                <input
                  type="text"
                  value={undoReason}
                  onChange={(e) => setUndoReason(e.target.value)}
                  placeholder="Expliquez pourquoi..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setSelectedAction(null)}
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={() => selectedAction.undoRedoInfo?.isUndone
                    ? handleRedo(selectedAction._id)
                    : handleUndo(selectedAction._id)
                  }
                  style={{
                    background: selectedAction.undoRedoInfo?.isUndone
                      ? 'var(--color-success)'
                      : 'var(--color-warning)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {selectedAction.undoRedoInfo?.isUndone ? '🔄 Refaire' : '↶ Annuler'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProjectHistory;