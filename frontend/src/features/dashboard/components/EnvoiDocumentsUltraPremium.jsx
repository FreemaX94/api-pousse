import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DocumentArrowUpIcon,
  PaperAirplaneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  TagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PhotoIcon,
  FilmIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  StarIcon,
  ArrowPathIcon
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
import UltraPremiumContainer from './UltraPremiumContainer';
import useThemeUltraPremium from '../hooks/useThemeUltraPremium';

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

const EnvoiDocumentsUltraPremium = () => {
  const { theme, getClasses, currentTheme } = useThemeUltraPremium();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  // Données simulées des envois de documents
  const documentsEnvois = [
    {
      id: 1,
      title: 'Facture F-2024-001',
      type: 'facture',
      size: '2.3 MB',
      format: 'PDF',
      status: 'delivered',
      priority: 'high',
      sentAt: '2024-03-22 14:30',
      deliveredAt: '2024-03-22 14:32',
      readAt: '2024-03-22 15:45',
      recipients: [
        { name: 'Jean Dupont', email: 'jean.dupont@email.com', status: 'read', readAt: '2024-03-22 15:45' },
        { name: 'Marie Martin', email: 'marie.martin@email.com', status: 'delivered', deliveredAt: '2024-03-22 14:32' }
      ],
      sender: 'Sophie Leblanc',
      subject: 'Facture pour services mars 2024',
      message: 'Veuillez trouver en pièce jointe votre facture...',
      tags: ['Facturation', 'Urgent', 'Client Premium'],
      clientCompany: 'Entreprise Luxor',
      totalAmount: 12500,
      dueDate: '2024-04-22',
      attempts: 1,
      bounces: 0,
      clicks: 3,
      opens: 5
    },
    {
      id: 2,
      title: 'Devis D-2024-028',
      type: 'devis',
      size: '1.8 MB',
      format: 'PDF',
      status: 'pending',
      priority: 'medium',
      sentAt: '2024-03-21 16:20',
      deliveredAt: null,
      readAt: null,
      recipients: [
        { name: 'Pierre Durand', email: 'pierre.durand@company.fr', status: 'pending' }
      ],
      sender: 'Thomas Leroy',
      subject: 'Devis aménagement jardin',
      message: 'Suite à notre entretien, voici le devis détaillé...',
      tags: ['Devis', 'Aménagement', 'Nouveau client'],
      clientCompany: 'Green Solutions',
      totalAmount: 8500,
      validUntil: '2024-04-21',
      attempts: 3,
      bounces: 1,
      clicks: 0,
      opens: 0
    },
    {
      id: 3,
      title: 'Contrat C-2024-015',
      type: 'contrat',
      size: '3.1 MB',
      format: 'PDF',
      status: 'failed',
      priority: 'high',
      sentAt: '2024-03-20 10:15',
      deliveredAt: null,
      readAt: null,
      recipients: [
        { name: 'Admin RH', email: 'rh@bigcorp.com', status: 'bounced', error: 'Boîte mail pleine' }
      ],
      sender: 'Julie Bernard',
      subject: 'Contrat de maintenance annuel',
      message: 'Merci de signer et retourner ce contrat...',
      tags: ['Contrat', 'Maintenance', 'À relancer'],
      clientCompany: 'Big Corp Ltd',
      totalAmount: 25000,
      signatureRequired: true,
      attempts: 5,
      bounces: 2,
      clicks: 0,
      opens: 0
    },
    {
      id: 4,
      title: 'Rapport mensuel Mars',
      type: 'rapport',
      size: '4.7 MB',
      format: 'PDF',
      status: 'delivered',
      priority: 'low',
      sentAt: '2024-03-19 09:00',
      deliveredAt: '2024-03-19 09:02',
      readAt: '2024-03-19 11:30',
      recipients: [
        { name: 'Direction Générale', email: 'direction@company.com', status: 'read', readAt: '2024-03-19 11:30' },
        { name: 'Comptabilité', email: 'compta@company.com', status: 'read', readAt: '2024-03-19 14:15' }
      ],
      sender: 'Analytics Bot',
      subject: 'Rapport mensuel des activités',
      message: 'Voici le rapport détaillé de nos activités...',
      tags: ['Rapport', 'Mensuel', 'Direction'],
      clientCompany: 'Interne',
      totalAmount: 0,
      attempts: 1,
      bounces: 0,
      clicks: 8,
      opens: 12
    },
    {
      id: 5,
      title: 'Catalogue Produits 2024',
      type: 'catalogue',
      size: '15.2 MB',
      format: 'PDF',
      status: 'delivered',
      priority: 'medium',
      sentAt: '2024-03-18 14:45',
      deliveredAt: '2024-03-18 14:47',
      readAt: '2024-03-18 16:20',
      recipients: [
        { name: 'Réseau partenaires', email: 'partenaires@network.com', status: 'read', readAt: '2024-03-18 16:20' }
      ],
      sender: 'Marketing Team',
      subject: 'Nouveau catalogue produits disponible',
      message: 'Découvrez nos nouveautés dans ce catalogue...',
      tags: ['Catalogue', 'Marketing', 'Partenaires'],
      clientCompany: 'Réseau National',
      totalAmount: 0,
      attempts: 1,
      bounces: 0,
      clicks: 25,
      opens: 45
    }
  ];

  // KPIs globaux
  const kpis = {
    totalSent: documentsEnvois.length,
    delivered: documentsEnvois.filter(d => d.status === 'delivered').length,
    pending: documentsEnvois.filter(d => d.status === 'pending').length,
    failed: documentsEnvois.filter(d => d.status === 'failed').length,
    totalSize: documentsEnvois.reduce((sum, d) => sum + parseFloat(d.size), 0).toFixed(1),
    avgDeliveryTime: '2.3 min',
    openRate: 68,
    clickRate: 24
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'pending': return <ClockIcon className="w-5 h-5 text-yellow-400" />;
      case 'failed': return <XCircleIcon className="w-5 h-5 text-red-400" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusGradient = (status) => {
    switch(status) {
      case 'delivered': return 'from-green-500 to-emerald-600';
      case 'pending': return 'from-yellow-500 to-orange-600';
      case 'failed': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'facture': return <DocumentTextIcon className="w-6 h-6" />;
      case 'devis': return <TagIcon className="w-6 h-6" />;
      case 'contrat': return <ArchiveBoxIcon className="w-6 h-6" />;
      case 'rapport': return <ChartBarIcon className="w-6 h-6" />;
      case 'catalogue': return <PhotoIcon className="w-6 h-6" />;
      default: return <DocumentTextIcon className="w-6 h-6" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const filteredDocuments = documentsEnvois.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.clientCompany.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Configuration des graphiques
  const chartColors = {
    primary: currentTheme === 'neon' ? 'rgba(0, 255, 255, 1)' : 
            currentTheme === 'galaxy' ? 'rgba(147, 51, 234, 1)' :
            currentTheme === 'ocean' ? 'rgba(6, 182, 212, 1)' :
            'rgba(59, 130, 246, 1)',
    secondary: currentTheme === 'neon' ? 'rgba(255, 0, 255, 1)' :
              currentTheme === 'galaxy' ? 'rgba(168, 85, 247, 1)' :
              currentTheme === 'ocean' ? 'rgba(34, 211, 238, 1)' :
              'rgba(99, 102, 241, 1)'
  };

  const statusDistributionData = {
    labels: ['Livrés', 'En cours', 'Échec'],
    datasets: [{
      data: [kpis.delivered, kpis.pending, kpis.failed],
      backgroundColor: [
        'rgba(52, 211, 153, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(52, 211, 153, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2
    }]
  };

  const dailyActivityData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [{
      label: 'Documents envoyés',
      data: [12, 19, 8, 15, 25, 4, 2],
      borderColor: chartColors.primary,
      backgroundColor: chartColors.primary.replace('1)', '0.1)'),
      tension: 0.4,
      fill: true
    }]
  };

  const DocumentCard = ({ doc }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedDocument(doc)}
      className={getClasses('card', 'cursor-pointer relative overflow-hidden')}
    >
      {/* Badge priorité */}
      <div className="absolute top-4 right-4">
        <span className={`w-3 h-3 rounded-full ${getPriorityColor(doc.priority)} animate-pulse`}>
          ●
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getStatusGradient(doc.status)} flex items-center justify-center text-white shadow-lg`}>
            {getTypeIcon(doc.type)}
          </div>
          <div>
            <h3 className={`text-lg font-bold ${theme.text}`}>{doc.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm ${theme.textSecondary}`}>{doc.format}</span>
              <span className={`text-sm ${theme.textSecondary}`}>• {doc.size}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${getStatusGradient(doc.status)} text-white`}>
                {doc.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations client */}
      <div className={getClasses('glass', 'p-3 rounded-lg mb-4')}>
        <div className="flex items-center gap-2 mb-2">
          <BuildingOfficeIcon className={`w-4 h-4 ${theme.accent}`} />
          <span className={`text-sm font-medium ${theme.text}`}>{doc.clientCompany}</span>
        </div>
        <div className="flex items-center gap-2">
          <EnvelopeIcon className={`w-4 h-4 ${theme.accent}`} />
          <span className={`text-xs ${theme.textSecondary}`}>
            {doc.recipients.length} destinataire{doc.recipients.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {doc.tags.slice(0, 2).map((tag, idx) => (
          <span key={idx} className={getClasses('badge', 'text-xs')}>
            {tag}
          </span>
        ))}
        {doc.tags.length > 2 && (
          <span className={getClasses('badge', 'text-xs')}>
            +{doc.tags.length - 2}
          </span>
        )}
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={getClasses('glass', 'text-center p-2 rounded-lg')}>
          <div className={`text-lg font-bold ${theme.text}`}>
            {doc.attempts}
          </div>
          <div className={`text-xs ${theme.textSecondary}`}>Tentatives</div>
        </div>
        <div className={getClasses('glass', 'text-center p-2 rounded-lg')}>
          <div className={`text-lg font-bold ${theme.text}`}>
            {doc.opens}
          </div>
          <div className={`text-xs ${theme.textSecondary}`}>Ouvertures</div>
        </div>
        <div className={getClasses('glass', 'text-center p-2 rounded-lg')}>
          <div className={`text-lg font-bold ${theme.text}`}>
            {doc.clicks}
          </div>
          <div className={`text-xs ${theme.textSecondary}`}>Clics</div>
        </div>
      </div>

      {/* Timeline */}
      <div className={getClasses('glass', 'p-3 rounded-lg mb-4')}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PaperAirplaneIcon className={`w-3 h-3 ${theme.accent}`} />
            <span className={`text-xs ${theme.textSecondary}`}>
              Envoyé: {new Date(doc.sentAt).toLocaleString()}
            </span>
          </div>
          {doc.deliveredAt && (
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-3 h-3 text-green-400" />
              <span className={`text-xs ${theme.textSecondary}`}>
                Livré: {new Date(doc.deliveredAt).toLocaleString()}
              </span>
            </div>
          )}
          {doc.readAt && (
            <div className="flex items-center gap-2">
              <EyeIcon className="w-3 h-3 text-blue-400" />
              <span className={`text-xs ${theme.textSecondary}`}>
                Lu: {new Date(doc.readAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={getClasses('button', 'flex-1 py-2 text-sm')}
        >
          Voir détails
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={getClasses('glass', 'px-3 py-2 rounded-xl')}
        >
          <ArrowPathIcon className={`w-4 h-4 ${theme.accent}`} />
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <UltraPremiumContainer
      title="Envoi de Documents Ultra Premium"
      icon={DocumentArrowUpIcon}
    >
      {/* KPIs */}
      <div className="grid grid-cols-8 gap-4 mb-6">
        {[
          { label: 'Total envoyé', value: kpis.totalSent, icon: PaperAirplaneIcon, gradient: 'from-blue-500 to-indigo-600' },
          { label: 'Livrés', value: kpis.delivered, icon: CheckCircleIcon, gradient: 'from-green-500 to-emerald-600' },
          { label: 'En attente', value: kpis.pending, icon: ClockIcon, gradient: 'from-yellow-500 to-orange-600' },
          { label: 'Échecs', value: kpis.failed, icon: XCircleIcon, gradient: 'from-red-500 to-pink-600' },
          { label: 'Taille totale', value: `${kpis.totalSize} MB`, icon: ArchiveBoxIcon, gradient: 'from-purple-500 to-pink-600' },
          { label: 'Délai moyen', value: kpis.avgDeliveryTime, icon: ClockIcon, gradient: 'from-cyan-500 to-blue-600' },
          { label: 'Taux ouverture', value: `${kpis.openRate}%`, icon: EyeIcon, gradient: 'from-teal-500 to-cyan-600' },
          { label: 'Taux clic', value: `${kpis.clickRate}%`, icon: ShareIcon, gradient: 'from-indigo-500 to-purple-600' }
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className={getClasses('card', 'relative overflow-hidden')}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-10`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-6 h-6 ${theme.accent}`} />
              </div>
              <div className={`text-2xl font-bold ${theme.text}`}>{kpi.value}</div>
              <div className={`text-xs ${theme.textSecondary} mt-1`}>{kpi.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textSecondary}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un document..."
            className={getClasses('input', 'pl-10')}
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'delivered', 'pending', 'failed'].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 
                getClasses('button', 'px-4 py-3') : 
                getClasses('glass', 'px-4 py-3 rounded-xl font-medium')}
            >
              {status === 'all' ? 'Tous' : 
               status === 'delivered' ? 'Livrés' :
               status === 'pending' ? 'En cours' : 'Échecs'}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSendModal(true)}
          className={getClasses('button', 'px-4 py-3 flex items-center gap-2')}
        >
          <PlusIcon className="w-5 h-5" />
          Nouvel envoi
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAnalytics(!showAnalytics)}
          className={getClasses('button', 'px-4 py-3 flex items-center gap-2')}
        >
          <ChartBarIcon className="w-5 h-5" />
          Analytics
        </motion.button>
      </div>

      {/* Section Analytics */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-6 mb-8"
          >
            <div className={getClasses('card')}>
              <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Répartition des statuts</h3>
              <div className="h-64">
                <Doughnut data={statusDistributionData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: theme.text }
                    }
                  }
                }} />
              </div>
            </div>

            <div className={getClasses('card')}>
              <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Activité hebdomadaire</h3>
              <div className="h-64">
                <Line data={dailyActivityData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { 
                      grid: { display: false },
                      ticks: { color: theme.textSecondary }
                    },
                    y: { 
                      grid: { color: theme.border },
                      ticks: { color: theme.textSecondary }
                    }
                  }
                }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grille des documents */}
      <div className="grid grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>

      {/* Modal détails document */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'w-full max-w-4xl max-h-[90vh] overflow-y-auto')}
            >
              <h2 className={`text-2xl font-bold ${theme.text} mb-6`}>
                Détails - {selectedDocument.title}
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className={getClasses('glass', 'p-4 rounded-xl')}>
                  <h3 className={`font-semibold ${theme.text} mb-3`}>Destinataires</h3>
                  <div className="space-y-3">
                    {selectedDocument.recipients.map((recipient, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <div className={`font-medium ${theme.text}`}>{recipient.name}</div>
                          <div className={`text-sm ${theme.textSecondary}`}>{recipient.email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(recipient.status)}
                          <span className={`text-xs ${theme.textSecondary}`}>
                            {recipient.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={getClasses('glass', 'p-4 rounded-xl')}>
                  <h3 className={`font-semibold ${theme.text} mb-3`}>Statistiques d'engagement</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className={`text-2xl font-bold ${theme.text}`}>
                        {selectedDocument.opens}
                      </div>
                      <div className={`text-xs ${theme.textSecondary}`}>Ouvertures</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${theme.text}`}>
                        {selectedDocument.clicks}
                      </div>
                      <div className={`text-xs ${theme.textSecondary}`}>Clics</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${theme.text}`}>
                        {selectedDocument.attempts}
                      </div>
                      <div className={`text-xs ${theme.textSecondary}`}>Tentatives</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${theme.text}`}>
                        {selectedDocument.bounces}
                      </div>
                      <div className={`text-xs ${theme.textSecondary}`}>Rejets</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={getClasses('glass', 'px-6 py-3 rounded-xl font-medium')}
                  onClick={() => setSelectedDocument(null)}
                >
                  Fermer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={getClasses('button', 'px-6 py-3')}
                >
                  Renvoyer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default EnvoiDocumentsUltraPremium;