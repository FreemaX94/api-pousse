// Composant pour gérer les templates de projets
import React, { useState } from 'react';
import { useProjectTemplates } from '../hooks/useProjectsApi';

const ProjectTemplates = ({ onClose, onSelectTemplate }) => {
  const {
    templates,
    popularTemplates,
    loading,
    error,
    createTemplate,
    createProjectFromTemplate,
    duplicateTemplate,
    updateTemplate,
    deleteTemplate
  } = useProjectTemplates();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'general',
    tags: [],
    template: {
      title: '',
      description: '',
      type: 'Installation',
      category: 'residential',
      priority: 'medium'
    }
  });

  const categories = ['general', 'installation', 'entretien', 'design', 'commercial', 'residential'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || template.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      await createTemplate(newTemplate);
      setShowCreateForm(false);
      setNewTemplate({
        name: '',
        description: '',
        category: 'general',
        tags: [],
        template: {
          title: '',
          description: '',
          type: 'Installation',
          category: 'residential',
          priority: 'medium'
        }
      });
    } catch (err) {
      console.error('Erreur lors de la création du template:', err);
    }
  };

  const handleUseTemplate = async (template) => {
    try {
      const project = await createProjectFromTemplate(template._id, {
        // Vous pouvez ajouter des données spécifiques ici
      });
      onSelectTemplate && onSelectTemplate(project);
      onClose && onClose();
    } catch (err) {
      console.error('Erreur lors de l\'utilisation du template:', err);
    }
  };

  const handleDuplicateTemplate = async (templateId, currentName) => {
    const newName = prompt('Nom du template dupliqué:', `${currentName} (Copie)`);
    if (newName) {
      try {
        await duplicateTemplate(templateId, newName);
      } catch (err) {
        console.error('Erreur lors de la duplication:', err);
      }
    }
  };

  const handleDeleteTemplate = async (templateId, templateName) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le template "${templateName}" ?`)) {
      try {
        await deleteTemplate(templateId);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
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
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Chargement des templates...
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
        maxWidth: '1000px',
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
              📋 Templates de Projets
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
              {templates.length} template{templates.length > 1 ? 's' : ''} disponible{templates.length > 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                color: 'white',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            >
              ➕ Nouveau
            </button>
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
        </div>

        {/* Barre de recherche et onglets */}
        <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un template..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Onglets */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
            {[
              { key: 'all', label: '📋 Tous', count: templates.length },
              { key: 'popular', label: '🔥 Populaires', count: popularTemplates.length },
              ...categories.map(cat => ({
                key: cat,
                label: `📁 ${cat.charAt(0).toUpperCase()}${cat.slice(1)}`,
                count: templates.filter(t => t.category === cat).length
              }))
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                  color: activeTab === tab.key ? 'white' : 'var(--color-text-primary)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
                <span style={{
                  background: activeTab === tab.key ? 'rgba(255,255,255,0.3)' : 'var(--color-bg-primary)',
                  borderRadius: '10px',
                  padding: '0.1rem 0.4rem',
                  fontSize: '0.7rem',
                  minWidth: '1.2rem',
                  textAlign: 'center'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Liste des templates */}
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

          {/* Templates populaires en haut */}
          {activeTab === 'popular' && popularTemplates.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.1rem',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🔥 Templates les plus utilisés
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {popularTemplates.map(template => (
                  <TemplateCard
                    key={template._id}
                    template={template}
                    onUse={() => handleUseTemplate(template)}
                    onDuplicate={() => handleDuplicateTemplate(template._id, template.name)}
                    onDelete={() => handleDeleteTemplate(template._id, template.name)}
                    isPopular={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Grille des templates */}
          {filteredTemplates.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--color-text-secondary)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <div>Aucun template trouvé</div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {(activeTab === 'popular' ? popularTemplates : filteredTemplates).map(template => (
                <TemplateCard
                  key={template._id}
                  template={template}
                  onUse={() => handleUseTemplate(template)}
                  onDuplicate={() => handleDuplicateTemplate(template._id, template.name)}
                  onDelete={() => handleDeleteTemplate(template._id, template.name)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal de création de template */}
        {showCreateForm && (
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
            padding: '2rem',
            overflowY: 'auto'
          }}>
            <div style={{
              background: 'var(--color-surface)',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem' }}>
                ➕ Créer un nouveau template
              </h3>

              <form onSubmit={handleCreateTemplate}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                    Nom du template :
                  </label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                    Description :
                  </label>
                  <textarea
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                    Catégorie :
                  </label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase()}{cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
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
                    type="submit"
                    style={{
                      background: 'var(--color-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    ➕ Créer
                  </button>
                </div>
              </form>
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

// Composant pour afficher une carte de template
const TemplateCard = ({ template, onUse, onDuplicate, onDelete, isPopular = false }) => {
  return (
    <div style={{
      background: 'var(--color-bg-primary)',
      borderRadius: '12px',
      padding: '1.5rem',
      border: isPopular ? '2px solid var(--color-warning)' : '1px solid var(--color-border)',
      transition: 'all 0.2s ease',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = 'var(--shadow-lg)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }}
    >
      {isPopular && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '12px',
          background: 'var(--color-warning)',
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: '700'
        }}>
          🔥 POPULAIRE
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div>
          <h4 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.1rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)'
          }}>
            {template.name}
          </h4>
          <div style={{
            background: 'var(--color-primary)',
            color: 'white',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '600',
            display: 'inline-block'
          }}>
            {template.category}
          </div>
        </div>
      </div>

      {template.description && (
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)',
          margin: '0 0 1rem 0',
          lineHeight: '1.4'
        }}>
          {template.description}
        </p>
      )}

      {/* Statistiques */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        fontSize: '0.8rem',
        color: 'var(--color-text-secondary)'
      }}>
        {template.usageCount && (
          <span>📊 {template.usageCount} utilisations</span>
        )}
        {template.createdAt && (
          <span>📅 {new Date(template.createdAt).toLocaleDateString('fr-FR')}</span>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={onUse}
          style={{
            background: 'var(--color-success)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          ✨ Utiliser
        </button>

        <button
          onClick={onDuplicate}
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            padding: '0.5rem',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Dupliquer"
        >
          📋
        </button>

        <button
          onClick={onDelete}
          style={{
            background: 'var(--color-error)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Supprimer"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ProjectTemplates;