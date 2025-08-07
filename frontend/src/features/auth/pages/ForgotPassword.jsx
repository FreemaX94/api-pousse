// frontend/src/pages/ForgotPassword.jsx

import React, { useState } from 'react';
import { api } from '../../../shared/api/domains/inventory/clientApi';
import { toast } from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRecaptcha = value => setToken(value);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!token) return toast.error('Confirmez que vous n’êtes pas un robot');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email, recaptcha: token });
      toast.success('Email de réinitialisation envoyé');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
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
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '120%',
        height: '120%',
        background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        width: '100%',
        maxWidth: '500px',
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
          left: '-50%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(45deg, rgba(240,147,251,0.03), rgba(245,87,108,0.03))',
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
            fontSize: '2.5rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            textShadow: '0 4px 20px rgba(240,147,251,0.3)'
          }}>
            🔑 Mot de passe oublié
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: '1rem',
            fontWeight: '500',
            lineHeight: '1.5',
            margin: 0
          }}>
            Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          display: 'grid',
          gap: '2rem',
          position: 'relative',
          zIndex: 1
        }}>
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
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              onFocus={(e) => e.target.style.borderColor = '#f093fb'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
            />
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(240,147,251,0.05), rgba(245,87,108,0.05))',
            borderRadius: '16px',
            border: '2px solid rgba(240,147,251,0.1)'
          }}>
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleRecaptcha}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !token}
            style={{
              width: '100%',
              padding: '1.25rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              background: (loading || !token) ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : 'linear-gradient(135deg, #f093fb, #f5576c)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: (loading || !token) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: (loading || !token) ? '0 8px 25px rgba(156,163,175,0.3)' : '0 15px 35px rgba(240,147,251,0.4)',
              transform: (loading || !token) ? 'scale(0.98)' : 'scale(1)',
              opacity: (loading || !token) ? 0.7 : 1
            }}
            onMouseEnter={(e) => (!loading && token) && (e.target.style.transform = 'translateY(-2px) scale(1.02)')}
            onMouseLeave={(e) => (!loading && token) && (e.target.style.transform = 'translateY(0) scale(1)')}
          >
            {loading ? '📤 Envoi en cours...' : '🚀 Envoyer le lien'}
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
            Vous vous souvenez de votre mot de passe ?{' '}
            <a href="/login" style={{
              color: '#f093fb',
              textDecoration: 'none',
              fontWeight: '700',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Retourner à la connexion
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


