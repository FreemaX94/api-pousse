import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  FunnelIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  CogIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  UserIcon,
  ShoppingBagIcon,
  TagIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  ChartPieIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatistiquesFacturationPremium = () => {
  const [selectedPeriod, setSelectedPeriod] = useState({
    start: new Date(2025, 6, 7),
    end: new Date(2025, 7, 7)
  });
  const [activeMenu, setActiveMenu] = useState('Synthèse');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterEtatClient, setFilterEtatClient] = useState('en_cours_refuse_accepte');
  const [filterEtatVendeur, setFilterEtatVendeur] = useState('tout');
  const [filterEtatAuteur, setFilterEtatAuteur] = useState('tout');
  const [filterEtatProduit, setFilterEtatProduit] = useState('tout');
  const [filterEtatCategorie, setFilterEtatCategorie] = useState('tout');

  // Menu latéral items
  const menuItems = [
    { id: 'Général', icon: ChartBarIcon, label: 'Général' },
    { id: 'Synthèse', icon: ChartPieIcon, label: 'Synthèse' },
    { id: 'Devis 12 mois', icon: DocumentTextIcon, label: 'Devis 12 derniers mois' },
    { id: 'Devis client', icon: UserIcon, label: 'Devis par client' },
    { id: 'Devis vendeur', icon: TrophyIcon, label: 'Devis par vendeur' },
    { id: 'Devis auteur', icon: UserIcon, label: 'Devis par auteur' },
    { id: 'Devis produit', icon: ShoppingBagIcon, label: 'Devis par produit' },
    { id: 'Devis catégorie', icon: TagIcon, label: 'Devis par catégorie de produit' },
    { id: 'Factures 12 mois', icon: DocumentTextIcon, label: 'Factures 12 derniers mois' },
    { id: 'Factures client', icon: UserIcon, label: 'Factures par client' },
    { id: 'Factures vendeur', icon: TrophyIcon, label: 'Factures par vendeur' },
    { id: 'Factures auteur', icon: UserIcon, label: 'Factures par auteur' },
    { id: 'Factures produit', icon: ShoppingBagIcon, label: 'Factures par produit' },
    { id: 'Factures catégorie', icon: TagIcon, label: 'Factures par catégorie de produit' },
    { id: 'Avoirs 12 mois', icon: DocumentTextIcon, label: 'Avoirs 12 derniers mois' },
    { id: 'Avoirs client', icon: UserIcon, label: 'Avoirs par client' },
    { id: 'Avoirs vendeur', icon: TrophyIcon, label: 'Avoirs par vendeur' },
    { id: 'Avoirs auteur', icon: UserIcon, label: 'Avoirs par auteur' },
    { id: 'Avoirs produit', icon: ShoppingBagIcon, label: 'Avoirs par produit' },
    { id: 'Avoirs catégorie', icon: TagIcon, label: 'Avoirs par catégorie de produit' },
    { id: 'TVA', icon: ReceiptPercentIcon, label: 'Montant taux TVA' }
  ];

  // Données statistiques Devis
  const statsDevis = [
    { type: 'Brouillon', nombre: 3, fraisTraitement: 0, totalHT: 1250.00, totalTVA: 250.00, totalTTC: 1500.00, margeHT: 450.00, montantPaye: 0 },
    { type: 'En cours', nombre: 8, fraisTraitement: 0, totalHT: 15680.00, totalTVA: 3136.00, totalTTC: 18816.00, margeHT: 5488.00, montantPaye: 0 },
    { type: 'Accepté', nombre: 45, fraisTraitement: 0, totalHT: 98450.00, totalTVA: 19690.00, totalTTC: 118140.00, margeHT: 34457.50, montantPaye: 95312.00 },
    { type: 'Refusé', nombre: 12, fraisTraitement: 0, totalHT: 22300.00, totalTVA: 4460.00, totalTTC: 26760.00, margeHT: 7805.00, montantPaye: 0 }
  ];

  // Données statistiques Factures
  const statsFactures = [
    { type: 'Brouillon', nombre: 2, fraisTraitement: 0, totalHT: 850.00, totalTVA: 170.00, totalTTC: 1020.00, margeHT: 297.50, montantPaye: 0 },
    { type: 'En cours', nombre: 15, fraisTraitement: 0, totalHT: 32450.00, totalTVA: 6490.00, totalTTC: 38940.00, margeHT: 11357.50, montantPaye: 0 },
    { type: 'Payé', nombre: 156, fraisTraitement: 0, totalHT: 245680.00, totalTVA: 49136.00, totalTTC: 294816.00, margeHT: 85988.00, montantPaye: 294816.00 },
    { type: 'Impayé', nombre: 23, fraisTraitement: 0, totalHT: 45230.00, totalTVA: 9046.00, totalTTC: 54276.00, margeHT: 15830.50, montantPaye: 0 }
  ];

  // Données statistiques Avoirs
  const statsAvoirs = [
    { type: 'Brouillon', nombre: 1, fraisTraitement: 0, totalHT: 150.00, totalTVA: 30.00, totalTTC: 180.00, margeHT: 52.50, montantPaye: 0 },
    { type: 'En cours', nombre: 3, fraisTraitement: 0, totalHT: 1250.00, totalTVA: 250.00, totalTTC: 1500.00, margeHT: 437.50, montantPaye: 0 },
    { type: 'Validé', nombre: 8, fraisTraitement: 0, totalHT: 5680.00, totalTVA: 1136.00, totalTTC: 6816.00, margeHT: 1988.00, montantPaye: 6816.00 }
  ];

  // Calcul des totaux
  const calculateTotals = (stats) => {
    return stats.reduce((acc, item) => {
      if (item.type !== 'Brouillon') {
        acc.totalHT += item.totalHT;
        acc.totalTVA += item.totalTVA;
        acc.totalTTC += item.totalTTC;
      }
      return acc;
    }, { totalHT: 0, totalTVA: 0, totalTTC: 0 });
  };

  const totalsFactures = calculateTotals(statsFactures);
  const totalsAvoirs = calculateTotals(statsAvoirs);
  const totalNet = {
    totalHT: totalsFactures.totalHT - totalsAvoirs.totalHT,
    totalTVA: totalsFactures.totalTVA - totalsAvoirs.totalTVA,
    totalTTC: totalsFactures.totalTTC - totalsAvoirs.totalTTC
  };

  // Graphique pour évolution 12 derniers mois
  const chartData12Months = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Devis',
        data: [45000, 52000, 48000, 61000, 58000, 72000, 85000, 78000, 92000, 88000, 95000, 102000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Factures',
        data: [42000, 48000, 45000, 58000, 55000, 68000, 82000, 75000, 88000, 85000, 92000, 98000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Avoirs',
        data: [2000, 1800, 2200, 1500, 1800, 2400, 2100, 1900, 2300, 2000, 2200, 2500],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
          }
        }
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const renderTableRow = (item, isTotal = false) => (
    <tr className={`${isTotal ? 'bg-gradient-to-r from-indigo-50 to-purple-50 font-semibold' : 'hover:bg-gray-50'} transition-colors duration-200`}>
      <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
      {!isTotal && <td className="px-4 py-3 text-sm text-center text-gray-700">{item.nombre}</td>}
      {!isTotal && <td className="px-4 py-3 text-sm text-center text-gray-700">{item.nombre > 0 ? 'Total' : '-'}</td>}
      <td className="px-4 py-3 text-sm text-right text-gray-700">{item.fraisTraitement.toFixed(2)} €</td>
      <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalHT.toFixed(2)} €</td>
      <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalTVA.toFixed(2)} €</td>
      <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{item.totalTTC.toFixed(2)} €</td>
      <td className="px-4 py-3 text-sm text-right text-gray-700">{item.margeHT.toFixed(2)} €</td>
      <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{item.montantPaye.toFixed(2)} €</td>
    </tr>
  );

  const renderGeneralContent = () => (
    <>
      {/* Section Devis */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Devis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Frais trait.</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TVA</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Marge HT</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant payé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statsDevis.map((item, index) => (
                <motion.tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">{item.nombre}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">Total</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.fraisTraitement.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalTVA.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{item.totalTTC.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.margeHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{item.montantPaye.toFixed(2)} €</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Section Factures */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <BanknotesIcon className="w-5 h-5 mr-2" />
            Factures
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Frais trait.</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TVA</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Marge HT</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant payé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statsFactures.map((item, index) => (
                <motion.tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">{item.nombre}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">Total</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.fraisTraitement.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalTVA.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{item.totalTTC.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.margeHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{item.montantPaye.toFixed(2)} €</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Section Avoirs */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <ReceiptPercentIcon className="w-5 h-5 mr-2" />
            Avoirs
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Frais trait.</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TVA</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Marge HT</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant payé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statsAvoirs.map((item, index) => (
                <motion.tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">{item.nombre}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">Total</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.fraisTraitement.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalTVA.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{item.totalTTC.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.margeHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{item.montantPaye.toFixed(2)} €</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Résumé final */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg border border-indigo-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">
            Montant Factures soustrait du montant des Avoirs
          </h3>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead className="border-b-2 border-indigo-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Document</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">HT</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">TVA</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">TTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-indigo-50 transition-colors duration-200">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Factures</td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">{totalsFactures.totalHT.toFixed(2)} €</td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">{totalsFactures.totalTVA.toFixed(2)} €</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{totalsFactures.totalTTC.toFixed(2)} €</td>
              </tr>
              <tr className="hover:bg-indigo-50 transition-colors duration-200">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Avoirs</td>
                <td className="px-4 py-3 text-sm text-right text-red-600">-{totalsAvoirs.totalHT.toFixed(2)} €</td>
                <td className="px-4 py-3 text-sm text-right text-red-600">-{totalsAvoirs.totalTVA.toFixed(2)} €</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-red-600">-{totalsAvoirs.totalTTC.toFixed(2)} €</td>
              </tr>
              <tr className="bg-gradient-to-r from-indigo-100 to-purple-100 font-bold">
                <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                <td className="px-4 py-3 text-sm text-right text-indigo-600">{totalNet.totalHT.toFixed(2)} €</td>
                <td className="px-4 py-3 text-sm text-right text-indigo-600">{totalNet.totalTVA.toFixed(2)} €</td>
                <td className="px-4 py-3 text-sm text-right text-indigo-700 text-lg">{totalNet.totalTTC.toFixed(2)} €</td>
              </tr>
            </tbody>
          </table>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Remarque :</strong> les chiffres ci-dessus comptabilisent tous les montants de documents qui ne sont pas en brouillon. 
              Cela inclut les montants des factures impayées.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );

  const renderSyntheseContent = () => (
    <>
      {/* Blocs de résumé en haut */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          variants={itemVariants} 
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Aujourd'hui</h4>
            <CalendarDaysIcon className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">0,00 €</div>
          <div className="text-sm text-gray-500 mt-1">sur 0 factures</div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">7 derniers jours</h4>
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">12 316,22 €</div>
          <div className="text-sm text-gray-500 mt-1">sur 16 factures</div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Ce mois</h4>
            <ChartBarIcon className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">3 983,81 €</div>
          <div className="text-sm text-gray-500 mt-1">sur 7 factures</div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Depuis le dernier bilan</h4>
            <BanknotesIcon className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">659 104,97 €</div>
          <div className="text-sm text-gray-500 mt-1">sur 1024 factures et factures d'acompte</div>
        </motion.div>
      </div>

      {/* Graphiques en barres */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Derniers devis acceptés */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Derniers devis acceptés</h3>
          <div className="h-64">
            <Bar 
              data={{
                labels: ['2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08'],
                datasets: [{
                  label: 'Montant TTC',
                  data: [12500, 18900, 15600, 22300, 19800, 24500, 21000],
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderColor: 'rgb(59, 130, 246)',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Dernières factures payées */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dernières factures payées</h3>
          <div className="h-64">
            <Bar 
              data={{
                labels: ['2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08'],
                datasets: [{
                  label: 'Montant TTC',
                  data: [28500, 32100, 29800, 35600, 31200, 38900, 34500],
                  backgroundColor: 'rgba(20, 184, 166, 0.8)',
                  borderColor: 'rgb(20, 184, 166)',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Derniers avoirs */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Derniers avoirs</h3>
          <div className="h-64">
            <Bar 
              data={{
                labels: ['2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08'],
                datasets: [{
                  label: 'Montant TTC',
                  data: [1200, 850, 1500, 920, 1100, 1800, 1350],
                  backgroundColor: 'rgba(168, 85, 247, 0.8)',
                  borderColor: 'rgb(168, 85, 247)',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Montant en attente des factures non payées */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Montant en attente des factures non payées</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camembert */}
          <div className="h-80">
            <Doughnut
              data={{
                labels: [
                  'Depuis 30 jours',
                  'Entre 30 jours et 60 jours',
                  'Il y a plus de 60 jours'
                ],
                datasets: [{
                  data: [59054.57, 57451.46, 1988461.36],
                  backgroundColor: [
                    'rgba(250, 204, 21, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                  ],
                  borderColor: [
                    'rgb(250, 204, 21)',
                    'rgb(251, 146, 60)',
                    'rgb(239, 68, 68)'
                  ],
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      font: {
                        size: 12
                      }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed);
                        return label + ': ' + value;
                      }
                    }
                  }
                }
              }}
            />
          </div>

          {/* Liste des montants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-400 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Depuis 30 jours</span>
              </div>
              <span className="text-lg font-bold text-gray-900">59 054,57 €</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-400 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Entre 30 jours et 60 jours</span>
              </div>
              <span className="text-lg font-bold text-gray-900">57 451,46 €</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Il y a plus de 60 jours</span>
              </div>
              <span className="text-lg font-bold text-gray-900">1 988 461,36 €</span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <span className="text-sm font-bold text-indigo-700">Depuis toujours</span>
                <span className="text-xl font-bold text-indigo-900">2 104 967,39 €</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section Devis */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Devis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Frais trait.</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TVA</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Marge HT</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant payé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statsDevis.map((item, index) => (
                <motion.tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">{item.nombre}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">Total</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.fraisTraitement.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalTVA.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{item.totalTTC.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.margeHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{item.montantPaye.toFixed(2)} €</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Section Factures */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <BanknotesIcon className="w-5 h-5 mr-2" />
            Factures
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Frais trait.</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TVA</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Marge HT</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant payé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statsFactures.map((item, index) => (
                <motion.tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">{item.nombre}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">Total</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.fraisTraitement.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalTVA.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{item.totalTTC.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.margeHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{item.montantPaye.toFixed(2)} €</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Section Avoirs */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <ReceiptPercentIcon className="w-5 h-5 mr-2" />
            Avoirs
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Frais trait.</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TVA</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Marge HT</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant payé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statsAvoirs.map((item, index) => (
                <motion.tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">{item.nombre}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700">Total</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.fraisTraitement.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.totalTVA.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{item.totalTTC.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{item.margeHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{item.montantPaye.toFixed(2)} €</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Résumé final */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg border border-indigo-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">
            Montant Factures soustrait du montant des Avoirs
          </h3>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead className="border-b-2 border-indigo-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Document</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">HT</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">TVA</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">TTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-indigo-50 transition-colors duration-200">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Factures</td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">{totalsFactures.totalHT.toFixed(2)} €</td>
                <td className="px-4 py-3 text-sm text-right text-gray-700">{totalsFactures.totalTVA.toFixed(2)} €</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{totalsFactures.totalTTC.toFixed(2)} €</td>
              </tr>
              <tr className="hover:bg-indigo-50 transition-colors duration-200">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Avoirs</td>
                <td className="px-4 py-3 text-sm text-right text-red-600">-{totalsAvoirs.totalHT.toFixed(2)} €</td>
                <td className="px-4 py-3 text-sm text-right text-red-600">-{totalsAvoirs.totalTVA.toFixed(2)} €</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-red-600">-{totalsAvoirs.totalTTC.toFixed(2)} €</td>
              </tr>
              <tr className="bg-gradient-to-r from-indigo-100 to-purple-100 font-bold">
                <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                <td className="px-4 py-3 text-sm text-right text-indigo-600">{totalNet.totalHT.toFixed(2)} €</td>
                <td className="px-4 py-3 text-sm text-right text-indigo-600">{totalNet.totalTVA.toFixed(2)} €</td>
                <td className="px-4 py-3 text-sm text-right text-indigo-700 text-lg">{totalNet.totalTTC.toFixed(2)} €</td>
              </tr>
            </tbody>
          </table>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Remarque :</strong> les chiffres ci-dessus comptabilisent tous les montants de documents qui ne sont pas en brouillon. 
              Cela inclut les montants des factures impayées.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );

  const renderDevisParClientContent = () => {
    // Données clients
    const clientsData = [
      { client: 'SARL Jardins Modernes', nombre: 5, fraisTraitement: 0, totalHT: 1250.50, totalTVA: 250.10, totalTTC: 1500.60, margeHT: 437.68, montantPaye: 1200.00 },
      { client: 'Martin Paysages', nombre: 3, fraisTraitement: 0, totalHT: 850.00, totalTVA: 170.00, totalTTC: 1020.00, margeHT: 297.50, montantPaye: 800.00 },
      { client: 'Dupont & Fils', nombre: 8, fraisTraitement: 0, totalHT: 2150.75, totalTVA: 430.15, totalTTC: 2580.90, margeHT: 752.76, montantPaye: 2400.00 },
      { client: 'Espaces Verts Pro', nombre: 4, fraisTraitement: 0, totalHT: 980.25, totalTVA: 196.05, totalTTC: 1176.30, margeHT: 343.09, montantPaye: 1100.00 },
      { client: 'Villa Moderne', nombre: 6, fraisTraitement: 0, totalHT: 1680.00, totalTVA: 336.00, totalTTC: 2016.00, margeHT: 588.00, montantPaye: 1900.00 },
      { client: 'Résidence Harmony', nombre: 2, fraisTraitement: 0, totalHT: 450.00, totalTVA: 90.00, totalTTC: 540.00, margeHT: 157.50, montantPaye: 500.00 },
      { client: 'Château de Versant', nombre: 7, fraisTraitement: 0, totalHT: 3250.00, totalTVA: 650.00, totalTTC: 3900.00, margeHT: 1137.50, montantPaye: 3700.00 },
      { client: 'Parc Municipal', nombre: 9, fraisTraitement: 0, totalHT: 4120.50, totalTVA: 824.10, totalTTC: 4944.60, margeHT: 1442.18, montantPaye: 4800.00 },
      { client: 'Green Solutions', nombre: 3, fraisTraitement: 0, totalHT: 720.00, totalTVA: 144.00, totalTTC: 864.00, margeHT: 252.00, montantPaye: 800.00 },
      { client: 'Nature & Jardins', nombre: 5, fraisTraitement: 0, totalHT: 1450.30, totalTVA: 290.06, totalTTC: 1740.36, margeHT: 507.61, montantPaye: 1600.00 },
      { client: 'EcoVert Services', nombre: 4, fraisTraitement: 0, totalHT: 890.00, totalTVA: 178.00, totalTTC: 1068.00, margeHT: 311.50, montantPaye: 1000.00 },
      { client: 'Jardins du Sud', nombre: 6, fraisTraitement: 0, totalHT: 1980.75, totalTVA: 396.15, totalTTC: 2376.90, margeHT: 693.26, montantPaye: 2200.00 },
      { client: 'Terrasses & Co', nombre: 2, fraisTraitement: 0, totalHT: 520.00, totalTVA: 104.00, totalTTC: 624.00, margeHT: 182.00, montantPaye: 600.00 },
      { client: 'Fleurs et Plantes', nombre: 8, fraisTraitement: 0, totalHT: 2890.50, totalTVA: 578.10, totalTTC: 3468.60, margeHT: 1011.68, montantPaye: 3300.00 },
      { client: 'Maison Verte', nombre: 3, fraisTraitement: 0, totalHT: 650.00, totalTVA: 130.00, totalTTC: 780.00, margeHT: 227.50, montantPaye: 750.00 },
      { client: 'Jardin Zen', nombre: 5, fraisTraitement: 0, totalHT: 1320.80, totalTVA: 264.16, totalTTC: 1584.96, margeHT: 462.28, montantPaye: 1500.00 },
      { client: 'Paysages Urbains', nombre: 4, fraisTraitement: 0, totalHT: 950.00, totalTVA: 190.00, totalTTC: 1140.00, margeHT: 332.50, montantPaye: 1100.00 },
      { client: 'Vert Horizon', nombre: 7, fraisTraitement: 0, totalHT: 2450.25, totalTVA: 490.05, totalTTC: 2940.30, margeHT: 857.59, montantPaye: 2800.00 }
    ];

    // Calcul des totaux
    const totals = clientsData.reduce((acc, client) => {
      acc.nombre += client.nombre;
      acc.fraisTraitement += client.fraisTraitement;
      acc.totalHT += client.totalHT;
      acc.totalTVA += client.totalTVA;
      acc.totalTTC += client.totalTTC;
      acc.margeHT += client.margeHT;
      acc.montantPaye += client.montantPaye;
      return acc;
    }, {
      nombre: 0,
      fraisTraitement: 0,
      totalHT: 0,
      totalTVA: 0,
      totalTTC: 0,
      margeHT: 0,
      montantPaye: 0
    });

    const filterTabs = [
      { id: 'tout', label: 'Tout' },
      { id: 'brouillon', label: 'Brouillon' },
      { id: 'en_cours', label: 'En cours' },
      { id: 'refuse', label: 'Refusé' },
      { id: 'accepte', label: 'Accepté' },
      { id: 'en_cours_refuse_accepte', label: 'En cours + refusé + accepté' }
    ];

    return (
      <>
        {/* Onglets de filtre d'état */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterEtatClient(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  filterEtatClient === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tableau des clients */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Devis par client</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de devis</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Frais trait. (TTC)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT (%)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TVA</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC (%)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marge HT</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant payé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clientsData.map((client, index) => (
                  <motion.tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <td className="px-4 py-3 text-sm">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200">
                        {client.client}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">{client.nombre}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{client.fraisTraitement.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{client.totalHT.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {((client.totalHT / totals.totalHT) * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{client.totalTVA.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{client.totalTTC.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {((client.totalTTC / totals.totalTTC) * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{client.margeHT.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{client.montantPaye.toFixed(2)} €</td>
                  </motion.tr>
                ))}
                
                {/* Ligne de totaux */}
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 font-bold">
                  <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{totals.nombre}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.fraisTraitement.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.totalHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">100.0%</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.totalTVA.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-indigo-700">{totals.totalTTC.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">100.0%</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.margeHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600">{totals.montantPaye.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </>
    );
  };

  const renderDevisParVendeurContent = () => {
    // Données vendeurs
    const vendeursData = [
      { collaborateur: 'Marc Leblanc', nombre: 45, fraisTraitement: 0, totalHT: 12850.50, totalTVA: 2570.10, totalTTC: 15420.60, margeHT: 4497.68, montantPaye: 14200.00 },
      { collaborateur: 'Paul Moreau', nombre: 38, fraisTraitement: 0, totalHT: 10250.75, totalTVA: 2050.15, totalTTC: 12300.90, margeHT: 3587.76, montantPaye: 11500.00 },
      { collaborateur: 'Luc Bernard', nombre: 32, fraisTraitement: 0, totalHT: 8920.00, totalTVA: 1784.00, totalTTC: 10704.00, margeHT: 3122.00, montantPaye: 10000.00 },
      { collaborateur: 'Sophie Martin', nombre: 28, fraisTraitement: 0, totalHT: 7680.25, totalTVA: 1536.05, totalTTC: 9216.30, margeHT: 2688.09, montantPaye: 8800.00 },
      { collaborateur: 'Julie Rousseau', nombre: 25, fraisTraitement: 0, totalHT: 6450.00, totalTVA: 1290.00, totalTTC: 7740.00, margeHT: 2257.50, montantPaye: 7200.00 },
      { collaborateur: 'Thomas Petit', nombre: 22, fraisTraitement: 0, totalHT: 5890.30, totalTVA: 1178.06, totalTTC: 7068.36, margeHT: 2061.61, montantPaye: 6500.00 },
      { collaborateur: 'Non défini', nombre: 18, fraisTraitement: 0, totalHT: 6893.82, totalTVA: 1378.76, totalTTC: 8272.58, margeHT: 5158.26, montantPaye: 7800.00 }
    ];

    // Calcul des totaux
    const totals = vendeursData.reduce((acc, vendeur) => {
      acc.nombre += vendeur.nombre;
      acc.fraisTraitement += vendeur.fraisTraitement;
      acc.totalHT += vendeur.totalHT;
      acc.totalTVA += vendeur.totalTVA;
      acc.totalTTC += vendeur.totalTTC;
      acc.margeHT += vendeur.margeHT;
      acc.montantPaye += vendeur.montantPaye;
      return acc;
    }, {
      nombre: 0,
      fraisTraitement: 0,
      totalHT: 0,
      totalTVA: 0,
      totalTTC: 0,
      margeHT: 0,
      montantPaye: 0
    });

    const filterTabs = [
      { id: 'tout', label: 'Tout' },
      { id: 'brouillon', label: 'Brouillon' },
      { id: 'en_cours', label: 'En cours' },
      { id: 'refuse', label: 'Refusé' },
      { id: 'accepte', label: 'Accepté' },
      { id: 'en_cours_refuse_accepte', label: 'En cours + refusé + accepté' }
    ];

    return (
      <>
        {/* Onglets de filtre d'état */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterEtatVendeur(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  filterEtatVendeur === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tableau des vendeurs */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <TrophyIcon className="w-5 h-5 mr-2" />
              Devis par vendeur
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collaborateur</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de devis</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Frais trait. (TTC)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT (%)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TVA</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC (%)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Marge HT</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant payé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vendeursData.map((vendeur, index) => (
                  <motion.tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
                          {vendeur.collaborateur === 'Non défini' ? '?' : vendeur.collaborateur.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-gray-900">{vendeur.collaborateur}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">{vendeur.nombre}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{vendeur.fraisTraitement.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{vendeur.totalHT.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {((vendeur.totalHT / totals.totalHT) * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{vendeur.totalTVA.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{vendeur.totalTTC.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {((vendeur.totalTTC / totals.totalTTC) * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{vendeur.margeHT.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{vendeur.montantPaye.toFixed(2)} €</td>
                  </motion.tr>
                ))}
                
                {/* Ligne de totaux */}
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50 font-bold">
                  <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{totals.nombre}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.fraisTraitement.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.totalHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">100.0%</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.totalTVA.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-purple-700">{totals.totalTTC.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">100.0%</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.margeHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600">{totals.montantPaye.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Graphique de performance des vendeurs */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance des vendeurs</h3>
          <div className="h-80">
            <Bar
              data={{
                labels: vendeursData.map(v => v.collaborateur),
                datasets: [
                  {
                    label: 'Chiffre d\'affaires TTC',
                    data: vendeursData.map(v => v.totalTTC),
                    backgroundColor: 'rgba(147, 51, 234, 0.8)',
                    borderColor: 'rgb(147, 51, 234)',
                    borderWidth: 1
                  },
                  {
                    label: 'Marge HT',
                    data: vendeursData.map(v => v.margeHT),
                    backgroundColor: 'rgba(236, 72, 153, 0.8)',
                    borderColor: 'rgb(236, 72, 153)',
                    borderWidth: 1
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return context.dataset.label + ': ' + new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </>
    );
  };

  const renderDevisParAuteurContent = () => {
    // Données auteurs
    const auteursData = [
      { collaborateur: 'Lucie Garcia', nombre: 18, fraisTraitement: 0, totalHT: 6893.82, totalTVA: 1378.76, totalTTC: 8272.58, margeHT: 5158.26, montantPaye: 0 },
      { collaborateur: 'Antoine Dubois', nombre: 24, fraisTraitement: 0, totalHT: 8450.00, totalTVA: 1690.00, totalTTC: 10140.00, margeHT: 2957.50, montantPaye: 9500.00 },
      { collaborateur: 'Marie Lambert', nombre: 32, fraisTraitement: 0, totalHT: 12300.50, totalTVA: 2460.10, totalTTC: 14760.60, margeHT: 4305.18, montantPaye: 14000.00 },
      { collaborateur: 'Pierre Moreau', nombre: 28, fraisTraitement: 0, totalHT: 9850.25, totalTVA: 1970.05, totalTTC: 11820.30, margeHT: 3447.59, montantPaye: 11200.00 },
      { collaborateur: 'Sophie Martin', nombre: 22, fraisTraitement: 0, totalHT: 7680.00, totalTVA: 1536.00, totalTTC: 9216.00, margeHT: 2688.00, montantPaye: 8800.00 },
      { collaborateur: 'Jean Durand', nombre: 35, fraisTraitement: 0, totalHT: 14250.75, totalTVA: 2850.15, totalTTC: 17100.90, margeHT: 4987.76, montantPaye: 16500.00 },
      { collaborateur: 'Céline Rousseau', nombre: 20, fraisTraitement: 0, totalHT: 6450.00, totalTVA: 1290.00, totalTTC: 7740.00, margeHT: 2257.50, montantPaye: 7200.00 }
    ];

    // Calcul des totaux
    const totals = auteursData.reduce((acc, auteur) => {
      acc.nombre += auteur.nombre;
      acc.fraisTraitement += auteur.fraisTraitement;
      acc.totalHT += auteur.totalHT;
      acc.totalTVA += auteur.totalTVA;
      acc.totalTTC += auteur.totalTTC;
      acc.margeHT += auteur.margeHT;
      acc.montantPaye += auteur.montantPaye;
      return acc;
    }, {
      nombre: 0,
      fraisTraitement: 0,
      totalHT: 0,
      totalTVA: 0,
      totalTTC: 0,
      margeHT: 0,
      montantPaye: 0
    });

    const filterTabs = [
      { id: 'tout', label: 'Tout' },
      { id: 'brouillon', label: 'Brouillon' },
      { id: 'en_cours', label: 'En cours' },
      { id: 'refuse', label: 'Refusé' },
      { id: 'accepte', label: 'Accepté' },
      { id: 'en_cours_refuse_accepte', label: 'En cours + refusé + accepté' }
    ];

    return (
      <>
        {/* Onglets de filtre d'état */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterEtatAuteur(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  filterEtatAuteur === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tableau des auteurs */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Devis par auteur
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Collaborateur
                      <div className="group relative ml-2">
                        <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded-lg py-2 px-3 -top-2 left-6 w-48">
                          Auteur ayant créé le devis
                          <div className="absolute left-0 top-3 -ml-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-gray-800 border-b-8 border-b-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de devis</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Frais trait. (TTC)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT (%)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TVA</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC (%)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Marge HT</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant payé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {auteursData.map((auteur, index) => (
                  <motion.tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
                          {auteur.collaborateur.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{auteur.collaborateur}</div>
                          <div className="text-xs text-gray-500">Auteur de devis</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">{auteur.nombre}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{auteur.fraisTraitement.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{auteur.totalHT.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {((auteur.totalHT / totals.totalHT) * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{auteur.totalTVA.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{auteur.totalTTC.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {((auteur.totalTTC / totals.totalTTC) * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{auteur.margeHT.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{auteur.montantPaye.toFixed(2)} €</td>
                  </motion.tr>
                ))}
                
                {/* Ligne de totaux */}
                <tr className="bg-gradient-to-r from-teal-50 to-cyan-50 font-bold">
                  <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{totals.nombre}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.fraisTraitement.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.totalHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">100.0%</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.totalTVA.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-teal-700">{totals.totalTTC.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">100.0%</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.margeHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600">{totals.montantPaye.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Graphique de contribution des auteurs */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contribution des auteurs</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80">
              <Doughnut
                data={{
                  labels: auteursData.map(a => a.collaborateur),
                  datasets: [{
                    label: 'Chiffre d\'affaires TTC',
                    data: auteursData.map(a => a.totalTTC),
                    backgroundColor: [
                      'rgba(20, 184, 166, 0.8)',
                      'rgba(6, 182, 212, 0.8)',
                      'rgba(34, 211, 238, 0.8)',
                      'rgba(103, 232, 249, 0.8)',
                      'rgba(165, 243, 252, 0.8)',
                      'rgba(14, 116, 144, 0.8)',
                      'rgba(8, 145, 178, 0.8)'
                    ],
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 15,
                        font: { size: 11 }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed);
                          const percentage = ((context.parsed / totals.totalTTC) * 100).toFixed(1);
                          return label + ': ' + value + ' (' + percentage + '%)';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="h-80">
              <Bar
                data={{
                  labels: auteursData.map(a => a.collaborateur.split(' ')[0]),
                  datasets: [
                    {
                      label: 'Nombre de devis',
                      data: auteursData.map(a => a.nombre),
                      backgroundColor: 'rgba(20, 184, 166, 0.8)',
                      borderColor: 'rgb(20, 184, 166)',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return 'Devis: ' + context.parsed.y;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 5
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
      </>
    );
  };

  const renderDevisParProduitContent = () => {
    // Données produits (30+ produits)
    const produitsData = [
      { produit: 'Non défini', nombre: 5, quantite: 0, totalHT: 450.00, totalTVA: 90.00, totalTTC: 540.00, margeHT: 157.50 },
      { produit: 'Acer palmatum Dissectum Garnet - Érable du Japon 125/150cm', nombre: 3, quantite: 8, totalHT: 1250.00, totalTVA: 250.00, totalTTC: 1500.00, margeHT: 437.50 },
      { produit: 'Photinia x fraseri Red Robin - Photinia 80/100cm pot 15L', nombre: 7, quantite: 45, totalHT: 890.75, totalTVA: 178.15, totalTTC: 1068.90, margeHT: 311.76 },
      { produit: 'Taille de haie - Forfait linéaire jusqu\'à 2m', nombre: 12, quantite: 120, totalHT: 2400.00, totalTVA: 480.00, totalTTC: 2880.00, margeHT: 840.00 },
      { produit: 'Cupressus sempervirens - Cyprès de Provence 175/200cm', nombre: 4, quantite: 15, totalHT: 1875.50, totalTVA: 375.10, totalTTC: 2250.60, margeHT: 656.43 },
      { produit: 'Rosa Iceberg - Rosier buisson blanc 60/80cm', nombre: 6, quantite: 25, totalHT: 425.00, totalTVA: 85.00, totalTTC: 510.00, margeHT: 148.75 },
      { produit: 'Entretien pelouse - Tonte, scarification, fertilisation /m²', nombre: 8, quantite: 500, totalHT: 750.00, totalTVA: 150.00, totalTTC: 900.00, margeHT: 262.50 },
      { produit: 'Lavandula angustifolia Hidcote - Lavande vraie 30/40cm pot 3L', nombre: 9, quantite: 120, totalHT: 540.00, totalTVA: 108.00, totalTTC: 648.00, margeHT: 189.00 },
      { produit: 'Prunus laurocerasus Rotundifolia - Laurier cerise 100/125cm', nombre: 5, quantite: 30, totalHT: 1350.25, totalTVA: 270.05, totalTTC: 1620.30, margeHT: 472.59 },
      { produit: 'Plantation arbuste - Main d\'œuvre unitaire', nombre: 15, quantite: 85, totalHT: 850.00, totalTVA: 170.00, totalTTC: 1020.00, margeHT: 297.50 },
      { produit: 'Olea europaea - Olivier 150/175cm conteneur 35L', nombre: 3, quantite: 6, totalHT: 1440.00, totalTVA: 288.00, totalTTC: 1728.00, margeHT: 504.00 },
      { produit: 'Mulch organique - Écorces de pin maritime 20/40mm /m³', nombre: 10, quantite: 25, totalHT: 875.00, totalTVA: 175.00, totalTTC: 1050.00, margeHT: 306.25 },
      { produit: 'Buxus sempervirens - Buis commun boule 40/50cm', nombre: 8, quantite: 40, totalHT: 680.00, totalTVA: 136.00, totalTTC: 816.00, margeHT: 238.00 },
      { produit: 'Élagage grand arbre - Intervention nacelle >10m', nombre: 2, quantite: 4, totalHT: 1800.00, totalTVA: 360.00, totalTTC: 2160.00, margeHT: 630.00 },
      { produit: 'Hydrangea macrophylla - Hortensia bleu 60/80cm pot 7.5L', nombre: 7, quantite: 35, totalHT: 525.75, totalTVA: 105.15, totalTTC: 630.90, margeHT: 184.01 },
      { produit: 'Système arrosage automatique - Kit complet jardin 500m²', nombre: 3, quantite: 3, totalHT: 3450.00, totalTVA: 690.00, totalTTC: 4140.00, margeHT: 1207.50 },
      { produit: 'Trachelospermum jasminoides - Jasmin étoilé 150/175cm', nombre: 5, quantite: 18, totalHT: 810.00, totalTVA: 162.00, totalTTC: 972.00, margeHT: 283.50 },
      { produit: 'Terreau plantation - Amendé compost 40L/sac', nombre: 20, quantite: 150, totalHT: 450.00, totalTVA: 90.00, totalTTC: 540.00, margeHT: 157.50 },
      { produit: 'Magnolia grandiflora - Magnolia persistant 200/250cm', nombre: 2, quantite: 4, totalHT: 980.00, totalTVA: 196.00, totalTTC: 1176.00, margeHT: 343.00 },
      { produit: 'Pittosporum tobira Nanum - Pittospore nain 40/60cm', nombre: 6, quantite: 48, totalHT: 576.00, totalTVA: 115.20, totalTTC: 691.20, margeHT: 201.60 },
      { produit: 'Gazon en rouleau - Premium sport et jeux /m²', nombre: 4, quantite: 200, totalHT: 1600.00, totalTVA: 320.00, totalTTC: 1920.00, margeHT: 560.00 },
      { produit: 'Nerium oleander - Laurier rose rose 100/125cm', nombre: 5, quantite: 20, totalHT: 460.00, totalTVA: 92.00, totalTTC: 552.00, margeHT: 161.00 },
      { produit: 'Diagnostic phytosanitaire - Expertise arboricole', nombre: 3, quantite: 3, totalHT: 450.00, totalTVA: 90.00, totalTTC: 540.00, margeHT: 157.50 },
      { produit: 'Carpinus betulus - Charme commun 175/200cm racines nues', nombre: 4, quantite: 25, totalHT: 625.00, totalTVA: 125.00, totalTTC: 750.00, margeHT: 218.75 },
      { produit: 'Fertilisant organique - NPK 6-3-12 granulés /25kg', nombre: 12, quantite: 60, totalHT: 420.00, totalTVA: 84.00, totalTTC: 504.00, margeHT: 147.00 },
      { produit: 'Hedera helix - Lierre commun grimpant 150/175cm', nombre: 7, quantite: 28, totalHT: 392.00, totalTVA: 78.40, totalTTC: 470.40, margeHT: 137.20 },
      { produit: 'Abattage arbre dangereux - Démontage contrôlé', nombre: 2, quantite: 2, totalHT: 1200.00, totalTVA: 240.00, totalTTC: 1440.00, margeHT: 420.00 },
      { produit: 'Agapanthus africanus - Agapanthe bleue pot 3L', nombre: 8, quantite: 64, totalHT: 512.00, totalTVA: 102.40, totalTTC: 614.40, margeHT: 179.20 },
      { produit: 'Création massif - Conception et réalisation /m²', nombre: 5, quantite: 75, totalHT: 2250.00, totalTVA: 450.00, totalTTC: 2700.00, margeHT: 787.50 },
      { produit: 'Viburnum tinus - Laurier tin 80/100cm conteneur 10L', nombre: 6, quantite: 30, totalHT: 540.00, totalTVA: 108.00, totalTTC: 648.00, margeHT: 189.00 },
      { produit: 'Traitement bio chenilles processionnaires - Piège/arbre', nombre: 4, quantite: 12, totalHT: 480.00, totalTVA: 96.00, totalTTC: 576.00, margeHT: 168.00 },
      { produit: 'Elaeagnus x ebbingei - Chalef 100/125cm pot 15L', nombre: 5, quantite: 25, totalHT: 625.00, totalTVA: 125.00, totalTTC: 750.00, margeHT: 218.75 },
      { produit: 'Évacuation déchets verts - Forfait camion benne 7m³', nombre: 10, quantite: 10, totalHT: 750.00, totalTVA: 150.00, totalTTC: 900.00, margeHT: 262.50 }
    ];

    // Calcul des totaux
    const totals = produitsData.reduce((acc, produit) => {
      acc.nombre += produit.nombre;
      acc.quantite += produit.quantite;
      acc.totalHT += produit.totalHT;
      acc.totalTVA += produit.totalTVA;
      acc.totalTTC += produit.totalTTC;
      acc.margeHT += produit.margeHT;
      return acc;
    }, {
      nombre: 0,
      quantite: 0,
      totalHT: 0,
      totalTVA: 0,
      totalTTC: 0,
      margeHT: 0
    });

    const filterTabs = [
      { id: 'tout', label: 'Tout' },
      { id: 'brouillon', label: 'Brouillon' },
      { id: 'en_cours', label: 'En cours' },
      { id: 'refuse', label: 'Refusé' },
      { id: 'accepte', label: 'Accepté' },
      { id: 'en_cours_refuse_accepte', label: 'En cours + refusé + accepté' }
    ];

    return (
      <>
        {/* Onglets de filtre d'état */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterEtatProduit(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  filterEtatProduit === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tableau des produits */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              Devis par produit
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">Produit ou service</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de devis</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT (%)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TVA</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC (%)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Marge HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {produitsData.map((produit, index) => (
                  <motion.tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <td className="px-4 py-3 text-sm">
                      <button className="text-left text-amber-600 hover:text-amber-800 transition-colors duration-200">
                        <div className="max-w-xs truncate" title={produit.produit}>
                          {produit.produit}
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">{produit.nombre}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">{produit.quantite}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{produit.totalHT.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {((produit.totalHT / totals.totalHT) * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{produit.totalTVA.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{produit.totalTTC.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {((produit.totalTTC / totals.totalTTC) * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">{produit.margeHT.toFixed(2)} €</td>
                  </motion.tr>
                ))}
                
                {/* Ligne de totaux */}
                <tr className="bg-gradient-to-r from-amber-50 to-orange-50 font-bold">
                  <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{totals.nombre}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">{totals.quantite}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.totalHT.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">100.0%</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">{totals.totalTVA.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-amber-700">{totals.totalTTC.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">100.0%</td>
                  <td className="px-4 py-3 text-sm text-right text-orange-700">{totals.margeHT.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Graphique Top 10 produits */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 produits par chiffre d'affaires</h3>
          <div className="h-80">
            <Bar
              data={{
                labels: produitsData
                  .sort((a, b) => b.totalTTC - a.totalTTC)
                  .slice(0, 10)
                  .map(p => p.produit.length > 30 ? p.produit.substring(0, 30) + '...' : p.produit),
                datasets: [
                  {
                    label: 'Chiffre d\'affaires TTC',
                    data: produitsData
                      .sort((a, b) => b.totalTTC - a.totalTTC)
                      .slice(0, 10)
                      .map(p => p.totalTTC),
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderColor: 'rgb(245, 158, 11)',
                    borderWidth: 1
                  }
                ]
              }}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed.x);
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </>
    );
  };

  const renderDevisParCategorieContent = () => {
    // Données des catégories
    const categoriesData = [
      { categorie: 'Aucune catégorie', nombre: 38, quantite: 85.00, totalHT: 5893.82, totalTVA: 1178.76, totalTTC: 7072.58, margeHT: 4420.37 },
      { categorie: 'Non défini', nombre: 5, quantite: 9.00, totalHT: 1000.00, totalTVA: 200.00, totalTTC: 1200.00, margeHT: 737.89 }
    ];

    // Calcul des totaux
    const totaux = categoriesData.reduce((acc, item) => ({
      nombre: acc.nombre + item.nombre,
      quantite: acc.quantite + item.quantite,
      totalHT: acc.totalHT + item.totalHT,
      totalTVA: acc.totalTVA + item.totalTVA,
      totalTTC: acc.totalTTC + item.totalTTC,
      margeHT: acc.margeHT + item.margeHT
    }), { nombre: 0, quantite: 0, totalHT: 0, totalTVA: 0, totalTTC: 0, margeHT: 0 });

    return (
      <>
        {/* Filtres supérieurs */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2">
                  <CalendarDaysIcon className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">07/07/2025 - 07/08/2025</span>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center">
                  <FunnelIcon className="w-5 h-5 mr-2 text-gray-600" />
                  <span>Filtres</span>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="nom d'un client..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-64"
                  />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <CogIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <PrinterIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Onglets filtres */}
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex space-x-4">
              {['tout', 'brouillon', 'en_cours', 'refuse', 'accepte', 'en_cours_refuse_accepte'].map((etat) => (
                <button
                  key={etat}
                  onClick={() => setFilterEtatCategorie(etat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filterEtatCategorie === etat
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {etat === 'tout' && 'Tout'}
                  {etat === 'brouillon' && 'Brouillon'}
                  {etat === 'en_cours' && 'En cours'}
                  {etat === 'refuse' && 'Refusé'}
                  {etat === 'accepte' && 'Accepté'}
                  {etat === 'en_cours_refuse_accepte' && 'En cours + refusé + accepté'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tableau principal */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Nombre de devis
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total HT
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total HT (%)
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total TVA
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total TTC
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total TTC (%)
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Marge HT
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categoriesData.map((item, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TagIcon className="w-5 h-5 text-yellow-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{item.categorie}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900 font-medium">{item.nombre}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900">{item.quantite.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {item.totalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {((item.totalHT / totaux.totalHT) * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm text-gray-600">
                        {item.totalTVA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-semibold text-green-600">
                        {item.totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {((item.totalTTC / totaux.totalTTC) * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-medium text-orange-600">
                        {item.margeHT.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                      </span>
                    </td>
                  </motion.tr>
                ))}
                
                {/* Ligne de totaux */}
                <tr className="bg-gradient-to-r from-yellow-50 to-orange-50 font-semibold">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">TOTAL</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-bold text-gray-900">{totaux.nombre}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm font-bold text-gray-900">{totaux.quantite.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-bold text-gray-900">
                      {totaux.totalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-200 text-yellow-900">
                      100%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-bold text-gray-900">
                      {totaux.totalTVA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-bold text-green-600">
                      {totaux.totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-200 text-green-900">
                      100%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-bold text-orange-600">
                      {totaux.margeHT.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Graphique répartition par catégorie */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChartPieIcon className="w-5 h-5 mr-2 text-yellow-500" />
              Répartition par catégorie
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Doughnut
                data={{
                  labels: categoriesData.map(c => c.categorie),
                  datasets: [{
                    data: categoriesData.map(c => c.totalTTC),
                    backgroundColor: [
                      'rgba(251, 191, 36, 0.8)',
                      'rgba(251, 146, 60, 0.8)'
                    ],
                    borderColor: [
                      'rgba(251, 191, 36, 1)',
                      'rgba(251, 146, 60, 1)'
                    ],
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const value = context.parsed;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${context.label}: ${value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
      </>
    );
  };

  const renderFactures12MoisContent = () => {
    // Données pour les graphiques
    const moisLabels = ['2024-09', '2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08'];
    
    // Données HT et Taxe
    const facturesData = [
      { mois: '2024-09', htPrecedente: 0, taxePrecedente: 0, ttcPrecedente: 0, margePrecedente: 0, htPrincipale: 0, taxePrincipale: 0, ttcPrincipale: 0, margePrincipale: 0 },
      { mois: '2024-10', htPrecedente: 0, taxePrecedente: 0, ttcPrecedente: 0, margePrecedente: 0, htPrincipale: 0, taxePrincipale: 0, ttcPrincipale: 0, margePrincipale: 0 },
      { mois: '2024-11', htPrecedente: 0, taxePrecedente: 0, ttcPrecedente: 0, margePrecedente: 0, htPrincipale: 0, taxePrincipale: 0, ttcPrincipale: 0, margePrincipale: 0 },
      { mois: '2024-12', htPrecedente: 0, taxePrecedente: 0, ttcPrecedente: 0, margePrecedente: 0, htPrincipale: 0, taxePrincipale: 0, ttcPrincipale: 0, margePrincipale: 0 },
      { mois: '2025-01', htPrecedente: 0, taxePrecedente: 0, ttcPrecedente: 0, margePrecedente: 0, htPrincipale: 0, taxePrincipale: 0, ttcPrincipale: 0, margePrincipale: 0 },
      { mois: '2025-02', htPrecedente: 0, taxePrecedente: 0, ttcPrecedente: 0, margePrecedente: 0, htPrincipale: 0, taxePrincipale: 0, ttcPrincipale: 0, margePrincipale: 0 },
      { mois: '2025-03', htPrecedente: 0, taxePrecedente: 0, ttcPrecedente: 0, margePrecedente: 0, htPrincipale: 0, taxePrincipale: 0, ttcPrincipale: 0, margePrincipale: 0 },
      { mois: '2025-04', htPrecedente: 0, taxePrecedente: 0, ttcPrecedente: 0, margePrecedente: 0, htPrincipale: 0, taxePrincipale: 0, ttcPrincipale: 0, margePrincipale: 0 },
      { mois: '2025-05', htPrecedente: 0, taxePrecedente: 0, ttcPrecedente: 0, margePrecedente: 0, htPrincipale: 0, taxePrincipale: 0, ttcPrincipale: 0, margePrincipale: 0 },
      { mois: '2025-06', htPrecedente: 0, taxePrecedente: 0, ttcPrecedente: 0, margePrecedente: 0, htPrincipale: 0, taxePrincipale: 0, ttcPrincipale: 0, margePrincipale: 0 },
      { mois: '2025-07', htPrecedente: 49461.64, taxePrecedente: 9892.32, ttcPrecedente: 59353.96, margePrecedente: 48310.27, htPrincipale: 0, taxePrincipale: 0, ttcPrincipale: 0, margePrincipale: 0 },
      { mois: '2025-08', htPrecedente: 3319.84, taxePrecedente: 663.97, ttcPrecedente: 3983.81, margePrecedente: 2276.11, htPrincipale: 0, taxePrincipale: 0, ttcPrincipale: 0, margePrincipale: 0 }
    ];

    // Calcul des totaux
    const totaux = facturesData.reduce((acc, item) => ({
      htPrecedente: acc.htPrecedente + item.htPrecedente,
      taxePrecedente: acc.taxePrecedente + item.taxePrecedente,
      ttcPrecedente: acc.ttcPrecedente + item.ttcPrecedente,
      margePrecedente: acc.margePrecedente + item.margePrecedente,
      htPrincipale: acc.htPrincipale + item.htPrincipale,
      taxePrincipale: acc.taxePrincipale + item.taxePrincipale,
      ttcPrincipale: acc.ttcPrincipale + item.ttcPrincipale,
      margePrincipale: acc.margePrincipale + item.margePrincipale
    }), { htPrecedente: 0, taxePrecedente: 0, ttcPrecedente: 0, margePrecedente: 0, htPrincipale: 0, taxePrincipale: 0, ttcPrincipale: 0, margePrincipale: 0 });

    return (
      <>
        {/* Filtres supérieurs */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2">
                  <CalendarDaysIcon className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">07/07/2025 - 07/08/2025</span>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center">
                  <FunnelIcon className="w-5 h-5 mr-2 text-gray-600" />
                  <span>Filtres</span>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="nom d'un client..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <CogIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <PrinterIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Graphique HT et Taxe */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2 text-blue-500" />
              HT et Taxe - Comparaison annuelle
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Bar
                data={{
                  labels: moisLabels,
                  datasets: [
                    {
                      label: 'HT (période précédente)',
                      data: facturesData.map(f => f.htPrecedente),
                      backgroundColor: 'rgba(156, 163, 175, 0.8)',
                      borderColor: 'rgba(156, 163, 175, 1)',
                      borderWidth: 1
                    },
                    {
                      label: 'TVA (période précédente)',
                      data: facturesData.map(f => f.taxePrecedente),
                      backgroundColor: 'rgba(209, 213, 219, 0.8)',
                      borderColor: 'rgba(209, 213, 219, 1)',
                      borderWidth: 1
                    },
                    {
                      label: 'HT (période principale)',
                      data: facturesData.map(f => f.htPrincipale),
                      backgroundColor: 'rgba(59, 130, 246, 0.8)',
                      borderColor: 'rgba(59, 130, 246, 1)',
                      borderWidth: 1
                    },
                    {
                      label: 'TVA (période principale)',
                      data: facturesData.map(f => f.taxePrincipale),
                      backgroundColor: 'rgba(147, 197, 253, 0.8)',
                      borderColor: 'rgba(147, 197, 253, 1)',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                          size: 11
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${context.parsed.y.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return value.toLocaleString('fr-FR') + ' €';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Graphique des Marges HT */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BanknotesIcon className="w-5 h-5 mr-2 text-green-500" />
              Marges HT - Évolution annuelle
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Bar
                data={{
                  labels: moisLabels,
                  datasets: [
                    {
                      label: 'Marge HT (période précédente)',
                      data: facturesData.map(f => f.margePrecedente),
                      backgroundColor: 'rgba(156, 163, 175, 0.8)',
                      borderColor: 'rgba(156, 163, 175, 1)',
                      borderWidth: 1
                    },
                    {
                      label: 'Marge HT (période principale)',
                      data: facturesData.map(f => f.margePrincipale),
                      backgroundColor: 'rgba(34, 197, 94, 0.8)',
                      borderColor: 'rgba(34, 197, 94, 1)',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${context.parsed.y.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return value.toLocaleString('fr-FR') + ' €';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Tableau de synthèse */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-indigo-500" />
              Tableau de synthèse mensuel
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Mois
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    HT (période précédente)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Taxe (période précédente)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    TTC (période précédente)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Marge HT (période précédente)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    HT (période principale)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Taxe (période principale)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    TTC (période principale)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Marge HT (période principale)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {facturesData.map((item, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.mois}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-700">
                      {item.htPrecedente > 0 ? `${item.htPrecedente.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-600">
                      {item.taxePrecedente > 0 ? `${item.taxePrecedente.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {item.ttcPrecedente > 0 ? `${item.ttcPrecedente.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-green-600">
                      {item.margePrecedente > 0 ? `${item.margePrecedente.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-700">
                      {item.htPrincipale > 0 ? `${item.htPrincipale.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-600">
                      {item.taxePrincipale > 0 ? `${item.taxePrincipale.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-blue-600">
                      {item.ttcPrincipale > 0 ? `${item.ttcPrincipale.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-green-600">
                      {item.margePrincipale > 0 ? `${item.margePrincipale.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : '-'}
                    </td>
                  </motion.tr>
                ))}
                
                {/* Ligne de totaux */}
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 font-semibold">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                    Total
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                    {totaux.htPrecedente.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-gray-700">
                    {totaux.taxePrecedente.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                    {totaux.ttcPrecedente.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-green-600">
                    {totaux.margePrecedente.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                    {totaux.htPrincipale > 0 ? `${totaux.htPrincipale.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-gray-700">
                    {totaux.taxePrincipale > 0 ? `${totaux.taxePrincipale.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-blue-600">
                    {totaux.ttcPrincipale > 0 ? `${totaux.ttcPrincipale.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-green-600">
                    {totaux.margePrincipale > 0 ? `${totaux.margePrincipale.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </>
    );
  };

  const renderDevis12MoisContent = () => {
    // Données pour les graphiques
    const moisLabels = ['2024-09', '2024-10', '2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08'];
    
    // Données HT et Taxe
    const htDataPeriodePrincipale = [45000, 52000, 48000, 61000, 58000, 72000, 68000, 75000, 82000, 78000, 85000, 92000];
    const taxeDataPeriodePrincipale = [9000, 10400, 9600, 12200, 11600, 14400, 13600, 15000, 16400, 15600, 17000, 18400];
    const htDataPeriodePrecedente = [42000, 48000, 45000, 58000, 55000, 68000, 65000, 71000, 78000, 74000, 81000, 88000];
    const taxeDataPeriodePrecedente = [8400, 9600, 9000, 11600, 11000, 13600, 13000, 14200, 15600, 14800, 16200, 17600];
    
    // Données Marge
    const margeHTPeriodePrincipale = [15750, 18200, 16800, 21350, 20300, 25200, 23800, 26250, 28700, 27300, 29750, 32200];
    const margeHTPeriodePrecedente = [14700, 16800, 15750, 20300, 19250, 23800, 22750, 24850, 27300, 25900, 28350, 30800];

    // Calcul des totaux
    const totalHTPrincipale = htDataPeriodePrincipale.reduce((a, b) => a + b, 0);
    const totalTaxePrincipale = taxeDataPeriodePrincipale.reduce((a, b) => a + b, 0);
    const totalMargePrincipale = margeHTPeriodePrincipale.reduce((a, b) => a + b, 0);
    const totalHTPrecedente = htDataPeriodePrecedente.reduce((a, b) => a + b, 0);
    const totalTaxePrecedente = taxeDataPeriodePrecedente.reduce((a, b) => a + b, 0);
    const totalMargePrecedente = margeHTPeriodePrecedente.reduce((a, b) => a + b, 0);

    return (
      <>
        {/* En-tête avec titre et bandeau informatif */}
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">HT et Taxe</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Par défaut, cette interface affiche les devis "en cours" + "acceptés" + "refusés".
            </p>
          </div>
        </motion.div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Graphique HT et Taxe */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">HT et Taxe - Comparaison périodes</h3>
            <div className="h-80">
              <Bar
                data={{
                  labels: moisLabels,
                  datasets: [
                    {
                      label: 'HT (période principale)',
                      data: htDataPeriodePrincipale,
                      backgroundColor: 'rgba(59, 130, 246, 0.8)',
                      stack: 'principale'
                    },
                    {
                      label: 'Taxe (période principale)',
                      data: taxeDataPeriodePrincipale,
                      backgroundColor: 'rgba(147, 197, 253, 0.8)',
                      stack: 'principale'
                    },
                    {
                      label: 'HT (période précédente)',
                      data: htDataPeriodePrecedente,
                      backgroundColor: 'rgba(107, 114, 128, 0.5)',
                      stack: 'precedente'
                    },
                    {
                      label: 'Taxe (période précédente)',
                      data: taxeDataPeriodePrecedente,
                      backgroundColor: 'rgba(209, 213, 219, 0.5)',
                      stack: 'precedente'
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        font: { size: 11 }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return context.dataset.label + ': ' + new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      stacked: true,
                      ticks: {
                        font: { size: 10 }
                      }
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Graphique Marges */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Marges HT - Comparaison périodes</h3>
            <div className="h-80">
              <Bar
                data={{
                  labels: moisLabels,
                  datasets: [
                    {
                      label: 'Marge HT (période principale)',
                      data: margeHTPeriodePrincipale,
                      backgroundColor: 'rgba(20, 184, 166, 0.8)',
                      borderColor: 'rgb(20, 184, 166)',
                      borderWidth: 1
                    },
                    {
                      label: 'Marge HT (période précédente)',
                      data: margeHTPeriodePrecedente,
                      backgroundColor: 'rgba(209, 213, 219, 0.5)',
                      borderColor: 'rgb(156, 163, 175)',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        font: { size: 11 }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return context.dataset.label + ': ' + new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        font: { size: 10 }
                      }
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Tableau de synthèse */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Tableau de synthèse</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th rowSpan="2" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mois</th>
                  <th colSpan="4" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">Période précédente</th>
                  <th colSpan="4" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">Période principale</th>
                </tr>
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">HT</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Taxe</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">TTC</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Marge HT</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">HT</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Taxe</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">TTC</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Marge HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {moisLabels.map((mois, index) => (
                  <tr key={mois} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{mois}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700 border-l border-gray-200">
                      {htDataPeriodePrecedente[index].toLocaleString('fr-FR')} €
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">
                      {taxeDataPeriodePrecedente[index].toLocaleString('fr-FR')} €
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                      {(htDataPeriodePrecedente[index] + taxeDataPeriodePrecedente[index]).toLocaleString('fr-FR')} €
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">
                      {margeHTPeriodePrecedente[index].toLocaleString('fr-FR')} €
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700 border-l border-gray-200">
                      {htDataPeriodePrincipale[index].toLocaleString('fr-FR')} €
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700">
                      {taxeDataPeriodePrincipale[index].toLocaleString('fr-FR')} €
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                      {(htDataPeriodePrincipale[index] + taxeDataPeriodePrincipale[index]).toLocaleString('fr-FR')} €
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                      {margeHTPeriodePrincipale[index].toLocaleString('fr-FR')} €
                    </td>
                  </tr>
                ))}
                {/* Ligne de total */}
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 font-bold">
                  <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 border-l border-gray-200">
                    {totalHTPrecedente.toLocaleString('fr-FR')} €
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {totalTaxePrecedente.toLocaleString('fr-FR')} €
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-indigo-700">
                    {(totalHTPrecedente + totalTaxePrecedente).toLocaleString('fr-FR')} €
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {totalMargePrecedente.toLocaleString('fr-FR')} €
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900 border-l border-gray-200">
                    {totalHTPrincipale.toLocaleString('fr-FR')} €
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {totalTaxePrincipale.toLocaleString('fr-FR')} €
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-indigo-700">
                    {(totalHTPrincipale + totalTaxePrincipale).toLocaleString('fr-FR')} €
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-green-600">
                    {totalMargePrincipale.toLocaleString('fr-FR')} €
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </>
    );
  };

  const renderChartContent = (title, chartType = 'line') => (
    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="h-96">
        {chartType === 'line' && <Line data={chartData12Months} options={chartOptions} />}
        {chartType === 'bar' && <Bar data={chartData12Months} options={chartOptions} />}
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="flex h-screen bg-gradient-to-br from-slate-50 to-indigo-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Sidebar */}
      <motion.div 
        className="w-64 bg-white shadow-xl border-r border-gray-200 overflow-y-auto"
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
          <h2 className="text-xl font-bold text-white">Statistiques</h2>
          <p className="text-indigo-100 text-sm mt-1">Facturation</p>
        </div>
        
        <nav className="p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                    activeMenu === item.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {activeMenu === item.id && (
                    <ChevronRightIcon className="w-4 h-4 ml-auto" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <motion.div 
          className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  value={selectedPeriod.start.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedPeriod({...selectedPeriod, start: new Date(e.target.value)})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="date"
                  value={selectedPeriod.end.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedPeriod({...selectedPeriod, end: new Date(e.target.value)})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <FunnelIcon className="w-5 h-5 mr-2" />
                Filtres
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="nom d'un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <PrinterIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <ShareIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <CogIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content based on active menu */}
        <div className="p-6 space-y-6">
          {activeMenu === 'Général' && renderGeneralContent()}
          {activeMenu === 'Synthèse' && renderSyntheseContent()}
          {activeMenu === 'Devis 12 mois' && renderDevis12MoisContent()}
          {activeMenu === 'Devis client' && renderDevisParClientContent()}
          {activeMenu === 'Devis vendeur' && renderDevisParVendeurContent()}
          {activeMenu === 'Devis auteur' && renderDevisParAuteurContent()}
          {activeMenu === 'Devis produit' && renderDevisParProduitContent()}
          {activeMenu === 'Devis catégorie' && renderDevisParCategorieContent()}
          {activeMenu === 'Factures 12 mois' && renderFactures12MoisContent()}
          {activeMenu === 'Avoirs 12 mois' && renderChartContent(activeMenu, 'line')}
          {activeMenu.includes('client') && !activeMenu.includes('12 mois') && activeMenu !== 'Devis client' && renderChartContent(activeMenu, 'bar')}
          {activeMenu.includes('vendeur') && activeMenu !== 'Devis vendeur' && renderChartContent(activeMenu, 'bar')}
          {activeMenu.includes('auteur') && activeMenu !== 'Devis auteur' && renderChartContent(activeMenu, 'bar')}
          {activeMenu.includes('produit') && renderChartContent(activeMenu, 'bar')}
          {activeMenu.includes('catégorie') && renderChartContent(activeMenu, 'bar')}
          {activeMenu === 'TVA' && renderChartContent('Montant par taux de TVA', 'bar')}
        </div>
      </div>
    </motion.div>
  );
};

export default StatistiquesFacturationPremium;