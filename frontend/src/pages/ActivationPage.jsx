// src/pages/ActivationPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/clientApi';

const ActivationPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState({ loading: true, message: '', error: false });

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await api.get(`/api/auth/activate/${token}`);
        setStatus({ loading: false, message: response.data.message || 'Votre compte a bien été activé !', error: false });
      } catch (err) {
        const msg = err.response?.data?.message || 'Échec de l’activation : token invalide ou expiré.';
        setStatus({ loading: false, message: msg, error: true });
      }
    };
    activateAccount();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-md rounded-lg text-center">
        {status.loading ? (
          <p>Activation en cours...</p>
        ) : (
          <>
            <h2 className={`text-2xl font-bold mb-4 ${status.error ? 'text-red-600' : 'text-green-600'}`}>
              {status.error ? 'Erreur' : 'Succès'}
            </h2>
            <p className="mb-6">{status.message}</p>
            {status.error ? (
              <Link to="/" className="text-blue-500 hover:underline">Retour à l’accueil</Link>
            ) : (
              <Link to="/login" className="text-blue-500 hover:underline">Se connecter</Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivationPage;

/*
  Modifications ajoutées :
  1. Création d’un nouveau composant React `ActivationPage.jsx` sous `src/pages/`.
  2. Récupération du `token` depuis l’URL via `useParams()`.
  3. Appel GET à `/api/auth/activate/:token` avec `axios`.
  4. Gestion des états `loading`, `success` et `error` pour afficher un message approprié et un lien.
*/
