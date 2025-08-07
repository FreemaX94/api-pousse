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
  PrinterIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

const ContratsView = () => {
  // États pour la gestion de l'interface
  const [showFilters, setShowFilters] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('principal');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedContrats, setSelectedContrats] = useState([]);

  // États pour les filtres de date
  const [dateFilters, setDateFilters] = useState({
    dateDebut: '',
    dateFin: ''
  });

  // États pour les filtres avancés
  const [filters, setFilters] = useState({
    numero: '',
    client: '',
    titre: '',
    reference: '',
    collaborateur: 'all',
    cloture: 'all',
    typeActivite: 'all',
    actif: 'all',
    nombrePassages: '',
    tempsPassage: '',
    periodicitéFacturation: 'all',
    typeContrat: 'all',
    dernierIndice: ''
  });

  // États pour le formulaire d'ajout
  const [formData, setFormData] = useState({
    titre: '',
    client: '',
    typeContrat: '',
    nombrePassages: '',
    budget: '',
    dateDebut: '',
    dateFin: '',
    reference: '',
    collaborateur: '',
    adresse: ''
  });

  // Données d'exemple pour les contrats
  const contrats = [
    {
      id: 1,
      dateCreation: '15/01/2024 10:30',
      typeContrat: 'Entretien annuel',
      nombrePassages: 12,
      budget: 15600.00,
      client: 'ADAGIO OPERA',
      adresse: '15 Rue de la Paix, 75002 Paris',
      titre: 'Maintenance espaces verts',
      debut: '01/02/2024',
      fin: '31/01/2025',
      actif: true,
      cloture: false
    },
    {
      id: 2,
      dateCreation: '22/01/2024 14:15',
      typeContrat: 'Abonnement trimestriel',
      nombrePassages: 4,
      budget: 2400.00,
      client: 'SEPHORA',
      adresse: '70 Av. des Champs-Élysées, 75008 Paris',
      titre: 'Entretien plantes intérieures',
      debut: '01/03/2024',
      fin: '28/02/2025',
      actif: true,
      cloture: false
    },
    {
      id: 3,
      dateCreation: '05/02/2024 09:45',
      typeContrat: 'Contrat ponctuel',
      nombrePassages: 1,
      budget: 850.00,
      client: 'SPOTIFY',
      adresse: '12 Rue Auber, 75009 Paris',
      titre: 'Installation mur végétal',
      debut: '15/02/2024',
      fin: '15/02/2024',
      actif: false,
      cloture: true
    },
    {
      id: 4,
      dateCreation: '10/02/2024 16:20',
      typeContrat: 'Maintenance semestrielle',
      nombrePassages: 2,
      budget: 3200.00,
      client: 'HERMES',
      adresse: '24 Rue du Faubourg Saint-Honoré, 75008 Paris',
      titre: 'Entretien jardins de façade',
      debut: '01/03/2024',
      fin: '28/02/2025',
      actif: true,
      cloture: false
    },
    {
      id: 5,
      dateCreation: '18/02/2024 11:00',
      typeContrat: 'Entretien mensuel',
      nombrePassages: 12,
      budget: 7200.00,
      client: 'LYDIA SOLUTIONS',
      adresse: '14 Avenue de l\'Opéra, 75001 Paris',
      titre: 'Soins plantes bureaux',
      debut: '01/04/2024',
      fin: '31/03/2025',
      actif: true,
      cloture: false
    },
    {
      id: 6,
      dateCreation: '25/02/2024 13:30',
      typeContrat: 'Abonnement annuel',
      nombrePassages: 24,
      budget: 18000.00,
      client: 'BEWIZ',
      adresse: '8 Rue de la Michodière, 75002 Paris',
      titre: 'Végétalisation complète',
      debut: '01/05/2024',
      fin: '30/04/2025',
      actif: true,
      cloture: false
    },
    {
      id: 7,
      dateCreation: '03/03/2024 08:45',
      typeContrat: 'Maintenance trimestrielle',
      nombrePassages: 4,
      budget: 1800.00,
      client: 'CLAREO',
      adresse: '45 Rue de Turbigo, 75003 Paris',
      titre: 'Entretien plantes d\'accueil',
      debut: '15/03/2024',
      fin: '14/03/2025',
      actif: true,
      cloture: false
    },
    {
      id: 8,
      dateCreation: '12/03/2024 15:15',
      typeContrat: 'Contrat saisonnier',
      nombrePassages: 6,
      budget: 4500.00,
      client: 'AAREAL BANK',
      adresse: '52 Avenue des Champs-Élysées, 75008 Paris',
      titre: 'Aménagement terrasse printemps',
      debut: '01/04/2024',
      fin: '30/09/2024',
      actif: false,
      cloture: true
    },
    {
      id: 9,
      dateCreation: '20/03/2024 10:00',
      typeContrat: 'Entretien bimensuel',
      nombrePassages: 6,
      budget: 3600.00,
      client: 'BERENBERG BANK',
      adresse: '16 Boulevard Haussmann, 75009 Paris',
      titre: 'Soins jardins intérieurs',
      debut: '01/04/2024',
      fin: '31/03/2025',
      actif: true,
      cloture: false
    },
    {
      id: 10,
      dateCreation: '28/03/2024 12:30',
      typeContrat: 'Maintenance annuelle',
      nombrePassages: 12,
      budget: 9600.00,
      client: 'AQUILAE GESTION',
      adresse: '38 Rue de Provence, 75009 Paris',
      titre: 'Entretien espaces communs',
      debut: '01/05/2024',
      fin: '30/04/2025',
      actif: true,
      cloture: false
    }
  ];

  const clients = ['ADAGIO OPERA', 'SEPHORA', 'SPOTIFY', 'HERMES', 'LYDIA SOLUTIONS', 'BEWIZ', 'CLAREO', 'AAREAL BANK', 'BERENBERG BANK', 'AQUILAE GESTION'];
  const typesContrat = ['Entretien annuel', 'Abonnement trimestriel', 'Contrat ponctuel', 'Maintenance semestrielle', 'Entretien mensuel', 'Abonnement annuel', 'Maintenance trimestrielle', 'Contrat saisonnier', 'Entretien bimensuel', 'Maintenance annuelle'];
  const collaborateurs = ['Jean Dupont', 'Marie Martin', 'Paul Durand', 'Sophie Bernard', 'Luc Moreau'];

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
      setSelectedContrats(contrats.map(contrat => contrat.id));
    } else {
      setSelectedContrats([]);
    }
  };

  const handleSelectContrat = (id, checked) => {
    if (checked) {
      setSelectedContrats([...selectedContrats, id]);
    } else {
      setSelectedContrats(selectedContrats.filter(contratId => contratId !== id));
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDateFilterChange = (field, value) => {
    setDateFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      numero: '',
      client: '',
      titre: '',
      reference: '',
      collaborateur: 'all',
      cloture: 'all',
      typeActivite: 'all',
      actif: 'all',
      nombrePassages: '',
      tempsPassage: '',
      periodicitéFacturation: 'all',
      typeContrat: 'all',
      dernierIndice: ''
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
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
                  Recherche sur date de fin du contrat
                </h3>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        console.log('Filtrer par dates:', dateFilters);
                        setShowDatePicker(false);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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
                      { key: '30-jours', label: '30 derniers jours' },
                      { key: 'mois-courant', label: 'Mois courant' },
                      { key: 'mois-precedent', label: 'Mois précédent' },
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                  <input
                    type="text"
                    value={filters.titre}
                    onChange={(e) => handleFilterChange('titre', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
                  <input
                    type="text"
                    value={filters.reference}
                    onChange={(e) => handleFilterChange('reference', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Collaborateur</label>
                  <select
                    value={filters.collaborateur}
                    onChange={(e) => handleFilterChange('collaborateur', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    {collaborateurs.map(collab => (
                      <option key={collab} value={collab}>{collab}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clôturé ?</label>
                  <select
                    value={filters.cloture}
                    onChange={(e) => handleFilterChange('cloture', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type d'activité</label>
                  <select
                    value={filters.typeActivite}
                    onChange={(e) => handleFilterChange('typeActivite', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    <option value="entretien">Entretien</option>
                    <option value="installation">Installation</option>
                    <option value="maintenance">Maintenance</option>
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

            {/* Champs personnalisés */}
            {activeFilterTab === 'personnalises' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de passages/an</label>
                  <input
                    type="number"
                    value={filters.nombrePassages}
                    onChange={(e) => handleFilterChange('nombrePassages', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temps passage</label>
                  <input
                    type="number"
                    value={filters.tempsPassage}
                    onChange={(e) => handleFilterChange('tempsPassage', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    placeholder="Minutes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Périodicité de facturation</label>
                  <select
                    value={filters.periodicitéFacturation}
                    onChange={(e) => handleFilterChange('periodicitéFacturation', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Toutes</option>
                    <option value="mensuelle">Mensuelle</option>
                    <option value="trimestrielle">Trimestrielle</option>
                    <option value="semestrielle">Semestrielle</option>
                    <option value="annuelle">Annuelle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
                  <select
                    value={filters.typeContrat}
                    onChange={(e) => handleFilterChange('typeContrat', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    {typesContrat.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dernier indice appliqué</label>
                  <input
                    type="number"
                    step="0.01"
                    value={filters.dernierIndice}
                    onChange={(e) => handleFilterChange('dernierIndice', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
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

  // Composant Tableau des contrats
  const ContratsTable = () => (
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
                onClick={() => handleSort('dateCreation')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date/heure de création</span>
                  {sortColumn === 'dateCreation' && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type de contrat
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('nombrePassages')}
              >
                <div className="flex items-center space-x-1">
                  <span>Nombre de passages/an</span>
                  {sortColumn === 'nombrePassages' && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('budget')}
              >
                <div className="flex items-center space-x-1">
                  <span>Budget</span>
                  {sortColumn === 'budget' && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adresse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('debut')}
              >
                <div className="flex items-center space-x-1">
                  <span>Début</span>
                  {sortColumn === 'debut' && (
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
            {contrats.map((contrat, index) => (
              <motion.tr
                key={contrat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedContrats.includes(contrat.id)}
                    onChange={(e) => handleSelectContrat(contrat.id, e.target.checked)}
                    className="rounded border-gray-300 text-[#2170E3] focus:ring-[#2170E3]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contrat.dateCreation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {contrat.typeContrat}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  <span className="font-medium">{contrat.nombrePassages}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  {formatPrice(contrat.budget)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-[#2170E3] hover:text-blue-800 hover:underline">
                    {contrat.client}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {contrat.adresse}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {contrat.titre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contrat.debut}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-[#2170E3] hover:text-blue-900"
                      title="Voir le contrat"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
                      title="Modifier le contrat"
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
            Ajouter un contrat
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
              <PrinterIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Indicateur de sélection */}
      {selectedContrats.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {selectedContrats.length} contrat(s) sélectionné(s)
          </p>
        </div>
      )}

      {/* Panneau de filtres */}
      <FiltersPanel />

      {/* Tableau des contrats */}
      <ContratsTable />
      
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
            <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">7</button>
          </div>
          
          <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page suivante">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-sm text-gray-700">
          192 résultats
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
    </div>
  );
};

export default ContratsView;