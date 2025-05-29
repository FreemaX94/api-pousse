import React, { useEffect, useState } from 'react';

export default function InvoiceList({ invoicesOverride }) {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || window.location.origin;

  useEffect(() => {
    if (invoicesOverride?.length > 0) {
      setInvoices(invoicesOverride);
    } else {
      async function fetchInvoices() {
        try {
          const res = await fetch(`${baseUrl}/api/invoices`);
          if (!res.ok) throw new Error(`Erreur ${res.status} ${res.statusText}`);
          const data = await res.json();
          setInvoices(data.data || []);
        } catch (err) {
          console.error('Échec fetch factures :', err);
          setError(err);
        }
      }
      fetchInvoices();
    }
  }, [baseUrl, invoicesOverride]);

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

