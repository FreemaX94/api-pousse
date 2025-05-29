import React, { useEffect, useState } from 'react';
import InvoiceList from './InvoiceList';
import ExpenseList from './ExpenseList';
import InvoiceForm from './InvoiceForm';
import ExpenseForm from './ExpenseForm';
import Modal from './Modal';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [notesFrais, setNotesFrais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const BASE = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    try {
      const [invRes, nfRes] = await Promise.all([
        fetch(`${BASE}/api/invoices`),
        fetch(`${BASE}/api/expenses`),
      ]);
      const [invData, nfData] = await Promise.all([
        invRes.json(),
        nfRes.json(),
      ]);
      setInvoices(invData);
      setNotesFrais(nfData);
      console.log('📊 Factures rechargées :', invData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [BASE]);

  const totalFactures = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalNotes = notesFrais.reduce((sum, nf) => sum + nf.amount, 0);

  const dataByMonth = {};
  [...invoices, ...notesFrais].forEach(item => {
    try {
      console.log('🧪 Facture date brute :', item.date);
      const date = new Date(item.date);
      console.log('📅 Date JS interprétée :', date);
      if (isNaN(date)) throw new Error('Invalid date');
      const monthKey = date.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      if (!dataByMonth[monthKey]) dataByMonth[monthKey] = { month: monthKey, ca: 0, notes: 0 };
      if (invoices.includes(item)) {
        dataByMonth[monthKey].ca += item.amount;
      } else {
        dataByMonth[monthKey].notes += item.amount;
      }
    } catch (err) {
      console.warn('❌ Erreur de parsing de date pour item :', item, err.message);
    }
  });

  const chartData = Object.values(dataByMonth).sort((a, b) =>
    new Date(a.month) - new Date(b.month)
  );

  const handleInvoiceCreated = () => {
    setShowInvoiceModal(false);
    fetchData();
  };

  const handleNoteCreated = () => {
    setShowNotesModal(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-white to-gray-100">
      <div className="px-6 mx-auto max-w-7xl">
        <h1 className="mb-8 text-5xl font-extrabold text-center text-gray-800">Comptabilité</h1>

        <div className="flex justify-center mb-10 space-x-4">
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="px-6 py-3 text-white transition bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700"
          >
            + Nouvelle facture
          </button>
          <button
            onClick={() => setShowNotesModal(true)}
            className="px-6 py-3 text-white transition bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700"
          >
            + Note de frais salarié
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2">
          {[ 
            { label: 'Total factures carte', value: `${totalFactures.toFixed(2)} €`, color: 'text-red-600' },
            { label: 'Total notes de frais salariés', value: `${totalNotes.toFixed(2)} €`, color: 'text-yellow-600' },
          ].map((card, idx) => (
            <div key={idx} className="p-8 transition bg-white shadow-xl rounded-3xl hover:shadow-2xl">
              <p className="mb-4 text-sm font-medium tracking-wider text-gray-400 uppercase">{card.label}</p>
              <p className={`text-4xl font-extrabold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="p-8 mb-12 bg-white shadow-xl rounded-3xl">
          <p className="mb-4 text-sm font-medium tracking-wider text-gray-400 uppercase">Évolution mensuelle</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Legend verticalAlign="top" height={36}/>
                <Bar dataKey="ca" name="Factures carte" fill="#EF4444" radius={[8, 8, 0, 0]} />
                <Bar dataKey="notes" name="Notes de frais" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="p-6 bg-white shadow-xl rounded-3xl">
            <p className="pb-2 mb-4 text-xl font-semibold text-gray-700 border-b">Factures récentes</p>
            <ul className="divide-y divide-gray-200">
              {invoices.slice(0, 5).map(({ _id, employee, pole, amount }) => (
                <li key={_id} className="py-3 transition hover:bg-gray-50">
                  <span className="font-medium text-gray-900">
                    {employee} – {pole} – {parseFloat(amount).toFixed(2)} euros
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-white shadow-xl rounded-3xl">
            <p className="pb-2 mb-4 text-xl font-semibold text-gray-700 border-b">Notes de frais récentes</p>
            <ul className="divide-y divide-gray-200">
              {notesFrais.slice(0, 5).map(({ _id, employee, amount }) => (
                <li key={_id} className="py-3 transition hover:bg-gray-50">
                  <span className="font-medium text-gray-900">
                    {employee} – {parseFloat(amount).toFixed(2)} euros
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Modal isOpen={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} title="Nouvelle facture">
          <InvoiceForm onSuccess={handleInvoiceCreated} />
        </Modal>
        <Modal isOpen={showNotesModal} onClose={() => setShowNotesModal(false)} title="Nouvelle note de frais salarié">
          <ExpenseForm onSuccess={handleNoteCreated} />
        </Modal>
      </div>
    </div>
  );
}

