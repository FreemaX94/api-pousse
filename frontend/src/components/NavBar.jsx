// src/components/NavBar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto relative flex items-center h-16">
        {/* Bouton déconnexion positionné à droite */}
        <button
          onClick={handleLogout}
          className="absolute right-0 mr-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Se déconnecter
        </button>

        {/* Titre centré */}
        <h1
          className="mx-auto text-2xl uppercase"
          style={{ fontFamily: 'BodoniBauerBQ' }}
        >
          POUSSE
        </h1>
      </div>
    </header>
  );
}
