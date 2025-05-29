import React, { useEffect, useState } from 'react'
import InvoiceList from './InvoiceList'
import ExpenseList from './ExpenseList'
import InvoiceForm from './InvoiceForm'
import ExpenseForm from './ExpenseForm'
import Modal from './Modal'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function Dashboard() {
  const [invoices, setInvoices] = useState([])
  const [notesFrais, setNotesFrais] = useState([])
  const [loading, setLoading] = useState(true)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const BASE = import.meta.env.VITE_API_URL

  useEffect(() => {
    async function fetchData() {
      try {
        const [invRes, nfRes] = await Promise.all([
          fetch(`${BASE}/api/invoices`),
          fetch(`${BASE}/api/expenses`),
        ])
        const [invData, nfData] = await Promise.all([
          invRes.json(),
          nfRes.json(),
        ])
        setInvoices(invData)
        setNotesFrais(nfData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [BASE])

  const totalFactures = invoices.reduce((sum, inv) => sum + (inv.total ?? inv.amount), 0)
  const totalNotes = notesFrais.reduce((sum, nf) => sum + nf.amount, 0)

  const dataByMonth = {}
  ;[...invoices, ...notesFrais].forEach(item => {
    const monthKey = new Date(item.date).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    })
    if (!dataByMonth[monthKey]) dataByMonth[monthKey] = { month: monthKey, ca: 0, notes: 0 }
    if (invoices.includes(item)) dataByMonth[monthKey].ca += item.total ?? item.amount
    else dataByMonth[monthKey].notes += item.amount
  })
  const chartData = Object.values(dataByMonth).sort((a, b) => new Date(a.month) - new Date(b.month))

  const handleInvoiceCreated = newInv => {
    setInvoices(prev => [newInv, ...prev])
    setShowInvoiceModal(false)
  }

  const handleNoteCreated = newNote => {
    setNotesFrais(prev => [newNote, ...prev])
    setShowNotesModal(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-500">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8">Comptabilité</h1>

        <div className="flex justify-center space-x-4 mb-10">
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
          >
            + Nouvelle facture
          </button>
          <button
            onClick={() => setShowNotesModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
          >
            + Note de frais salarié
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {[ 
            { label: 'Total factures carte', value: `${totalFactures.toFixed(2)} €`, color: 'text-red-600' },
            { label: 'Total notes de frais salariés', value: `${totalNotes.toFixed(2)} €`, color: 'text-yellow-600' },
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition">
              <p className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">{card.label}</p>
              <p className={`text-4xl font-extrabold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <p className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Évolution mensuelle</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <p className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Factures récentes</p>
            <ul className="divide-y divide-gray-200">
              {invoices.slice(0, 5).map(({ _id, employee, pole, total }) => (
                <li key={_id} className="py-3 hover:bg-gray-50 transition">
                  <span className="text-gray-900 font-medium">
                    {employee} – {pole} – {parseFloat(total).toFixed(2)} euros
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <p className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Notes de frais récentes</p>
            <ul className="divide-y divide-gray-200">
              {notesFrais.slice(0, 5).map(({ _id, employee, amount }) => (
                <li key={_id} className="py-3 hover:bg-gray-50 transition">
                  <span className="text-gray-900 font-medium">
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
  )
}
