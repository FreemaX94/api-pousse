// frontend/src/pages/ForgotPassword.jsx

import React, { useState } from 'react';
import axios from 'axios';
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
      await axios.post(
        'http://localhost:3001/api/auth/forgot-password',
        { email, recaptcha: token }
      );
      toast.success('Email de réinitialisation envoyé');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Mot de passe oublié</h2>
        <label className="block mb-2">
          Votre e-mail
          <input
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </label>
        <div className="my-4">
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
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
  );
}
