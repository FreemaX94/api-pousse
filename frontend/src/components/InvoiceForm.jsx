import React, { useState } from 'react';
import { CheckCircle, User, CalendarDays, FileText, Euro, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InvoiceForm({ onSuccess }) {
  const [employee, setEmployee] = useState('');
  const [pole, setPole] = useState('Entretien');
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || window.location.origin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    const payload = {
      employee,
      pole,
      client,
      details,
      dueDate,
      amount: parseFloat(amount),
      date: dueDate
    };

    try {
      const res = await fetch(`${baseUrl}/api/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Erreur ${res.status}`);
      }

      const newInvoice = await res.json();
      onSuccess?.(newInvoice);
      setEmployee('');
      setPole('Entretien');
      setDetails('');
      setDueDate('');
      setClient('');
      setAmount('');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl px-10 py-12 mx-auto border border-gray-100 shadow-xl bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-black rounded-3xl">
      <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-center text-gray-900 dark:text-white">Nouvelle facture</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none left-3 top-1/2" />
          <input
            type="text"
            name="employee"
            placeholder="Salarié"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            className="w-full py-3 pl-10 pr-4 border border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />
        </div>
        <div className="relative">
          <Building2 className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none left-3 top-1/2" />
          <select
            className="w-full py-3 pl-10 pr-4 border border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={pole}
            onChange={(e) => setPole(e.target.value)}
            required
          >
            <option value="Entretien">Entretien</option>
            <option value="Création">Création</option>
            <option value="Livraison">Livraison</option>
          </select>
        </div>
        <div className="relative">
          <FileText className="absolute w-5 h-5 text-gray-400 pointer-events-none left-3 top-3" />
          <textarea
            placeholder="Détails"
            className="w-full py-3 pl-10 pr-4 border border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        <div className="relative">
          <CalendarDays className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none left-3 top-1/2" />
          <input
            type="date"
            name="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full py-3 pl-10 pr-4 border border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none left-3 top-1/2" />
          <input
            type="text"
            name="client"
            placeholder="Client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="w-full py-3 pl-10 pr-4 border border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />
        </div>
        <div className="relative">
          <Euro className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none left-3 top-1/2" />
          <input
            type="number"
            step="0.01"
            name="amount"
            placeholder="Montant (€)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full py-3 pl-10 pr-4 border border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />
        </div>
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 font-semibold text-white transition duration-200 shadow-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl"
        >
          {loading ? 'Envoi...' : 'Créer la facture'}
        </motion.button>
        {error && <p className="text-sm text-center text-red-600">{error}</p>}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center mt-2 text-sm text-green-600"
            >
              <CheckCircle className="w-5 h-5 mr-2" /> Facture enregistrée avec succès !
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
