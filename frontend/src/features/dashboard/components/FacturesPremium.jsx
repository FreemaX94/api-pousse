// Factures Premium - Gestion Comptable Ultra Moderne 💰
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BanknotesIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
  CheckBadgeIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PrinterIcon,
  EnvelopeIcon,
  ChartPieIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  DocumentArrowDownIcon,
  PaperAirplaneIcon,
  BellAlertIcon,
  CalculatorIcon,
  ScaleIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  QrCodeIcon,
  WifiIcon,
  CloudArrowUpIcon,
  FolderArrowDownIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  BoltIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import confetti from 'canvas-confetti';

// Composant Timeline de paiement
const PaymentTimeline = ({ payments }) => {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500" />
      {payments.map((payment, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative flex items-center mb-4"
        >
          <div className={`absolute left-2 w-4 h-4 rounded-full ${
            payment.status === 'paid' ? 'bg-green-500' : 
            payment.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <div className="ml-10 flex-1">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium">{payment.amount}€</span>
                <span className="text-xs text-gray-400">{payment.date}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{payment.method}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Composant de carte de facture moderne avec effets 3D
const FactureCard = ({ facture, onView, onSend, onDownload, onMarkPaid, onRemind }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getStatusConfig = (statut) => {
    const configs = {
      'Payée': {
        gradient: 'from-green-500 to-emerald-500',
        icon: CheckCircleIcon,
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-400'
      },
      'En attente': {
        gradient: 'from-yellow-500 to-amber-500',
        icon: ClockIcon,
        bgColor: 'bg-yellow-500/20',
        textColor: 'text-yellow-400'
      },
      'En retard': {
        gradient: 'from-red-500 to-rose-500',
        icon: ExclamationCircleIcon,
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400',
        pulse: true
      },
      'Partielle': {
        gradient: 'from-blue-500 to-indigo-500',
        icon: ReceiptPercentIcon,
        bgColor: 'bg-blue-500/20',
        textColor: 'text-blue-400'
      }
    };
    return configs[statut] || configs['En attente'];
  };

  const statusConfig = getStatusConfig(facture.statut);
  const StatusIcon = statusConfig.icon;
  const daysOverdue = facture.statut === 'En retard' ? 
    Math.floor((new Date() - new Date(facture.dateEcheance)) / (1000 * 60 * 60 * 24)) : 0;
  
  const progressPercentage = (facture.montantPaye / facture.totalTTC) * 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, rotateY: -10 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, rotateY: 5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group perspective-1000"
    >
      {/* Effet de lueur pour factures en retard */}
      {statusConfig.pulse && (
        <motion.div
          className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Badge priorité */}
      {facture.priorite === 'haute' && (
        <motion.div
          className="absolute -top-3 -right-3 z-10"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
            URGENT
          </div>
        </motion.div>
      )}

      <div className={`relative bg-white/10 backdrop-blur-xl rounded-2xl border transition-all duration-300
                      ${isHovered ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20' : 'border-white/20'}`}>
        
        {/* Header avec statut et montant */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div 
                className={`p-3 bg-gradient-to-r ${statusConfig.gradient} rounded-xl text-white shadow-lg`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <StatusIcon className="w-5 h-5" />
              </motion.div>
              <div>
                <p className="text-xs text-gray-400">Facture {facture.numero}</p>
                <p className={`text-sm font-semibold ${statusConfig.textColor}`}>
                  {facture.statut}
                  {daysOverdue > 0 && ` (${daysOverdue}j)`}
                </p>
              </div>
            </div>
            
            {/* Montant avec effet 3D */}
            <motion.div
              className="text-right"
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            >
              <p className="text-2xl font-bold text-white">
                {facture.totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </p>
              {facture.montantPaye > 0 && facture.montantPaye < facture.totalTTC && (
                <p className="text-xs text-gray-400">
                  Payé: {facture.montantPaye.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </p>
              )}
            </motion.div>
          </div>

          {/* Informations client avec icônes */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <BuildingLibraryIcon className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">{facture.client}</h3>
              {facture.clientVIP && (
                <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs rounded-full">
                  VIP
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>Émise: {new Date(facture.dateFacture).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>Échéance: {new Date(facture.dateEcheance).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>

          {/* Barre de progression du paiement */}
          {facture.statut !== 'Payée' && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Progression paiement</span>
                <span className="text-xs text-white font-medium">{progressPercentage.toFixed(0)}%</span>
              </div>
              <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                {/* Effet de brillance */}
                <motion.div
                  className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-200, 200] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              </div>
            </div>
          )}

          {/* Méthodes de paiement acceptées */}
          <div className="flex items-center space-x-2 mb-4">
            <CreditCardIcon className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-2">
              {facture.methodesAcceptees?.map((method, i) => (
                <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                  {method}
                </span>
              ))}
            </div>
          </div>

          {/* Actions rapides avec animations */}
          <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {facture.statut !== 'Payée' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onMarkPaid(facture)}
                  className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                >
                  <CheckBadgeIcon className="w-4 h-4" />
                  <span>Marquer payée</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onRemind(facture)}
                  className="px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                >
                  <BellAlertIcon className="w-4 h-4" />
                  <span>Relancer</span>
                </motion.button>
              </>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSend(facture)}
              className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
            >
              <EnvelopeIcon className="w-4 h-4" />
              <span>Envoyer</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDownload(facture)}
              className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Télécharger</span>
            </motion.button>
          </div>
        </div>

        {/* Footer avec informations supplémentaires */}
        <div className="px-6 py-3 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3 text-gray-400">
              {facture.recurring && (
                <span className="flex items-center space-x-1">
                  <ArrowPathIcon className="w-3 h-3" />
                  <span>Récurrente</span>
                </span>
              )}
              {facture.locked && (
                <span className="flex items-center space-x-1">
                  <LockClosedIcon className="w-3 h-3" />
                  <span>Verrouillée</span>
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {facture.hasAttachments && (
                <DocumentArrowDownIcon className="w-4 h-4 text-gray-400" />
              )}
              {facture.hasNotes && (
                <ChatBubbleLeftIcon className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Composant de statistiques avancées
const FacturesStats = ({ factures }) => {
  const stats = useMemo(() => {
    const total = factures.length;
    const payees = factures.filter(f => f.statut === 'Payée').length;
    const enAttente = factures.filter(f => f.statut === 'En attente').length;
    const enRetard = factures.filter(f => f.statut === 'En retard').length;
    const montantTotal = factures.reduce((acc, f) => acc + f.totalTTC, 0);
    const montantPaye = factures.reduce((acc, f) => acc + f.montantPaye, 0);
    const montantRestant = montantTotal - montantPaye;
    
    return {
      total,
      payees,
      enAttente,
      enRetard,
      montantTotal,
      montantPaye,
      montantRestant,
      tauxRecouvrement: montantTotal > 0 ? (montantPaye / montantTotal * 100).toFixed(1) : 0
    };
  }, [factures]);

  // Données pour le graphique en ligne
  const lineChartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Facturé',
        data: [45000, 52000, 48000, 61000, 58000, 67000],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4
      },
      {
        label: 'Encaissé',
        data: [42000, 48000, 45000, 55000, 54000, 62000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Données pour le graphique donut
  const donutData = {
    labels: ['Payées', 'En attente', 'En retard'],
    datasets: [{
      data: [stats.payees, stats.enAttente, stats.enRetard],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(250, 204, 21, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {/* KPI Cards avec animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-1"
      >
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <BanknotesIcon className="w-8 h-8 text-green-400" />
            <span className="text-xs text-green-400 font-medium">+15.3%</span>
          </div>
          <p className="text-sm text-gray-400 mb-1">Total facturé</p>
          <p className="text-3xl font-bold text-white">
            {stats.montantTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-1"
      >
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <CheckBadgeIcon className="w-8 h-8 text-purple-400" />
            <span className="text-xs text-purple-400 font-medium">{stats.tauxRecouvrement}%</span>
          </div>
          <p className="text-sm text-gray-400 mb-1">Montant encaissé</p>
          <p className="text-3xl font-bold text-white">
            {stats.montantPaye.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-1"
      >
        <div className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <ClockIcon className="w-8 h-8 text-yellow-400" />
            <span className="text-xs text-yellow-400 font-medium">{stats.enAttente}</span>
          </div>
          <p className="text-sm text-gray-400 mb-1">En attente</p>
          <p className="text-3xl font-bold text-white">
            {stats.montantRestant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-1"
      >
        <div className="bg-gradient-to-br from-red-600/20 to-rose-600/20 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30">
          <div className="flex items-center justify-between mb-4">
            <ExclamationCircleIcon className="w-8 h-8 text-red-400" />
            <motion.span 
              className="text-xs text-red-400 font-medium"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {stats.enRetard} factures
            </motion.span>
          </div>
          <p className="text-sm text-gray-400 mb-1">En retard</p>
          <p className="text-3xl font-bold text-white">
            {(stats.montantTotal * 0.15).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// Composant principal
const FacturesPremium = ({ themeColors }) => {
  const [factures, setFactures] = useState([
    {
      numero: 'FAC-2025-001',
      dateFacture: '2025-01-01',
      dateEcheance: '2025-01-31',
      client: 'Crystal Tech Solutions',
      clientVIP: true,
      statut: 'Payée',
      totalTTC: 15750,
      montantPaye: 15750,
      methodesAcceptees: ['CB', 'Virement', 'Chèque'],
      recurring: false,
      locked: true,
      hasAttachments: true,
      hasNotes: false,
      priorite: 'normale'
    },
    {
      numero: 'FAC-2025-002',
      dateFacture: '2025-01-02',
      dateEcheance: '2025-01-20',
      client: 'Green Energy Corp',
      clientVIP: false,
      statut: 'En retard',
      totalTTC: 28500,
      montantPaye: 0,
      methodesAcceptees: ['CB', 'Virement'],
      recurring: true,
      locked: false,
      hasAttachments: true,
      hasNotes: true,
      priorite: 'haute'
    },
    {
      numero: 'FAC-2025-003',
      dateFacture: '2025-01-03',
      dateEcheance: '2025-02-03',
      client: 'Digital Innovation Lab',
      clientVIP: false,
      statut: 'En attente',
      totalTTC: 8900,
      montantPaye: 0,
      methodesAcceptees: ['CB', 'PayPal'],
      recurring: false,
      locked: false,
      hasAttachments: false,
      hasNotes: false,
      priorite: 'normale'
    },
    {
      numero: 'FAC-2025-004',
      dateFacture: '2025-01-04',
      dateEcheance: '2025-02-04',
      client: 'Luxury Hotels Group',
      clientVIP: true,
      statut: 'Partielle',
      totalTTC: 45200,
      montantPaye: 22600,
      methodesAcceptees: ['Virement', 'Chèque'],
      recurring: false,
      locked: false,
      hasAttachments: true,
      hasNotes: true,
      priorite: 'normale'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showTimeline, setShowTimeline] = useState(false);

  const handleMarkPaid = (facture) => {
    setFactures(prev => prev.map(f => 
      f.numero === facture.numero 
        ? { ...f, statut: 'Payée', montantPaye: f.totalTTC }
        : f
    ));
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleRemind = (facture) => {
    console.log('Relance envoyée pour:', facture.numero);
  };

  const handleSend = (facture) => {
    console.log('Envoi de la facture:', facture.numero);
  };

  const handleDownload = (facture) => {
    console.log('Téléchargement:', facture.numero);
  };

  const filteredFactures = useMemo(() => {
    let filtered = [...factures];
    
    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.numero.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(f => f.statut === filterStatus);
    }
    
    return filtered;
  }, [factures, searchTerm, filterStatus]);

  return (
    <div className="p-6 space-y-6">
      {/* Header avec animations */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
            <BanknotesIcon className="w-8 h-8 text-green-400" />
            <span>Factures Premium</span>
            <motion.span 
              className="ml-2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              COMPTABILITÉ 2.0
            </motion.span>
          </h1>
          <p className="text-gray-400 mt-1">Gestion intelligente des paiements et relances automatiques</p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTimeline(!showTimeline)}
            className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg flex items-center space-x-2"
          >
            <ChartPieIcon className="w-5 h-5" />
            <span>Analytics</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center space-x-2"
          >
            <BoltIcon className="w-5 h-5" />
            <span>Nouvelle facture</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Statistiques */}
      <FacturesStats factures={factures} />

      {/* Barre de recherche et filtres */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une facture, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="Payée">Payées</option>
              <option value="En attente">En attente</option>
              <option value="En retard">En retard</option>
              <option value="Partielle">Paiement partiel</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-green-500/20 rounded-lg text-green-400"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Liste des factures */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredFactures.map((facture) => (
            <FactureCard
              key={facture.numero}
              facture={facture}
              onView={() => {}}
              onSend={handleSend}
              onDownload={handleDownload}
              onMarkPaid={handleMarkPaid}
              onRemind={handleRemind}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FacturesPremium;