import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/clientApi';
import { toast } from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import zxcvbn from 'zxcvbn';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

export default function Signup() {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirm: '',
    acceptTOS: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = zxcvbn(form.password).score;
  const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setError('');
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
      const token = await recaptchaRef.current.executeAsync();
      if (!token) {
        setError('Token reCAPTCHA manquant.');
        return;
      }

      await api.post('/auth/register', {
        username: form.username,
        password: form.password,
        email: form.email,
        fullname: form.fullname,
        recaptcha: token
      });
      toast.success('Inscription réussie !');
      navigate('/app/login', { replace: true });
    } catch (err) {
      console.error('❌ Erreur inscription :', err);
      if (err.response) {
        console.error('📦 Réponse du backend :', err.response.data);
        setError(err.response.data.message || 'Erreur inconnue');
      } else if (err.request) {
        console.error('🚫 Aucune réponse du serveur');
        setError('Serveur injoignable.');
      } else {
        console.error('❗ Erreur inattendue :', err.message);
        setError('Erreur inconnue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
        background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        width: '100%',
        maxWidth: '520px',
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
          background: 'linear-gradient(45deg, rgba(79,172,254,0.03), rgba(0,242,254,0.03))',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            fontSize: '2.8rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            textShadow: '0 4px 20px rgba(79,172,254,0.3)'
          }}>
            ✨ Créer un compte
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: '1.1rem',
            fontWeight: '500',
            margin: 0
          }}>
            Rejoignez-nous et commencez votre aventure
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <label htmlFor="fullname" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700',
                color: '#1e293b'
              }}>
                👤 Nom complet
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                value={form.fullname}
                onChange={handleChange}
                required
                autoFocus
                placeholder="Votre nom complet"
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
                onFocus={(e) => e.target.style.borderColor = '#4facfe'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
              />
            </div>

            <div>
              <label htmlFor="username" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700',
                color: '#1e293b'
              }}>
                🏷️ Nom d'utilisateur
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
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
                onFocus={(e) => e.target.style.borderColor = '#4facfe'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              📧 Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="votre.email@exemple.com"
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
              onFocus={(e) => e.target.style.borderColor = '#4facfe'}
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
              placeholder="Votre mot de passe sécurisé"
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: '2px solid rgba(148,163,184,0.3)',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: '500',
                background: 'rgba(255,255,255,0.9)',
                transition: 'all 0.3s ease',
                outline: 'none',
                marginBottom: '0.5rem'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4facfe'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
            />
            
            {/* Barre de force du mot de passe premium */}
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(148,163,184,0.2)',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '0.5rem'
            }}>
              <div
                style={{
                  height: '100%',
                  width: `${(strength + 1) * 20}%`,
                  background: ['#ef4444','#f59e0b','#eab308','#22c55e','#16a34a'][strength],
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </div>
            <p style={{
              fontSize: '0.8rem',
              color: ['#ef4444','#f59e0b','#eab308','#22c55e','#16a34a'][strength],
              fontWeight: '600',
              margin: 0
            }}>
              🛡️ {strengthLabels[strength]}
            </p>
          </div>

          <div>
            <label htmlFor="confirm" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              🔐 Confirmer le mot de passe
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              required
              placeholder="Confirmez votre mot de passe"
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
              onFocus={(e) => e.target.style.borderColor = '#4facfe'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.9rem'
          }}>
            <input
              id="acceptTOS"
              name="acceptTOS"
              type="checkbox"
              checked={form.acceptTOS}
              onChange={handleChange}
              style={{
                width: '20px',
                height: '20px',
                accentColor: '#4facfe'
              }}
            />
            <label htmlFor="acceptTOS" style={{
              color: '#475569',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              J'accepte les{' '}
              <Link to="/terms" style={{
                color: '#4facfe',
                textDecoration: 'none',
                fontWeight: '700'
              }}>
                conditions générales
              </Link>
            </label>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(79,172,254,0.05), rgba(0,242,254,0.05))',
            borderRadius: '16px',
            border: '2px solid rgba(79,172,254,0.1)'
          }}>
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              size="invisible"
              ref={recaptchaRef}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !form.acceptTOS}
            style={{
              width: '100%',
              padding: '1.25rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              background: (loading || !form.acceptTOS) ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : 'linear-gradient(135deg, #4facfe, #00f2fe)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: (loading || !form.acceptTOS) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: (loading || !form.acceptTOS) ? '0 8px 25px rgba(156,163,175,0.3)' : '0 15px 35px rgba(79,172,254,0.4)',
              transform: (loading || !form.acceptTOS) ? 'scale(0.98)' : 'scale(1)',
              opacity: (loading || !form.acceptTOS) ? 0.7 : 1
            }}
            onMouseEnter={(e) => (!loading && form.acceptTOS) && (e.target.style.transform = 'translateY(-2px) scale(1.02)')}
            onMouseLeave={(e) => (!loading && form.acceptTOS) && (e.target.style.transform = 'translateY(0) scale(1)')}
          >
            {loading ? '⏳ Création en cours...' : '🚀 S\'inscrire'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <p style={{
            fontSize: '1rem',
            color: '#64748b',
            fontWeight: '500',
            margin: 0
          }}>
            Déjà un compte ?{' '}
            <Link to="/app/login" style={{
              color: '#4facfe',
              textDecoration: 'none',
              fontWeight: '700',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

