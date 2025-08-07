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
  TagIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ArrowUpIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon as ClockPendingIcon
} from '@heroicons/react/24/outline';

const DemandesClientTableauDeBord = () => {
  // États pour la gestion de l'interface
  const [activeTab, setActiveTab] = useState('Tout');
  const [showFilters, setShowFilters] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('principal');
  const [activeFormTab, setActiveFormTab] = useState('donnees');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedDemandes, setSelectedDemandes] = useState([]);

  // États pour les filtres de date
  const [dateType, setDateType] = useState('debut');
  const [dateFilters, setDateFilters] = useState({
    dateDebut: '',
    dateFin: ''
  });

  // États pour les filtres
  const [filters, setFilters] = useState({
    numero: '',
    libelle: '',
    client: '',
    assignation: '',
    equipe: '',
    statut: 'all',
    priorite: 'all',
    emailDemandeur: '',
    favoris: 'all',
    actif: 'all',
    auteur: '',
    categorie: '',
    provenanceTicket: '',
    interventions: 'all',
    reponses: 'all',
    typeActivite: '',
    rapportEnvoye: 'all',
    accuseReceptionEnvoye: 'all',
    contrats: 'all'
  });

  // États pour le formulaire d'ajout
  const [formData, setFormData] = useState({
    libelle: '',
    client: '',
    priorite: 'Normal',
    statut: 'Nouveau',
    assignation: '',
    contrat: '',
    equipe: '',
    dateDebut: '',
    heureDebut: '',
    dateFin: '',
    heureFin: '',
    emailDemandeur: '',
    favoris: 'non',
    actif: 'oui',
    auteur: '',
    categorie: '',
    provenanceTicket: 'Autre',
    interventions: 'non',
    reponses: 'non',
    typeActivite: '',
    rapportEnvoye: 'non',
    accuseReceptionEnvoye: 'non',
    contrats: 'non'
  });

  // Données d'exemple pour les demandes client
  const demandesData = [
    {
      id: 1,
      numero: 'DC001',
      titre: 'Problème d\'arrosage automatique',
      statut: 'En cours',
      priorite: 'Haut',
      client: 'ADAGIO OPERA',
      dateDebut: '09/07/2025 09:00',
      dateFin: '09/07/2025 17:00',
      dateClôture: null,
      assignation: 'Aymeric Tireau',
      emailDemandeur: 'marie.dubois@adagio-opera.fr',
      actif: true,
      couleurLigne: 'yellow'
    },
    {
      id: 2,
      numero: 'DC002',
      titre: 'Remplacement plantes mortes',
      statut: 'Résolu',
      priorite: 'Normal',
      client: 'SEPHORA',
      dateDebut: '08/07/2025 14:00',
      dateFin: '08/07/2025 16:00',
      dateClôture: '08/07/2025 15:30',
      assignation: 'Lucie Garcia',
      emailDemandeur: 'facilities@sephora.fr',
      actif: true,
      couleurLigne: 'green'
    },
    {
      id: 3,
      numero: 'DC003',
      titre: 'Installation urgente mur végétal',
      statut: 'Nouveau',
      priorite: 'Immédiat',
      client: 'SPOTIFY',
      dateDebut: '10/07/2025 08:00',
      dateFin: '10/07/2025 18:00',
      dateClôture: null,
      assignation: 'David Celeste',
      emailDemandeur: 'office@spotify.com',
      actif: true,
      couleurLigne: 'red'
    },
    {
      id: 4,
      numero: 'DC004',
      titre: 'Entretien mensuel espaces verts',
      statut: 'En cours',
      priorite: 'Normal',
      client: 'HERMES',
      dateDebut: '11/07/2025 10:00',
      dateFin: '11/07/2025 15:00',
      dateClôture: null,
      assignation: 'Elodie Treveten',
      emailDemandeur: 'garden@hermes.com',
      actif: true,
      couleurLigne: 'none'
    },
    {
      id: 5,
      numero: 'DC005',
      titre: 'Diagnostic parasites plantes',
      statut: 'Résolu',
      priorite: 'Haut',
      client: 'LYDIA SOLUTIONS',
      dateDebut: '07/07/2025 13:00',
      dateFin: '07/07/2025 17:00',
      dateClôture: '07/07/2025 16:45',
      assignation: 'Estelle Delapierre',
      emailDemandeur: 'support@lydia-app.com',
      actif: true,
      couleurLigne: 'green'
    }
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
  const contrats = [
    'N°240',
    'N°278',
    'N°261',
    'N°276 : Aléa',
    'N°271 : B-CE Euro Ariane',
    'N°270 : B-CE New Flag',
    'N°204 : CE – My Flex Office'
  ];
  const equipes = ['Équipe Entretien', 'Équipe Installation', 'Équipe Support', 'Équipe Commercial'];
  const priorites = ['Faible', 'Normal', 'Haut', 'Urgent', 'Immédiat'];
  const statuts = ['Nouveau', 'En cours', 'Attente de réponse', 'Résolu', 'Fermé', 'Rejeté'];
  const categories = ['Entretien', 'Installation', 'Dépannage', 'Conseil', 'Urgence'];
  const provenancesTicket = ['Autre', 'En personne', 'Par email', 'Par téléphone'];

  // Filtrer les demandes selon l'onglet actif
  const getFilteredDemandes = () => {
    let filtered = demandesData;
    
    switch (activeTab) {
      case 'Ouverts':
        filtered = demandesData.filter(d => d.statut !== 'Résolu' && d.statut !== 'Fermé');
        break;
      case 'Clôturés':
        filtered = demandesData.filter(d => d.statut === 'Résolu' || d.statut === 'Fermé');
        break;
      default:
        filtered = demandesData;
    }
    
    return filtered;
  };

  const filteredDemandes = getFilteredDemandes();

  // Fonctions utilitaires
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
      setSelectedDemandes(filteredDemandes.map(demande => demande.id));
    } else {
      setSelectedDemandes([]);
    }
  };

  const handleSelectDemande = (id, checked) => {
    if (checked) {
      setSelectedDemandes([...selectedDemandes, id]);
    } else {
      setSelectedDemandes(selectedDemandes.filter(demandeId => demandeId !== id));
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDateFilterChange = (field, value) => {
    setDateFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      numero: '',
      libelle: '',
      client: '',
      assignation: '',
      equipe: '',
      statut: 'all',
      priorite: 'all',
      emailDemandeur: '',
      favoris: 'all',
      actif: 'all',
      auteur: '',
      categorie: '',
      provenanceTicket: '',
      interventions: 'all',
      reponses: 'all',
      typeActivite: '',
      rapportEnvoye: 'all',
      accuseReceptionEnvoye: 'all',
      contrats: 'all'
    });
  };

  const resetDateFilters = () => {
    setDateFilters({
      dateDebut: '',
      dateFin: ''
    });
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
      case 'demain':
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        setDateFilters({
          dateDebut: formatDate(tomorrow),
          dateFin: formatDate(tomorrow)
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
      case '14-jours':
        const fourteenDaysAgo = new Date(today);
        fourteenDaysAgo.setDate(today.getDate() - 14);
        setDateFilters({
          dateDebut: formatDate(fourteenDaysAgo),
          dateFin: formatDate(today)
        });
        break;
      case '30-jours':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        setDateFilters({
          dateDebut: formatDate(thirtyDaysAgo),
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
      case 'mois-precedent':
        const firstDayPrev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayPrev = new Date(today.getFullYear(), today.getMonth(), 0);
        setDateFilters({
          dateDebut: formatDate(firstDayPrev),
          dateFin: formatDate(lastDayPrev)
        });
        break;
      case 'mois-suivant':
        const firstDayNext = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const lastDayNext = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        setDateFilters({
          dateDebut: formatDate(firstDayNext),
          dateFin: formatDate(lastDayNext)
        });
        break;
      case 'annee-precedente':
        const firstDayPrevYear = new Date(today.getFullYear() - 1, 0, 1);
        const lastDayPrevYear = new Date(today.getFullYear() - 1, 11, 31);
        setDateFilters({
          dateDebut: formatDate(firstDayPrevYear),
          dateFin: formatDate(lastDayPrevYear)
        });
        break;
      case 'annee-cours':
        const firstDayYear = new Date(today.getFullYear(), 0, 1);
        const lastDayYear = new Date(today.getFullYear(), 11, 31);
        setDateFilters({
          dateDebut: formatDate(firstDayYear),
          dateFin: formatDate(lastDayYear)
        });
        break;
      case 'depuis-toujours':
        setDateFilters({
          dateDebut: '',
          dateFin: ''
        });
        break;
      default:
        break;
    }
  };

  const handleSubmitForm = () => {
    console.log('Enregistrer demande client:', formData);
    setShowAddForm(false);
    // Réinitialiser le formulaire
    setFormData({
      libelle: '',
      client: '',
      priorite: 'Normal',
      statut: 'Nouveau',
      assignation: '',
      contrat: '',
      equipe: '',
      dateDebut: '',
      heureDebut: '',
      dateFin: '',
      heureFin: '',
      emailDemandeur: '',
      favoris: 'non',
      actif: 'oui',
      auteur: '',
      categorie: '',
      provenanceTicket: 'Autre',
      interventions: 'non',
      reponses: 'non',
      typeActivite: '',
      rapportEnvoye: 'non',
      accuseReceptionEnvoye: 'non',
      contrats: 'non'
    });
  };

  const getPriorityBadge = (priorite) => {
    const colors = {
      'Faible': 'bg-green-100 text-green-800 border-green-200',
      'Normal': 'bg-gray-100 text-gray-800 border-gray-200',
      'Haut': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Urgent': 'bg-orange-100 text-orange-800 border-orange-200',
      'Immédiat': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priorite] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusBadge = (statut) => {
    const colors = {
      'Nouveau': 'bg-blue-100 text-blue-800 border-blue-200',
      'Ouvert': 'bg-purple-100 text-purple-800 border-purple-200',
      'En cours': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Résolu': 'bg-green-100 text-green-800 border-green-200',
      'Clôturé': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRowColor = (couleur) => {
    switch (couleur) {
      case 'red': return 'bg-red-50';
      case 'green': return 'bg-green-50';
      case 'yellow': return 'bg-yellow-50';
      default: return '';
    }
  };

  // Composant Sélecteur de date
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
                  Sélecteur de date
                </h3>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Radio buttons pour le type de date */}
                <div className="md:col-span-3 mb-4">
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="dateType"
                        value="debut"
                        checked={dateType === 'debut'}
                        onChange={(e) => setDateType(e.target.value)}
                        className="mr-2 text-[#2170E3] focus:ring-[#2170E3]"
                      />
                      Date de début
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="dateType"
                        value="fin"
                        checked={dateType === 'fin'}
                        onChange={(e) => setDateType(e.target.value)}
                        className="mr-2 text-[#2170E3] focus:ring-[#2170E3]"
                      />
                      Date de fin
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="dateType"
                        value="cloture"
                        checked={dateType === 'cloture'}
                        onChange={(e) => setDateType(e.target.value)}
                        className="mr-2 text-[#2170E3] focus:ring-[#2170E3]"
                      />
                      Date de clôture (si applicable)
                    </label>
                  </div>
                </div>

                {/* Champs de date */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Du</label>
                      <input
                        type="date"
                        value={dateFilters.dateDebut}
                        onChange={(e) => handleDateFilterChange('dateDebut', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Au</label>
                      <input
                        type="date"
                        value={dateFilters.dateFin}
                        onChange={(e) => handleDateFilterChange('dateFin', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <button
                      onClick={() => {
                        console.log('Filtrer par dates:', dateFilters, 'Type:', dateType);
                        setShowDatePicker(false);
                      }}
                      className="px-4 py-2 bg-[#2170E3] text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Filtrer
                    </button>
                    <button
                      onClick={() => {
                        resetDateFilters();
                        setShowDatePicker(false);
                      }}
                      className="text-[#2170E3] hover:text-blue-800 text-sm"
                    >
                      Annuler ces filtres
                    </button>
                  </div>
                </div>

                {/* Raccourcis */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Raccourcis</h4>
                  <div className="space-y-1">
                    {[
                      { key: 'hier', label: 'Hier' },
                      { key: 'aujourd\'hui', label: 'Aujourd\'hui' },
                      { key: 'demain', label: 'Demain' },
                      { key: '7-jours', label: '7 derniers jours' },
                      { key: '14-jours', label: '14 derniers jours' },
                      { key: '30-jours', label: '30 derniers jours' },
                      { key: 'mois-courant', label: 'Mois courant' },
                      { key: 'mois-precedent', label: 'Mois précédent' },
                      { key: 'mois-suivant', label: 'Mois suivant' },
                      { key: 'annee-precedente', label: 'Année précédente' },
                      { key: 'annee-cours', label: 'Année en cours' },
                      { key: 'depuis-toujours', label: 'Depuis toujours' }
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
            {/* Onglets des filtres */}
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
                onClick={() => setActiveFilterTab('secondaires')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeFilterTab === 'secondaires'
                    ? 'border-[#2170E3] text-[#2170E3]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Champs secondaires
              </button>
            </div>

            {/* Champs principaux */}
            {activeFilterTab === 'principal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">N°</label>
                  <input
                    type="number"
                    value={filters.numero}
                    onChange={(e) => handleFilterChange('numero', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Libellé</label>
                  <input
                    type="text"
                    value={filters.libelle}
                    onChange={(e) => handleFilterChange('libelle', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <select
                    value={filters.client}
                    onChange={(e) => handleFilterChange('client', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="">Tous les clients</option>
                    {clients.map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignation</label>
                  <select
                    value={filters.assignation}
                    onChange={(e) => handleFilterChange('assignation', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="">Tous</option>
                    {collaborateurs.map(collab => (
                      <option key={collab} value={collab}>{collab}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Équipe</label>
                  <select
                    value={filters.equipe}
                    onChange={(e) => handleFilterChange('equipe', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="">Toutes</option>
                    {equipes.map(equipe => (
                      <option key={equipe} value={equipe}>{equipe}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={filters.statut}
                    onChange={(e) => handleFilterChange('statut', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    {statuts.map(statut => (
                      <option key={statut} value={statut}>{statut}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                  <select
                    value={filters.priorite}
                    onChange={(e) => handleFilterChange('priorite', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Toutes</option>
                    {priorites.map(priorite => (
                      <option key={priorite} value={priorite}>{priorite}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email du demandeur</label>
                  <input
                    type="email"
                    value={filters.emailDemandeur}
                    onChange={(e) => handleFilterChange('emailDemandeur', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Favoris ?</label>
                  <select
                    value={filters.favoris}
                    onChange={(e) => handleFilterChange('favoris', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actif ?</label>
                  <select
                    value={filters.actif}
                    onChange={(e) => handleFilterChange('actif', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
              </div>
            )}

            {/* Champs secondaires */}
            {activeFilterTab === 'secondaires' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
                  <select
                    value={filters.auteur}
                    onChange={(e) => handleFilterChange('auteur', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="">Tous</option>
                    {collaborateurs.map(collab => (
                      <option key={collab} value={collab}>{collab}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={filters.categorie}
                    onChange={(e) => handleFilterChange('categorie', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="">Toutes</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provenance de ticket</label>
                  <select
                    value={filters.provenanceTicket}
                    onChange={(e) => handleFilterChange('provenanceTicket', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="">Toutes</option>
                    {provenancesTicket.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interventions ?</label>
                  <select
                    value={filters.interventions}
                    onChange={(e) => handleFilterChange('interventions', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Réponses ?</label>
                  <select
                    value={filters.reponses}
                    onChange={(e) => handleFilterChange('reponses', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type d'activité</label>
                  <input
                    type="text"
                    value={filters.typeActivite}
                    onChange={(e) => handleFilterChange('typeActivite', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rapport envoyé ?</label>
                  <select
                    value={filters.rapportEnvoye}
                    onChange={(e) => handleFilterChange('rapportEnvoye', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accusé de réception envoyé ?</label>
                  <select
                    value={filters.accuseReceptionEnvoye}
                    onChange={(e) => handleFilterChange('accuseReceptionEnvoye', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contrats ?</label>
                  <select
                    value={filters.contrats}
                    onChange={(e) => handleFilterChange('contrats', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
              </div>
            )}

            {/* Actions des filtres */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={resetFilters}
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

  // Composant Tableau des demandes
  const DemandesTable = () => (
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
                Titre + Statut + Priorité
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('client')}
              >
                <div className="flex items-center space-x-1">
                  <span>Client</span>
                  {sortColumn === 'client' && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date/heure de début/fin
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDemandes.map((demande, index) => (
              <motion.tr
                key={demande.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`hover:bg-gray-50 ${getRowColor(demande.couleurLigne)}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedDemandes.includes(demande.id)}
                    onChange={(e) => handleSelectDemande(demande.id, e.target.checked)}
                    className="rounded border-gray-300 text-[#2170E3] focus:ring-[#2170E3]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {demande.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900">{demande.titre}</p>
                    <div className="flex space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(demande.statut)}`}>
                        {demande.statut}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(demande.priorite)}`}>
                        {demande.priorite}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-[#2170E3] hover:text-blue-800 hover:underline">
                    {demande.client}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span>Début: {demande.dateDebut}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span>Fin: {demande.dateFin}</span>
                    </div>
                    {demande.dateClôture && (
                      <div className="flex items-center space-x-1">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Clôturé: {demande.dateClôture}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-[#2170E3] hover:text-blue-900"
                      title="Voir la demande"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
                      title="Modifier la demande"
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

  // Composant Formulaire d'ajout
  const AddDemandeForm = () => (
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
                    onClick={handleSubmitForm}
                    disabled={!formData.libelle || !formData.client}
                    className="inline-flex items-center px-4 py-2 bg-[#2170E3] text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Enregistrer
                  </button>
                  <nav className="text-sm text-gray-500">
                    Demandes client &gt; Ajouter une demande client
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
              {/* Onglets du formulaire */}
              <div className="flex space-x-8 border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveFormTab('donnees')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeFormTab === 'donnees'
                      ? 'border-[#2170E3] text-[#2170E3]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Données principales
                </button>
                <button
                  onClick={() => setActiveFormTab('secondaires')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeFormTab === 'secondaires'
                      ? 'border-[#2170E3] text-[#2170E3]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Informations secondaires
                </button>
              </div>

              {/* Données principales */}
              {activeFormTab === 'donnees' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Libellé <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.libelle}
                      onChange={(e) => handleFormChange('libelle', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <button className="px-3 py-2 border border-gray-200 rounded hover:bg-gray-50">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                      <select
                        value={formData.priorite}
                        onChange={(e) => handleFormChange('priorite', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        {priorites.map(priorite => (
                          <option key={priorite} value={priorite}>{priorite}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                      <select
                        value={formData.statut}
                        onChange={(e) => handleFormChange('statut', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        {statuts.map(statut => (
                          <option key={statut} value={statut}>{statut}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Collaborateur</label>
                      <select
                        value={formData.assignation}
                        onChange={(e) => handleFormChange('assignation', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        <option value="">Sélectionner un collaborateur</option>
                        {collaborateurs.map(collab => (
                          <option key={collab} value={collab}>{collab}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contrat</label>
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
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provenance</label>
                      <select
                        value={formData.provenanceTicket}
                        onChange={(e) => handleFormChange('provenanceTicket', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        {provenancesTicket.map(provenance => (
                          <option key={provenance} value={provenance}>{provenance}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Équipe</label>
                    <select
                      value={formData.equipe}
                      onChange={(e) => handleFormChange('equipe', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    >
                      <option value="">Sélectionner une équipe</option>
                      {equipes.map(equipe => (
                        <option key={equipe} value={equipe}>{equipe}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
                      <input
                        type="time"
                        value={formData.heureDebut}
                        onChange={(e) => handleFormChange('heureDebut', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin</label>
                      <input
                        type="time"
                        value={formData.heureFin}
                        onChange={(e) => handleFormChange('heureFin', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email du demandeur</label>
                    <input
                      type="email"
                      value={formData.emailDemandeur}
                      onChange={(e) => handleFormChange('emailDemandeur', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Favoris ?</label>
                      <select
                        value={formData.favoris}
                        onChange={(e) => handleFormChange('favoris', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        <option value="non">Non</option>
                        <option value="oui">Oui</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Actif ?</label>
                      <select
                        value={formData.actif}
                        onChange={(e) => handleFormChange('actif', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Informations secondaires */}
              {activeFormTab === 'secondaires' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
                    <select
                      value={formData.auteur}
                      onChange={(e) => handleFormChange('auteur', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    >
                      <option value="">Sélectionner un auteur</option>
                      {collaborateurs.map(collab => (
                        <option key={collab} value={collab}>{collab}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provenance de ticket</label>
                    <select
                      value={formData.provenanceTicket}
                      onChange={(e) => handleFormChange('provenanceTicket', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    >
                      <option value="">Sélectionner une provenance</option>
                      {provenancesTicket.map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type d'activité</label>
                    <input
                      type="text"
                      value={formData.typeActivite}
                      onChange={(e) => handleFormChange('typeActivite', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interventions ?</label>
                    <select
                      value={formData.interventions}
                      onChange={(e) => handleFormChange('interventions', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    >
                      <option value="non">Non</option>
                      <option value="oui">Oui</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Réponses ?</label>
                    <select
                      value={formData.reponses}
                      onChange={(e) => handleFormChange('reponses', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    >
                      <option value="non">Non</option>
                      <option value="oui">Oui</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rapport envoyé ?</label>
                    <select
                      value={formData.rapportEnvoye}
                      onChange={(e) => handleFormChange('rapportEnvoye', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    >
                      <option value="non">Non</option>
                      <option value="oui">Oui</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Accusé de réception envoyé ?</label>
                    <select
                      value={formData.accuseReceptionEnvoye}
                      onChange={(e) => handleFormChange('accuseReceptionEnvoye', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    >
                      <option value="non">Non</option>
                      <option value="oui">Oui</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contrats ?</label>
                    <select
                      value={formData.contrats}
                      onChange={(e) => handleFormChange('contrats', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    >
                      <option value="non">Non</option>
                      <option value="oui">Oui</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
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
                  onClick={handleSubmitForm}
                  disabled={!formData.libelle || !formData.client}
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
            Ajouter une demande client
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDatePicker(true)}
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {dateFilters.dateDebut || dateFilters.dateFin 
              ? `${dateFilters.dateDebut || '...'} - ${dateFilters.dateFin || '...'}`
              : 'date min. - date max.'
            }
          </motion.button>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filtres
          </motion.button>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
              <TagIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm mb-6">
        <div className="flex space-x-6 px-6 overflow-x-auto">
          {['Tout', 'Ouverts', 'Clôturés'].map((tab) => (
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
              {tab === 'Tout' && (
                <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {demandesData.length} résultats
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Indicateur de sélection */}
      {selectedDemandes.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {selectedDemandes.length} demande(s) sélectionnée(s)
          </p>
        </div>
      )}

      {/* Panneau de filtres */}
      <FiltersPanel />

      {/* Tableau des demandes */}
      <DemandesTable />
      
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
          </div>
          
          <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page suivante">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-sm text-gray-700">
          {filteredDemandes.length} résultats
        </div>
      </div>

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
      <AddDemandeForm />
    </div>
  );
};

export default DemandesClientTableauDeBord;