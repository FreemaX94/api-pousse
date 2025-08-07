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
  XMarkIcon,
  MapPinIcon,
  DocumentArrowUpIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const EquipementsView = () => {
  // États pour la gestion de l'interface
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('principal');
  const [activeFormTab, setActiveFormTab] = useState('donnees');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedEquipements, setSelectedEquipements] = useState([]);

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
    },
    {
      id: 4,
      numero: 'EQ004',
      nom: 'Substrat drainant premium',
      client: 'HERMES',
      adresse: '24 Rue du Faubourg Saint-Honoré, 75008 Paris',
      code: 'SUB-004',
      localisation: 'Terrasse',
      dateInstallation: '05/11/2023',
      categorie: 'Substrats',
      actif: true,
      favoris: true
    },
    {
      id: 5,
      numero: 'EQ005',
      nom: 'Kit d\'outils d\'entretien',
      client: 'LYDIA SOLUTIONS',
      adresse: '14 Avenue de l\'Opéra, 75001 Paris',
      code: 'OUT-005',
      localisation: 'Local technique',
      dateInstallation: '18/09/2023',
      categorie: 'Outils',
      actif: false,
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
                  <div className="grid grid-cols-2 gap-2">
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
                      <StarIcon className="ml-2 w-4 h-4 text-yellow-500 fill-current" />
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

  // Composant Formulaire d'ajout (simplifié pour l'intégration)
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
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* En-tête du formulaire */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Ajouter un équipement</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenu du formulaire */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
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
                    <select
                      value={formData.client}
                      onChange={(e) => handleFormChange('client', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      required
                    >
                      <option value="">Sélectionner un client</option>
                      {clients.map(client => (
                        <option key={client} value={client}>{client}</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date d'installation</label>
                    <input
                      type="date"
                      value={formData.dateInstallation}
                      onChange={(e) => handleFormChange('dateInstallation', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                    <input
                      type="text"
                      value={formData.localisation}
                      onChange={(e) => handleFormChange('localisation', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      placeholder="Ex: Hall d'entrée, Bureau 204..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                  <textarea
                    value={formData.commentaire}
                    onChange={(e) => handleFormChange('commentaire', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    placeholder="Informations complémentaires sur cet équipement..."
                  />
                </div>
              </div>
            </div>

            {/* Footer du formulaire */}
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
            Ajouter un équipement
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
        
        <div className="text-sm text-gray-600">
          {selectedEquipements.length > 0 && `${selectedEquipements.length} équipement(s) sélectionné(s)`}
        </div>
      </div>

      {/* Panneau de filtres */}
      <FiltersPanel />

      {/* Tableau des équipements */}
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
          </div>
          
          <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page suivante">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-sm text-gray-700">
          {equipements.length} résultats
        </div>
      </div>

      {/* Modal d'ajout d'équipement */}
      <AddEquipementForm />
    </div>
  );
};

export default EquipementsView;