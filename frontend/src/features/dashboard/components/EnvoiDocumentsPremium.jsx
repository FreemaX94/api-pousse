// Envoi Documents Premium - Gestion Intelligente des Documents 📨
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
  CloudArrowUpIcon,
  FolderArrowDownIcon,
  PrinterIcon,
  ShareIcon,
  PaperClipIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  ChartBarIcon,
  BellAlertIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  FingerPrintIcon,
  QrCodeIcon,
  WifiIcon,
  SignalIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ViewColumnsIcon,
  EyeIcon,
  EyeSlashIcon,
  InboxArrowDownIcon,
  ArchiveBoxIcon,
  TrashIcon,
  BookmarkIcon,
  TagIcon,
  HashtagIcon,
  AtSymbolIcon,
  CursorArrowRaysIcon,
  CommandLineIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { Bar, Line, Doughnut, Scatter } from 'react-chartjs-2';
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
import confetti from 'canvas-confetti';

// Enregistrement des composants Chart.js
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

// Composant de carte de document ultra-moderne
const DocumentCard = ({ document, onSend, onSchedule, onView, onDownload, onArchive }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const getDocumentTypeConfig = (type) => {
    const configs = {
      'rapport': {
        icon: DocumentTextIcon,
        gradient: 'from-blue-500 via-indigo-500 to-purple-500',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30'
      },
      'avis': {
        icon: BellAlertIcon,
        gradient: 'from-yellow-500 via-amber-500 to-orange-500',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30'
      },
      'facture': {
        icon: DocumentArrowDownIcon,
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30'
      },
      'contrat': {
        icon: ShieldCheckIcon,
        gradient: 'from-purple-500 via-pink-500 to-rose-500',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500/30'
      },
      'devis': {
        icon: DocumentCheckIcon,
        gradient: 'from-cyan-500 via-sky-500 to-blue-500',
        bgColor: 'bg-cyan-500/20',
        borderColor: 'border-cyan-500/30'
      }
    };
    return configs[type] || configs['rapport'];
  };

  const getUrgencyLevel = (daysOverdue) => {
    if (daysOverdue > 7) return { label: 'CRITIQUE', color: 'text-red-500', pulse: true };
    if (daysOverdue > 3) return { label: 'URGENT', color: 'text-orange-500', pulse: true };
    if (daysOverdue > 0) return { label: 'EN RETARD', color: 'text-yellow-500', pulse: false };
    return { label: 'À TEMPS', color: 'text-green-500', pulse: false };
  };

  const config = getDocumentTypeConfig(document.type);
  const DocumentIcon = config.icon;
  const daysOverdue = Math.ceil((new Date() - new Date(document.dateEcheance)) / (1000 * 60 * 60 * 24));
  const urgency = getUrgencyLevel(daysOverdue);

  const handleSend = async () => {
    setIsSending(true);
    // Animation de progression
    for (let i = 0; i <= 100; i += 5) {
      setSendingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    onSend(document);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setIsSending(false);
    setSendingProgress(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, rotateX: -30, scale: 0.9 }}
      animate={{ opacity: 1, rotateX: 0, scale: 1 }}
      exit={{ opacity: 0, rotateX: 30, scale: 0.9 }}
      whileHover={{ 
        y: -10,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group perspective-1000"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Effet de lueur pour documents urgents */}
      {urgency.pulse && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-3xl blur-2xl opacity-30`}
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [0.98, 1.02, 0.98]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Badge d'urgence flottant */}
      {daysOverdue > 0 && (
        <motion.div
          className="absolute -top-3 -right-3 z-20"
          animate={{ 
            y: [-2, 2, -2],
            rotate: [-5, 5, -5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="relative">
            <div className={`absolute inset-0 ${urgency.pulse ? 'bg-red-500' : 'bg-orange-500'} rounded-full blur-md opacity-75`} />
            <div className={`relative px-3 py-1 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs rounded-full font-bold shadow-xl border border-white/30`}>
              <FireIcon className="w-3 h-3 inline mr-1" />
              {urgency.label}
            </div>
          </div>
        </motion.div>
      )}

      <div className={`relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl border-2 ${config.borderColor} hover:border-purple-500/50 transition-all overflow-hidden shadow-2xl hover:shadow-purple-500/20`}>
        {/* Barre de progression supérieure */}
        <div className={`h-1 bg-gradient-to-r ${config.gradient}`} />
        
        {/* En-tête avec icône et type */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                className="relative"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-2xl blur-lg opacity-50`} />
                <div className={`relative p-3 bg-gradient-to-br ${config.gradient} rounded-2xl text-white shadow-xl border border-white/20`}>
                  <DocumentIcon className="w-6 h-6" />
                </div>
              </motion.div>
              <div>
                <p className="text-xs text-gray-400 font-mono">#{document.numero}</p>
                <p className="text-sm font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {document.type.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Statut d'envoi */}
            <div className="flex items-center space-x-2">
              {document.envoye ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 rounded-full"
                >
                  <CheckCircleIcon className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">Envoyé</span>
                </motion.div>
              ) : (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center space-x-1 px-2 py-1 bg-orange-500/20 rounded-full"
                >
                  <ClockIcon className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-orange-400">En attente</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Informations client */}
          <div className="mb-4 p-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">{document.client}</h3>
              </div>
              {document.prioritaire && (
                <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs rounded-full font-bold">
                  ⭐ PRIORITAIRE
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <EnvelopeIcon className="w-3 h-3" />
                <span>{document.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CalendarDaysIcon className="w-3 h-3" />
                <span>{new Date(document.dateCreation).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>

          {/* Titre du document */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-1">{document.titre}</h4>
            <p className="text-xs text-gray-400 line-clamp-2">{document.description}</p>
          </div>

          {/* Pièces jointes */}
          {document.attachments && document.attachments.length > 0 && (
            <div className="mb-4 flex items-center space-x-2">
              <PaperClipIcon className="w-4 h-4 text-gray-400" />
              <div className="flex space-x-1">
                {document.attachments.map((attachment, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    className="p-1 bg-white/10 rounded-lg"
                  >
                    {attachment.type === 'pdf' && <DocumentTextIcon className="w-4 h-4 text-red-400" />}
                    {attachment.type === 'image' && <PhotoIcon className="w-4 h-4 text-green-400" />}
                    {attachment.type === 'video' && <FilmIcon className="w-4 h-4 text-blue-400" />}
                  </motion.div>
                ))}
              </div>
              <span className="text-xs text-gray-400">({document.attachments.length} fichiers)</span>
            </div>
          )}

          {/* Barre de progression d'envoi */}
          {isSending && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Envoi en cours...</span>
                <span className="text-xs text-white font-bold">{sendingProgress}%</span>
              </div>
              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  animate={{ width: `${sendingProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={`grid grid-cols-2 gap-2 transition-all ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={isSending || document.envoye}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 ${
                document.envoye 
                  ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              }`}
            >
              <PaperAirplaneIcon className="w-4 h-4" />
              <span>{document.envoye ? 'Envoyé' : 'Envoyer'}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSchedule(document)}
              className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
            >
              <CalendarDaysIcon className="w-4 h-4" />
              <span>Planifier</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onView(document)}
              className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
            >
              <EyeIcon className="w-4 h-4" />
              <span>Voir</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDownload(document)}
              className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
            >
              <CloudArrowUpIcon className="w-4 h-4" />
              <span>Télécharger</span>
            </motion.button>
          </div>
        </div>

        {/* Footer avec métadonnées */}
        <div className="px-6 py-3 bg-gradient-to-r from-white/5 to-white/10 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3 text-gray-400">
              <span className="flex items-center space-x-1">
                <HashtagIcon className="w-3 h-3" />
                <span>{document.tags?.join(', ')}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {document.encrypted && <LockClosedIcon className="w-4 h-4 text-green-400" />}
              {document.signed && <FingerPrintIcon className="w-4 h-4 text-blue-400" />}
              {document.tracked && <SignalIcon className="w-4 h-4 text-purple-400" />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Composant de statistiques des documents
const DocumentsStats = ({ documents }) => {
  const stats = useMemo(() => {
    const total = documents.length;
    const envoyes = documents.filter(d => d.envoye).length;
    const enAttente = documents.filter(d => !d.envoye).length;
    const enRetard = documents.filter(d => {
      const daysOverdue = Math.ceil((new Date() - new Date(d.dateEcheance)) / (1000 * 60 * 60 * 24));
      return daysOverdue > 0 && !d.envoye;
    }).length;
    const tauxEnvoi = total > 0 ? (envoyes / total * 100).toFixed(1) : 0;

    return {
      total,
      envoyes,
      enAttente,
      enRetard,
      tauxEnvoi
    };
  }, [documents]);

  // Données pour le graphique en ligne
  const lineData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Documents envoyés',
        data: [12, 19, 15, 25, 22, 18, 8],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4
      },
      {
        label: 'Documents créés',
        data: [15, 22, 18, 28, 25, 20, 10],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Données pour le graphique donut
  const donutData = {
    labels: ['Envoyés', 'En attente', 'En retard'],
    datasets: [{
      data: [stats.envoyes, stats.enAttente - stats.enRetard, stats.enRetard],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  const kpis = [
    {
      label: 'Total documents',
      value: stats.total,
      icon: DocumentTextIcon,
      gradient: 'from-blue-500 to-indigo-500',
      trend: '+12%',
      subValue: 'Ce mois'
    },
    {
      label: 'Documents envoyés',
      value: stats.envoyes,
      icon: PaperAirplaneIcon,
      gradient: 'from-green-500 to-emerald-500',
      trend: '+18%',
      subValue: `${stats.tauxEnvoi}% taux`
    },
    {
      label: 'En attente',
      value: stats.enAttente,
      icon: ClockIcon,
      gradient: 'from-yellow-500 to-amber-500',
      trend: '-5%',
      subValue: 'À traiter'
    },
    {
      label: 'En retard',
      value: stats.enRetard,
      icon: ExclamationTriangleIcon,
      gradient: 'from-red-500 to-rose-500',
      trend: '+3%',
      subValue: 'Urgent',
      alert: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPIs avec animations */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {kpi.alert && (
              <motion.div
                className="absolute -top-2 -right-2 z-10"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </motion.div>
            )}
            
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r ${kpi.gradient} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity`} />
              <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${kpi.gradient} rounded-xl shadow-lg`}>
                    <kpi.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-medium ${
                    kpi.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {kpi.trend}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-1">{kpi.label}</p>
                <p className="text-3xl font-bold text-white">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.subValue}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Évolution des envois</h3>
          <div className="h-64">
            <Line data={lineData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false }, ticks: { color: '#9CA3AF' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9CA3AF' } }
              }
            }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Répartition</h3>
          <div className="h-64">
            <Doughnut data={donutData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } }
            }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Composant principal
const EnvoiDocumentsPremium = ({ themeColors }) => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      numero: 'DOC-2025-001',
      type: 'rapport',
      titre: 'Rapport d\'intervention - Crystal Tech',
      description: 'Maintenance préventive système climatisation',
      client: 'Crystal Tech Solutions',
      email: 'contact@crystaltech.fr',
      dateCreation: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      dateEcheance: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      envoye: false,
      prioritaire: true,
      attachments: [
        { type: 'pdf', name: 'rapport.pdf' },
        { type: 'image', name: 'photo1.jpg' }
      ],
      tags: ['urgent', 'maintenance'],
      encrypted: true,
      signed: true,
      tracked: true
    },
    {
      id: 2,
      numero: 'DOC-2025-002',
      type: 'avis',
      titre: 'Avis de passage - Green Energy',
      description: 'Intervention planifiée pour dépannage électrique',
      client: 'Green Energy Corp',
      email: 'info@greenenergy.fr',
      dateCreation: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      dateEcheance: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      envoye: true,
      prioritaire: false,
      attachments: [],
      tags: ['planifié'],
      encrypted: false,
      signed: false,
      tracked: true
    },
    {
      id: 3,
      numero: 'DOC-2025-003',
      type: 'facture',
      titre: 'Facture FAC-2025-087',
      description: 'Facturation installation système sécurité',
      client: 'Digital Innovation Lab',
      email: 'billing@digilab.fr',
      dateCreation: new Date(),
      dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      envoye: false,
      prioritaire: false,
      attachments: [
        { type: 'pdf', name: 'facture.pdf' }
      ],
      tags: ['facturation', 'installation'],
      encrypted: true,
      signed: true,
      tracked: false
    },
    {
      id: 4,
      numero: 'DOC-2025-004',
      type: 'contrat',
      titre: 'Contrat de maintenance annuel',
      description: 'Renouvellement contrat maintenance Luxury Hotels',
      client: 'Luxury Hotels Group',
      email: 'legal@luxuryhotels.fr',
      dateCreation: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      dateEcheance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      envoye: false,
      prioritaire: true,
      attachments: [
        { type: 'pdf', name: 'contrat.pdf' },
        { type: 'pdf', name: 'conditions.pdf' }
      ],
      tags: ['contrat', 'renouvellement', 'urgent'],
      encrypted: true,
      signed: false,
      tracked: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');

  // Filtrage et tri
  const filteredDocuments = useMemo(() => {
    let filtered = [...documents];

    // Recherche
    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.numero.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par type
    if (filterType !== 'all') {
      filtered = filtered.filter(d => d.type === filterType);
    }

    // Filtre par statut
    if (filterStatus === 'sent') {
      filtered = filtered.filter(d => d.envoye);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(d => !d.envoye);
    } else if (filterStatus === 'overdue') {
      filtered = filtered.filter(d => {
        const daysOverdue = Math.ceil((new Date() - new Date(d.dateEcheance)) / (1000 * 60 * 60 * 24));
        return daysOverdue > 0 && !d.envoye;
      });
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dateCreation) - new Date(a.dateCreation);
        case 'deadline':
          return new Date(a.dateEcheance) - new Date(b.dateEcheance);
        case 'client':
          return a.client.localeCompare(b.client);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [documents, searchTerm, filterType, filterStatus, sortBy]);

  const handleSend = (document) => {
    setDocuments(prev => prev.map(d =>
      d.id === document.id ? { ...d, envoye: true } : d
    ));
  };

  const handleSchedule = (document) => {
    console.log('Planifier l\'envoi:', document);
  };

  const handleView = (document) => {
    console.log('Voir le document:', document);
  };

  const handleDownload = (document) => {
    console.log('Télécharger:', document);
  };

  const handleArchive = (document) => {
    console.log('Archiver:', document);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
            <DocumentArrowUpIcon className="w-8 h-8 text-blue-400" />
            <span>Envoi Documents Premium</span>
            <motion.span
              className="ml-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SMART DELIVERY
            </motion.span>
          </h1>
          <p className="text-gray-400 mt-1">Gestion intelligente et automatisée de l'envoi de documents</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Bouton IA Assistant */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center space-x-2"
          >
            <SparklesIcon className="w-5 h-5" />
            <span>IA Assistant</span>
          </motion.button>

          {/* Bouton nouveau document */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg flex items-center space-x-2"
          >
            <DocumentArrowUpIcon className="w-5 h-5" />
            <span>Nouveau document</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Statistiques */}
      <DocumentsStats documents={documents} />

      {/* Barre de recherche et filtres */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un document, client, numéro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Filtres */}
          <div className="flex items-center space-x-3">
            {/* Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">Tous types</option>
              <option value="rapport">Rapports</option>
              <option value="avis">Avis</option>
              <option value="facture">Factures</option>
              <option value="contrat">Contrats</option>
              <option value="devis">Devis</option>
            </select>

            {/* Statut */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">Tous statuts</option>
              <option value="sent">Envoyés</option>
              <option value="pending">En attente</option>
              <option value="overdue">En retard</option>
            </select>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="date">Date création</option>
              <option value="deadline">Échéance</option>
              <option value="client">Client</option>
              <option value="type">Type</option>
            </select>

            {/* Vue */}
            <div className="flex bg-white/10 rounded-lg p-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Liste des documents */}
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        <AnimatePresence mode="popLayout">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onSend={handleSend}
              onSchedule={handleSchedule}
              onView={handleView}
              onDownload={handleDownload}
              onArchive={handleArchive}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Message si aucun résultat */}
      {filteredDocuments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <DocumentTextIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Aucun document trouvé</h3>
          <p className="text-gray-400">Modifiez vos filtres ou créez un nouveau document</p>
        </motion.div>
      )}
    </div>
  );
};

export default EnvoiDocumentsPremium;