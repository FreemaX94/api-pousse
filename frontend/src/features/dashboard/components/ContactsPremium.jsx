import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  TagIcon,
  LinkIcon,
  ClockIcon,
  StarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  DocumentDuplicateIcon,
  ArrowTrendingUpIcon,
  UserPlusIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  HeartIcon,
  BoltIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const ContactsPremium = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState('grid');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const contacts = [
    {
      id: 1,
      nom: 'Jean Dupont',
      entreprise: 'Tech Solutions',
      fonction: 'Directeur Technique',
      telephone: '+33 6 12 34 56 78',
      email: 'jean.dupont@techsolutions.fr',
      adresse: '123 Rue de la Tech, 75001 Paris',
      dernierContact: '2024-03-15',
      score: 95,
      statut: 'VIP',
      tags: ['Client Premium', 'Tech', 'Partenaire'],
      interactions: 45,
      projets: 12,
      chiffreAffaires: 125000,
      notes: 'Client stratégique, à contacter mensuellement',
      reseau: ['Marie Martin', 'Pierre Bernard'],
      avatar: '👨‍💼',
      isFavorite: true,
      socialLinks: {
        linkedin: 'linkedin.com/in/jeandupont',
        twitter: '@jeandupont'
      }
    },
    {
      id: 2,
      nom: 'Marie Martin',
      entreprise: 'Green Energy Corp',
      fonction: 'Responsable Achats',
      telephone: '+33 6 98 76 54 32',
      email: 'marie.martin@greenenergy.com',
      adresse: '456 Avenue Verte, 69002 Lyon',
      dernierContact: '2024-03-18',
      score: 88,
      statut: 'Actif',
      tags: ['Environnement', 'B2B', 'Grand compte'],
      interactions: 32,
      projets: 8,
      chiffreAffaires: 89000,
      notes: 'Intéressée par nos solutions durables',
      reseau: ['Jean Dupont', 'Sophie Leclerc'],
      avatar: '👩‍💼',
      isFavorite: false,
      socialLinks: {
        linkedin: 'linkedin.com/in/mariemartin'
      }
    },
    {
      id: 3,
      nom: 'Pierre Bernard',
      entreprise: 'Design Studio',
      fonction: 'CEO',
      telephone: '+33 7 45 67 89 01',
      email: 'pierre@designstudio.fr',
      adresse: '789 Boulevard Créatif, 33000 Bordeaux',
      dernierContact: '2024-03-10',
      score: 72,
      statut: 'Prospect',
      tags: ['Design', 'PME', 'Créatif'],
      interactions: 15,
      projets: 3,
      chiffreAffaires: 35000,
      notes: 'Potentiel de collaboration sur projets créatifs',
      reseau: ['Jean Dupont'],
      avatar: '🎨',
      isFavorite: false,
      socialLinks: {
        linkedin: 'linkedin.com/in/pierrebernard',
        instagram: '@designstudiofr'
      }
    }
  ];

  const viewModes = [
    { id: 'grid', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: 'list', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> },
    { id: 'network', icon: <LinkIcon className="w-5 h-5" /> }
  ];

  const filters = [
    { id: 'all', label: 'Tous', count: contacts.length },
    { id: 'vip', label: 'VIP', count: 1, color: 'yellow' },
    { id: 'actif', label: 'Actifs', count: 1, color: 'green' },
    { id: 'prospect', label: 'Prospects', count: 1, color: 'blue' },
    { id: 'favorite', label: 'Favoris', count: 1, color: 'red' }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatutColor = (statut) => {
    switch(statut) {
      case 'VIP': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Actif': return 'bg-green-100 text-green-800 border-green-200';
      case 'Prospect': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'vip' && contact.statut === 'VIP') ||
                         (selectedFilter === 'actif' && contact.statut === 'Actif') ||
                         (selectedFilter === 'prospect' && contact.statut === 'Prospect') ||
                         (selectedFilter === 'favorite' && contact.isFavorite);
    
    return matchesSearch && matchesFilter;
  });

  const renderContactCard = (contact) => (
    <motion.div
      key={contact.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group"
      onClick={() => setSelectedContact(contact)}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{contact.avatar}</div>
            <div>
              <h3 className="font-bold text-gray-900">{contact.nom}</h3>
              <p className="text-sm text-gray-500">{contact.fonction}</p>
              <p className="text-sm font-medium text-purple-600">{contact.entreprise}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              contact.isFavorite = !contact.isFavorite;
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {contact.isFavorite ? (
              <StarSolid className="w-5 h-5 text-yellow-500" />
            ) : (
              <StarIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <PhoneIcon className="w-4 h-4" />
            <span>{contact.telephone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <EnvelopeIcon className="w-4 h-4" />
            <span className="truncate">{contact.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4" />
            <span className="truncate">{contact.adresse}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatutColor(contact.statut)}`}>
            {contact.statut}
          </span>
          <div className="flex items-center space-x-2">
            <FireIcon className={`w-5 h-5 ${getScoreColor(contact.score)}`} />
            <span className={`font-bold ${getScoreColor(contact.score)}`}>{contact.score}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {contact.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center border-t pt-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">{contact.interactions}</p>
            <p className="text-xs text-gray-500">Interactions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{contact.projets}</p>
            <p className="text-xs text-gray-500">Projets</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">{(contact.chiffreAffaires/1000).toFixed(0)}k€</p>
            <p className="text-xs text-gray-500">CA</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <ClockIcon className="w-3 h-3" />
            <span>Dernier contact: {contact.dernierContact}</span>
          </div>
          <div className="flex -space-x-2">
            {contact.reseau.slice(0, 3).map((person, index) => (
              <div key={index} className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600 border-2 border-white">
                {person.charAt(0)}
              </div>
            ))}
            {contact.reseau.length > 3 && (
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                +{contact.reseau.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderNetworkView = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-purple-200 rounded-full" />
            <div className="w-96 h-96 border-2 border-purple-100 rounded-full absolute" />
          </div>
          {filteredContacts.map((contact, index) => {
            const angle = (index * 360) / filteredContacts.length;
            const radius = 150;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                <div className="relative group">
                  <div className="text-4xl cursor-pointer hover:scale-110 transition-transform">
                    {contact.avatar}
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {contact.nom}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Gérez vos contacts avec un réseau de relations avancé</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
          >
            <UserPlusIcon className="w-5 h-5" />
            <span>Nouveau contact</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {viewModes.map(mode => (
              <button
                key={mode.id}
                onClick={() => setSelectedView(mode.id)}
                className={`p-2 rounded-lg transition-colors ${
                  selectedView === mode.id ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
                }`}
              >
                {mode.icon}
              </button>
            ))}
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t"
          >
            <div className="flex items-center space-x-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedFilter === filter.id
                      ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 text-xs opacity-60">({filter.count})</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <UserGroupIcon className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold">{contacts.length}</p>
          <p className="text-sm opacity-80">Total contacts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white"
        >
          <StarIcon className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold">1</p>
          <p className="text-sm opacity-80">Contacts VIP</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl p-6 text-white"
        >
          <ArrowTrendingUpIcon className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold">85%</p>
          <p className="text-sm opacity-80">Score moyen</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-6 text-white"
        >
          <BriefcaseIcon className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold">249k€</p>
          <p className="text-sm opacity-80">CA total</p>
        </motion.div>
      </div>

      {selectedView === 'network' ? (
        renderNetworkView()
      ) : (
        <div className={selectedView === 'grid' ? 'grid grid-cols-3 gap-6' : 'space-y-4'}>
          <AnimatePresence>
            {filteredContacts.map(contact => renderContactCard(contact))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedContact(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Détails du contact</h2>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="text-6xl">{selectedContact.avatar}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{selectedContact.nom}</h3>
                        <p className="text-gray-600">{selectedContact.fonction}</p>
                        <p className="text-purple-600 font-medium">{selectedContact.entreprise}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Informations de contact</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <PhoneIcon className="w-5 h-5" />
                            <span>{selectedContact.telephone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <EnvelopeIcon className="w-5 h-5" />
                            <span>{selectedContact.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPinIcon className="w-5 h-5" />
                            <span>{selectedContact.adresse}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Réseaux sociaux</h4>
                        <div className="flex items-center space-x-3">
                          {selectedContact.socialLinks?.linkedin && (
                            <a href={`https://${selectedContact.socialLinks.linkedin}`} className="text-blue-600 hover:text-blue-700">
                              <GlobeAltIcon className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Notes</h4>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedContact.notes}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Statistiques</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{selectedContact.interactions}</p>
                          <p className="text-sm text-gray-600">Interactions</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{selectedContact.projets}</p>
                          <p className="text-sm text-gray-600">Projets</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{(selectedContact.chiffreAffaires/1000).toFixed(0)}k€</p>
                          <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">{selectedContact.score}</p>
                          <p className="text-sm text-gray-600">Score</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Réseau de relations</h4>
                      <div className="space-y-2">
                        {selectedContact.reseau.map((person, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-600">
                              {person.charAt(0)}
                            </div>
                            <span className="text-gray-700">{person}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedContact.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactsPremium;