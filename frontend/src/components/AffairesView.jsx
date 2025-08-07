import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  TagIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ArrowUpIcon,
  DocumentArrowUpIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const AffairesView = () => {
  // États pour la gestion de l'interface
  const [activeTab, setActiveTab] = useState('tout');
  const [showFilters, setShowFilters] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('principal');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedAffaires, setSelectedAffaires] = useState([]);
  const [synthesePeriod, setSynthesePeriod] = useState('30-jours');

  // États pour les blocs collapsibles du formulaire
  const [showSecondaryInfo, setShowSecondaryInfo] = useState(false);
  const [showFiles, setShowFiles] = useState(false);

  // États pour les filtres de date
  const [dateFilters, setDateFilters] = useState({
    dateDebut: '',
    dateFin: ''
  });

  // États pour les filtres avancés
  const [filters, setFilters] = useState({
    numero: '',
    client: '',
    collaborateur: 'all',
    titre: '',
    etape: 'all',
    categorieOffre: 'all',
    groupe: 'all',
    dateReelle: '',
    conclusion: 'all',
    favoris: 'all',
    actif: 'all',
    mission: ''
  });

  // États pour le formulaire d'ajout
  const [formData, setFormData] = useState({
    nomOffre: '',
    client: '',
    collaborateur: '',
    groupe: '',
    etape: '',
    categorieOffre: '',
    conclusion: '',
    dateConclusionAttendue: '',
    montant: '',
    commentaire: '',
    mission: '',
    liens: []
  });

  // Données d'exemple pour les affaires
  const affaires = [
    {
      id: 1,
      numero: 'AF001',
      client: 'ADAGIO OPERA',
      collaborateur: 'Aymeric Tireau',
      titre: 'Aménagement terrasse executive',
      etape: 'Devis envoyé : à relancer',
      categorieOffre: 'Aménagement',
      groupe: 'Hôtellerie',
      montant: 15000.00,
      dateCreation: '15/01/2024',
      conclusion: 'En cours',
      actif: true,
      favoris: false
    },
    {
      id: 2,
      numero: 'AF002',
      client: 'SEPHORA',
      collaborateur: 'Lucie Garcia',
      titre: 'Végétalisation magasin flagship',
      etape: 'RDV pris',
      categorieOffre: 'Retail',
      groupe: 'Cosmétique',
      montant: 28000.00,
      dateCreation: '22/01/2024',
      conclusion: 'En cours',
      actif: true,
      favoris: true
    },
    {
      id: 3,
      numero: 'AF003',
      client: 'SPOTIFY',
      collaborateur: 'David Celeste',
      titre: 'Installation mur végétal bureaux',
      etape: 'Devis en cours',
      categorieOffre: 'Bureaux',
      groupe: 'Tech',
      montant: 12500.00,
      dateCreation: '05/02/2024',
      conclusion: 'Succès',
      actif: false,
      favoris: false
    },
    {
      id: 4,
      numero: 'AF004',
      client: 'HERMES',
      collaborateur: 'Elodie Treveten',
      titre: 'Jardins de façade boutique',
      etape: 'Devis en cours (semaine suivante)',
      categorieOffre: 'Luxe',
      groupe: 'Mode',
      montant: 45000.00,
      dateCreation: '10/02/2024',
      conclusion: 'En cours',
      actif: true,
      favoris: true
    },
    {
      id: 5,
      numero: 'AF005',
      client: 'LYDIA SOLUTIONS',
      collaborateur: 'Estelle Delapierre',
      titre: 'Espaces verts open space',
      etape: 'RDV pris',
      categorieOffre: 'Bureaux',
      groupe: 'Fintech',
      montant: 8500.00,
      dateCreation: '18/02/2024',
      conclusion: 'En cours',
      actif: true,
      favoris: false
    },
    {
      id: 6,
      numero: 'AF006',
      client: 'BEWIZ',
      collaborateur: 'Florence ROGER',
      titre: 'Création jardin suspendu',
      etape: 'En attente longue : prévoir une relance',
      categorieOffre: 'Innovation',
      groupe: 'Tech',
      montant: 22000.00,
      dateCreation: '25/02/2024',
      conclusion: 'Perte',
      actif: false,
      favoris: false
    },
    {
      id: 7,
      numero: 'AF007',
      client: 'CLAREO',
      collaborateur: 'Marine Sandoz',
      titre: 'Aménagement hall d\'accueil',
      etape: 'Devis 2 : à relancer',
      categorieOffre: 'Aménagement',
      groupe: 'Conseil',
      montant: 9800.00,
      dateCreation: '03/03/2024',
      conclusion: 'En cours',
      actif: true,
      favoris: false
    },
    {
      id: 8,
      numero: 'AF008',
      client: 'AAREAL BANK',
      collaborateur: 'Simon Henry',
      titre: 'Terrasse végétalisée siège',
      etape: 'Devis en cours',
      categorieOffre: 'Bureaux',
      groupe: 'Finance',
      montant: 35000.00,
      dateCreation: '12/03/2024',
      conclusion: 'Succès',
      actif: false,
      favoris: true
    },
    {
      id: 9,
      numero: 'AF009',
      client: 'BERENBERG BANK',
      collaborateur: 'Aymeric Tireau',
      titre: 'Jardins intérieurs agence',
      etape: 'RDV pris',
      categorieOffre: 'Finance',
      groupe: 'Finance',
      montant: 18500.00,
      dateCreation: '20/03/2024',
      conclusion: 'En cours',
      actif: true,
      favoris: false
    },
    {
      id: 10,
      numero: 'AF010',
      client: 'AQUILAE GESTION',
      collaborateur: 'Lucie Garcia',
      titre: 'Espaces communs résidence',
      etape: 'Devis envoyé : à relancer',
      categorieOffre: 'Immobilier',
      groupe: 'Gestion',
      montant: 42000.00,
      dateCreation: '28/03/2024',
      conclusion: 'En cours',
      actif: true,
      favoris: true
    }
  ];

  // Données pour les graphiques de synthèse
  const performanceData = [
    { mois: 'Jan', ventes: 120000, objectif: 100000 },
    { mois: 'Fév', ventes: 150000, objectif: 120000 },
    { mois: 'Mar', ventes: 180000, objectif: 140000 },
    { mois: 'Avr', ventes: 160000, objectif: 160000 },
    { mois: 'Mai', ventes: 200000, objectif: 180000 },
    { mois: 'Juin', ventes: 220000, objectif: 200000 }
  ];

  const repartitionData = [
    { name: 'Gagnées', value: 35, color: '#10B981' },
    { name: 'En cours', value: 45, color: '#F59E0B' },
    { name: 'Perdues', value: 20, color: '#EF4444' }
  ];

  const etapeData = [
    { etape: 'RDV pris', nombre: 15 },
    { etape: 'Devis en cours', nombre: 12 },
    { etape: 'Devis envoyé : à relancer', nombre: 18 },
    { etape: 'Devis 2 : à relancer', nombre: 8 },
    { etape: 'En attente longue : prévoir une relance', nombre: 5 },
    { etape: 'Devis en cours (semaine suivante)', nombre: 3 }
  ];

  const clients = ['ADAGIO OPERA', 'SEPHORA', 'SPOTIFY', 'HERMES', 'LYDIA SOLUTIONS', 'BEWIZ', 'CLAREO', 'AAREAL BANK', 'BERENBERG BANK', 'AQUILAE GESTION'];
  const collaborateurs = [
    'Aymeric Tireau',
    'David Celeste', 
    'Elodie Treveten',
    'Estelle Delapierre',
    'Florence ROGER',
    'Lucie Garcia',
    'Marine Sandoz',
    'Simon Henry'
  ];
  const etapes = [
    'RDV pris',
    'Devis en cours',
    'Devis envoyé : à relancer',
    'Devis 2 : à relancer', 
    'En attente longue : prévoir une relance',
    'Devis en cours (semaine suivante)'
  ];
  const conclusions = [
    'Succès',
    'Perte'
  ];
  const categoriesOffre = ['Aménagement', 'Retail', 'Bureaux', 'Luxe', 'Innovation', 'Finance', 'Immobilier'];
  const groupes = ['Hôtellerie', 'Cosmétique', 'Tech', 'Mode', 'Fintech', 'Conseil', 'Finance', 'Gestion'];

  // Fonctions utilitaires
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAffaires(affaires.map(affaire => affaire.id));
    } else {
      setSelectedAffaires([]);
    }
  };

  const handleSelectAffaire = (id, checked) => {
    if (checked) {
      setSelectedAffaires([...selectedAffaires, id]);
    } else {
      setSelectedAffaires(selectedAffaires.filter(affaireId => affaireId !== id));
    }
  };

  const applyDateShortcut = (shortcut) => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    switch (shortcut) {
      case 'hier':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        setDateFilters({
          dateDebut: formatDate(yesterday),
          dateFin: formatDate(yesterday)
        });
        break;
      case 'aujourd\'hui':
        setDateFilters({
          dateDebut: formatDate(today),
          dateFin: formatDate(today)
        });
        break;
      case '7-jours':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        setDateFilters({
          dateDebut: formatDate(sevenDaysAgo),
          dateFin: formatDate(today)
        });
        break;
      case 'mois-courant':
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setDateFilters({
          dateDebut: formatDate(firstDay),
          dateFin: formatDate(lastDay)
        });
        break;
      default:
        break;
    }
  };

  // Composant Pop-up Sélecteur de date
  const DatePickerModal = () => (
    <AnimatePresence>
      {showDatePicker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sélectionner une période
                </h3>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Du</label>
                      <input
                        type="date"
                        value={dateFilters.dateDebut}
                        onChange={(e) => setDateFilters(prev => ({ ...prev, dateDebut: e.target.value }))}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Au</label>
                      <input
                        type="date"
                        value={dateFilters.dateFin}
                        onChange={(e) => setDateFilters(prev => ({ ...prev, dateFin: e.target.value }))}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <button
                      onClick={() => {
                        console.log('Filtrer par dates:', dateFilters);
                        setShowDatePicker(false);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Filtrer
                    </button>
                    <button
                      onClick={() => {
                        setDateFilters({ dateDebut: '', dateFin: '' });
                        setShowDatePicker(false);
                      }}
                      className="text-[#2170E3] hover:text-blue-800 text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Raccourcis</h4>
                  <div className="space-y-1">
                    {[
                      { key: 'hier', label: 'Hier' },
                      { key: 'aujourd\'hui', label: 'Aujourd\'hui' },
                      { key: '7-jours', label: '7 derniers jours' },
                      { key: 'mois-courant', label: 'Mois courant' }
                    ].map((shortcut) => (
                      <button
                        key={shortcut.key}
                        onClick={() => applyDateShortcut(shortcut.key)}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        {shortcut.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Composant Panneau de filtres
  const FiltersPanel = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex space-x-8 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveFilterTab('principal')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeFilterTab === 'principal'
                    ? 'border-[#2170E3] text-[#2170E3]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Champs principaux
              </button>
              <button
                onClick={() => setActiveFilterTab('personnalises')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeFilterTab === 'personnalises'
                    ? 'border-[#2170E3] text-[#2170E3]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Champs personnalisés
              </button>
            </div>

            {activeFilterTab === 'principal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">N°</label>
                  <input
                    type="number"
                    value={filters.numero}
                    onChange={(e) => setFilters(prev => ({ ...prev, numero: e.target.value }))}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <select
                    value={filters.client}
                    onChange={(e) => setFilters(prev => ({ ...prev, client: e.target.value }))}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="">Tous les clients</option>
                    {clients.map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Collaborateur</label>
                  <select
                    value={filters.collaborateur}
                    onChange={(e) => setFilters(prev => ({ ...prev, collaborateur: e.target.value }))}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    {collaborateurs.map(collab => (
                      <option key={collab} value={collab}>{collab}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                  <input
                    type="text"
                    value={filters.titre}
                    onChange={(e) => setFilters(prev => ({ ...prev, titre: e.target.value }))}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Étape</label>
                  <select
                    value={filters.etape}
                    onChange={(e) => setFilters(prev => ({ ...prev, etape: e.target.value }))}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Toutes</option>
                    {etapes.map(etape => (
                      <option key={etape} value={etape}>{etape}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie de l'offre</label>
                  <select
                    value={filters.categorieOffre}
                    onChange={(e) => setFilters(prev => ({ ...prev, categorieOffre: e.target.value }))}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Toutes</option>
                    {categoriesOffre.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeFilterTab === 'personnalises' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
                  <input
                    type="text"
                    value={filters.mission}
                    onChange={(e) => setFilters(prev => ({ ...prev, mission: e.target.value }))}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setFilters({
                  numero: '',
                  client: '',
                  collaborateur: 'all',
                  titre: '',
                  etape: 'all',
                  categorieOffre: 'all',
                  groupe: 'all',
                  dateReelle: '',
                  conclusion: 'all',
                  favoris: 'all',
                  actif: 'all',
                  mission: ''
                })}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Annuler ces filtres
              </button>
              <div className="flex space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Enregistrer ce filtre
                </button>
                <button className="px-4 py-2 bg-[#2170E3] text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Chercher
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Composant Tableau des affaires
  const AffairesTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-[#2170E3] focus:ring-[#2170E3]"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('numero')}
              >
                <div className="flex items-center space-x-1">
                  <span>N°</span>
                  {sortColumn === 'numero' && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collaborateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Étape
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie de l'offre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Groupe
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('montant')}
              >
                <div className="flex items-center space-x-1">
                  <span>Montant</span>
                  {sortColumn === 'montant' && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {affaires.map((affaire, index) => (
              <motion.tr
                key={affaire.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedAffaires.includes(affaire.id)}
                    onChange={(e) => handleSelectAffaire(affaire.id, e.target.checked)}
                    className="rounded border-gray-300 text-[#2170E3] focus:ring-[#2170E3]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {affaire.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-[#2170E3] hover:text-blue-800 hover:underline">
                    {affaire.client}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {affaire.collaborateur}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {affaire.titre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    affaire.etape === 'RDV pris' ? 'bg-blue-100 text-blue-800' :
                    affaire.etape === 'Devis en cours' ? 'bg-yellow-100 text-yellow-800' :
                    affaire.etape === 'Devis envoyé : à relancer' ? 'bg-orange-100 text-orange-800' :
                    affaire.etape === 'Devis 2 : à relancer' ? 'bg-orange-100 text-orange-800' :
                    affaire.etape === 'En attente longue : prévoir une relance' ? 'bg-red-100 text-red-800' :
                    affaire.etape === 'Devis en cours (semaine suivante)' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {affaire.etape}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {affaire.categorieOffre}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {affaire.groupe}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  {formatPrice(affaire.montant)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-[#2170E3] hover:text-blue-900"
                      title="Voir l'affaire"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
                      title="Modifier l'affaire"
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

  // Composant Synthèse
  const SyntheseView = () => (
    <div className="space-y-6">
      {/* Sélecteur de période */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Synthèse des affaires</h3>
        <select
          value={synthesePeriod}
          onChange={(e) => setSynthesePeriod(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
        >
          <option value="7-jours">7 derniers jours</option>
          <option value="30-jours">30 derniers jours</option>
          <option value="3-mois">3 derniers mois</option>
          <option value="6-mois">6 derniers mois</option>
          <option value="annee">Cette année</option>
        </select>
      </div>

      {/* Cartes de répartition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Total Affaires</h4>
          <p className="text-3xl font-bold text-gray-900">847</p>
          <p className="text-sm text-green-600 mt-1">+12% vs période précédente</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Succès</h4>
          <p className="text-3xl font-bold text-green-600">296</p>
          <p className="text-sm text-green-600 mt-1">35% de taux de conversion</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Perdues</h4>
          <p className="text-3xl font-bold text-red-600">169</p>
          <p className="text-sm text-red-600 mt-1">20% du total</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip formatter={(value) => formatPrice(value)} />
              <Line type="monotone" dataKey="ventes" stroke="#2170E3" strokeWidth={2} />
              <Line type="monotone" dataKey="objectif" stroke="#94A3B8" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Diagramme circulaire */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Répartition par statut</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={repartitionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({name, value}) => `${name}: ${value}%`}
              >
                {repartitionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique Potentiel par étape */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Potentiel par étape</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={etapeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="etape" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="nombre" fill="#2170E3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table des 10 dernières offres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">10 dernières offres</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étape</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {affaires.slice(0, 10).map((affaire) => (
                <tr key={affaire.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affaire.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{affaire.titre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      affaire.etape === 'RDV pris' ? 'bg-blue-100 text-blue-800' :
                      affaire.etape === 'Devis en cours' ? 'bg-yellow-100 text-yellow-800' :
                      affaire.etape === 'Devis envoyé : à relancer' ? 'bg-orange-100 text-orange-800' :
                      affaire.etape === 'Devis 2 : à relancer' ? 'bg-orange-100 text-orange-800' :
                      affaire.etape === 'En attente longue : prévoir une relance' ? 'bg-red-100 text-red-800' :
                      affaire.etape === 'Devis en cours (semaine suivante)' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {affaire.etape}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatPrice(affaire.montant)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{affaire.dateCreation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Composant Formulaire d'ajout
  const AddAffaireForm = () => (
    <AnimatePresence>
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      console.log('Enregistrer affaire:', formData);
                      setShowAddForm(false);
                    }}
                    disabled={!formData.nomOffre || !formData.client}
                    className="inline-flex items-center px-4 py-2 bg-[#2170E3] text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Enregistrer
                  </button>
                  <nav className="text-sm text-gray-500">
                    Affaires &gt; Ajouter une affaire
                  </nav>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Bloc Données */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Données</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de l'offre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nomOffre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nomOffre: e.target.value }))}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <select
                          value={formData.client}
                          onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                          className="flex-1 border border-gray-200 rounded-l p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                          required
                        >
                          <option value="">Sélectionner un client</option>
                          {clients.map(client => (
                            <option key={client} value={client}>{client}</option>
                          ))}
                        </select>
                        <button className="px-3 py-2 bg-[#2170E3] text-white border border-l-0 border-[#2170E3] rounded-r hover:bg-blue-700">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Collaborateur</label>
                      <select
                        value={formData.collaborateur}
                        onChange={(e) => setFormData(prev => ({ ...prev, collaborateur: e.target.value }))}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        <option value="">Sélectionner</option>
                        {collaborateurs.map(collab => (
                          <option key={collab} value={collab}>{collab}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Groupe</label>
                      <div className="flex">
                        <select
                          value={formData.groupe}
                          onChange={(e) => setFormData(prev => ({ ...prev, groupe: e.target.value }))}
                          className="flex-1 border border-gray-200 rounded-l p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        >
                          <option value="">Sélectionner</option>
                          {groupes.map(groupe => (
                            <option key={groupe} value={groupe}>{groupe}</option>
                          ))}
                        </select>
                        <button className="px-3 py-2 bg-gray-100 text-gray-600 border border-l-0 border-gray-200 rounded-r hover:bg-gray-200">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Étape</label>
                      <div className="flex">
                        <select
                          value={formData.etape}
                          onChange={(e) => setFormData(prev => ({ ...prev, etape: e.target.value }))}
                          className="flex-1 border border-gray-200 rounded-l p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        >
                          <option value="">Sélectionner</option>
                          {etapes.map(etape => (
                            <option key={etape} value={etape}>{etape}</option>
                          ))}
                        </select>
                        <button className="px-3 py-2 bg-gray-100 text-gray-600 border border-l-0 border-gray-200 rounded-r hover:bg-gray-200">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie de l'offre</label>
                      <div className="flex">
                        <select
                          value={formData.categorieOffre}
                          onChange={(e) => setFormData(prev => ({ ...prev, categorieOffre: e.target.value }))}
                          className="flex-1 border border-gray-200 rounded-l p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        >
                          <option value="">Sélectionner</option>
                          {categoriesOffre.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button className="px-3 py-2 bg-gray-100 text-gray-600 border border-l-0 border-gray-200 rounded-r hover:bg-gray-200">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Conclusion</label>
                      <select
                        value={formData.conclusion}
                        onChange={(e) => setFormData(prev => ({ ...prev, conclusion: e.target.value }))}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        <option value="">Sélectionner</option>
                        <option value="En cours">En cours</option>
                        {conclusions.map(conclusion => (
                          <option key={conclusion} value={conclusion}>{conclusion}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de conclusion attendue</label>
                      <input
                        type="date"
                        value={formData.dateConclusionAttendue}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateConclusionAttendue: e.target.value }))}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.montant}
                        onChange={(e) => setFormData(prev => ({ ...prev, montant: e.target.value }))}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Liens vers devis et autres factures</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Ajouter un lien..."
                        className="flex-1 border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                      <button className="px-3 py-2 bg-[#2170E3] text-white rounded hover:bg-blue-700">
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                    <textarea
                      rows={4}
                      value={formData.commentaire}
                      onChange={(e) => setFormData(prev => ({ ...prev, commentaire: e.target.value }))}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      placeholder="Informations complémentaires..."
                    />
                  </div>
                </div>
              </div>

              {/* Bloc Informations secondaires */}
              <div className="mb-8">
                <button
                  onClick={() => setShowSecondaryInfo(!showSecondaryInfo)}
                  className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4 hover:text-blue-600"
                >
                  <span>Informations secondaires</span>
                  <ChevronDownIcon className={`w-5 h-5 transition-transform ${showSecondaryInfo ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showSecondaryInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
                        <input
                          type="text"
                          value={formData.mission}
                          onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                          className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                          placeholder="Description de la mission..."
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bloc Fichiers */}
              <div className="mb-8">
                <button
                  onClick={() => setShowFiles(!showFiles)}
                  className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4 hover:text-blue-600"
                >
                  <span>Fichiers</span>
                  <ChevronDownIcon className={`w-5 h-5 transition-transform ${showFiles ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showFiles && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ajouter un fichier</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-4 text-sm text-gray-600">
                            Glisser-déposer des fichiers ici ou 
                            <button className="text-[#2170E3] hover:text-blue-800 ml-1">parcourir</button>
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Formats acceptés: PDF, JPG, PNG, DOC (max 10MB)
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  console.log('Enregistrer affaire:', formData);
                  setShowAddForm(false);
                }}
                disabled={!formData.nomOffre || !formData.client}
                className="px-6 py-2 bg-[#2170E3] text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="p-6">
      {/* En-tête avec boutons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-[#2170E3] text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Ajouter une affaire
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDatePicker(true)}
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {dateFilters.dateDebut || dateFilters.dateFin 
              ? `${dateFilters.dateDebut || '...'} – ${dateFilters.dateFin || '...'}`
              : 'date min. – date max.'
            }
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filtres
          </motion.button>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
            <TagIcon className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('tout')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tout'
                  ? 'border-[#2170E3] text-[#2170E3]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => setActiveTab('synthese')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'synthese'
                  ? 'border-[#2170E3] text-[#2170E3]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Synthèse
            </button>
          </nav>
        </div>
      </div>

      {/* Indicateur de sélection */}
      {selectedAffaires.length > 0 && activeTab === 'tout' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {selectedAffaires.length} affaire(s) sélectionnée(s)
          </p>
        </div>
      )}

      {/* Panneau de filtres */}
      <FiltersPanel />

      {/* Contenu des onglets */}
      {activeTab === 'tout' ? (
        <>
          <AffairesTable />
          
          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between rounded-b-lg">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page précédente">
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              
              <div className="flex space-x-1">
                <button className="px-3 py-1 text-sm rounded bg-[#2170E3] text-white">1</button>
                <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">2</button>
                <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">3</button>
                <span className="px-2 py-1 text-sm text-gray-500">...</span>
                <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">27</button>
                <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">28</button>
                <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">29</button>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page suivante">
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-sm text-gray-700">
              847 résultats
            </div>
          </div>
        </>
      ) : (
        <SyntheseView />
      )}

      {/* Footer */}
      <footer className="mt-8 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            © 2025 Organilog · 
            <button className="text-[#2170E3] hover:text-blue-800 mx-1">CGU</button>
            ·
            <button className="text-[#2170E3] hover:text-blue-800 mx-1">Mentions légales</button>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-1 text-[#2170E3] hover:text-blue-800 text-sm"
          >
            <ArrowUpIcon className="w-4 h-4" />
            <span>Retour en haut</span>
          </button>
        </div>
      </footer>

      {/* Modales */}
      <DatePickerModal />
      <AddAffaireForm />
    </div>
  );
};

export default AffairesView;