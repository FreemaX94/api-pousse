// src/pages/NotFound.jsx
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-green-900 to-green-600 text-white text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Oups ! Cette page n'existe pas.</p>
      <button
        onClick={() => navigate('/')}
        className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-100 transition"
      >
        Retour à l'accueil
      </button>
    </div>
  );
}