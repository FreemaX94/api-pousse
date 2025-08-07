import React, { useEffect, useState } from 'react';
import api, { handleApiError } from '../../../api/axios';

export default function InvoiceList({ invoicesOverride }) {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (invoicesOverride?.length > 0) {
      setInvoices(invoicesOverride);
    } else {
      const fetchInvoices = async () => {
        try {
          setLoading(true);
          const response = await api.get('/invoices');
          setInvoices(response.data.data || response.data || []);
          setError(null);
        } catch (err) {
          console.error('Échec fetch factures :', err);
          const errorInfo = handleApiError(err);
          setError(errorInfo);
        } finally {
          setLoading(false);
        }
      };
      fetchInvoices();
    }
  }, [invoicesOverride]);

  if (loading) return <div className="text-blue-600">Chargement des factures...</div>;
  if (error) return <div className="text-red-600">Erreur : {error.message}</div>;
  if (invoices.length === 0) return <p className="text-center text-gray-500">Aucune facture enregistrée.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="mb-4 text-lg font-semibold text-center">Factures enregistrées</h2>
      <ul className="space-y-3">
        {invoices.map((inv) => (
          <li key={inv._id} className="p-4 bg-white border rounded-md shadow">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{inv.client}</span>
              <span className="text-sm text-gray-500">{new Date(inv.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="mt-1 text-sm text-gray-700">
              <p><strong>Employé :</strong> {inv.employee}</p>
              <p><strong>Pôle :</strong> {inv.pole}</p>
              <p><strong>Détails :</strong> {inv.details}</p>
              <p><strong>Montant :</strong> {inv.amount} €</p>
              <p><strong>Status :</strong> {inv.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

