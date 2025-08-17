import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReceiptRefundIcon,
  CurrencyEuroIcon,
  CalendarDaysIcon,
  UserIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUturnLeftIcon,
  CreditCardIcon,
  ChartBarIcon,
  ArrowTrendingDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  CalculatorIcon,
  ShieldCheckIcon,
  BoltIcon,
  SparklesIcon,
  FireIcon,
  RocketLaunchIcon,
  MinusCircleIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  TagIcon,
  DocumentDuplicateIcon,
  HashtagIcon,
  ClipboardDocumentCheckIcon,
  InformationCircleIcon,
  CheckBadgeIcon,
  XCircleIcon,
  BellAlertIcon,
  PencilIcon,
  TrashIcon,
  BanknotesIcon,
  TicketIcon,
  GiftIcon,
  ExclamationCircleIcon,
  ScaleIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

const AvoirsFacturationUltraPremium = () => {
  const [selectedCreditNote, setSelectedCreditNote] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterReason, setFilterReason] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewCreditModal, setShowNewCreditModal] = useState(false);
  const [animatedRefunds, setAnimatedRefunds] = useState(0);

  // Animation des remboursements
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedRefunds(prev => {
        const target = 23456.78;
        const diff = target - prev;
        return prev + diff * 0.1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Avoirs exemple
  const creditNotes = [
    {
      id: 'AV-2024-001',
      number: 'AV2024001',
      originalInvoice: 'FAC-2024-067',
      client: {
        name: 'Restaurant Le Jardin Gourmand',
        type: 'Commerce',
        email: 'compta@jardingourmand.fr',
        history: 'excellent'
      },
      date: new Date('2024-08-15'),
      amount: 450.00,
      tax: 90.00,
      total: 540.00,
      status: 'validated',
      reason: 'service_issue',
      reasonDetail: 'Intervention incomplète - haie non taillée',
      items: [
        { description: 'Taille de haie (non réalisé)', quantity: 1, price: -450 }
      ],
      refundMethod: 'credit',
      refundDate: new Date('2024-08-20'),
      documents: ['rapport_incident.pdf', 'photos.zip'],
      notes: 'Client fidèle - geste commercial accordé',
      approvedBy: 'Marie Dupont',
      impact: 'low',
      nextAction: 'Crédit sur prochaine facture',
      satisfactionScore: 4.5
    },
    {
      id: 'AV-2024-002',
      number: 'AV2024002',
      originalInvoice: 'FAC-2024-089',
      client: {
        name: 'Villa Moderne',
        type: 'Particulier',
        email: 'contact@villamoderne.com',
        history: 'good'
      },
      date: new Date('2024-08-10'),
      amount: 1200.00,
      tax: 240.00,
      total: 1440.00,
      status: 'pending',
      reason: 'cancellation',
      reasonDetail: 'Annulation intervention - client absent',
      items: [
        { description: 'Traitement phytosanitaire annulé', quantity: 1, price: -800 },
        { description: 'Fertilisation annulée', quantity: 1, price: -400 }
      ],
      refundMethod: 'pending',
      documents: ['email_annulation.pdf'],
      notes: 'En attente validation direction',
      impact: 'medium',
      daysWaiting: 5
    },
    {
      id: 'AV-2024-003',
      number: 'AV2024003',
      originalInvoice: 'FAC-2024-045',
      client: {
        name: 'Jardin Botanique de Lyon',
        type: 'Entreprise',
        email: 'finance@jardinbotanique.fr',
        history: 'excellent'
      },
      date: new Date('2024-07-25'),
      amount: 2340.00,
      tax: 468.00,
      total: 2808.00,
      status: 'processed',
      reason: 'damage',
      reasonDetail: 'Dommage matériel lors intervention',
      items: [
        { description: 'Remboursement dommages', quantity: 1, price: -2340 }
      ],
      refundMethod: 'bank_transfer',
      refundDate: new Date('2024-08-01'),
      bankReference: 'VIR-2024-08-012',
      documents: ['constat_assurance.pdf', 'devis_reparation.pdf'],
      notes: 'Pris en charge par assurance',
      approvedBy: 'Direction',
      insuranceClaim: 'ASS-2024-089',
      impact: 'high',
      compensationType: 'full'
    },
    {
      id: 'AV-2024-004',
      number: 'AV2024004',
      originalInvoice: 'FAC-2024-092',
      client: {
        name: 'Résidence Les Terrasses',
        type: 'Syndic',
        email: 'syndic@terrasses.fr',
        history: 'average'
      },
      date: new Date('2024-08-18'),
      amount: 180.00,
      tax: 36.00,
      total: 216.00,
      status: 'draft',
      reason: 'pricing_error',
      reasonDetail: 'Erreur de tarification sur devis',
      items: [
        { description: 'Ajustement tarif', quantity: 1, price: -180 }
      ],
      refundMethod: null,
      documents: ['devis_original.pdf', 'devis_corrige.pdf'],
      notes: 'En cours de validation',
      impact: 'low'
    },
    {
      id: 'AV-2024-005',
      number: 'AV2024005',
      originalInvoice: 'FAC-2024-078',
      client: {
        name: 'Entreprise TechCorp',
        type: 'Entreprise',
        email: 'achats@techcorp.fr',
        history: 'good'
      },
      date: new Date('2024-08-05'),
      amount: 890.00,
      tax: 178.00,
      total: 1068.00,
      status: 'validated',
      reason: 'quality_issue',
      reasonDetail: 'Qualité des plantations non conforme',
      items: [
        { description: 'Remplacement végétaux', quantity: 15, price: -59.33 }
      ],
      refundMethod: 'replacement',
      replacementDate: new Date('2024-08-25'),
      documents: ['rapport_qualite.pdf', 'bon_livraison.pdf'],
      notes: 'Remplacement prévu semaine prochaine',
      approvedBy: 'Service Qualité',
      impact: 'medium',
      followUp: true,
      warranty: true
    }
  ];

  // Calcul des statistiques
  const stats = {
    totalCreditNotes: creditNotes.reduce((acc, cn) => acc + cn.total, 0),
    validatedAmount: creditNotes.filter(cn => cn.status === 'validated').reduce((acc, cn) => acc + cn.total, 0),
    pendingAmount: creditNotes.filter(cn => cn.status === 'pending').reduce((acc, cn) => acc + cn.total, 0),
    processedAmount: creditNotes.filter(cn => cn.status === 'processed').reduce((acc, cn) => acc + cn.total, 0),
    averageAmount: creditNotes.reduce((acc, cn) => acc + cn.total, 0) / creditNotes.length,
    totalCount: creditNotes.length,
    validatedCount: creditNotes.filter(cn => cn.status === 'validated').length,
    pendingCount: creditNotes.filter(cn => cn.status === 'pending').length,
    refundRate: ((creditNotes.reduce((acc, cn) => acc + cn.total, 0) / 150000) * 100).toFixed(2),
    avgProcessingTime: 4.5
  };

  // Graphique évolution avoirs
  const creditEvolution = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
    datasets: [
      {
        label: 'Montant avoirs',
        data: [2100, 1800, 2400, 1500, 2800, 2200, 3100, 3500],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'CA mensuel',
        data: [45000, 52000, 48000, 61000, 58000, 72000, 68000, 75000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Répartition par motif
  const reasonDistribution = {
    labels: ['Problème service', 'Annulation', 'Dommage', 'Erreur prix', 'Qualité'],
    datasets: [{
      data: [30, 25, 15, 10, 20],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Analyse impact
  const impactAnalysis = {
    labels: ['Satisfaction client', 'Rentabilité', 'Réputation', 'Fidélisation', 'Processus'],
    datasets: [{
      label: 'Impact positif',
      data: [85, 65, 90, 88, 75],
      backgroundColor: 'rgba(34, 197, 94, 0.3)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 2
    }]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'validated': return 'from-green-500 to-emerald-500';
      case 'pending': return 'from-yellow-500 to-amber-500';
      case 'processed': return 'from-blue-500 to-indigo-500';
      case 'draft': return 'from-gray-400 to-gray-500';
      case 'rejected': return 'from-red-500 to-orange-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'validated': return 'Validé';
      case 'pending': return 'En attente';
      case 'processed': return 'Traité';
      case 'draft': return 'Brouillon';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  const getReasonIcon = (reason) => {
    switch(reason) {
      case 'service_issue': return '⚠️';
      case 'cancellation': return '❌';
      case 'damage': return '🔨';
      case 'pricing_error': return '💰';
      case 'quality_issue': return '⭐';
      default: return '📋';
    }
  };

  const getReasonLabel = (reason) => {
    switch(reason) {
      case 'service_issue': return 'Problème service';
      case 'cancellation': return 'Annulation';
      case 'damage': return 'Dommage';
      case 'pricing_error': return 'Erreur tarif';
      case 'quality_issue': return 'Qualité';
      default: return reason;
    }
  };

  const getImpactColor = (impact) => {
    switch(impact) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredCreditNotes = creditNotes.filter(note => {
    const matchesSearch = note.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.number.includes(searchTerm) ||
                         note.originalInvoice.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || note.status === filterStatus;
    const matchesReason = filterReason === 'all' || note.reason === filterReason;
    return matchesSearch && matchesStatus && matchesReason;
  });

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Avoirs */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Animation de fond */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute -bottom-10 -left-10"
            animate={{
              rotate: [-10, 10, -10],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ReceiptRefundIcon className="w-96 h-96" />
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <ReceiptRefundIcon className="w-8 h-8 mr-3" />
                Gestion des Avoirs & Remboursements
              </h1>
              <p className="text-orange-100">Traitement intelligent des crédits et compensations</p>
              
              {/* Indicateurs système */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Système actif</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ScaleIcon className="w-5 h-5" />
                  <span className="text-sm">Conformité légale</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span className="text-sm">Validation sécurisée</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HandRaisedIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Satisfaction client</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                -{animatedRefunds.toFixed(2)}€
              </div>
              <div className="text-orange-100">Total avoirs ce mois</div>
              <div className="mt-3 flex items-center justify-end space-x-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {stats.refundRate}% du CA
                </span>
                <button 
                  onClick={() => setShowNewCreditModal(true)}
                  className="px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-300"
                >
                  <PlusIcon className="w-5 h-5 inline mr-1" />
                  Nouvel avoir
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {[
          { label: 'Total avoirs', value: `${(stats.totalCreditNotes / 1000).toFixed(1)}K€`, icon: '💸', color: 'from-red-500 to-orange-500' },
          { label: 'Validés', value: `${(stats.validatedAmount / 1000).toFixed(1)}K€`, icon: '✅', color: 'from-green-500 to-emerald-500' },
          { label: 'En attente', value: `${(stats.pendingAmount / 1000).toFixed(1)}K€`, icon: '⏳', color: 'from-yellow-500 to-amber-500' },
          { label: 'Traités', value: `${(stats.processedAmount / 1000).toFixed(1)}K€`, icon: '✔️', color: 'from-blue-500 to-indigo-500' },
          { label: 'Moyenne', value: `${(stats.averageAmount / 1000).toFixed(1)}K€`, icon: '📊', color: 'from-purple-500 to-pink-500' },
          { label: 'Nombre', value: stats.totalCount, icon: '📄', color: 'from-indigo-500 to-purple-500' },
          { label: 'Délai trait.', value: `${stats.avgProcessingTime}j`, icon: '⏱️', color: 'from-cyan-500 to-blue-500' },
          { label: 'Taux retour', value: `${stats.refundRate}%`, icon: '📈', color: 'from-pink-500 to-rose-500' }
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
                placeholder="Rechercher avoir..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none w-64"
              />
            </div>

            {/* Filtre statut */}
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            >
              <option value="all">Tous statuts</option>
              <option value="validated">Validés</option>
              <option value="pending">En attente</option>
              <option value="processed">Traités</option>
              <option value="draft">Brouillons</option>
            </select>

            {/* Filtre motif */}
            <select 
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            >
              <option value="all">Tous motifs</option>
              <option value="service_issue">Problème service</option>
              <option value="cancellation">Annulation</option>
              <option value="damage">Dommage</option>
              <option value="pricing_error">Erreur prix</option>
              <option value="quality_issue">Qualité</option>
            </select>

            {/* Mode vue */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded ${viewMode === 'cards' ? 'bg-white shadow' : ''}`}
              >
                Cartes
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 rounded ${viewMode === 'timeline' ? 'bg-white shadow' : ''}`}
              >
                Timeline
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
            <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors">
              <ArrowPathIcon className="w-5 h-5 inline mr-2" />
              Actualiser
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des avoirs */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <ReceiptRefundIcon className="w-5 h-5 mr-2" />
                Avoirs et Crédits
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {filteredCreditNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedCreditNote(note)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Header avoir */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-2xl">{getReasonIcon(note.reason)}</span>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {note.number}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getStatusColor(note.status)}`}>
                            {getStatusLabel(note.status)}
                          </span>
                          {note.impact && (
                            <span className={`text-xs font-semibold ${getImpactColor(note.impact)}`}>
                              Impact {note.impact}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {note.client.name}
                          <span className="ml-2 text-xs text-gray-500">
                            (Facture: {note.originalInvoice})
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">
                          -{note.total.toFixed(2)}€
                        </div>
                        <div className="text-sm text-gray-600">
                          HT: -{note.amount.toFixed(2)}€
                        </div>
                      </div>
                    </div>

                    {/* Motif et détails */}
                    <div className="mb-3 p-3 bg-orange-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Motif:</div>
                      <div className="text-sm font-medium text-gray-900">
                        {getReasonLabel(note.reason)}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {note.reasonDetail}
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                        <span>{note.date.toLocaleDateString('fr-FR')}</span>
                      </div>
                      {note.refundDate && (
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          <span>Remb. {note.refundDate.toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      {note.refundMethod && (
                        <div className="flex items-center space-x-2">
                          <CreditCardIcon className="w-4 h-4 text-gray-400" />
                          <span>{note.refundMethod === 'credit' ? 'Crédit' : 
                                 note.refundMethod === 'bank_transfer' ? 'Virement' :
                                 note.refundMethod === 'replacement' ? 'Remplacement' : 
                                 note.refundMethod}</span>
                        </div>
                      )}
                      {note.approvedBy && (
                        <div className="flex items-center space-x-2">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          <span>{note.approvedBy}</span>
                        </div>
                      )}
                    </div>

                    {/* Articles concernés */}
                    {note.items && (
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">Articles concernés:</div>
                        {note.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-700">{item.description}</span>
                            <span className="font-medium text-red-600">{item.price.toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Informations supplémentaires */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-3">
                        {note.documents && note.documents.length > 0 && (
                          <span className="flex items-center text-xs text-gray-600">
                            <DocumentDuplicateIcon className="w-3 h-3 mr-1" />
                            {note.documents.length} docs
                          </span>
                        )}
                        {note.insuranceClaim && (
                          <span className="flex items-center text-xs text-blue-600">
                            <ShieldCheckIcon className="w-3 h-3 mr-1" />
                            Assurance
                          </span>
                        )}
                        {note.warranty && (
                          <span className="flex items-center text-xs text-green-600">
                            <CheckBadgeIcon className="w-3 h-3 mr-1" />
                            Garantie
                          </span>
                        )}
                        {note.followUp && (
                          <span className="flex items-center text-xs text-orange-600">
                            <BellAlertIcon className="w-3 h-3 mr-1" />
                            Suivi requis
                          </span>
                        )}
                      </div>

                      {/* Actions rapides */}
                      <div className="flex space-x-2">
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200">
                          <PrinterIcon className="w-4 h-4" />
                        </button>
                        {note.status === 'pending' && (
                          <button className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-sm">
                            Valider
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
          {/* Évolution avoirs */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Avoirs vs CA</h3>
            <div className="h-48">
              <Line
                data={creditEvolution}
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

          {/* Répartition par motif */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition Motifs</h3>
            <div className="h-48">
              <Doughnut
                data={reasonDistribution}
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

          {/* Analyse impact */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse Impact</h3>
            <div className="h-48">
              <Radar
                data={impactAnalysis}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        stepSize: 20
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Actions et alertes */}
          <motion.div 
            className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BellAlertIcon className="w-5 h-5 mr-2" />
              Actions Requises
            </h3>
            <div className="space-y-3">
              {stats.pendingCount > 0 && (
                <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stats.pendingCount} avoirs à valider</span>
                    <ExclamationCircleIcon className="w-5 h-5 text-yellow-300" />
                  </div>
                </div>
              )}
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">2 remboursements à traiter</span>
                  <ClockIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Analyse qualité requise</span>
                  <ChartBarIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-3 bg-white/20 backdrop-blur-lg rounded-lg font-medium hover:bg-white/30 transition-all duration-300">
              <DocumentTextIcon className="w-5 h-5 inline mr-2" />
              Rapport détaillé
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AvoirsFacturationUltraPremium;