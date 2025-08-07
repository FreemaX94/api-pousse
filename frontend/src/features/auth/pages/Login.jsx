// frontend/src/features/auth/pages/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Configuration API avec credentials activés
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
      console.log('Login: Tentative de connexion pour', form.username);
      const response = await api.post(
        '/auth/login',
        { username: form.username, password: form.password }
      );
      console.log('Login: Connexion réussie', response.data);
      toast.success('Connexion réussie !');
      // Si "remember me", on pourrait stocker en localStorage, sinon laisser le cookie de session
      if (form.remember) {
        localStorage.setItem('rememberedUser', form.username);
      } else {
        localStorage.removeItem('rememberedUser');
      }
      
      // Forcer un rechargement de la page pour que PrivateRoute revérifie l'authentification
      window.location.href = '/app/home';
    } catch (err) {
      // Gérer le message d'erreur renvoyé par le serveur si besoin
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Nom d'utilisateur ou mot de passe invalide";
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '120%',
        height: '120%',
        background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '32px',
        padding: '3rem',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Inner decorative element */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(45deg, rgba(102,126,234,0.03), rgba(118,75,162,0.03))',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            fontSize: '2.8rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            textShadow: '0 4px 20px rgba(102,126,234,0.3)'
          }}>
            🔐 Connexion
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: '1.1rem',
            fontWeight: '500',
            margin: 0
          }}>
            Accédez à votre espace de gestion
          </p>
        </div>

        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            border: '2px solid #fca5a5',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            color: '#dc2626',
            fontWeight: '600',
            boxShadow: '0 8px 25px rgba(239, 68, 68, 0.15)',
            position: 'relative',
            zIndex: 1
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          display: 'grid',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <label htmlFor="username" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#1e293b'
            }}>
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
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: '2px solid rgba(148,163,184,0.3)',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: '500',
                background: 'rgba(255,255,255,0.9)',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
            />
          </div>

          <div>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#1e293b'
            }}>
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
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: '2px solid rgba(148,163,184,0.3)',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: '500',
                background: 'rgba(255,255,255,0.9)',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.9rem'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <input
                name="remember"
                type="checkbox"
                checked={form.remember}
                onChange={handleChange}
                style={{
                  width: '18px',
                  height: '18px',
                  marginRight: '0.5rem',
                  accentColor: '#667eea'
                }}
              />
              <span style={{
                color: '#475569',
                fontWeight: '500'
              }}>Se souvenir de moi</span>
            </label>
            <Link to="/forgot-password" style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1.25rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              background: loading ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading ? '0 8px 25px rgba(156,163,175,0.3)' : '0 15px 35px rgba(102,126,234,0.4)',
              transform: loading ? 'scale(0.98)' : 'scale(1)'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px) scale(1.02)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0) scale(1)')}
          >
            {loading ? '⏳ Connexion en cours...' : '🚀 Se connecter'}
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '2rem 0',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            flex: 1,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.3), transparent)'
          }} />
          <span style={{
            margin: '0 1rem',
            color: '#64748b',
            fontWeight: '500',
            background: 'rgba(255,255,255,0.8)',
            padding: '0.5rem 1rem',
            borderRadius: '12px'
          }}>ou</span>
          <div style={{
            flex: 1,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.3), transparent)'
          }} />
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '1rem',
          color: '#64748b',
          fontWeight: '500',
          margin: 0,
          position: 'relative',
          zIndex: 1
        }}>
          Pas de compte ?{' '}
          <Link to="/signup" style={{
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: '700',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            S'inscrire maintenant
          </Link>
        </p>
      </div>
    </div>
  );
}
