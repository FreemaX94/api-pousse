import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UltraPremiumContainer from './UltraPremiumContainer';
import useThemeUltraPremium from '../hooks/useThemeUltraPremium';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentCheckIcon,
  BuildingOfficeIcon,
  UserIcon,
  SparklesIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const ContratsUltraPremium = () => {
  const { getClasses } = useThemeUltraPremium();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedContrat, setSelectedContrat] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-12-31'
  });
  const [showPdfGenerator, setShowPdfGenerator] = useState(false);
  const [showElectronicSignature, setShowElectronicSignature] = useState(false);
  const [showDeadlineAlerts, setShowDeadlineAlerts] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showVersioning, setShowVersioning] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [contractVersions, setContractVersions] = useState({});
  const [pendingSignatures, setPendingSignatures] = useState([]);
  const [deadlineAlerts, setDeadlineAlerts] = useState([]);
  const [contractTemplates, setContractTemplates] = useState([
    {
      id: 1,
      name: 'Contrat Premium Hôtellerie',
      category: 'Premium',
      description: 'Modèle spécialisé pour les établissements hôteliers avec services premium',
      clauses: 12,
      lastModified: '2024-12-15',
      usage: 15,
      variables: ['nom_client', 'montant_mensuel', 'services_inclus', 'date_debut'],
      preview: true
    },
    {
      id: 2,
      name: 'Maintenance Standard',
      category: 'Standard',
      description: 'Contrat type pour maintenance d\'espaces verts standard',
      clauses: 8,
      lastModified: '2024-11-20',
      usage: 28,
      variables: ['nom_client', 'surface_entretien', 'frequence', 'tarif'],
      preview: true
    },
    {
      id: 3,
      name: 'Innovation Tech',
      category: 'Innovation',
      description: 'Modèle pour projets innovants avec technologies IoT',
      clauses: 15,
      lastModified: '2024-10-30',
      usage: 5,
      variables: ['nom_client', 'technologies', 'duree_projet', 'budget_innovation'],
      preview: true
    }
  ]);

  // Initialisation des alertes d'échéance
  const [deadlineAlertsData] = useState([
    {
      id: 1,
      contratId: 'CTR-2025-001',
      type: 'renewal',
      severity: 'medium',
      date: '2024-11-30',
      daysUntil: 45,
      message: 'Contrat ADAGIO à renouveler',
      action: 'Préparer avenant de renouvellement',
      client: 'ADAGIO OPERA'
    },
    {
      id: 2,
      contratId: 'CTR-2024-015',
      type: 'expiration',
      severity: 'high',
      date: '2024-12-31',
      daysUntil: 15,
      message: 'Fin de contrat HERMES',
      action: 'Négocier renouvellement ou clôturer',
      client: 'HERMES'
    },
    {
      id: 3,
      contratId: 'CTR-2025-002',
      type: 'payment',
      severity: 'low',
      date: '2025-08-01',
      daysUntil: 180,
      message: 'Prochaine échéance SEPHORA',
      action: 'Préparer facture',
      client: 'SEPHORA'
    }
  ]);

  // Données enrichies pour les contrats
  const [contratsData] = useState([
    {
      id: 1,
      numero: 'CTR-2025-001',
      nom: 'Contrat Premium Adagio Opera',
      client: 'ADAGIO OPERA',
      clientLogo: '🏢',
      type: 'Abonnement Premium',
      statut: 'Actif',
      dateDebut: '2025-01-15',
      dateFin: '2025-12-31',
      dateSignature: '2025-01-10',
      montantMensuel: 2500.00,
      montantTotal: 30000.00,
      montantPaye: 17500.00,
      progression: 58,
      responsable: 'Marie Dubois',
      services: ['Entretien espaces verts', 'Arrosage automatique', 'Support 24/7'],
      renouvellement: 'Automatique',
      tags: ['Premium', 'Prioritaire'],
      prochainePaiement: '2025-08-15',
      notes: 'Client VIP avec besoins spécifiques pour espaces hôteliers',
      dureeRestante: 146,
      signature: {
        status: 'signed',
        signedDate: '2025-01-10',
        signataires: [
          { name: 'Jean Dupont', role: 'Directeur ADAGIO', signedAt: '2025-01-10 14:30' },
          { name: 'Marie Dubois', role: 'Chef de projet', signedAt: '2025-01-10 14:35' }
        ],
        method: 'electronic',
        certificate: 'cert-adagio-2025-001'
      },
      versions: [
        { id: 'v1.0', date: '2025-01-05', description: 'Version initiale', status: 'archived' },
        { id: 'v1.1', date: '2025-01-08', description: 'Ajout services premium', status: 'archived' },
        { id: 'v1.2', date: '2025-01-10', description: 'Version finale signée', status: 'current' }
      ],
      documents: {
        contract: { url: '#', generated: true, lastGenerated: '2025-01-10' },
        annexes: [
          { name: 'Annexe services', url: '#', type: 'pdf' },
          { name: 'Grille tarifaire', url: '#', type: 'pdf' }
        ]
      },
      template: 'Premium Hôtellerie',
      alerts: [
        { type: 'renewal', date: '2024-11-30', message: 'Préparation renouvellement' }
      ]
    },
    {
      id: 2,
      numero: 'CTR-2025-002',
      nom: 'Contrat Maintenance Sephora',
      client: 'SEPHORA',
      clientLogo: '💄',
      type: 'Maintenance',
      statut: 'Actif',
      dateDebut: '2025-03-01',
      dateFin: '2026-02-28',
      dateSignature: '2025-02-25',
      montantMensuel: 1800.00,
      montantTotal: 21600.00,
      montantPaye: 9000.00,
      progression: 42,
      responsable: 'Jean Martin',
      services: ['Entretien plantes', 'Remplacement', 'Diagnostic'],
      renouvellement: 'Manuel',
      tags: ['Retail', 'Mensuel'],
      prochainePaiement: '2025-08-01',
      notes: 'Contrat standard avec interventions régulières',
      dureeRestante: 213
    },
    {
      id: 3,
      numero: 'CTR-2025-003',
      nom: 'Contrat Innovation Spotify',
      client: 'SPOTIFY',
      clientLogo: '🎵',
      type: 'Innovation',
      statut: 'En négociation',
      dateDebut: '2025-09-01',
      dateFin: '2027-08-31',
      dateSignature: null,
      montantMensuel: 3200.00,
      montantTotal: 76800.00,
      montantPaye: 0.00,
      progression: 0,
      responsable: 'Sophie Leroy',
      services: ['Mur végétal connecté', 'IoT monitoring', 'Design créatif'],
      renouvellement: 'En discussion',
      tags: ['Innovation', 'Tech', 'Long terme'],
      prochainePaiement: null,
      notes: 'Projet pilote avec technologies innovantes',
      dureeRestante: null
    },
    {
      id: 4,
      numero: 'CTR-2024-015',
      nom: 'Contrat Luxe Hermes',
      client: 'HERMES',
      clientLogo: '👜',
      type: 'Luxe Sur-Mesure',
      statut: 'Expiré',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      dateSignature: '2023-12-15',
      montantMensuel: 4500.00,
      montantTotal: 54000.00,
      montantPaye: 54000.00,
      progression: 100,
      responsable: 'Pierre Moreau',
      services: ['Design exclusif', 'Plantes rares', 'Maintenance premium'],
      renouvellement: 'À renouveler',
      tags: ['Luxe', 'Exclusif', 'Terminé'],
      prochainePaiement: null,
      notes: 'Contrat terminé avec succès, renouvellement en discussion',
      dureeRestante: 0
    },
    {
      id: 5,
      numero: 'CTR-2025-004',
      nom: 'Contrat Startup Lydia',
      client: 'LYDIA SOLUTIONS',
      clientLogo: '💳',
      type: 'Startup',
      statut: 'Suspendu',
      dateDebut: '2025-04-01',
      dateFin: '2025-10-01',
      dateSignature: '2025-03-28',
      montantMensuel: 800.00,
      montantTotal: 4800.00,
      montantPaye: 2400.00,
      progression: 50,
      responsable: 'Emma Dubois',
      services: ['Plantes d\'intérieur', 'Entretien basique'],
      renouvellement: 'Incertain',
      tags: ['Startup', 'Flexible'],
      prochainePaiement: null,
      notes: 'Contrat suspendu temporairement pour raisons budgétaires',
      dureeRestante: 61
    }
  ]);

  const types = ['Tous', 'Abonnement Premium', 'Maintenance', 'Innovation', 'Luxe Sur-Mesure', 'Startup'];
  const statuts = ['Tous', 'Actif', 'En négociation', 'Expiré', 'Suspendu', 'À renouveler'];

  // Filtrage des contrats
  const filteredContrats = contratsData.filter(contrat => {
    const matchSearch = searchTerm === '' ||
      contrat.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrat.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrat.responsable.toLowerCase().includes(searchTerm.toLowerCase());

    const matchFilter = activeFilter === 'Tous' ||
      contrat.type === activeFilter ||
      contrat.statut === activeFilter;

    const contractDate = new Date(contrat.dateDebut || '1970-01-01');
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const matchDate = contractDate >= startDate && contractDate <= endDate;

    return matchSearch && matchFilter && matchDate;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatutColor = (statut) => {
    const colors = {
      'Actif': 'from-green-400 to-green-600',
      'En négociation': 'from-blue-400 to-blue-600',
      'Expiré': 'from-gray-400 to-gray-600',
      'Suspendu': 'from-red-400 to-red-600',
      'À renouveler': 'from-orange-400 to-orange-600'
    };
    return colors[statut] || 'from-gray-400 to-gray-600';
  };

  const getStatutIcon = (statut) => {
    const icons = {
      'Actif': <CheckCircleIcon className="w-5 h-5" />,
      'En négociation': <ClockIcon className="w-5 h-5" />,
      'Expiré': <XCircleIcon className="w-5 h-5" />,
      'Suspendu': <ExclamationTriangleIcon className="w-5 h-5" />,
      'À renouveler': <ArrowPathIcon className="w-5 h-5" />
    };
    return icons[statut] || <DocumentCheckIcon className="w-5 h-5" />;
  };

  const calculateDaysRemaining = (dateFin) => {
    if (!dateFin) return null;
    const today = new Date();
    const endDate = new Date(dateFin);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progression) => {
    if (progression >= 80) return 'from-green-400 to-green-600';
    if (progression >= 50) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const ProgressBar = ({ value, className = '' }) => (
    <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(value)}`}
      />
    </div>
  );

  const ContratCard = ({ contrat, index }) => {
    const daysRemaining = calculateDaysRemaining(contrat.dateFin);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        className={getClasses('card', 'p-6 cursor-pointer group relative overflow-hidden')}
        onClick={() => {setSelectedContrat(contrat); setShowModal(true);}}
      >
        {/* Indicateur d'urgence pour les contrats expirant bientôt */}
        {daysRemaining !== null && daysRemaining <= 30 && daysRemaining > 0 && (
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] border-b-orange-500" />
        )}
        {daysRemaining !== null && daysRemaining <= 0 && (
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] border-b-red-500" />
        )}

        {/* Header avec client et statut */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={getClasses('glass', 'w-14 h-14 flex items-center justify-center rounded-2xl text-3xl')}>
              {contrat.clientLogo}
            </div>
            <div>
              <h3 className={getClasses('text', 'font-bold text-lg')}>
                {contrat.client}
              </h3>
              <p className={getClasses('textMuted', 'text-sm')}>
                #{contrat.numero}
              </p>
            </div>
          </div>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatutColor(contrat.statut)} text-white shadow-lg`}
          >
            {getStatutIcon(contrat.statut)}
            {contrat.statut}
          </motion.span>
        </div>

        {/* Nom du contrat et type */}
        <div className="mb-4">
          <h4 className={getClasses('text', 'font-semibold text-lg mb-2')}>
            {contrat.nom}
          </h4>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className={getClasses('glass', 'px-3 py-1 rounded-full text-xs font-medium inline-block')}
          >
            {contrat.type}
          </motion.span>
        </div>

        {/* Période du contrat */}
        <div className={getClasses('glass', 'p-4 rounded-xl mb-4')}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className={getClasses('textMuted', 'text-xs')}>Début:</span>
              <p className={getClasses('text', 'font-medium')}>
                {new Date(contrat.dateDebut).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <span className={getClasses('textMuted', 'text-xs')}>Fin:</span>
              <p className={getClasses('text', 'font-medium')}>
                {contrat.dateFin ? new Date(contrat.dateFin).toLocaleDateString('fr-FR') : 'Non définie'}
              </p>
            </div>
          </div>
          {daysRemaining !== null && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className={getClasses('textMuted', 'text-xs')}>Temps restant:</span>
              <p className={`font-bold text-sm ${
                daysRemaining <= 0 ? 'text-red-500' :
                daysRemaining <= 30 ? 'text-orange-500' : getClasses('text')
              }`}>
                {daysRemaining <= 0 ? 'Expiré' : `${daysRemaining} jour(s)`}
              </p>
            </div>
          )}
        </div>

        {/* Progression financière */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className={getClasses('text', 'text-sm font-medium')}>Progression</span>
            <span className={getClasses('accent', 'text-sm font-bold')}>{contrat.progression}%</span>
          </div>
          <ProgressBar value={contrat.progression} />
        </div>

        {/* Montants */}
        <div className={getClasses('glass', 'p-4 rounded-xl mb-4')}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className={getClasses('textMuted', 'text-xs')}>Mensuel</p>
              <p className={getClasses('text', 'font-bold text-lg')}>
                {formatCurrency(contrat.montantMensuel)}
              </p>
            </div>
            <div>
              <p className={getClasses('textMuted', 'text-xs')}>Total</p>
              <p className={getClasses('accent', 'font-bold text-lg')}>
                {formatCurrency(contrat.montantTotal)}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className={getClasses('textMuted', 'text-xs')}>Payé: {formatCurrency(contrat.montantPaye)}</p>
            <p className={getClasses('text', 'text-xs font-medium')}>Restant: {formatCurrency(contrat.montantTotal - contrat.montantPaye)}</p>
          </div>
        </div>

        {/* Services inclus */}
        <div className="mb-4">
          <p className={getClasses('textMuted', 'text-xs mb-2')}>Services:</p>
          <div className="flex flex-wrap gap-1">
            {contrat.services.slice(0, 2).map((service, idx) => (
              <span
                key={idx}
                className={getClasses('glass', 'px-2 py-1 rounded text-xs')}
              >
                {service}
              </span>
            ))}
            {contrat.services.length > 2 && (
              <span className={getClasses('textMuted', 'text-xs')}>
                +{contrat.services.length - 2} autres
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {contrat.tags.map((tag, idx) => (
            <motion.span
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={getClasses('glass', 'px-2 py-1 rounded-full text-xs font-medium')}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Footer avec responsable et actions */}
        <div className="flex justify-between items-center mt-4">
          <div className={getClasses('textMuted', 'text-xs')}>
            Responsable: <span className={getClasses('text', 'font-medium')}>{contrat.responsable}</span>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
              title="Voir détails"
            >
              <EyeIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
              title="Modifier"
            >
              <PencilIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
              title="Télécharger PDF"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <UltraPremiumContainer
      title="Contrats Ultra Premium"
      icon={DocumentCheckIcon}
    >
      {/* Barre d'outils */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={getClasses('glass', 'p-6 rounded-xl mb-8')}
      >
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex flex-wrap gap-4 items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={getClasses('button', 'flex items-center gap-2 px-6 py-3')}
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nouveau Contrat</span>
              <SparklesIcon className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPdfGenerator(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              <span>PDF</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowElectronicSignature(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <PencilIcon className="w-5 h-5" />
              <span>Signature</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeadlineAlerts(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
            >
              <ClockIcon className="w-5 h-5" />
              <span>Échéances</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTemplateLibrary(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <BuildingOfficeIcon className="w-5 h-5" />
              <span>Modèles</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVersioning(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Versions</span>
            </motion.button>

            <div className="flex items-center gap-2">
              <CalendarIcon className={getClasses('accent', 'w-5 h-5')} />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className={getClasses('input', 'text-sm')}
              />
              <span className={getClasses('textMuted')}>–</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className={getClasses('input', 'text-sm')}
              />
            </div>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className={getClasses('accent', 'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5')} />
              <input
                type="text"
                placeholder="Rechercher contrat, client, responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={getClasses('input', 'pl-10 w-full')}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filtres */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={getClasses('glass', 'p-4 rounded-xl mb-8')}
      >
        <div className="flex flex-wrap gap-3">
          {[...statuts, ...types.slice(1)].map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${activeFilter === filter
                  ? getClasses('buttonPrimary')
                  : getClasses('glass', 'hover:shadow-lg')
                }
              `}
            >
              {filter === 'Tous' && <TagIcon className="w-4 h-4 mr-2 inline" />}
              {filter}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Contrats', value: filteredContrats.length, icon: '📋', color: 'from-blue-400 to-blue-600' },
          { label: 'Actifs', value: filteredContrats.filter(c => c.statut === 'Actif').length, icon: '✅', color: 'from-green-400 to-green-600' },
          { label: 'En Négociation', value: filteredContrats.filter(c => c.statut === 'En négociation').length, icon: '🔄', color: 'from-blue-400 to-blue-600' },
          { 
            label: 'CA Mensuel', 
            value: formatCurrency(filteredContrats.filter(c => c.statut === 'Actif').reduce((acc, c) => acc + c.montantMensuel, 0)), 
            icon: '💰', 
            color: 'from-purple-400 to-purple-600' 
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={getClasses('card', 'p-6 text-center')}
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
            <h3 className={getClasses('text', 'font-bold text-2xl')}>{stat.value}</h3>
            <p className={getClasses('textMuted', 'text-sm')}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Grille des contrats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContrats.map((contrat, index) => (
          <ContratCard key={contrat.id} contrat={contrat} index={index} />
        ))}
      </div>

      {/* Message si aucun contrat */}
      {filteredContrats.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={getClasses('card', 'p-12 text-center')}
        >
          <div className="text-6xl mb-4">📄</div>
          <h3 className={getClasses('text', 'text-xl font-bold mb-2')}>Aucun contrat trouvé</h3>
          <p className={getClasses('textMuted')}>Essayez de modifier vos critères de recherche</p>
        </motion.div>
      )}

      {/* Modal de détails */}
      <AnimatePresence>
        {showModal && selectedContrat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'max-w-5xl w-full max-h-[90vh] overflow-y-auto')}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-6">
                    <div className={getClasses('glass', 'w-20 h-20 flex items-center justify-center rounded-3xl text-5xl')}>
                      {selectedContrat.clientLogo}
                    </div>
                    <div>
                      <h2 className={getClasses('text', 'text-3xl font-bold mb-2')}>
                        {selectedContrat.nom}
                      </h2>
                      <p className={getClasses('accent', 'text-xl font-semibold mb-1')}>
                        {selectedContrat.client}
                      </p>
                      <p className={getClasses('textMuted')}>
                        Contrat #{selectedContrat.numero}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className={getClasses('glass', 'p-3 rounded-xl hover:bg-red-500/20')}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Détails du contrat</h3>
                    <div className={getClasses('glass', 'p-6 rounded-xl space-y-4')}>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Type:</span>
                        <p className={getClasses('text', 'font-medium')}>{selectedContrat.type}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Statut:</span>
                        <div className="mt-1">
                          <motion.span 
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatutColor(selectedContrat.statut)} text-white shadow-lg`}
                          >
                            {getStatutIcon(selectedContrat.statut)}
                            {selectedContrat.statut}
                          </motion.span>
                        </div>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Responsable:</span>
                        <p className={getClasses('text', 'font-medium')}>{selectedContrat.responsable}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Renouvellement:</span>
                        <p className={getClasses('text', 'font-medium')}>{selectedContrat.renouvellement}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Période</h3>
                    <div className={getClasses('glass', 'p-6 rounded-xl space-y-4')}>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Date de signature:</span>
                        <p className={getClasses('text', 'font-medium')}>
                          {selectedContrat.dateSignature ? new Date(selectedContrat.dateSignature).toLocaleDateString('fr-FR') : 'Non signé'}
                        </p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Début:</span>
                        <p className={getClasses('text', 'font-medium')}>
                          {new Date(selectedContrat.dateDebut).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Fin:</span>
                        <p className={getClasses('text', 'font-medium')}>
                          {selectedContrat.dateFin ? new Date(selectedContrat.dateFin).toLocaleDateString('fr-FR') : 'Non définie'}
                        </p>
                      </div>
                      {selectedContrat.dureeRestante !== null && (
                        <div>
                          <span className={getClasses('textMuted', 'text-sm')}>Temps restant:</span>
                          <p className={`font-bold text-lg ${
                            selectedContrat.dureeRestante <= 0 ? 'text-red-500' :
                            selectedContrat.dureeRestante <= 30 ? 'text-orange-500' : getClasses('text')
                          }`}>
                            {selectedContrat.dureeRestante <= 0 ? 'Expiré' : `${selectedContrat.dureeRestante} jour(s)`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Financier</h3>
                    <div className={getClasses('glass', 'p-6 rounded-xl space-y-4')}>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Montant mensuel:</span>
                        <p className={getClasses('text', 'font-bold text-xl')}>
                          {formatCurrency(selectedContrat.montantMensuel)}
                        </p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Montant total:</span>
                        <p className={getClasses('accent', 'font-bold text-2xl')}>
                          {formatCurrency(selectedContrat.montantTotal)}
                        </p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Déjà payé:</span>
                        <p className={getClasses('text', 'font-bold text-lg')}>
                          {formatCurrency(selectedContrat.montantPaye)}
                        </p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Reste à payer:</span>
                        <p className={`font-bold text-lg ${
                          selectedContrat.montantTotal - selectedContrat.montantPaye === 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {formatCurrency(selectedContrat.montantTotal - selectedContrat.montantPaye)}
                        </p>
                      </div>
                      <div className="pt-3">
                        <span className={getClasses('textMuted', 'text-sm')}>Progression:</span>
                        <div className="mt-2">
                          <ProgressBar value={selectedContrat.progression} />
                          <p className={getClasses('accent', 'font-bold text-center mt-2')}>{selectedContrat.progression}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Services inclus</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedContrat.services.map((service, idx) => (
                      <div key={idx} className={getClasses('glass', 'p-4 rounded-xl text-center')}>
                        <span className={getClasses('text', 'font-medium')}>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedContrat.notes && (
                  <div className="mt-8">
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Notes</h3>
                    <div className={getClasses('glass', 'p-6 rounded-xl')}>
                      <p className={getClasses('text')}>{selectedContrat.notes}</p>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Tags</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedContrat.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={getClasses('glass', 'px-4 py-2 rounded-full font-medium')}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={getClasses('buttonPrimary', 'flex-1')}
                  >
                    <PencilIcon className="w-5 h-5 mr-2" />
                    Modifier
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={getClasses('button', 'flex-1')}
                  >
                    <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                    Télécharger PDF
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={getClasses('button', 'flex-1')}
                  >
                    <ArrowPathIcon className="w-5 h-5 mr-2" />
                    Renouveler
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Générateur PDF */}
      <AnimatePresence>
        {showPdfGenerator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPdfGenerator(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'max-w-4xl w-full max-h-[90vh] overflow-y-auto')}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={getClasses('text', 'text-3xl font-bold mb-2 flex items-center')}>
                      <DocumentArrowDownIcon className="w-8 h-8 text-red-500 mr-3" />
                      Générateur PDF Automatique
                    </h2>
                    <p className={getClasses('textMuted')}>
                      Génération automatique de contrats PDF avec mise en page professionnelle
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPdfGenerator(false)}
                    className={getClasses('glass', 'p-3 rounded-xl hover:bg-red-500/20')}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Contrats disponibles</h3>
                    <div className="space-y-3">
                      {filteredContrats.map((contrat, idx) => (
                        <motion.div
                          key={contrat.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={getClasses('glass', 'p-4 rounded-xl flex items-center justify-between hover:shadow-lg transition-all')}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-xl ${getStatutColor(contrat.statut)} flex items-center justify-center text-3xl`}>
                              {contrat.clientLogo}
                            </div>
                            <div>
                              <h4 className={getClasses('text', 'font-bold')}>{contrat.nom}</h4>
                              <p className={getClasses('textMuted', 'text-sm')}>{contrat.client} - #{contrat.numero}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getStatutColor(contrat.statut)} text-white`}>
                                  {contrat.statut}
                                </span>
                                {contrat.template && (
                                  <span className={getClasses('badge', 'text-xs')}>
                                    {contrat.template}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                            >
                              <DocumentArrowDownIcon className="w-4 h-4" />
                              <span>Générer PDF</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={getClasses('glass', 'p-2 rounded-lg')}
                            >
                              <EyeIcon className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className={getClasses('glass', 'p-4 rounded-xl')}>
                      <h3 className={getClasses('text', 'text-lg font-bold mb-4 flex items-center')}>
                        <SparklesIcon className="w-5 h-5 text-red-500 mr-2" />
                        Options PDF
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className={getClasses('text', 'text-sm')}>Filigrane sécurisé</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className={getClasses('text', 'text-sm')}>Signature numérique</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className={getClasses('text', 'text-sm')}>Annexes automatiques</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className={getClasses('text', 'text-sm')}>Logo entreprise</span>
                        </label>
                      </div>
                    </div>

                    <div className={getClasses('glass', 'p-4 rounded-xl')}>
                      <h3 className={getClasses('text', 'text-lg font-bold mb-4')}>Modèles disponibles</h3>
                      <div className="space-y-2">
                        {contractTemplates.map((template, idx) => (
                          <motion.button
                            key={template.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={getClasses('glass', 'w-full p-3 rounded-lg text-left hover:shadow-lg transition-all')}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className={getClasses('text', 'font-medium text-sm')}>{template.name}</p>
                                <p className={getClasses('textMuted', 'text-xs')}>{template.category}</p>
                              </div>
                              <span className={getClasses('badge', 'text-xs')}>
                                {template.usage}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className={getClasses('glass', 'p-4 rounded-xl')}>
                      <h3 className={getClasses('text', 'text-lg font-bold mb-4')}>Actions rapides</h3>
                      <div className="space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Génération en lot
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                        >
                          Modèle personnalisé
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          Historique PDF
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Signature Électronique */}
      <AnimatePresence>
        {showElectronicSignature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowElectronicSignature(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'max-w-5xl w-full max-h-[90vh] overflow-y-auto')}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={getClasses('text', 'text-3xl font-bold mb-2 flex items-center')}>
                      <PencilIcon className="w-8 h-8 text-green-500 mr-3" />
                      Signature Électronique Intégrée
                    </h2>
                    <p className={getClasses('textMuted')}>
                      Système de signature électronique sécurisée avec certificats
                    </p>
                  </div>
                  <button
                    onClick={() => setShowElectronicSignature(false)}
                    className={getClasses('glass', 'p-3 rounded-xl hover:bg-red-500/20')}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Signatures en attente</h3>
                    <div className="space-y-4">
                      {filteredContrats
                        .filter(c => !c.signature || c.signature.status === 'pending')
                        .map((contrat, idx) => (
                          <motion.div
                            key={contrat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={getClasses('glass', 'p-4 rounded-xl border-l-4 border-orange-500')}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <ClockIcon className="w-5 h-5 text-orange-600" />
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                    En attente
                                  </span>
                                </div>
                                <h4 className={getClasses('text', 'font-bold mb-1')}>{contrat.nom}</h4>
                                <p className={getClasses('textMuted', 'text-sm mb-2')}>{contrat.client}</p>
                                <div className="flex items-center space-x-4 text-sm">
                                  <span className={getClasses('textMuted', 'flex items-center')}>
                                    <UserIcon className="w-4 h-4 mr-1" />
                                    {contrat.responsable}
                                  </span>
                                  <span className={getClasses('textMuted', 'flex items-center')}>
                                    <CurrencyEuroIcon className="w-4 h-4 mr-1" />
                                    {formatCurrency(contrat.montantMensuel)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                  <span>Signer</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={getClasses('glass', 'p-2 rounded-lg')}
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Contrats signés</h3>
                    <div className="space-y-4">
                      {filteredContrats
                        .filter(c => c.signature && c.signature.status === 'signed')
                        .map((contrat, idx) => (
                          <motion.div
                            key={contrat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={getClasses('glass', 'p-4 rounded-xl border-l-4 border-green-500')}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    Signé
                                  </span>
                                </div>
                                <h4 className={getClasses('text', 'font-bold mb-1')}>{contrat.nom}</h4>
                                <p className={getClasses('textMuted', 'text-sm mb-2')}>{contrat.client}</p>
                                {contrat.signature && (
                                  <div className="space-y-1">
                                    <p className={getClasses('textMuted', 'text-xs')}>
                                      Signé le: {contrat.signature.signedDate}
                                    </p>
                                    <p className={getClasses('textMuted', 'text-xs')}>
                                      Certificat: {contrat.signature.certificate}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {contrat.signature.signataires.map((sig, sigIdx) => (
                                        <span key={sigIdx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                          {sig.name}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                  <DocumentArrowDownIcon className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Alertes d'Échéance */}
      <AnimatePresence>
        {showDeadlineAlerts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeadlineAlerts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'max-w-5xl w-full max-h-[90vh] overflow-y-auto')}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={getClasses('text', 'text-3xl font-bold mb-2 flex items-center')}>
                      <ClockIcon className="w-8 h-8 text-yellow-500 mr-3" />
                      Système d'Alertes d'Échéance
                    </h2>
                    <p className={getClasses('textMuted')}>
                      Surveillance automatique des échéances et renouvellements
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeadlineAlerts(false)}
                    className={getClasses('glass', 'p-3 rounded-xl hover:bg-red-500/20')}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Alertes actives</h3>
                    <div className="space-y-4">
                      {deadlineAlertsData.map((alert, idx) => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`rounded-xl p-4 border-l-4 ${
                            alert.severity === 'high' ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-500' :
                            alert.severity === 'medium' ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-500' :
                            'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-500'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <ClockIcon className={`w-5 h-5 ${
                                  alert.severity === 'high' ? 'text-red-600' :
                                  alert.severity === 'medium' ? 'text-orange-600' :
                                  'text-blue-600'
                                }`} />
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                                  alert.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {alert.severity}
                                </span>
                                <span className={getClasses('badge', 'text-xs')}>
                                  {alert.type}
                                </span>
                              </div>
                              <h4 className={getClasses('text', 'font-bold mb-1')}>{alert.client}</h4>
                              <p className={getClasses('text', 'text-sm mb-2')}>{alert.message}</p>
                              <p className={getClasses('textMuted', 'text-xs mb-2')}>{alert.action}</p>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className={getClasses('textMuted', 'flex items-center')}>
                                  <CalendarIcon className="w-4 h-4 mr-1" />
                                  {alert.date}
                                </span>
                                <span className={`flex items-center font-bold ${
                                  alert.daysUntil <= 15 ? 'text-red-600' :
                                  alert.daysUntil <= 45 ? 'text-orange-600' :
                                  'text-blue-600'
                                }`}>
                                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                                  {alert.daysUntil} jour(s)
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                <PaperAirplaneIcon className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className={getClasses('glass', 'p-4 rounded-xl')}>
                      <h3 className={getClasses('text', 'text-lg font-bold mb-4 flex items-center')}>
                        <ChartBarIcon className="w-5 h-5 text-yellow-500 mr-2" />
                        Statistiques
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={getClasses('textMuted')}>Alertes actives</span>
                          <span className={getClasses('text', 'font-bold text-yellow-600')}>
                            {deadlineAlertsData.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={getClasses('textMuted')}>Critiques</span>
                          <span className={getClasses('text', 'font-bold text-red-600')}>
                            {deadlineAlertsData.filter(a => a.severity === 'high').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={getClasses('textMuted')}>Ce mois</span>
                          <span className={getClasses('text', 'font-bold text-orange-600')}>
                            {deadlineAlertsData.filter(a => a.daysUntil <= 30).length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={getClasses('glass', 'p-4 rounded-xl')}>
                      <h3 className={getClasses('text', 'text-lg font-bold mb-4')}>Configuration</h3>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className={getClasses('text', 'text-sm')}>Email automatique</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className={getClasses('text', 'text-sm')}>SMS d'urgence</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className={getClasses('text', 'text-sm')}>Slack notifications</span>
                        </label>
                      </div>
                    </div>

                    <div className={getClasses('glass', 'p-4 rounded-xl')}>
                      <h3 className={getClasses('text', 'text-lg font-bold mb-4')}>Actions</h3>
                      <div className="space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Nouvelle alerte
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                        >
                          Rapport mensuel
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Bibliothèque de Modèles */}
      <AnimatePresence>
        {showTemplateLibrary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTemplateLibrary(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'max-w-6xl w-full max-h-[90vh] overflow-y-auto')}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={getClasses('text', 'text-3xl font-bold mb-2 flex items-center')}>
                      <BuildingOfficeIcon className="w-8 h-8 text-purple-500 mr-3" />
                      Bibliothèque de Modèles
                    </h2>
                    <p className={getClasses('textMuted')}>
                      Collection complète de modèles de contrats personnalisables
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTemplateLibrary(false)}
                    className={getClasses('glass', 'p-3 rounded-xl hover:bg-red-500/20')}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={getClasses('text', 'text-xl font-bold')}>Modèles disponibles</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span>Nouveau modèle</span>
                      </motion.button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {contractTemplates.map((template, idx) => (
                        <motion.div
                          key={template.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className={getClasses('glass', 'p-4 rounded-xl cursor-pointer hover:shadow-lg transition-all')}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              template.category === 'Premium' ? 'bg-purple-100 text-purple-700' :
                              template.category === 'Standard' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {template.category}
                            </span>
                            <span className={getClasses('badge', 'text-xs')}>
                              {template.usage} fois
                            </span>
                          </div>
                          <h4 className={getClasses('text', 'font-bold mb-2')}>{template.name}</h4>
                          <p className={getClasses('textMuted', 'text-sm mb-3')}>{template.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className={getClasses('textMuted')}>
                              {template.clauses} clauses
                            </span>
                            <span className={getClasses('textMuted')}>
                              {template.lastModified}
                            </span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                              >
                                Utiliser
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs"
                              >
                                <EyeIcon className="w-3 h-3" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className={getClasses('glass', 'p-4 rounded-xl')}>
                      <h3 className={getClasses('text', 'text-lg font-bold mb-4 flex items-center')}>
                        <ChartBarIcon className="w-5 h-5 text-purple-500 mr-2" />
                        Statistiques
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={getClasses('textMuted')}>Total modèles</span>
                          <span className={getClasses('text', 'font-bold text-purple-600')}>
                            {contractTemplates.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={getClasses('textMuted')}>Utilisation totale</span>
                          <span className={getClasses('text', 'font-bold text-green-600')}>
                            {contractTemplates.reduce((sum, t) => sum + t.usage, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={getClasses('textMuted')}>Plus populaire</span>
                          <span className={getClasses('text', 'font-bold text-blue-600')}>
                            Standard
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={getClasses('glass', 'p-4 rounded-xl')}>
                      <h3 className={getClasses('text', 'text-lg font-bold mb-4')}>Catégories</h3>
                      <div className="space-y-2">
                        {['Premium', 'Standard', 'Innovation', 'Maintenance', 'Luxe'].map((cat, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className={getClasses('text', 'text-sm')}>{cat}</span>
                            <span className={getClasses('badge', 'text-xs')}>
                              {contractTemplates.filter(t => t.category === cat).length}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={getClasses('glass', 'p-4 rounded-xl')}>
                      <h3 className={getClasses('text', 'text-lg font-bold mb-4')}>Actions rapides</h3>
                      <div className="space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Import modèle
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                        >
                          Export sélection
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          Rapport usage
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Versioning */}
      <AnimatePresence>
        {showVersioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowVersioning(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'max-w-5xl w-full max-h-[90vh] overflow-y-auto')}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className={getClasses('text', 'text-3xl font-bold mb-2 flex items-center')}>
                      <ArrowPathIcon className="w-8 h-8 text-indigo-500 mr-3" />
                      Versioning des Contrats
                    </h2>
                    <p className={getClasses('textMuted')}>
                      Historique complet des versions avec traçabilité
                    </p>
                  </div>
                  <button
                    onClick={() => setShowVersioning(false)}
                    className={getClasses('glass', 'p-3 rounded-xl hover:bg-red-500/20')}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Historique des versions</h3>
                    <div className="space-y-4">
                      {filteredContrats
                        .filter(c => c.versions)
                        .map((contrat, idx) => (
                          <motion.div
                            key={contrat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={getClasses('glass', 'p-4 rounded-xl')}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className={getClasses('text', 'font-bold mb-1')}>{contrat.nom}</h4>
                                <p className={getClasses('textMuted', 'text-sm')}>{contrat.client}</p>
                              </div>
                              <span className={getClasses('badge', 'text-xs')}>
                                {contrat.versions.length} versions
                              </span>
                            </div>
                            <div className="space-y-2">
                              {contrat.versions.reverse().map((version, vIdx) => (
                                <div key={version.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      version.status === 'current' ? 'bg-green-100 text-green-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {version.id}
                                    </span>
                                    <div>
                                      <p className={getClasses('text', 'font-medium text-sm')}>{version.description}</p>
                                      <p className={getClasses('textMuted', 'text-xs')}>{version.date}</p>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    {version.status === 'current' && (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                        Actuelle
                                      </span>
                                    )}
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                      <EyeIcon className="w-3 h-3" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    >
                                      <DocumentArrowDownIcon className="w-3 h-3" />
                                    </motion.button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className={getClasses('glass', 'p-4 rounded-xl')}>
                      <h3 className={getClasses('text', 'text-lg font-bold mb-4 flex items-center')}>
                        <ChartBarIcon className="w-5 h-5 text-indigo-500 mr-2" />
                        Statistiques
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={getClasses('textMuted')}>Total versions</span>
                          <span className={getClasses('text', 'font-bold text-indigo-600')}>
                            {filteredContrats.filter(c => c.versions).reduce((sum, c) => sum + c.versions.length, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={getClasses('textMuted')}>Versions actives</span>
                          <span className={getClasses('text', 'font-bold text-green-600')}>
                            {filteredContrats.filter(c => c.versions).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={getClasses('textMuted')}>Archivées</span>
                          <span className={getClasses('text', 'font-bold text-gray-600')}>
                            {filteredContrats.filter(c => c.versions).reduce((sum, c) => sum + c.versions.filter(v => v.status === 'archived').length, 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={getClasses('glass', 'p-4 rounded-xl')}>
                      <h3 className={getClasses('text', 'text-lg font-bold mb-4')}>Fonctionnalités</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className={getClasses('textMuted')}>Sauvegarde auto</span>
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <span className={getClasses('textMuted')}>Comparaison</span>
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <span className={getClasses('textMuted')}>Restauration</span>
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <span className={getClasses('textMuted')}>Audit trail</span>
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                    </div>

                    <div className={getClasses('glass', 'p-4 rounded-xl')}>
                      <h3 className={getClasses('text', 'text-lg font-bold mb-4')}>Actions</h3>
                      <div className="space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Comparer versions
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                        >
                          Archive anciennes
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          Rapport versioning
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default ContratsUltraPremium;