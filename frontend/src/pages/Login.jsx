// frontend/src/pages/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/clientApi';
import { toast } from 'react-hot-toast';
import '../styles/login.css';

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
      navigate('/app/home', { replace: true });
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
    <div className="login-container">
      <div className="login-bg-decoration" />
      
      <div className="login-card">
        <div className="login-card-decoration" />

        <div className="login-header">
          <h2 className="login-title">
            🔐 Connexion
          </h2>
          <p className="login-subtitle">
            Accédez à votre espace de gestion
          </p>
        </div>

        {error && (
          <div className="login-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">
              👤 Nom d'utilisateur
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
              placeholder="Votre nom d'utilisateur"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              🔒 Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Votre mot de passe"
              className="form-input"
            />
          </div>

          <div className="form-remember-forgot">
            <label className="form-remember">
              <input
                name="remember"
                type="checkbox"
                checked={form.remember}
                onChange={handleChange}
              />
              <span>Se souvenir de moi</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? '⏳ Connexion en cours...' : '🚀 Se connecter'}
          </button>
        </form>

        <div className="login-divider">
          <div className="login-divider-line" />
          <span className="login-divider-text">ou</span>
          <div className="login-divider-line" />
        </div>

        <p className="login-signup">
          Pas de compte ?{' '}
          <Link to="/signup" className="signup-link">
            S'inscrire maintenant
          </Link>
        </p>
      </div>
    </div>
  );
}
