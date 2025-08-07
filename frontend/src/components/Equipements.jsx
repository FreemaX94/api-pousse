import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ViewColumnsIcon,
  PrinterIcon,
  TagIcon,
  Cog6ToothIcon,
  XMarkIcon,
  MapPinIcon,
  DocumentArrowUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Equipements = () => {
  // États pour la gestion de l'interface
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('principal');
  const [activeFormTab, setActiveFormTab] = useState('donnees');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedEquipements, setSelectedEquipements] = useState([]);
  const [showMap, setShowMap] = useState(false);

  // États pour les filtres
  const [filters, setFilters] = useState({
    numero: '',
    nom: '',
    localisation: '',
    client: '',
    code: '',
    categorie: 'all',
    favoris: 'all',
    actif: 'all',
    identification: '',
    dateInstallation: '',
    rapportPersonnalise: 'all',
    commentaire: '',
    longitude: '',
    latitude: ''
  });

  // États pour le formulaire d'ajout
  const [formData, setFormData] = useState({
    libelle: '',
    client: '',
    categorie: '',
    code: '',
    dateAchat: '',
    dateInstallation: '',
    identification: '',
    rapportPersonnalise: '',
    commentaire: '',
    longitude: '',
    latitude: '',
    adresse: '',
    localisation: ''
  });

  // Données d'exemple pour les équipements
  const equipements = [
    {
      id: 1,
      numero: 'EQ001',
      nom: 'Système d\'arrosage automatique',
      client: 'ADAGIO OPERA',
      adresse: '15 Rue de la Paix, 75002 Paris',
      code: 'SAA-001',
      localisation: 'Hall d\'entrée',
      dateInstallation: '15/03/2024',
      categorie: 'Arrosage',
      actif: true,
      favoris: false
    },
    {
      id: 2,
      numero: 'EQ002',
      nom: 'Bac à plantes design',
      client: 'SEPHORA',
      adresse: '70 Av. des Champs-Élysées, 75008 Paris',
      code: 'BAC-002',
      localisation: 'Espace accueil',
      dateInstallation: '22/01/2024',
      categorie: 'Contenants',
      actif: true,
      favoris: true
    },
    {
      id: 3,
      numero: 'EQ003',
      nom: 'Éclairage LED horticole',
      client: 'SPOTIFY',
      adresse: '12 Rue Auber, 75009 Paris',
      code: 'LED-003',
      localisation: 'Open space',
      dateInstallation: '08/12/2023',
      categorie: 'Éclairage',
      actif: true,
      favoris: false
    }
  ];

  const categories = ['Arrosage', 'Contenants', 'Éclairage', 'Substrats', 'Outils'];
  const clients = ['ADAGIO OPERA', 'SEPHORA', 'SPOTIFY', 'HERMES', 'LYDIA SOLUTIONS'];

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
      setSelectedEquipements(equipements.map(eq => eq.id));
    } else {
      setSelectedEquipements([]);
    }
  };

  const handleSelectEquipement = (id, checked) => {
    if (checked) {
      setSelectedEquipements([...selectedEquipements, id]);
    } else {
      setSelectedEquipements(selectedEquipements.filter(eqId => eqId !== id));
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      numero: '',
      nom: '',
      localisation: '',
      client: '',
      code: '',
      categorie: 'all',
      favoris: 'all',
      actif: 'all',
      identification: '',
      dateInstallation: '',
      rapportPersonnalise: 'all',
      commentaire: '',
      longitude: '',
      latitude: ''
    });
  };

  const handleSubmitForm = () => {
    console.log('Enregistrer équipement:', formData);
    setShowAddForm(false);
    // Réinitialiser le formulaire
    setFormData({
      libelle: '',
      client: '',
      categorie: '',
      code: '',
      dateAchat: '',
      dateInstallation: '',
      identification: '',
      rapportPersonnalise: '',
      commentaire: '',
      longitude: '',
      latitude: '',
      adresse: '',
      localisation: ''
    });
  };

  // Composant Header
  const Header = () => (
    <div className="bg-[#2170E3] text-white p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <span className="text-[#2170E3] font-bold text-sm">P</span>
          </div>
          <h1 className="text-xl font-bold">POUSSE</h1>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un équipement..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-blue-600 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button className="p-2 hover:bg-blue-600 rounded-lg">
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Composant Sidebar
  const Sidebar = () => (
    <div className="w-64 bg-[#2170E3] text-white h-full">
      <div className="p-4">
        <nav className="space-y-2">
          <div className="mb-4">
            <div className="text-sm text-blue-200 mb-2">Suivi clients</div>
            <div className="ml-4 space-y-1">
              <button className="w-full text-left px-3 py-2 text-blue-100 hover:bg-blue-600 rounded">
                Clients
              </button>
              <button className="w-full text-left px-3 py-2 text-blue-100 hover:bg-blue-600 rounded">
                Adresses
              </button>
              <button className="w-full text-left px-3 py-2 bg-blue-600 text-white font-medium rounded">
                Équipements
              </button>
              <button className="w-full text-left px-3 py-2 text-blue-100 hover:bg-blue-600 rounded">
                Contrats
              </button>
              <button className="w-full text-left px-3 py-2 text-blue-100 hover:bg-blue-600 rounded">
                Affaires
              </button>
              <button className="w-full text-left px-3 py-2 text-blue-100 hover:bg-blue-600 rounded">
                Contacts
              </button>
              <button className="w-full text-left px-3 py-2 text-blue-100 hover:bg-blue-600 rounded">
                Fichiers
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
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
                onClick={() => setActiveFilterTab('secondaire')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeFilterTab === 'secondaire'
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={filters.nom}
                    onChange={(e) => handleFilterChange('nom', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                  <input
                    type="text"
                    value={filters.localisation}
                    onChange={(e) => handleFilterChange('localisation', e.target.value)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={filters.code}
                    onChange={(e) => handleFilterChange('code', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={filters.categorie}
                    onChange={(e) => handleFilterChange('categorie', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Toutes</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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
            {activeFilterTab === 'secondaire' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Identification commerciale</label>
                  <input
                    type="text"
                    value={filters.identification}
                    onChange={(e) => handleFilterChange('identification', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'installation</label>
                  <input
                    type="date"
                    value={filters.dateInstallation}
                    onChange={(e) => handleFilterChange('dateInstallation', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rapport personnalisé</label>
                  <select
                    value={filters.rapportPersonnalise}
                    onChange={(e) => handleFilterChange('rapportPersonnalise', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    <option value="all">Tous</option>
                    <option value="standard">Standard</option>
                    <option value="personnalise">Personnalisé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                  <input
                    type="text"
                    value={filters.commentaire}
                    onChange={(e) => handleFilterChange('commentaire', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Géolocalisation</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Adresse"
                      className="flex-1 border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    />
                    <button
                      onClick={() => setShowMap(!showMap)}
                      className="px-3 py-2 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 transition-colors"
                    >
                      <MapPinIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Longitude"
                      value={filters.longitude}
                      onChange={(e) => handleFilterChange('longitude', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    />
                    <input
                      type="text"
                      placeholder="Latitude"
                      value={filters.latitude}
                      onChange={(e) => handleFilterChange('latitude', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fichiers</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <DocumentArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Glisser-déposer ou cliquer</p>
                  </div>
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

  // Composant Tableau des équipements
  const EquipementsTable = () => (
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
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('nom')}
              >
                <div className="flex items-center space-x-1">
                  <span>Nom</span>
                  {sortColumn === 'nom' && (
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
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localisation
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('dateInstallation')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date d'installation</span>
                  {sortColumn === 'dateInstallation' && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {equipements.map((equipement, index) => (
              <motion.tr
                key={equipement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedEquipements.includes(equipement.id)}
                    onChange={(e) => handleSelectEquipement(equipement.id, e.target.checked)}
                    className="rounded border-gray-300 text-[#2170E3] focus:ring-[#2170E3]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {equipement.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span>{equipement.nom}</span>
                    {equipement.favoris && (
                      <span className="ml-2 text-yellow-500">★</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-[#2170E3] hover:text-blue-800 hover:underline">
                    {equipement.client}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {equipement.adresse}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {equipement.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {equipement.localisation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {equipement.dateInstallation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {equipement.categorie}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-[#2170E3] hover:text-blue-900"
                      title="Voir l'équipement"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
                      title="Modifier l'équipement"
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
  const AddEquipementForm = () => (
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
            {/* En-tête du formulaire */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSubmitForm}
                    disabled={!formData.libelle || !formData.client}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#2170E3] hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Enregistrer
                  </button>
                  <nav className="text-sm text-gray-500">
                    Équipements > Ajouter un équipement
                  </nav>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-800">
                    <PrinterIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800">
                    <TagIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800">
                    <ViewColumnsIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Onglets du formulaire */}
            <div className="px-6 border-b border-gray-200">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveFormTab('donnees')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeFormTab === 'donnees'
                      ? 'border-[#2170E3] text-[#2170E3]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Données
                </button>
                <button
                  onClick={() => setActiveFormTab('informations')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeFormTab === 'informations'
                      ? 'border-[#2170E3] text-[#2170E3]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Informations secondaires
                </button>
                <button
                  onClick={() => setActiveFormTab('geolocalisation')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeFormTab === 'geolocalisation'
                      ? 'border-[#2170E3] text-[#2170E3]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Géolocalisation
                </button>
                <button
                  onClick={() => setActiveFormTab('fichiers')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeFormTab === 'fichiers'
                      ? 'border-[#2170E3] text-[#2170E3]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Fichiers
                </button>
              </div>
            </div>

            {/* Contenu du formulaire */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
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
                      <div className="flex">
                        <select
                          value={formData.client}
                          onChange={(e) => handleFormChange('client', e.target.value)}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                      <div className="flex">
                        <select
                          value={formData.categorie}
                          onChange={(e) => handleFormChange('categorie', e.target.value)}
                          className="flex-1 border border-gray-200 rounded-l p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button className="px-3 py-2 bg-gray-100 text-gray-600 border border-l-0 border-gray-200 rounded-r hover:bg-gray-200">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => handleFormChange('code', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date d'achat</label>
                      <input
                        type="date"
                        value={formData.dateAchat}
                        onChange={(e) => handleFormChange('dateAchat', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date d'installation</label>
                      <input
                        type="date"
                        value={formData.dateInstallation}
                        onChange={(e) => handleFormChange('dateInstallation', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Identification commerciale</label>
                    <input
                      type="text"
                      value={formData.identification}
                      onChange={(e) => handleFormChange('identification', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rapport personnalisé</label>
                    <select
                      value={formData.rapportPersonnalise}
                      onChange={(e) => handleFormChange('rapportPersonnalise', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    >
                      <option value="">Sélectionner</option>
                      <option value="standard">Standard</option>
                      <option value="personnalise">Personnalisé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                    <textarea
                      value={formData.commentaire}
                      onChange={(e) => handleFormChange('commentaire', e.target.value)}
                      rows={4}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    />
                  </div>
                </div>
              )}

              {activeFormTab === 'informations' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                    <input
                      type="text"
                      value={formData.localisation}
                      onChange={(e) => handleFormChange('localisation', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      placeholder="Ex: Hall d'entrée, Bureau 204, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Informations complémentaires</label>
                    <textarea
                      rows={6}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      placeholder="Ajoutez des informations complémentaires sur cet équipement..."
                    />
                  </div>
                </div>
              )}

              {activeFormTab === 'geolocalisation' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={formData.adresse}
                      onChange={(e) => handleFormChange('adresse', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      placeholder="Saisir l'adresse de l'équipement"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input
                        type="text"
                        value={formData.longitude}
                        onChange={(e) => handleFormChange('longitude', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        placeholder="Ex: 2.3522"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input
                        type="text"
                        value={formData.latitude}
                        onChange={(e) => handleFormChange('latitude', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        placeholder="Ex: 48.8566"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <MapPinIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Carte interactive sera affichée ici</p>
                  </div>
                </div>
              )}

              {activeFormTab === 'fichiers' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Documents attachés</label>
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
                </div>
              )}
            </div>

            {/* Footer fixe du formulaire */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitForm}
                disabled={!formData.libelle || !formData.client}
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#2170E3] hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Ajouter un équipement
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filtres
              </motion.button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
                <ViewColumnsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <FiltersPanel />
            <EquipementsTable />
            
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
                3 résultats
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
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
              <ChevronUpIcon className="w-4 h-4" />
              <span>Retour en haut</span>
            </button>
          </div>
        </footer>
        
        <AddEquipementForm />
      </div>
    </div>
  );
};

export default Equipements;