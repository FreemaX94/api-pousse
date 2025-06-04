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
      console.log('✅ Token généré par reCAPTCHA :', token);
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
      navigate('/login', { replace: true });
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-xl rounded-2xl">
        <h2 className="text-3xl font-extrabold text-center">Créer un compte</h2>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullname" className="block mb-1 text-sm font-medium">
              Nom complet
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              value={form.fullname}
              onChange={handleChange}
              required
              autoFocus
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <div className="h-2 mt-2 bg-gray-200 rounded">
              <div
                className={`h-full rounded ${['w-1/5','w-2/5','w-3/5','w-4/5','w-full'][strength]}`}
                style={{backgroundColor: ['#f56565','#ed8936','#ecc94b','#48bb78','#38a169'][strength]}}
              />
            </div>
            <p className="mt-1 text-xs">{strengthLabels[strength]}</p>
          </div>

          <div>
            <label htmlFor="confirm" className="block mb-1 text-sm font-medium">
              Confirmer le mot de passe
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center text-sm">
            <input
              id="acceptTOS"
              name="acceptTOS"
              type="checkbox"
              checked={form.acceptTOS}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="acceptTOS" className="ml-2">
              J’accepte les{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">
                conditions générales
              </Link>
            </label>
          </div>

          <div className="my-4">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              size="invisible"
              ref={recaptchaRef}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-green-500 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Création…' : 'S’inscrire'}
          </button>
        </form>

        <div className="text-sm text-center text-gray-600">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

