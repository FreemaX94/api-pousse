// frontend/src/pages/ForgotPassword.jsx

import React, { useState } from 'react';
import api from '../api/clientApi';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Mot de passe oublié</h2>
        <p className="text-sm text-gray-600 mb-4">
          Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            Adresse e-mail
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </label>
          <div>
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleRecaptcha}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Envoi…' : 'Envoyer le lien'}
          </button>
        </form>
      </div>
    </div>
  );
}


