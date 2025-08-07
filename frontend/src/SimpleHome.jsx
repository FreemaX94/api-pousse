import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SimpleHome() {
  const navigate = useNavigate();

  const sections = [
    { label: 'Événements', path: '/app/evenements' },
    { label: 'Création', path: '/app/creation' },
    { label: 'Dépôt', path: '/app/depot' },
    { label: 'Véhicules', path: '/app/vehicules' },
    { label: 'Comptabilité', path: '/app/comptabilite' }
  ];

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5dc',
      minHeight: 'calc(100vh - 4rem)'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#333'
      }}>
        🌱 Espace Pousse
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {sections.map((section) => (
          <button
            key={section.label}
            onClick={() => navigate(section.path)}
            style={{
              padding: '1rem',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#e6ddd4';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
}