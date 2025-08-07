import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon,
  CalendarDaysIcon,
  TagIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  ArrowUpIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudArrowUpIcon,
  LinkIcon,
  DocumentTextIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const DemandesClientStatistiques = () => {
  const [activeTab, setActiveTab] = useState('Chiffres-clés');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [dateFilter, setDateFilter] = useState('30 derniers jours');
  const [customDateRange, setCustomDateRange] = useState({
    dateDebut: '',
    dateFin: ''
  });
  const [selectedDateOption, setSelectedDateOption] = useState('30-derniers-jours');
  
  // États pour le formulaire d'ajout
  const [formData, setFormData] = useState({
    titre: '',
    client: '',
    responsable: '',
    contrat: '',
    statut: 'Nouveau',
    priorite: 'Normal',
    categorie: '',
    provenance: 'Autre',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    rapportPersonnalise: '',
    contenu: '',
    fichiers: []
  });

  // Données de démonstration pour les statistiques
  const statistiques = {
    totalTickets: 127,
    ticketsOuverts: 45,
    ticketsClotures: 82,
    derniers30Jours: {
      total: 38,
      ouverts: 15,
      clotures: 23,
      deltaTotal: +12,
      deltaOuverts: -3,
      deltaClotures: +15
    },
    derniers7Jours: {
      total: 9,
      ouverts: 4,
      clotures: 5,
      deltaTotal: +2,
      deltaOuverts: -1,
      deltaClotures: +3
    },
    ticketsParPriorite: [
      { priorite: 'Urgent', count: 12, color: '#EF4444' },
      { priorite: 'Haut', count: 8, color: '#F97316' },
      { priorite: 'Normal', count: 25, color: '#10B981' }
    ],
    ticketsParCategorie: [
      { categorie: 'Technique', count: 18, color: '#3B82F6' },
      { categorie: 'Commercial', count: 12, color: '#8B5CF6' },
      { categorie: 'Support', count: 10, color: '#06B6D4' },
      { categorie: 'Formation', count: 5, color: '#84CC16' }
    ]
  };

  // Données de démonstration pour les derniers tickets
  const derniersTickets = [
    {
      numero: '127',
      priorite: 'Urgent',
      statut: 'Ouvert',
      titre: 'Problème accès plateforme',
      client: 'ADAGIO OPERA',
      adresse: '15 Rue de la Paix, 75002 Paris',
      collaborateur: 'Marie Dubois',
      dateCreation: '19/07/2025'
    },
    {
      numero: '126',
      priorite: 'Normal',
      statut: 'Ouvert',
      titre: 'Demande formation équipe',
      client: 'ADVANCY CONSEIL',
      adresse: '8 Avenue Haussmann, 75008 Paris',
      collaborateur: 'Jean Martin',
      dateCreation: '18/07/2025'
    },
    {
      numero: '125',
      priorite: 'Haut',
      statut: 'En cours',
      titre: 'Installation nouveaux équipements',
      client: 'AE75 SAS',
      adresse: '22 Rue des Martyrs, 75011 Paris',
      collaborateur: 'Sophie Leroy',
      dateCreation: '17/07/2025'
    },
    {
      numero: '124',
      priorite: 'Normal',
      statut: 'Ouvert',
      titre: 'Maintenance préventive',
      client: 'AQUILAE GESTION',
      adresse: '45 Boulevard Saint-Germain, 75006 Paris',
      collaborateur: 'Pierre Moreau',
      dateCreation: '16/07/2025'
    },
    {
      numero: '123',
      priorite: 'Urgent',
      statut: 'En cours',
      titre: 'Panne système arrosage',
      client: 'BERENBERG BANK',
      adresse: '30 Avenue Montaigne, 75008 Paris',
      collaborateur: 'Thomas Weber',
      dateCreation: '15/07/2025'
    },
    {
      numero: '122',
      priorite: 'Normal',
      statut: 'Ouvert',
      titre: 'Renouvellement contrat',
      client: 'BEWIZ TECHNOLOGIES',
      adresse: '12 Rue de Rivoli, 75001 Paris',
      collaborateur: 'Emma Dubois',
      dateCreation: '14/07/2025'
    },
    {
      numero: '121',
      priorite: 'Haut',
      statut: 'En cours',
      titre: 'Audit sécurité installations',
      client: 'CLAREO CONSULTING',
      adresse: '88 Rue Saint-Antoine, 75004 Paris',
      collaborateur: 'Lucas Bernard',
      dateCreation: '13/07/2025'
    },
    {
      numero: '120',
      priorite: 'Normal',
      statut: 'Ouvert',
      titre: 'Demande devis extension',
      client: 'AAREAL BANK',
      adresse: '5 Place Vendôme, 75001 Paris',
      collaborateur: 'Anna Schmidt',
      dateCreation: '12/07/2025'
    },
    {
      numero: '119',
      priorite: 'Urgent',
      statut: 'En cours',
      titre: 'Remplacement urgent matériel',
      client: 'ADAGIO OPERA',
      adresse: '15 Rue de la Paix, 75002 Paris',
      collaborateur: 'Marie Dubois',
      dateCreation: '11/07/2025'
    },
    {
      numero: '118',
      priorite: 'Normal',
      statut: 'Ouvert',
      titre: 'Planification intervention',
      client: 'ADVANCY CONSEIL',
      adresse: '8 Avenue Haussmann, 75008 Paris',
      collaborateur: 'Jean Martin',
      dateCreation: '10/07/2025'
    }
  ];

  const dateOptions = [
    { value: '7-derniers-jours', label: '7 derniers jours' },
    { value: '30-derniers-jours', label: '30 derniers jours' },
    { value: 'mois-courant', label: 'Mois courant' },
    { value: 'trimestre-courant', label: 'Trimestre courant' },
    { value: 'annee-courante', label: 'Année courante' },
    { value: 'depuis-toujours', label: 'Depuis toujours' },
    { value: 'personnalise', label: 'Période personnalisée' }
  ];

  const shortcuts = [
    { label: 'Hier', value: 'hier' },
    { label: 'Aujourd\'hui', value: 'aujourd-hui' },
    { label: '7 derniers jours', value: '7-derniers-jours' },
    { label: '30 derniers jours', value: '30-derniers-jours' },
    { label: 'Année en cours', value: 'annee-courante' },
    { label: 'Depuis toujours', value: 'depuis-toujours' }
  ];

  // Données pour les formulaires
  const clients = ['ADAGIO OPERA', 'SEPHORA', 'SPOTIFY', 'HERMES', 'LYDIA SOLUTIONS', 'BEWIZ', 'CLAREO', 'AAREAL BANK', 'BERENBERG BANK', 'AQUILAE GESTION'];
  const responsables = [
    'Aymeric Tireau',
    'David Celeste',
    'Elodie Treveten',
    'Estelle Delapierre',
    'Florence ROGER',
    'Lucie Garcia',
    'Marine Sandoz',
    'Simon Henry'
  ];
  const statuts = ['Nouveau', 'En cours', 'Attente de réponse', 'Résolu', 'Fermé', 'Rejeté'];
  const priorites = ['Faible', 'Normal', 'Haut', 'Urgent', 'Immédiat'];
  const provenances = ['Autre', 'En personne', 'Par email', 'Par téléphone'];
  const categories = ['Entretien', 'Installation', 'Dépannage', 'Conseil', 'Urgence'];
  const contrats = [
    'N°240',
    'N°278',
    'N°261',
    'N°276 : Aléa',
    'N°271 : B-CE Euro Ariane',
    'N°270 : B-CE New Flag',
    'N°204 : CE – My Flex Office'
  ];
  const rapportsPersonnalises = [
    'Rapport standard maintenance',
    'Rapport intervention urgente',
    'Rapport diagnostic',
    'Rapport installation',
    'Rapport entretien préventif'
  ];

  const priorityColors = {
    'Urgent': 'bg-red-100 text-red-800 border-red-200',
    'Haut': 'bg-orange-100 text-orange-800 border-orange-200',
    'Normal': 'bg-green-100 text-green-800 border-green-200'
  };

  const statusColors = {
    'Ouvert': 'bg-blue-100 text-blue-800 border-blue-200',
    'En cours': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Clôturé': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const formatDelta = (delta) => {
    if (delta > 0) {
      return `+${delta}`;
    }
    return delta.toString();
  };

  // Fonctions pour le formulaire
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, fichiers: [...prev.fichiers, ...files] }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      fichiers: prev.fichiers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitForm = async (continueEdit = false) => {
    if (!formData.titre) {
      alert('Veuillez saisir un titre');
      return;
    }
    
    console.log('Données du formulaire:', formData);
    
    if (!continueEdit) {
      setShowAddForm(false);
      setFormData({
        titre: '',
        client: '',
        responsable: '',
        contrat: '',
        statut: 'Nouveau',
        priorite: 'Normal',
        categorie: '',
        provenance: 'Autre',
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: '',
        rapportPersonnalise: '',
        contenu: '',
        fichiers: []
      });
    }
  };

  const getDeltaColor = (delta) => {
    if (delta > 0) return 'text-green-600';
    if (delta < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const handleApplyDateFilter = () => {
    if (selectedDateOption === 'personnalise') {
      if (customDateRange.dateDebut && customDateRange.dateFin) {
        setDateFilter(`${customDateRange.dateDebut} - ${customDateRange.dateFin}`);
      }
    } else {
      const option = dateOptions.find(opt => opt.value === selectedDateOption);
      setDateFilter(option.label);
    }
    setShowDatePicker(false);
  };

  const renderDatePicker = () => (
    <AnimatePresence>
      {showDatePicker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDatePicker(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sélecteur de période</h3>
              <button
                onClick={() => setShowDatePicker(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Du</label>
                  <input
                    type="date"
                    value={customDateRange.dateDebut}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, dateDebut: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Au</label>
                  <input
                    type="date"
                    value={customDateRange.dateFin}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, dateFin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Période prédéfinie</label>
                <div className="space-y-2">
                  {dateOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        value={option.value}
                        checked={selectedDateOption === option.value}
                        onChange={(e) => setSelectedDateOption(e.target.value)}
                        className="mr-2 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Raccourcis</label>
                <div className="flex flex-wrap gap-2">
                  {shortcuts.map((shortcut) => (
                    <button
                      key={shortcut.value}
                      onClick={() => setSelectedDateOption(shortcut.value)}
                      className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                        selectedDateOption === shortcut.value
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {shortcut.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDatePicker(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleApplyDateFilter}
                className="px-4 py-2 text-sm font-medium text-white bg-[#2170E3] hover:bg-blue-700 rounded-md transition-colors"
              >
                Filtrer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderActionBar = () => (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-[#2170E3] text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Ajouter une demande client
          </motion.button>

          <button
            onClick={() => setShowDatePicker(true)}
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <CalendarDaysIcon className="w-4 h-4 mr-2" />
            {dateFilter}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" title="Tags">
            <TagIcon className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" title="Imprimer">
            <PrinterIcon className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" title="Exporter">
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="bg-white border-b border-gray-200">
      <div className="flex space-x-6 px-6">
        {['Général', 'Chiffres-clés'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-3 border-b-3 font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === tab
                ? 'border-[#2170E3] text-[#2170E3] bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-[#2170E3] hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total tickets</p>
            <p className="text-3xl font-bold text-gray-900">{statistiques.totalTickets}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Tickets ouverts</p>
            <p className="text-3xl font-bold text-orange-600">{statistiques.ticketsOuverts}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Tickets clôturés</p>
            <p className="text-3xl font-bold text-green-600">{statistiques.ticketsClotures}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPieChart = (data, title, colorKey = 'color') => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let cumulativePercentage = 0;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {data.map((item, index) => {
                const percentage = (item.count / total) * 100;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = -cumulativePercentage;
                cumulativePercentage += percentage;

                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="15.915"
                    fill="transparent"
                    stroke={item[colorKey]}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item[colorKey] }}
                ></div>
                <span className="text-sm text-gray-700">
                  {item.priorite || item.categorie}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTemporalStats = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">30 derniers jours</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total tickets</span>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">{statistiques.derniers30Jours.total}</span>
              <span className={`text-sm font-medium ${getDeltaColor(statistiques.derniers30Jours.deltaTotal)}`}>
                ({formatDelta(statistiques.derniers30Jours.deltaTotal)})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tickets ouverts</span>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-orange-600">{statistiques.derniers30Jours.ouverts}</span>
              <span className={`text-sm font-medium ${getDeltaColor(statistiques.derniers30Jours.deltaOuverts)}`}>
                ({formatDelta(statistiques.derniers30Jours.deltaOuverts)})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tickets clôturés</span>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">{statistiques.derniers30Jours.clotures}</span>
              <span className={`text-sm font-medium ${getDeltaColor(statistiques.derniers30Jours.deltaClotures)}`}>
                ({formatDelta(statistiques.derniers30Jours.deltaClotures)})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7 derniers jours</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total tickets</span>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">{statistiques.derniers7Jours.total}</span>
              <span className={`text-sm font-medium ${getDeltaColor(statistiques.derniers7Jours.deltaTotal)}`}>
                ({formatDelta(statistiques.derniers7Jours.deltaTotal)})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tickets ouverts</span>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-orange-600">{statistiques.derniers7Jours.ouverts}</span>
              <span className={`text-sm font-medium ${getDeltaColor(statistiques.derniers7Jours.deltaOuverts)}`}>
                ({formatDelta(statistiques.derniers7Jours.deltaOuverts)})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tickets clôturés</span>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">{statistiques.derniers7Jours.clotures}</span>
              <span className={`text-sm font-medium ${getDeltaColor(statistiques.derniers7Jours.deltaClotures)}`}>
                ({formatDelta(statistiques.derniers7Jours.deltaClotures)})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLastTicketsTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">10 derniers tickets ouverts</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client/Adresse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collaborateur</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {derniersTickets.map((ticket, index) => (
              <motion.tr
                key={ticket.numero}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {ticket.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[ticket.priorite]}`}>
                    {ticket.priorite}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[ticket.statut]}`}>
                    {ticket.statut}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {ticket.titre}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>
                    <button className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                      {ticket.client}
                    </button>
                    <div className="text-xs text-gray-500 mt-1">
                      {ticket.adresse}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ticket.collaborateur}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      title="Voir le ticket"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
                      title="Modifier le ticket"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFooter = () => (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          © 2025 Organilog · 
          <button className="text-blue-600 hover:text-blue-800 mx-1">CGU</button>
          ·
          <button className="text-blue-600 hover:text-blue-800 mx-1">Mentions légales</button>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <ArrowUpIcon className="w-4 h-4" />
          <span>Retour en haut</span>
        </button>
      </div>
    </footer>
  );

  const renderChiffresContent = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {renderStatsCards()}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {renderPieChart(statistiques.ticketsParPriorite, 'Tickets ouverts, par priorité', 'color')}
          {renderPieChart(statistiques.ticketsParCategorie, 'Tickets ouverts, par catégorie', 'color')}
        </div>

        {renderTemporalStats()}
        {renderLastTicketsTable()}
        {renderFooter()}
      </div>
    </div>
  );

  const renderGeneralContent = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vue Général</h3>
          <p className="text-gray-600">Contenu de l'onglet Général à implémenter selon les besoins.</p>
        </div>
        {renderFooter()}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-gray-50">
      {renderActionBar()}
      {renderTabs()}
      
      <div className="overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
        {activeTab === 'Chiffres-clés' ? renderChiffresContent() : renderGeneralContent()}
      </div>

      {renderDatePicker()}
      
      {/* Formulaire d'ajout de demande client */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#2170E3] text-white p-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Ajouter une demande client</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-white hover:bg-blue-600 rounded" title="Options">
                    <Cog6ToothIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 text-white hover:bg-blue-600 rounded"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Titre */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => handleFormChange('titre', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    placeholder="Saisissez le titre de la demande..."
                    required
                  />
                </div>

                {/* Bloc principal en deux colonnes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Colonne gauche */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client <span className="text-red-500">*</span>
                      </label>
                      <div className="flex space-x-2">
                        <select
                          value={formData.client}
                          onChange={(e) => handleFormChange('client', e.target.value)}
                          className="flex-1 border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                          required
                        >
                          <option value="">Sélectionner un client</option>
                          {clients.map(client => (
                            <option key={client} value={client}>{client}</option>
                          ))}
                        </select>
                        <button className="px-3 py-2 border border-gray-200 rounded hover:bg-gray-50" title="Ajouter un client">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                      <select
                        value={formData.responsable}
                        onChange={(e) => handleFormChange('responsable', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        <option value="">Sélectionner un responsable</option>
                        {responsables.map(resp => (
                          <option key={resp} value={resp}>{resp}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contrat</label>
                      <div className="space-y-2">
                        <select
                          value={formData.contrat}
                          onChange={(e) => handleFormChange('contrat', e.target.value)}
                          className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        >
                          <option value="">Sélectionner un contrat</option>
                          {contrats.map(contrat => (
                            <option key={contrat} value={contrat}>{contrat}</option>
                          ))}
                        </select>
                        <button className="text-[#2170E3] hover:text-blue-800 text-sm flex items-center">
                          <LinkIcon className="w-4 h-4 mr-1" />
                          Ajouter un contrat
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                      <textarea
                        value={formData.contenu}
                        onChange={(e) => handleFormChange('contenu', e.target.value)}
                        rows={6}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        placeholder="Décrivez le contenu de la demande..."
                      />
                    </div>
                  </div>

                  {/* Colonne droite */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statut <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.statut}
                        onChange={(e) => handleFormChange('statut', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        required
                      >
                        {statuts.map(statut => (
                          <option key={statut} value={statut}>{statut}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priorité <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.priorite}
                        onChange={(e) => handleFormChange('priorite', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        required
                      >
                        {priorites.map(priorite => (
                          <option key={priorite} value={priorite}>{priorite}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                      <input
                        type="date"
                        value={formData.dateDebut}
                        onChange={(e) => handleFormChange('dateDebut', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                      <input
                        type="date"
                        value={formData.dateFin}
                        onChange={(e) => handleFormChange('dateFin', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provenance</label>
                      <div className="space-y-2">
                        <select
                          value={formData.provenance}
                          onChange={(e) => handleFormChange('provenance', e.target.value)}
                          className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        >
                          <option value="">Sélectionner une provenance</option>
                          {provenances.map(prov => (
                            <option key={prov} value={prov}>{prov}</option>
                          ))}
                        </select>
                        <button className="text-[#2170E3] hover:text-blue-800 text-sm flex items-center">
                          <LinkIcon className="w-4 h-4 mr-1" />
                          Ajouter une nouvelle provenance
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                      <div className="space-y-2">
                        <select
                          value={formData.categorie}
                          onChange={(e) => handleFormChange('categorie', e.target.value)}
                          className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button className="text-[#2170E3] hover:text-blue-800 text-sm flex items-center">
                          <LinkIcon className="w-4 h-4 mr-1" />
                          Ajouter une nouvelle catégorie
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rapport personnalisé</label>
                      <select
                        value={formData.rapportPersonnalise}
                        onChange={(e) => handleFormChange('rapportPersonnalise', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        <option value="">Aucun</option>
                        {rapportsPersonnalises.map(rapport => (
                          <option key={rapport} value={rapport}>{rapport}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section Fichiers */}
                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fichiers</label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Glisser-déposer des fichiers ici ou 
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload-statistiques"
                        />
                        <label 
                          htmlFor="file-upload-statistiques"
                          className="text-[#2170E3] hover:text-blue-800 ml-1 cursor-pointer"
                        >
                          parcourir
                        </label>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Formats acceptés: PDF, JPG, PNG, DOC (max 10MB)
                      </p>
                    </div>

                    {/* Liste des fichiers ajoutés */}
                    {formData.fichiers.length > 0 && (
                      <div className="space-y-2">
                        {formData.fichiers.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                              <span className="text-sm text-gray-900">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleSubmitForm(true)}
                    disabled={!formData.titre}
                    className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  >
                    Enregistrer et continuer
                  </button>
                  <div className="text-sm text-gray-500">
                    © 2025 Organilog · 
                    <button className="text-[#2170E3] hover:text-blue-800 mx-1">CGU</button>
                    ·
                    <button className="text-[#2170E3] hover:text-blue-800 mx-1">Mentions légales</button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex items-center space-x-1 text-[#2170E3] hover:text-blue-800 text-sm"
                  >
                    <ArrowUpIcon className="w-4 h-4" />
                    <span>Retour en haut</span>
                  </button>
                  <button
                    onClick={() => handleSubmitForm(false)}
                    disabled={!formData.titre}
                    className="px-6 py-2 bg-[#2170E3] text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemandesClientStatistiques;