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
  DocumentArrowUpIcon,
  MapPinIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const ContactsView = () => {
  // États pour la gestion de l'interface
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('principal');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedContacts, setSelectedContacts] = useState([]);

  // États pour les blocs collapsibles du formulaire
  const [showSecondaryInfo, setShowSecondaryInfo] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // États pour les filtres
  const [filters, setFilters] = useState({
    numero: '',
    client: '',
    titre: '',
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    favoris: 'all',
    actif: 'all',
    b2b: 'all'
  });

  // États pour le formulaire d'ajout
  const [formData, setFormData] = useState({
    type: 'Client',
    civilite: '',
    prenom: '',
    nom: '',
    email: '',
    telephoneFixe: '',
    telephoneMobile: '',
    prenomAdresse: '',
    nomAdresse: '',
    rue: '',
    codePostal: '',
    ville: '',
    geolocalisation: '',
    longitude: '',
    latitude: '',
    commentaire: '',
    b2b: false
  });

  // Données d'exemple pour les contacts
  const contacts = [
    {
      id: 1,
      numero: 'CT001',
      b2b: true,
      titre: 'M.',
      prenom: 'Jean',
      nom: 'Dupont',
      email: 'jean.dupont@adagio-opera.fr',
      telephone: '01 42 61 47 91',
      client: 'ADAGIO OPERA',
      actif: true,
      favoris: false
    },
    {
      id: 2,
      numero: 'CT002',
      b2b: true,
      titre: 'Mme',
      prenom: 'Marie',
      nom: 'Martin',
      email: 'marie.martin@sephora.fr',
      telephone: '01 53 93 22 22',
      client: 'SEPHORA',
      actif: true,
      favoris: true
    },
    {
      id: 3,
      numero: 'CT003',
      b2b: false,
      titre: 'M.',
      prenom: 'Paul',
      nom: 'Durand',
      email: 'paul.durand@spotify.com',
      telephone: '01 44 82 20 00',
      client: 'SPOTIFY',
      actif: true,
      favoris: false
    },
    {
      id: 4,
      numero: 'CT004',
      b2b: true,
      titre: 'Mme',
      prenom: 'Sophie',
      nom: 'Bernard',
      email: 'sophie.bernard@hermes.com',
      telephone: '01 40 17 47 17',
      client: 'HERMES',
      actif: true,
      favoris: true
    },
    {
      id: 5,
      numero: 'CT005',
      b2b: false,
      titre: 'M.',
      prenom: 'Luc',
      nom: 'Moreau',
      email: 'luc.moreau@lydia-app.com',
      telephone: '01 80 05 26 35',
      client: 'LYDIA SOLUTIONS',
      actif: false,
      favoris: false
    },
    {
      id: 6,
      numero: 'CT006',
      b2b: true,
      titre: 'Mme',
      prenom: 'Emma',
      nom: 'Dubois',
      email: 'emma.dubois@bewiz.tech',
      telephone: '01 42 33 87 65',
      client: 'BEWIZ',
      actif: true,
      favoris: false
    },
    {
      id: 7,
      numero: 'CT007',
      b2b: true,
      titre: 'M.',
      prenom: 'Thomas',
      nom: 'Petit',
      email: 'thomas.petit@clareo.fr',
      telephone: '01 49 52 71 80',
      client: 'CLAREO',
      actif: true,
      favoris: false
    },
    {
      id: 8,
      numero: 'CT008',
      b2b: false,
      titre: 'Mme',
      prenom: 'Camille',
      nom: 'Roux',
      email: 'camille.roux@aareal-bank.fr',
      telephone: '01 44 50 33 90',
      client: 'AAREAL BANK',
      actif: true,
      favoris: true
    },
    {
      id: 9,
      numero: 'CT009',
      b2b: true,
      titre: 'M.',
      prenom: 'Lucas',
      nom: 'Leroy',
      email: 'lucas.leroy@berenberg.fr',
      telephone: '01 58 18 71 00',
      client: 'BERENBERG BANK',
      actif: true,
      favoris: false
    },
    {
      id: 10,
      numero: 'CT010',
      b2b: true,
      titre: 'Mme',
      prenom: 'Anna',
      nom: 'Schmidt',
      email: 'anna.schmidt@aquilae.fr',
      telephone: '01 53 43 22 11',
      client: 'AQUILAE GESTION',
      actif: true,
      favoris: true
    }
  ];

  const clients = ['ADAGIO OPERA', 'SEPHORA', 'SPOTIFY', 'HERMES', 'LYDIA SOLUTIONS', 'BEWIZ', 'CLAREO', 'AAREAL BANK', 'BERENBERG BANK', 'AQUILAE GESTION'];
  const civilites = ['M.', 'Mme', 'Mlle', 'Dr', 'Pr'];
  const typesContact = ['Client', 'Prospect', 'Autre'];

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
      setSelectedContacts(contacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (id, checked) => {
    if (checked) {
      setSelectedContacts([...selectedContacts, id]);
    } else {
      setSelectedContacts(selectedContacts.filter(contactId => contactId !== id));
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
      client: '',
      titre: '',
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      favoris: 'all',
      actif: 'all',
      b2b: 'all'
    });
  };

  const handleSubmitForm = () => {
    console.log('Enregistrer contact:', formData);
    setShowAddForm(false);
    // Réinitialiser le formulaire
    setFormData({
      type: 'Client',
      civilite: '',
      prenom: '',
      nom: '',
      email: '',
      telephoneFixe: '',
      telephoneMobile: '',
      prenomAdresse: '',
      nomAdresse: '',
      rue: '',
      codePostal: '',
      ville: '',
      geolocalisation: '',
      longitude: '',
      latitude: '',
      commentaire: '',
      b2b: false
    });
  };

  // Composant Toggle B2B
  const B2BToggle = ({ value, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? 'bg-[#2170E3]' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      role="switch"
      aria-checked={value}
      aria-label="B2B"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
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
          role="dialog"
          aria-label="Panneau de filtres"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={filters.prenom}
                    onChange={(e) => handleFilterChange('prenom', e.target.value)}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={filters.email}
                    onChange={(e) => handleFilterChange('email', e.target.value)}
                    className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={filters.telephone}
                    onChange={(e) => handleFilterChange('telephone', e.target.value)}
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

            {/* Champs personnalisés */}
            {activeFilterTab === 'personnalises' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">B2B ?</label>
                  <div className="flex items-center space-x-3">
                    <B2BToggle
                      value={filters.b2b === 'oui'}
                      onChange={(value) => handleFilterChange('b2b', value ? 'oui' : 'non')}
                    />
                    <span className="text-sm text-gray-600">
                      {filters.b2b === 'oui' ? 'Oui' : filters.b2b === 'non' ? 'Non' : 'Tous'}
                    </span>
                    <button
                      onClick={() => handleFilterChange('b2b', 'all')}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Réinitialiser
                    </button>
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

  // Composant Tableau des contacts
  const ContactsTable = () => (
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
                  aria-label="Sélectionner tous les contacts"
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
                B2B
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('prenom')}
              >
                <div className="flex items-center space-x-1">
                  <span>Prénom</span>
                  {sortColumn === 'prenom' && (
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
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact, index) => (
              <motion.tr
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={(e) => handleSelectContact(contact.id, e.target.checked)}
                    className="rounded border-gray-300 text-[#2170E3] focus:ring-[#2170E3]"
                    aria-label={`Sélectionner ${contact.prenom} ${contact.nom}`}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {contact.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {contact.b2b ? (
                    <CheckIcon className="w-5 h-5 text-green-600 mx-auto" aria-label="B2B" />
                  ) : (
                    <XMarkIcon className="w-5 h-5 text-red-600 mx-auto" aria-label="Non B2B" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contact.titre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contact.prenom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {contact.nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contact.email && (
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-[#2170E3] hover:text-blue-800 hover:underline"
                    >
                      {contact.email}
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contact.telephone && (
                    <a 
                      href={`tel:${contact.telephone.replace(/\s/g, '')}`}
                      className="text-[#2170E3] hover:text-blue-800 hover:underline"
                    >
                      {contact.telephone}
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-[#2170E3] hover:text-blue-800 hover:underline">
                    {contact.client}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-[#2170E3] hover:text-blue-900"
                      title="Voir le contact"
                      aria-label={`Voir ${contact.prenom} ${contact.nom}`}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
                      title="Modifier le contact"
                      aria-label={`Modifier ${contact.prenom} ${contact.nom}`}
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
  const AddContactForm = () => (
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
                    disabled={!formData.prenom || !formData.nom}
                    className="inline-flex items-center px-4 py-2 bg-[#2170E3] text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Enregistrer
                  </button>
                  <nav className="text-sm text-gray-500">
                    Contacts &gt; Ajouter un contact
                  </nav>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                  aria-label="Fermer"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Bloc Contact */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleFormChange('type', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        {typesContact.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Civilité</label>
                      <select
                        value={formData.civilite}
                        onChange={(e) => handleFormChange('civilite', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        <option value="">Sélectionner</option>
                        {civilites.map(civilite => (
                          <option key={civilite} value={civilite}>{civilite}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.prenom}
                        onChange={(e) => handleFormChange('prenom', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => handleFormChange('nom', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone fixe</label>
                      <input
                        type="tel"
                        value={formData.telephoneFixe}
                        onChange={(e) => handleFormChange('telephoneFixe', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone mobile</label>
                      <input
                        type="tel"
                        value={formData.telephoneMobile}
                        onChange={(e) => handleFormChange('telephoneMobile', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloc Adresse principale */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresse principale</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom (si différent)</label>
                      <input
                        type="text"
                        value={formData.prenomAdresse}
                        onChange={(e) => handleFormChange('prenomAdresse', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom (si différent)</label>
                      <input
                        type="text"
                        value={formData.nomAdresse}
                        onChange={(e) => handleFormChange('nomAdresse', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rue</label>
                    <textarea
                      rows={3}
                      value={formData.rue}
                      onChange={(e) => handleFormChange('rue', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      placeholder="Numéro et nom de rue..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                      <input
                        type="text"
                        value={formData.codePostal}
                        onChange={(e) => handleFormChange('codePostal', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                      <input
                        type="text"
                        value={formData.ville}
                        onChange={(e) => handleFormChange('ville', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Géolocalisation</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={formData.geolocalisation}
                        onChange={(e) => handleFormChange('geolocalisation', e.target.value)}
                        placeholder="Rechercher une adresse..."
                        className="flex-1 border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                      <button
                        onClick={() => setShowMap(!showMap)}
                        className="px-3 py-2 bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 transition-colors"
                      >
                        <MapPinIcon className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-2 text-sm text-[#2170E3] hover:text-blue-800">
                        Afficher la carte
                      </button>
                    </div>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                    <textarea
                      rows={4}
                      value={formData.commentaire}
                      onChange={(e) => handleFormChange('commentaire', e.target.value)}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">B2B ?</label>
                        <div className="flex items-center space-x-3">
                          <B2BToggle
                            value={formData.b2b}
                            onChange={(value) => handleFormChange('b2b', value)}
                          />
                          <span className="text-sm text-gray-600">
                            {formData.b2b ? 'Oui' : 'Non'}
                          </span>
                        </div>
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
                onClick={handleSubmitForm}
                disabled={!formData.prenom || !formData.nom}
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
            Ajouter un contact
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
          <button 
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            aria-label="Tags"
          >
            <TagIcon className="w-5 h-5" />
          </button>
          <button 
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            aria-label="Options d'affichage"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Indicateur de sélection */}
      {selectedContacts.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {selectedContacts.length} contact(s) sélectionné(s)
          </p>
        </div>
      )}

      {/* Panneau de filtres */}
      <FiltersPanel />

      {/* Tableau des contacts */}
      <ContactsTable />
      
      {/* Pagination */}
      <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between rounded-b-lg">
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 text-gray-400 hover:text-gray-600" 
            aria-label="Page précédente"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          
          <div className="flex space-x-1">
            <button className="px-3 py-1 text-sm rounded bg-[#2170E3] text-white">1</button>
            <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">2</button>
            <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">3</button>
            <span className="px-2 py-1 text-sm text-gray-500">...</span>
            <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">29</button>
            <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">30</button>
            <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">31</button>
          </div>
          
          <button 
            className="p-2 text-gray-400 hover:text-gray-600" 
            aria-label="Page suivante"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-sm text-gray-700">
          922 résultats
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

      {/* Modal d'ajout de contact */}
      <AddContactForm />
    </div>
  );
};

export default ContactsView;