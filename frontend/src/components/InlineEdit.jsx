import React, { useState } from 'react';
import { updateItemField } from '../api/clientApi';

const InlineEdit = ({ 
  itemId, 
  field, 
  value, 
  onUpdate, 
  type = 'text',
  suffix = '',
  style = {},
  className = '' 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation(); // Empêcher l'ouverture du modal
    setIsEditing(true);
    setEditValue(value || '');
  };

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await updateItemField(itemId, field, editValue);
      onUpdate && onUpdate(field, editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
      setEditValue(value); // Remettre l'ancienne valeur
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleInputClick = (e) => {
    e.stopPropagation(); // Empêcher l'ouverture du modal
  };

  if (isEditing) {
    return (
      <div onClick={handleInputClick} style={{ display: 'inline-block', ...style }}>
        <input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          disabled={isLoading}
          style={{
            background: 'var(--color-surface)',
            border: '2px solid var(--color-primary)',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            color: 'inherit',
            width: type === 'number' ? '80px' : 'auto',
            minWidth: '60px'
          }}
        />
        {isLoading && <span style={{ marginLeft: '4px', fontSize: '0.8rem' }}>💾</span>}
      </div>
    );
  }

  return (
    <span 
      onClick={handleClick} 
      className={className}
      style={{ 
        cursor: 'pointer',
        padding: '2px 4px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
        display: 'inline-block',
        ...style
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-bg-secondary)'}
      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      title={`Cliquer pour modifier ${field}`}
    >
      {value || 'N/A'}{suffix}
    </span>
  );
};

export default InlineEdit;