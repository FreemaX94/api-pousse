import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BanknotesIcon,
  CurrencyEuroIcon,
  CalendarDaysIcon,
  UserIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  WalletIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  CalculatorIcon,
  ReceiptRefundIcon,
  ShieldCheckIcon,
  BoltIcon,
  SparklesIcon,
  FireIcon,
  RocketLaunchIcon,
  TrophyIcon,
  ArrowPathIcon,
  BuildingLibraryIcon,
  ScaleIcon,
  DocumentDuplicateIcon,
  HashtagIcon,
  TagIcon,
  ClipboardDocumentCheckIcon,
  InformationCircleIcon,
  CheckBadgeIcon,
  LockClosedIcon,
  BellAlertIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Scatter } from 'react-chartjs-2';

const FacturesAcompteUltraPremium = () => {
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [viewMode, setViewMode] = useState('timeline');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewDepositModal, setShowNewDepositModal] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);

  // Animation du solde
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedBalance(prev => {
        const target = 45670.50;
        const diff = target - prev;
        return prev + diff * 0.1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Acomptes et paiements partiels
  const deposits = [
    {
      id: 'ACP-2024-001',
      type: 'acompte',
      client: {
        name: 'Jardin Botanique de Lyon',
        type: 'Entreprise',
        email: 'compta@jardinbotanique.fr',
        trustScore: 95
      },
      project: 'Aménagement zone tropicale',
      totalAmount: 35000,
      depositAmount: 10500,
      depositPercent: 30,
      paidAmount: 10500,
      remainingAmount: 24500,
      status: 'received',
      paymentDate: new Date('2024-08-01'),
      projectStartDate: new Date('2024-08-15'),
      projectEndDate: new Date('2024-10-15'),
      invoices: [
        { number: 'FAC-2024-089', amount: 10500, status: 'paid' }
      ],
      bankReference: 'VIR-2024-08-001',
      paymentMethod: 'Virement bancaire',
      documents: ['devis_signe.pdf', 'contrat.pdf'],
      notes: 'Acompte 30% pour démarrage travaux',
      milestones: [
        { name: 'Acompte initial', amount: 10500, status: 'completed', date: new Date('2024-08-01') },
        { name: 'Livraison matériaux', amount: 8000, status: 'pending', date: new Date('2024-08-20') },
        { name: 'Mi-parcours', amount: 8000, status: 'pending', date: new Date('2024-09-15') },
        { name: 'Solde final', amount: 8500, status: 'pending', date: new Date('2024-10-15') }
      ]
    },
    {
      id: 'ACP-2024-002',
      type: 'paiement_partiel',
      client: {
        name: 'Villa Moderne',
        type: 'Particulier',
        email: 'contact@villamoderne.com',
        trustScore: 88
      },
      project: 'Installation piscine naturelle',
      totalAmount: 45000,
      depositAmount: 22500,
      depositPercent: 50,
      paidAmount: 15000,
      remainingAmount: 30000,
      status: 'partial',
      paymentDate: new Date('2024-08-05'),
      projectStartDate: new Date('2024-08-10'),
      projectEndDate: new Date('2024-09-30'),
      invoices: [
        { number: 'FAC-2024-092', amount: 22500, status: 'partial' }
      ],
      paymentMethod: 'Carte bancaire',
      documents: ['devis_piscine.pdf'],
      notes: 'Paiement en 3 fois',
      paymentSchedule: [
        { date: new Date('2024-08-05'), amount: 15000, status: 'paid' },
        { date: new Date('2024-09-05'), amount: 15000, status: 'pending' },
        { date: new Date('2024-10-05'), amount: 15000, status: 'pending' }
      ]
    },
    {
      id: 'ACP-2024-003',
      type: 'acompte',
      client: {
        name: 'Résidence Harmony',
        type: 'Syndic',
        email: 'syndic@harmony.fr',
        trustScore: 92
      },
      project: 'Réfection espaces verts',
      totalAmount: 18500,
      depositAmount: 5550,
      depositPercent: 30,
      paidAmount: 5550,
      remainingAmount: 12950,
      status: 'received',
      paymentDate: new Date('2024-07-28'),
      projectStartDate: new Date('2024-08-05'),
      projectEndDate: new Date('2024-08-30'),
      invoices: [
        { number: 'FAC-2024-087', amount: 5550, status: 'paid' }
      ],
      bankReference: 'CHQ-2024-07-145',
      paymentMethod: 'Chèque',
      documents: ['devis_refection.pdf', 'plan_amenagement.pdf'],
      milestones: [
        { name: 'Acompte 30%', amount: 5550, status: 'completed', date: new Date('2024-07-28') },
        { name: 'Fin travaux', amount: 12950, status: 'in_progress', date: new Date('2024-08-30') }
      ]
    },
    {
      id: 'ACP-2024-004',
      type: 'reservation',
      client: {
        name: 'Entreprise TechCorp',
        type: 'Entreprise',
        email: 'finance@techcorp.fr',
        trustScore: 78
      },
      project: 'Entretien annuel 2025',
      totalAmount: 24000,
      depositAmount: 2400,
      depositPercent: 10,
      paidAmount: 0,
      remainingAmount: 24000,
      status: 'pending',
      dueDate: new Date('2024-09-01'),
      projectStartDate: new Date('2025-01-01'),
      projectEndDate: new Date('2025-12-31'),
      invoices: [
        { number: 'FAC-2024-095', amount: 2400, status: 'pending' }
      ],
      documents: ['contrat_annuel_2025.pdf'],
      notes: 'Réservation contrat entretien 2025',
      recurring: true
    },
    {
      id: 'ACP-2024-005',
      type: 'garantie',
      client: {
        name: 'Mairie de Lyon',
        type: 'Administration',
        email: 'marches@mairie-lyon.fr',
        trustScore: 98
      },
      project: 'Marché public - Parcs urbains',
      totalAmount: 120000,
      depositAmount: 6000,
      depositPercent: 5,
      paidAmount: 6000,
      remainingAmount: 0,
      status: 'guarantee',
      paymentDate: new Date('2024-06-15'),
      projectStartDate: new Date('2024-07-01'),
      projectEndDate: new Date('2025-06-30'),
      invoices: [],
      bankReference: 'GAR-2024-06-001',
      paymentMethod: 'Caution bancaire',
      documents: ['marche_public.pdf', 'caution_bancaire.pdf'],
      notes: 'Garantie de bonne exécution 5%',
      returnDate: new Date('2025-07-30')
    }
  ];

  // Calcul des statistiques
  const stats = {
    totalDeposits: deposits.reduce((acc, d) => acc + d.depositAmount, 0),
    receivedDeposits: deposits.reduce((acc, d) => acc + (d.paidAmount || 0), 0),
    pendingDeposits: deposits.filter(d => d.status === 'pending').reduce((acc, d) => acc + d.depositAmount, 0),
    averageDepositPercent: deposits.reduce((acc, d) => acc + d.depositPercent, 0) / deposits.length,
    totalProjects: deposits.length,
    activeProjects: deposits.filter(d => d.status !== 'completed').length,
    conversionRate: 85,
    cashFlow: animatedBalance
  };

  // Graphique évolution acomptes
  const depositsEvolution = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
    datasets: [
      {
        label: 'Acomptes reçus',
        data: [12000, 15000, 18000, 14000, 22000, 19000, 25000, 28000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'En attente',
        data: [3000, 4000, 2000, 5000, 3000, 6000, 4000, 7000],
        borderColor: 'rgb(251, 191, 36)',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Répartition par type
  const typeDistribution = {
    labels: ['Acompte projet', 'Paiement partiel', 'Réservation', 'Garantie'],
    datasets: [{
      data: [45, 30, 15, 10],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(251, 191, 36, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Timeline des paiements
  const paymentTimeline = {
    datasets: [{
      label: 'Échéancier',
      data: deposits.flatMap(d => {
        if (d.milestones) {
          return d.milestones.map(m => ({
            x: m.date.getTime(),
            y: m.amount,
            client: d.client.name
          }));
        }
        return [];
      }),
      backgroundColor: 'rgba(147, 51, 234, 0.6)',
      borderColor: 'rgb(147, 51, 234)',
      pointRadius: 6
    }]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'received': return 'from-green-500 to-emerald-500';
      case 'partial': return 'from-yellow-500 to-amber-500';
      case 'pending': return 'from-blue-500 to-indigo-500';
      case 'guarantee': return 'from-purple-500 to-pink-500';
      case 'refunded': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'received': return 'Reçu';
      case 'partial': return 'Partiel';
      case 'pending': return 'En attente';
      case 'guarantee': return 'Garantie';
      case 'refunded': return 'Remboursé';
      default: return status;
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'acompte': return '💰';
      case 'paiement_partiel': return '📊';
      case 'reservation': return '📅';
      case 'garantie': return '🛡️';
      default: return '💵';
    }
  };

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = deposit.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || deposit.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Acomptes */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animation de fond */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute -top-10 -right-10"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <BanknotesIcon className="w-96 h-96" />
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <WalletIcon className="w-8 h-8 mr-3" />
                Gestion des Acomptes & Paiements Partiels
              </h1>
              <p className="text-purple-100">Suivi intelligent des encaissements progressifs</p>
              
              {/* Indicateurs système */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Système actif</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BuildingLibraryIcon className="w-5 h-5" />
                  <span className="text-sm">Banque synchronisée</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ScaleIcon className="w-5 h-5" />
                  <span className="text-sm">Balance équilibrée</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckBadgeIcon className="w-5 h-5 text-green-300" />
                  <span className="text-sm">Conformité OK</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {animatedBalance.toFixed(2)}€
              </div>
              <div className="text-purple-100">Solde acomptes</div>
              <div className="mt-3 flex items-center justify-end space-x-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {stats.activeProjects} projets actifs
                </span>
                <button 
                  onClick={() => setShowNewDepositModal(true)}
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300"
                >
                  <PlusIcon className="w-5 h-5 inline mr-1" />
                  Nouvel acompte
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {[
          { label: 'Total acomptes', value: `${(stats.totalDeposits / 1000).toFixed(0)}K€`, icon: '💵', color: 'from-green-500 to-emerald-500' },
          { label: 'Encaissés', value: `${(stats.receivedDeposits / 1000).toFixed(0)}K€`, icon: '✅', color: 'from-blue-500 to-indigo-500' },
          { label: 'En attente', value: `${(stats.pendingDeposits / 1000).toFixed(0)}K€`, icon: '⏳', color: 'from-yellow-500 to-amber-500' },
          { label: '% moyen', value: `${stats.averageDepositPercent.toFixed(0)}%`, icon: '📊', color: 'from-purple-500 to-pink-500' },
          { label: 'Projets', value: stats.totalProjects, icon: '🏗️', color: 'from-indigo-500 to-purple-500' },
          { label: 'Actifs', value: stats.activeProjects, icon: '🔄', color: 'from-cyan-500 to-blue-500' },
          { label: 'Conversion', value: `${stats.conversionRate}%`, icon: '🎯', color: 'from-green-400 to-emerald-400' },
          { label: 'Cash flow', value: `${(stats.cashFlow / 1000).toFixed(0)}K€`, icon: '💰', color: 'from-yellow-400 to-orange-400' }
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
              <div className="text-xl font-bold text-gray-900">
                {kpi.icon} {kpi.value}
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
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none w-64"
              />
            </div>

            {/* Filtre type */}
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="all">Tous types</option>
              <option value="acompte">Acomptes</option>
              <option value="paiement_partiel">Paiements partiels</option>
              <option value="reservation">Réservations</option>
              <option value="garantie">Garanties</option>
            </select>

            {/* Mode vue */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 rounded ${viewMode === 'timeline' ? 'bg-white shadow' : ''}`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded ${viewMode === 'cards' ? 'bg-white shadow' : ''}`}
              >
                Cartes
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded ${viewMode === 'table' ? 'bg-white shadow' : ''}`}
              >
                Tableau
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <CalculatorIcon className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <ArrowDownTrayIcon className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
              <ArrowPathIcon className="w-5 h-5 inline mr-2" />
              Synchroniser
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des acomptes */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <BanknotesIcon className="w-5 h-5 mr-2" />
                Acomptes & Paiements
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {filteredDeposits.map((deposit, index) => (
                  <motion.div
                    key={deposit.id}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedDeposit(deposit)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Header acompte */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-2xl">{getTypeIcon(deposit.type)}</span>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {deposit.project}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getStatusColor(deposit.status)}`}>
                            {getStatusLabel(deposit.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {deposit.client.name}
                          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                            Score: {deposit.client.trustScore}%
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {deposit.depositAmount.toFixed(2)}€
                        </div>
                        <div className="text-sm text-gray-600">
                          {deposit.depositPercent}% du total
                        </div>
                      </div>
                    </div>

                    {/* Détails financiers */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">Projet total:</span>
                        <div className="font-semibold">{deposit.totalAmount.toFixed(2)}€</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Payé:</span>
                        <div className="font-semibold text-green-600">{deposit.paidAmount.toFixed(2)}€</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Restant:</span>
                        <div className="font-semibold">{deposit.remainingAmount.toFixed(2)}€</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Méthode:</span>
                        <div className="font-semibold">{deposit.paymentMethod || 'Non défini'}</div>
                      </div>
                    </div>

                    {/* Timeline ou échéancier */}
                    {deposit.milestones && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-2">Jalons de paiement:</div>
                        <div className="space-y-1">
                          {deposit.milestones.slice(0, 3).map((milestone, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                {milestone.status === 'completed' ? (
                                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                ) : milestone.status === 'in_progress' ? (
                                  <ClockIcon className="w-4 h-4 text-yellow-500 animate-pulse" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                )}
                                <span className={milestone.status === 'completed' ? 'text-gray-500 line-through' : ''}>
                                  {milestone.name}
                                </span>
                              </div>
                              <span className="font-medium">{milestone.amount.toFixed(0)}€</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Barre de progression */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progression paiement</span>
                        <span className="font-semibold">
                          {((deposit.paidAmount / deposit.totalAmount) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(deposit.paidAmount / deposit.totalAmount) * 100}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {deposit.documents && deposit.documents.length > 0 && (
                          <span className="flex items-center text-xs text-gray-600">
                            <DocumentDuplicateIcon className="w-3 h-3 mr-1" />
                            {deposit.documents.length} docs
                          </span>
                        )}
                        {deposit.bankReference && (
                          <span className="flex items-center text-xs text-gray-600">
                            <HashtagIcon className="w-3 h-3 mr-1" />
                            {deposit.bankReference}
                          </span>
                        )}
                        {deposit.recurring && (
                          <span className="flex items-center text-xs text-purple-600">
                            <ArrowPathIcon className="w-3 h-3 mr-1" />
                            Récurrent
                          </span>
                        )}
                      </div>

                      {/* Actions rapides */}
                      <div className="flex space-x-2">
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200">
                          <PrinterIcon className="w-4 h-4" />
                        </button>
                        {deposit.status === 'pending' && (
                          <button className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-sm">
                            Confirmer réception
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
          {/* Évolution acomptes */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Acomptes</h3>
            <div className="h-48">
              <Line
                data={depositsEvolution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 10,
                        usePointStyle: true,
                        font: { size: 10 }
                      }
                    }
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

          {/* Répartition par type */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Types de Paiements</h3>
            <div className="h-48">
              <Doughnut
                data={typeDistribution}
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

          {/* Alertes et prochaines échéances */}
          <motion.div 
            className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BellAlertIcon className="w-5 h-5 mr-2" />
              Prochaines Échéances
            </h3>
            <div className="space-y-3">
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">3 acomptes à recevoir</span>
                  <ClockIcon className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="text-xs opacity-90 mt-1">Total: 18,500€</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">2 garanties à libérer</span>
                  <CalendarDaysIcon className="w-5 h-5" />
                </div>
                <div className="text-xs opacity-90 mt-1">Fin de mois</div>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
              <ChartBarIcon className="w-5 h-5 inline mr-2" />
              Tableau de bord complet
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default FacturesAcompteUltraPremium;