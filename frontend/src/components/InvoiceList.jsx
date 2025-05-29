// frontend/src/components/InvoiceList.jsx

import React, { useEffect, useState } from 'react';

function InvoiceList({ invoicesOverride }) {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (invoicesOverride && invoicesOverride.length > 0) {
      // Utiliser la liste passée en prop après création
      setInvoices(invoicesOverride);
    } else if (!invoicesOverride) {
      // Sinon, fetch depuis l’API
      async function fetchInvoices() {
        try {
          const res = await fetch(`${BASE}/api/invoices`);
          if (!res.ok) throw new Error(`Erreur ${res.status} ${res.statusText}`);
          const data = await res.json();
          setInvoices(data);
        } catch (err) {
          console.error('Échec fetch factures :', err);
          setError(err);
        }
      }
      fetchInvoices();
    }
  }, [BASE, invoicesOverride]);

  if (error) {
    return <div className="text-red-600">Erreur : {error.message}</div>;
  }
  if (invoices.length === 0) {
    return <p className="text-gray-700">Aucune facture trouvée.</p>;
  }

  return (
    <ul className="space-y-2">
      {invoices.map((inv) => {
        // On récupère number et total (pas id/amount)
        const { _id, number, total, date, clientName } = inv;
        return (
          <li key={_id} className="text-gray-900">
            <strong>Facture #{number}</strong> – {total} €{' '}
            <em className="text-gray-600">
              ({new Date(date).toLocaleDateString()})
            </em>
            {clientName && (
              <p className="text-gray-800 ml-4">Client : {clientName}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default InvoiceList;
