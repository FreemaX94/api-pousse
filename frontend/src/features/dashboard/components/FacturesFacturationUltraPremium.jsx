import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  CurrencyEuroIcon,
  CalendarDaysIcon,
  UserIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PrinterIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  BellAlertIcon,
  CalculatorIcon,
  TagIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  WalletIcon,
  ChartPieIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon,
  RocketLaunchIcon,
  TrophyIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  QrCodeIcon,
  HashtagIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

const FacturesFacturationUltraPremium = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Animation des statistiques
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats({
        totalRevenue: Math.random() * 10000 + 150000,
        conversionRate: Math.random() * 10 + 85,
        avgPaymentTime: Math.random() * 5 + 7,
        cashFlow: Math.random() * 20000 + 80000
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Factures exemple avec détails complets
  const invoices = [
    {
      id: 'FAC-2024-001',
      number: '2024001',
      client: {
        name: 'Jardin Botanique de Lyon',
        type: 'Entreprise',
        address: '123 Avenue des Plantes, 69000 Lyon',
        email: 'contact@jardinbotanique.fr',
        phone: '04 72 83 91 00',
        siret: '123 456 789 00012',
        paymentHistory: 'excellent'
      },
      date: new Date('2024-08-01'),
      dueDate: new Date('2024-08-31'),
      amount: 12450.00,
      tax: 2490.00,
      total: 14940.00,
      status: 'paid',
      paymentDate: new Date('2024-08-15'),
      paymentMethod: 'Virement bancaire',
      items: [
        { description: 'Entretien espaces verts - Août 2024', quantity: 1, price: 8500 },
        { description: 'Taille arbustes ornementaux', quantity: 45, price: 35 },
        { description: 'Traitement phytosanitaire bio', quantity: 1, price: 2375 }
      ],
      recurring: true,
      contractId: 'CTR-2024-089',
      remindersSent: 0,
      attachments: ['devis_signe.pdf', 'bon_intervention.pdf'],
      notes: 'Client fidèle depuis 2019',
      discount: 5,
      late: false,
      satisfaction: 4.8,
      nextInvoice: new Date('2024-09-01')
    },
    {
      id: 'FAC-2024-002',
      number: '2024002',
      client: {
        name: 'Villa Moderne',
        type: 'Particulier',
        address: '45 Rue des Roses, 69006 Lyon',
        email: 'contact@villamoderne.com',
        phone: '06 12 34 56 78',
        paymentHistory: 'good'
      },
      date: new Date('2024-08-05'),
      dueDate: new Date('2024-09-05'),
      amount: 3200.00,
      tax: 640.00,
      total: 3840.00,
      status: 'pending',
      items: [
        { description: 'Création massif fleuri', quantity: 1, price: 2200 },
        { description: 'Pose arrosage automatique', quantity: 1, price: 1000 }
      ],
      recurring: false,
      remindersSent: 1,
      attachments: ['devis_2024002.pdf'],
      discount: 0,
      late: false,
      daysUntilDue: 5
    },
    {
      id: 'FAC-2024-003',
      number: '2024003',
      client: {
        name: 'Résidence Les Terrasses',
        type: 'Syndic',
        address: '78 Boulevard Principal, 69003 Lyon',
        email: 'syndic@terrasses.fr',
        phone: '04 78 92 10 30',
        siret: '987 654 321 00015',
        paymentHistory: 'average'
      },
      date: new Date('2024-07-15'),
      dueDate: new Date('2024-08-15'),
      amount: 5670.00,
      tax: 1134.00,
      total: 6804.00,
      status: 'overdue',
      items: [
        { description: 'Entretien mensuel parties communes', quantity: 1, price: 4200 },
        { description: 'Désherbage allées', quantity: 1, price: 470 },
        { description: 'Évacuation déchets verts', quantity: 2, price: 500 }
      ],
      recurring: true,
      contractId: 'CTR-2024-045',
      remindersSent: 3,
      attachments: ['facture_juillet.pdf', 'photos_intervention.zip'],
      discount: 0,
      late: true,
      daysOverdue: 15,
      penaltyAmount: 102.06
    },
    {
      id: 'FAC-2024-004',
      number: '2024004',
      client: {
        name: 'Restaurant Le Jardin Gourmand',
        type: 'Commerce',
        address: '12 Place Bellecour, 69002 Lyon',
        email: 'compta@jardingourmand.fr',
        phone: '04 78 37 22 11',
        siret: '456 789 123 00018',
        paymentHistory: 'excellent'
      },
      date: new Date('2024-08-10'),
      dueDate: new Date('2024-09-10'),
      amount: 1850.00,
      tax: 370.00,
      total: 2220.00,
      status: 'draft',
      items: [
        { description: 'Entretien terrasse végétalisée', quantity: 1, price: 850 },
        { description: 'Remplacement plantes aromatiques', quantity: 20, price: 50 }
      ],
      recurring: false,
      attachments: [],
      discount: 10,
      notes: 'Remise commerciale fidélité'
    },
    {
      id: 'FAC-2024-005',
      number: '2024005',
      client: {
        name: 'Parc d\'Activités TechHub',
        type: 'Entreprise',
        address: '200 Avenue Innovation, 69009 Lyon',
        email: 'facility@techhub.fr',
        phone: '04 72 10 88 99',
        siret: '789 012 345 00021',
        paymentHistory: 'good'
      },
      date: new Date('2024-08-12'),
      dueDate: new Date('2024-09-12'),
      amount: 18900.00,
      tax: 3780.00,
      total: 22680.00,
      status: 'partial',
      paidAmount: 11340.00,
      items: [
        { description: 'Aménagement paysager zone accueil', quantity: 1, price: 12500 },
        { description: 'Installation mobilier urbain végétal', quantity: 8, price: 800 }
      ],
      recurring: false,
      remindersSent: 1,
      attachments: ['plan_amenagement.pdf', 'devis_accepte.pdf'],
      discount: 0,
      paymentPlan: true,
      nextPayment: new Date('2024-09-12')
    }
  ];

  // Calcul des statistiques
  const stats = {
    totalRevenue: invoices.reduce((acc, inv) => acc + (inv.status === 'paid' ? inv.total : 0), 0),
    pendingAmount: invoices.reduce((acc, inv) => acc + (inv.status === 'pending' ? inv.total : 0), 0),
    overdueAmount: invoices.reduce((acc, inv) => acc + (inv.status === 'overdue' ? inv.total : 0), 0),
    avgInvoiceValue: invoices.reduce((acc, inv) => acc + inv.total, 0) / invoices.length,
    paidCount: invoices.filter(inv => inv.status === 'paid').length,
    pendingCount: invoices.filter(inv => inv.status === 'pending').length,
    overdueCount: invoices.filter(inv => inv.status === 'overdue').length,
    totalCount: invoices.length,
    paymentRate: (invoices.filter(inv => inv.status === 'paid').length / invoices.length * 100).toFixed(1),
    avgPaymentDelay: 12
  };

  // Graphique évolution CA
  const revenueChart = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
    datasets: [{
      label: 'Chiffre d\'affaires',
      data: [45000, 52000, 48000, 61000, 58000, 72000, 68000, 75000],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  // Répartition par statut
  const statusDistribution = {
    labels: ['Payées', 'En attente', 'En retard', 'Partielles'],
    datasets: [{
      data: [45, 30, 15, 10],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(251, 191, 36, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Analyse performance clients
  const clientPerformance = {
    labels: ['Excellent', 'Bon', 'Moyen', 'À risque'],
    datasets: [{
      label: 'Clients',
      data: [12, 8, 5, 2],
      backgroundColor: 'rgba(147, 51, 234, 0.6)',
      borderColor: 'rgb(147, 51, 234)',
      borderWidth: 2
    }]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'from-green-500 to-emerald-500';
      case 'pending': return 'from-blue-500 to-indigo-500';
      case 'overdue': return 'from-red-500 to-orange-500';
      case 'partial': return 'from-yellow-500 to-amber-500';
      case 'draft': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'paid': return 'Payée';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
      case 'partial': return 'Partielle';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  const getPaymentHistoryColor = (history) => {
    switch(history) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Factures */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animation de fond */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-0 right-0"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <CurrencyEuroIcon className="w-64 h-64" />
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <DocumentTextIcon className="w-8 h-8 mr-3" />
                Gestion des Factures Premium
              </h1>
              <p className="text-green-100">Facturation intelligente avec suivi en temps réel</p>
              
              {/* Indicateurs système */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Système actif</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span className="text-sm">Sécurisé</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BoltIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Traitement rapide</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckBadgeIcon className="w-5 h-5 text-green-300" />
                  <span className="text-sm">Conformité fiscale</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {stats.totalRevenue.toFixed(0)}€
              </div>
              <div className="text-green-100">CA encaissé ce mois</div>
              <div className="mt-3 flex items-center justify-end space-x-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {stats.paymentRate}% payées
                </span>
                <button className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300">
                  <PlusIcon className="w-5 h-5 inline mr-1" />
                  Nouvelle facture
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {[
          { label: 'Total facturé', value: `${(stats.totalRevenue / 1000).toFixed(0)}K€`, icon: '💰', color: 'from-green-500 to-emerald-500', trend: '+12%' },
          { label: 'En attente', value: `${(stats.pendingAmount / 1000).toFixed(0)}K€`, icon: '⏳', color: 'from-blue-500 to-indigo-500' },
          { label: 'En retard', value: `${(stats.overdueAmount / 1000).toFixed(0)}K€`, icon: '⚠️', color: 'from-red-500 to-orange-500' },
          { label: 'Moyenne', value: `${(stats.avgInvoiceValue / 1000).toFixed(1)}K€`, icon: '📊', color: 'from-purple-500 to-pink-500' },
          { label: 'Payées', value: stats.paidCount, icon: '✅', color: 'from-green-400 to-emerald-400' },
          { label: 'En cours', value: stats.pendingCount, icon: '🔄', color: 'from-blue-400 to-cyan-400' },
          { label: 'Délai moyen', value: `${stats.avgPaymentDelay}j`, icon: '📅', color: 'from-indigo-500 to-purple-500' },
          { label: 'Taux encaiss.', value: `${stats.paymentRate}%`, icon: '📈', color: 'from-yellow-500 to-orange-500' }
        ].map((kpi, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.05, type: "spring" }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className={`h-1 bg-gradient-to-r ${kpi.color}`} />
            <div className="p-3">
              <div className="text-xl font-bold text-gray-900 flex items-center justify-between">
                <span>{kpi.icon} {kpi.value}</span>
                {kpi.trend && (
                  <span className="text-xs text-green-600">{kpi.trend}</span>
                )}
              </div>
              <div className="text-xs text-gray-600">{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barre de contrôle */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Recherche */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher facture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none w-64"
              />
            </div>

            {/* Filtre statut */}
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="paid">Payées</option>
              <option value="pending">En attente</option>
              <option value="overdue">En retard</option>
              <option value="partial">Partielles</option>
              <option value="draft">Brouillons</option>
            </select>

            {/* Mode vue */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1 rounded ${viewMode === 'kanban' ? 'bg-white shadow' : ''}`}
              >
                Kanban
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <ArrowDownTrayIcon className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <PrinterIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <ArrowPathIcon className={`w-5 h-5 inline mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto-refresh
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des factures */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-6">
              <div className="space-y-4">
                {filteredInvoices.map((invoice, index) => (
                  <motion.div
                    key={invoice.id}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedInvoice(invoice)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Header facture */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {invoice.number}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getStatusColor(invoice.status)}`}>
                            {getStatusLabel(invoice.status)}
                          </span>
                          {invoice.recurring && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              <ArrowPathIcon className="w-3 h-3 inline mr-1" />
                              Récurrent
                            </span>
                          )}
                          {invoice.late && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full animate-pulse">
                              {invoice.daysOverdue}j de retard
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 flex items-center">
                          {invoice.client.type === 'Entreprise' ? (
                            <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                          ) : (
                            <UserIcon className="w-4 h-4 mr-1" />
                          )}
                          {invoice.client.name}
                          {invoice.client.paymentHistory && (
                            <span className={`ml-2 text-xs ${getPaymentHistoryColor(invoice.client.paymentHistory)}`}>
                              ({invoice.client.paymentHistory})
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {invoice.total.toFixed(2)}€
                        </div>
                        {invoice.status === 'partial' && (
                          <div className="text-sm text-gray-600">
                            Payé: {invoice.paidAmount.toFixed(2)}€
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dates et détails */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                        <span>{invoice.date.toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span>Échéance: {invoice.dueDate.toLocaleDateString('fr-FR')}</span>
                      </div>
                      {invoice.paymentDate && (
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          <span>Payé le {invoice.paymentDate.toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      {invoice.paymentMethod && (
                        <div className="flex items-center space-x-2">
                          <CreditCardIcon className="w-4 h-4 text-gray-400" />
                          <span>{invoice.paymentMethod}</span>
                        </div>
                      )}
                    </div>

                    {/* Articles */}
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-2">Articles facturés:</div>
                      {invoice.items.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{item.description}</span>
                          <span className="font-medium">{item.price.toFixed(2)}€</span>
                        </div>
                      ))}
                      {invoice.items.length > 2 && (
                        <div className="text-xs text-gray-500 mt-1">
                          +{invoice.items.length - 2} autres articles...
                        </div>
                      )}
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {invoice.attachments && invoice.attachments.length > 0 && (
                          <span className="flex items-center text-xs text-gray-600">
                            <DocumentDuplicateIcon className="w-3 h-3 mr-1" />
                            {invoice.attachments.length} pièces
                          </span>
                        )}
                        {invoice.remindersSent > 0 && (
                          <span className="flex items-center text-xs text-orange-600">
                            <BellAlertIcon className="w-3 h-3 mr-1" />
                            {invoice.remindersSent} relances
                          </span>
                        )}
                        {invoice.discount > 0 && (
                          <span className="flex items-center text-xs text-green-600">
                            <ReceiptPercentIcon className="w-3 h-3 mr-1" />
                            -{invoice.discount}%
                          </span>
                        )}
                      </div>

                      {/* Actions rapides */}
                      <div className="flex space-x-2">
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                          <EnvelopeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                        {invoice.status === 'pending' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPaymentModal(true);
                            }}
                            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                          >
                            Marquer payée
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          {/* Graphique CA */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution CA</h3>
            <div className="h-48">
              <Line
                data={revenueChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `${value / 1000}K€`
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Répartition statuts */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition Statuts</h3>
            <div className="h-48">
              <Doughnut
                data={statusDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        padding: 10,
                        usePointStyle: true,
                        font: { size: 10 }
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Alertes et actions */}
          <motion.div 
            className="bg-gradient-to-br from-emerald-500 to-green-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BellAlertIcon className="w-5 h-5 mr-2" />
              Alertes Facturation
            </h3>
            <div className="space-y-3">
              {stats.overdueCount > 0 && (
                <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stats.overdueCount} factures en retard</span>
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-300" />
                  </div>
                </div>
              )}
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">5 factures à envoyer</span>
                  <EnvelopeIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Clôture mensuelle dans 3j</span>
                  <CalendarDaysIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
              <ChartBarIcon className="w-5 h-5 inline mr-2" />
              Rapport complet
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default FacturesFacturationUltraPremium;