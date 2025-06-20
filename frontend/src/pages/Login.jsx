// frontend/src/pages/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/clientApi';
import { toast } from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Appel à votre API d'authentification
      // Le backend doit répondre avec un JWT ou un cookie httpOnly
      await api.post(
        '/auth/login',
        { username: form.username, password: form.password },
        { withCredentials: true }
      );
      toast.success('Connexion réussie !');
      // Si "remember me", on pourrait stocker en localStorage, sinon laisser le cookie de session
      if (form.remember) {
        localStorage.setItem('rememberedUser', form.username);
      } else {
        localStorage.removeItem('rememberedUser');
      }
      navigate('/home', { replace: true });
    } catch (err) {
      // Gérer le message d'erreur renvoyé par le serveur si besoin
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Nom d’utilisateur ou mot de passe invalide';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Préremplir le champ utilisateur si on a un rememberedUser
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
      setForm(f => ({ ...f, username: remembered, remember: true }));
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-sm p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="mb-6 text-3xl font-extrabold text-center">Se connecter</h2>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium">
              Nom d’utilisateur
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center">
              <input
                name="remember"
                type="checkbox"
                checked={form.remember}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2">Se souvenir de moi</span>
            </label>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500">ou</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <p className="mt-6 text-sm text-center text-gray-600">
          Pas de compte ?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            S’inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
