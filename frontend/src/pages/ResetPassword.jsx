// frontend/src/pages/ResetPassword.jsx

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/clientApi';
import { toast } from 'react-hot-toast';
import zxcvbn from 'zxcvbn';

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token = search.get('token') || '';
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const strength = zxcvbn(password).score;

  const navigate = useNavigate();
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      toast.success('Mot de passe changé');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const strengthLabels = ['Très faible','Faible','Moyen','Fort','Très fort'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
        <h2 className="text-xl font-bold">Réinitialiser le mot de passe</h2>
        <label className="block">
          Nouveau mot de passe
          <input
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </label>
        <div>
          <div className="h-2 bg-gray-200 rounded">
            <div
              className={`h-full rounded ${['w-1/5','w-2/5','w-3/5','w-4/5','w-full'][strength]}`}
              style={{ backgroundColor: ['#f56565','#ed8936','#ecc94b','#48bb78','#38a169'][strength] }}
            />
          </div>
          <p className="text-sm mt-1">{strengthLabels[strength]}</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Enregistrement…' : 'Changer le mot de passe'}
        </button>
      </form>
    </div>
  );
}
