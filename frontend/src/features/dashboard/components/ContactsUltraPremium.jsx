import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UltraPremiumContainer from './UltraPremiumContainer';
import useThemeUltraPremium from '../hooks/useThemeUltraPremium';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UserIcon,
  UsersIcon,
  TagIcon,
  HeartIcon,
  StarIcon,
  SparklesIcon,
  XMarkIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  PhotoIcon,
  PaperAirplaneIcon,
  InboxIcon,
  DocumentDuplicateIcon,
  AdjustmentsHorizontalIcon,
  BellIcon,
  IdentificationIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

const ContactsUltraPremium = () => {
  const { getClasses } = useThemeUltraPremium();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState('standard');
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  // Données enrichies pour les contacts avec historique de communication
  const [contactsData] = useState([
    {
      id: 1,
      nom: 'Marie Dubois',
      entreprise: 'ADAGIO OPERA',
      poste: 'Directrice Facilities',
      email: 'marie.dubois@adagio-opera.fr',
      telephone: '+33 1 42 36 78 90',
      mobile: '+33 6 78 90 12 34',
      adresse: '15 Rue de la Paix, 75002 Paris',
      site: 'https://adagio-opera.com',
      avatar: '👩‍💼',
      statut: 'Actif',
      type: 'Client',
      notes: 'Contact principal pour tous les projets d\'aménagement paysager',
      derniereInteraction: '2025-07-18',
      tags: ['VIP', 'Décisionneur', 'Paris'],
      score: 5,
      favoris: true,
      secteur: 'Hôtellerie',
      ca: 125000,
      role: 'Administrateur',
      photo: null,
      lastContact: { type: 'email', date: '2025-07-18', subject: 'Confirmation devis aménagement' },
      communicationHistory: [
        { id: 1, type: 'email', date: '2025-07-18', subject: 'Confirmation devis aménagement', status: 'sent' },
        { id: 2, type: 'call', date: '2025-07-15', duration: '15 min', subject: 'Suivi projet', status: 'completed' },
        { id: 3, type: 'meeting', date: '2025-07-10', duration: '1h', subject: 'Présentation propositions', status: 'completed' },
        { id: 4, type: 'email', date: '2025-07-08', subject: 'Demande de devis', status: 'received' }
      ]
    },
    {
      id: 2,
      nom: 'Jean Martin',
      entreprise: 'SEPHORA',
      poste: 'Responsable Espaces de Travail',
      email: 'jean.martin@sephora.fr',
      telephone: '+33 1 44 55 66 77',
      mobile: '+33 6 55 66 77 88',
      adresse: '56 Boulevard Haussmann, 75008 Paris',
      site: 'https://sephora.fr',
      avatar: '👨‍💼',
      statut: 'Actif',
      type: 'Client',
      notes: 'Très satisfait de nos services, recommande souvent',
      derniereInteraction: '2025-07-17',
      tags: ['Fidèle', 'Recommandeur', 'Beauté'],
      score: 5,
      favoris: true,
      secteur: 'Cosmétique',
      ca: 89000,
      role: 'Utilisateur',
      photo: '/photos/jean-martin.jpg',
      lastContact: { type: 'call', date: '2025-07-17', duration: '12 min' },
      communicationHistory: [
        { id: 1, type: 'call', date: '2025-07-17', duration: '12 min', subject: 'Suivi satisfaction', status: 'completed' },
        { id: 2, type: 'email', date: '2025-07-14', subject: 'Rapport mensuel', status: 'sent' },
        { id: 3, type: 'meeting', date: '2025-07-01', duration: '45 min', subject: 'Bilan trimestriel', status: 'completed' }
      ]
    },
    {
      id: 3,
      nom: 'Sophie Leroy',
      entreprise: 'SPOTIFY',
      poste: 'Workplace Manager',
      email: 'sophie.leroy@spotify.com',
      telephone: '+33 1 77 88 99 00',
      mobile: '+33 6 88 99 00 11',
      adresse: '32 Avenue Kleber, 75016 Paris',
      site: 'https://spotify.com',
      avatar: '👩‍🎨',
      statut: 'Actif',
      type: 'Prospect',
      notes: 'Intéressé par nos solutions innovantes pour espaces créatifs',
      derniereInteraction: '2025-07-16',
      tags: ['Innovation', 'Créatif', 'Tech'],
      score: 4,
      favoris: false,
      secteur: 'Technologie',
      ca: 0,
      role: 'Visiteur',
      photo: null,
      lastContact: { type: 'email', date: '2025-07-16', subject: 'Proposition commerciale' },
      communicationHistory: [
        { id: 1, type: 'email', date: '2025-07-16', subject: 'Proposition commerciale', status: 'sent' },
        { id: 2, type: 'call', date: '2025-07-12', duration: '25 min', subject: 'Découverte besoins', status: 'completed' },
        { id: 3, type: 'email', date: '2025-07-10', subject: 'Demande d\'information', status: 'received' }
      ]
    },
    {
      id: 4,
      nom: 'Pierre Moreau',
      entreprise: 'HERMES',
      poste: 'Directeur Immobilier',
      email: 'pierre.moreau@hermes.com',
      telephone: '+33 1 40 50 60 70',
      mobile: '+33 6 50 60 70 80',
      adresse: '24 Faubourg Saint-Honoré, 75008 Paris',
      site: 'https://hermes.com',
      avatar: '👨‍💹',
      statut: 'Actif',
      type: 'Client',
      notes: 'Exigences élevées, apprécie la qualité premium de nos services',
      derniereInteraction: '2025-07-15',
      tags: ['Premium', 'Luxe', 'Exigent'],
      score: 5,
      favoris: true,
      secteur: 'Luxe',
      ca: 156000,
      role: 'Administrateur',
      photo: '/photos/pierre-moreau.jpg',
      lastContact: { type: 'meeting', date: '2025-07-15', duration: '1h30' },
      communicationHistory: [
        { id: 1, type: 'meeting', date: '2025-07-15', duration: '1h30', subject: 'Revue contrat annuel', status: 'completed' },
        { id: 2, type: 'email', date: '2025-07-13', subject: 'Préparation RDV', status: 'sent' },
        { id: 3, type: 'call', date: '2025-07-05', duration: '20 min', subject: 'Urgence intervention', status: 'completed' }
      ]
    },
    {
      id: 5,
      nom: 'Emma Dubois',
      entreprise: 'LYDIA SOLUTIONS',
      poste: 'Office Manager',
      email: 'emma.dubois@lydia-app.com',
      telephone: '+33 1 30 40 50 60',
      mobile: '+33 6 40 50 60 70',
      adresse: '15 Rue des Entrepreneurs, 75015 Paris',
      site: 'https://lydia-app.com',
      avatar: '👩‍💻',
      statut: 'Inactif',
      type: 'Ancien Client',
      notes: 'Contrat terminé, mais relation maintenue pour futurs projets',
      derniereInteraction: '2025-06-20',
      tags: ['Fintech', 'Potentiel', 'Suivi'],
      score: 3,
      favoris: false,
      secteur: 'Finance',
      ca: 45000,
      role: 'Ancien Client',
      photo: null,
      lastContact: { type: 'email', date: '2025-06-20', subject: 'Fin de contrat' },
      communicationHistory: [
        { id: 1, type: 'email', date: '2025-06-20', subject: 'Fin de contrat', status: 'sent' },
        { id: 2, type: 'call', date: '2025-06-15', duration: '10 min', subject: 'Clôture dossier', status: 'completed' },
        { id: 3, type: 'meeting', date: '2025-05-30', duration: '30 min', subject: 'Bilan final', status: 'completed' }
      ]
    }
  ]);

  const secteurs = ['Tous', 'Hôtellerie', 'Cosmétique', 'Technologie', 'Luxe', 'Finance'];
  const types = ['Tous', 'Client', 'Prospect', 'Ancien Client', 'Partenaire'];
  const roles = ['Visiteur', 'Utilisateur', 'Administrateur', 'Ancien Client'];
  
  // Templates d'emails
  const emailTemplates = {
    standard: {
      subject: 'Nouvelle information de notre équipe',
      body: 'Bonjour,\n\nNous espérons que vous allez bien...\n\nCordialement,\nL\'equipe Pousse'
    },
    commercial: {
      subject: 'Proposition commerciale personnalisée',
      body: 'Cher client,\n\nSuite à notre échange...\n\nRestant à votre disposition'
    },
    suivi: {
      subject: 'Suivi de votre projet',
      body: 'Bonjour,\n\nVoici le point d\'avancement...\n\nBien à vous'
    },
    satisfaction: {
      subject: 'Enquête de satisfaction',
      body: 'Bonjour,\n\nNous aimerions connaître votre avis...\n\nMerci pour votre confiance'
    }
  };
  
  // Formats d'import supportés
  const importFormats = {
    csv: { name: 'CSV', description: 'Fichier CSV standard', icon: DocumentTextIcon },
    vcard: { name: 'vCard', description: 'Format vCard (.vcf)', icon: IdentificationIcon },
    google: { name: 'Google Contacts', description: 'Export Google Contacts', icon: UserGroupIcon },
    outlook: { name: 'Outlook', description: 'Contacts Outlook', icon: EnvelopeIcon }
  };

  // Filtrage des contacts
  const filteredContacts = contactsData.filter(contact => {
    const matchSearch = searchTerm === '' ||
      contact.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchFilter = activeFilter === 'Tous' ||
      (activeFilter === 'Favoris' && contact.favoris) ||
      contact.type === activeFilter ||
      contact.secteur === activeFilter ||
      contact.statut === activeFilter;

    return matchSearch && matchFilter;
  });

  const getTypeColor = (type) => {
    const colors = {
      'Client': 'from-green-400 to-green-600',
      'Prospect': 'from-blue-400 to-blue-600',
      'Ancien Client': 'from-gray-400 to-gray-600',
      'Partenaire': 'from-purple-400 to-purple-600'
    };
    return colors[type] || 'from-gray-400 to-gray-600';
  };

  const getStatutColor = (statut) => {
    return statut === 'Actif' ? 'text-green-500' : 'text-gray-500';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Gestion des contacts sélectionnés pour email groupé
  const handleContactSelection = (contactId) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };
  
  // Gestion de l'upload de photos
  const handlePhotoUpload = (contactId, file) => {
    // Simulation de l'upload
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedContacts = contactsData.map(contact => {
        if (contact.id === contactId) {
          return { ...contact, photo: e.target.result };
        }
        return contact;
      });
      // Ici on mettrait à jour le state avec updatedContacts
    };
    reader.readAsDataURL(file);
  };
  
  // Simulation import de contacts
  const handleImport = (format, file) => {
    console.log(`Import depuis ${format}:`, file.name);
    // Simulation du traitement d'import
    setTimeout(() => {
      alert(`${Math.floor(Math.random() * 50) + 10} contacts importés avec succès !`);
      setShowImportModal(false);
    }, 2000);
  };
  
  // Envoi d'email groupé
  const handleGroupEmail = () => {
    const selectedContactsData = contactsData.filter(c => selectedContacts.includes(c.id));
    console.log('Envoi email groupé à:', selectedContactsData.map(c => c.email));
    // Simulation d'envoi
    setTimeout(() => {
      alert(`Email envoyé à ${selectedContacts.length} contact(s) !`);
      setShowEmailModal(false);
      setSelectedContacts([]);
    }, 1000);
  };
  
  // Obtenir l'icône du type de communication
  const getCommunicationIcon = (type) => {
    switch(type) {
      case 'email': return EnvelopeIcon;
      case 'call': return PhoneIcon;
      case 'meeting': return CalendarDaysIcon;
      default: return ChatBubbleLeftRightIcon;
    }
  };
  
  // Obtenir la couleur du rôle
  const getRoleColor = (role) => {
    const colors = {
      'Administrateur': 'from-red-400 to-red-600',
      'Utilisateur': 'from-blue-400 to-blue-600',
      'Visiteur': 'from-gray-400 to-gray-600',
      'Ancien Client': 'from-orange-400 to-orange-600'
    };
    return colors[role] || 'from-gray-400 to-gray-600';
  };

  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const ContactCard = ({ contact, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={getClasses('card', 'p-6 cursor-pointer group relative overflow-hidden')}
      onClick={() => {setSelectedContact(contact); setShowModal(true);}}
    >
      {/* Badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-1">
        {contact.favoris && <HeartIcon className="w-5 h-5 text-red-500 fill-current" />}
        {selectedContacts.includes(contact.id) && <SparklesIcon className="w-5 h-5 text-yellow-500 fill-current" />}
        {contact.photo && <PhotoIcon className="w-5 h-5 text-green-500" />}
      </div>
      
      {/* Checkbox pour sélection multiple */}
      <div className="absolute top-4 left-4">
        <input
          type="checkbox"
          checked={selectedContacts.includes(contact.id)}
          onChange={() => handleContactSelection(contact.id)}
          className="w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Avatar et infos principales */}
      <div className="flex items-start gap-4 mb-4">
        <div className={getClasses('glass', 'w-16 h-16 flex items-center justify-center rounded-2xl text-3xl relative')}>
          {contact.photo ? (
            <img src={contact.photo} alt={contact.nom} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            contact.avatar
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedContact(contact);
              setShowPhotoModal(true);
            }}
            className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 transition-colors"
          >
            <CameraIcon className="w-3 h-3" />
          </button>
        </div>
        <div className="flex-1">
          <h3 className={getClasses('text', 'font-bold text-xl mb-1')}>
            {contact.nom}
          </h3>
          <p className={getClasses('accent', 'font-semibold text-lg mb-1')}>
            {contact.entreprise}
          </p>
          <p className={getClasses('textMuted', 'text-sm')}>
            {contact.poste}
          </p>
        </div>
      </div>

      {/* Type, rôle et statut */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-1">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTypeColor(contact.type)} text-white shadow-lg`}
          >
            {contact.type}
          </motion.span>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleColor(contact.role)} text-white shadow-lg`}
          >
            <ShieldCheckIcon className="w-3 h-3 mr-1" />
            {contact.role}
          </motion.span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${contact.statut === 'Actif' ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className={`text-sm font-medium ${getStatutColor(contact.statut)}`}>
            {contact.statut}
          </span>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between mb-4">
        <StarRating rating={contact.score} />
        <span className={getClasses('textMuted', 'text-sm')}>
          Secteur: {contact.secteur}
        </span>
      </div>

      {/* Contact info */}
      <div className={getClasses('glass', 'p-4 rounded-xl space-y-3 mb-4')}>
        <div className="flex items-center gap-3">
          <EnvelopeIcon className={getClasses('accent', 'w-4 h-4')} />
          <span className={getClasses('text', 'text-sm truncate')}>
            {contact.email}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <PhoneIcon className={getClasses('accent', 'w-4 h-4')} />
          <span className={getClasses('text', 'text-sm')}>
            {contact.telephone}
          </span>
        </div>
        {contact.mobile && (
          <div className="flex items-center gap-3">
            <DevicePhoneMobileIcon className={getClasses('accent', 'w-4 h-4')} />
            <span className={getClasses('text', 'text-sm')}>
              {contact.mobile}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {contact.tags.slice(0, 3).map((tag, idx) => (
          <motion.span
            key={idx}
            whileHover={{ scale: 1.05 }}
            className={getClasses('glass', 'px-2 py-1 rounded-full text-xs font-medium')}
          >
            {tag}
          </motion.span>
        ))}
        {contact.tags.length > 3 && (
          <span className={getClasses('textMuted', 'text-xs')}>
            +{contact.tags.length - 3} autres
          </span>
        )}
      </div>

      {/* CA et dernière interaction */}
      <div className={getClasses('glass', 'p-4 rounded-xl mb-4')}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={getClasses('textMuted', 'text-xs')}>CA généré</p>
            <p className={getClasses('text', contact.ca > 100000 ? 'text-green-600 font-bold text-lg' : 'font-semibold')}>
              {contact.ca > 0 ? formatCurrency(contact.ca) : 'N/A'}
            </p>
          </div>
          <div>
            <p className={getClasses('textMuted', 'text-xs')}>Dernière interaction</p>
            <p className={getClasses('text', 'font-medium text-sm')}>
              {new Date(contact.derniereInteraction).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Dernière communication */}
      {contact.lastContact && (
        <div className={getClasses('glass', 'p-3 rounded-xl mb-4')}>
          <div className="flex items-center gap-2 mb-1">
            {React.createElement(getCommunicationIcon(contact.lastContact.type), { className: getClasses('accent', 'w-4 h-4') })}
            <span className={getClasses('textMuted', 'text-xs')}>Dernière communication</span>
          </div>
          <p className={getClasses('text', 'text-sm font-medium')}>
            {contact.lastContact.subject || `${contact.lastContact.type} - ${contact.lastContact.duration || ''}`}
          </p>
          <p className={getClasses('textMuted', 'text-xs')}>
            {new Date(contact.lastContact.date).toLocaleDateString('fr-FR')}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-1 mt-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
          title="Voir le profil"
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
          title="Appeler"
        >
          <PhoneIcon className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
          title="Envoyer email"
        >
          <EnvelopeIcon className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedContact(contact);
            setShowHistoryModal(true);
          }}
          className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
          title="Historique communication"
        >
          <ClockIcon className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedContact(contact);
            setShowRoleModal(true);
          }}
          className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
          title="Gérer les rôles"
        >
          <ShieldCheckIcon className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <UltraPremiumContainer
      title="Contacts Ultra Premium"
      icon={UserIcon}
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
              onClick={() => setShowAddModal(true)}
              className={getClasses('button', 'flex items-center gap-2 px-6 py-3')}
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nouveau Contact</span>
              <SparklesIcon className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowImportModal(true)}
              className={getClasses('glass', 'flex items-center gap-2 px-4 py-3 hover:shadow-lg')}
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>Importer</span>
            </motion.button>
            
            {selectedContacts.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEmailModal(true)}
                className={getClasses('buttonPrimary', 'flex items-center gap-2 px-4 py-3')}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
                <span>Email Groupé ({selectedContacts.length})</span>
              </motion.button>
            )}
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className={getClasses('accent', 'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5')} />
              <input
                type="text"
                placeholder="Rechercher contact, entreprise, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={getClasses('input', 'pl-10 w-full')}
              />
            </div>
          </div>

          {/* Mode d'affichage */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${viewMode === 'grid'
                  ? getClasses('buttonPrimary')
                  : getClasses('glass', 'hover:shadow-lg')
                }
              `}
            >
              🏗️ Grille
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${viewMode === 'list'
                  ? getClasses('buttonPrimary')
                  : getClasses('glass', 'hover:shadow-lg')
                }
              `}
            >
              📊 Liste
            </motion.button>
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
          {['Tous', 'Favoris', 'Actif', 'Inactif', ...types.slice(1), ...secteurs.slice(1)].map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
                ${activeFilter === filter
                  ? getClasses('buttonPrimary')
                  : getClasses('glass', 'hover:shadow-lg')
                }
              `}
            >
              {filter === 'Favoris' && <HeartIcon className="w-4 h-4" />}
              {filter === 'Tous' && <UsersIcon className="w-4 h-4" />}
              {filter}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Contacts', value: filteredContacts.length, icon: '👥', color: 'from-blue-400 to-blue-600' },
          { label: 'Clients Actifs', value: filteredContacts.filter(c => c.statut === 'Actif' && c.type === 'Client').length, icon: '✅', color: 'from-green-400 to-green-600' },
          { label: 'Prospects', value: filteredContacts.filter(c => c.type === 'Prospect').length, icon: '🎯', color: 'from-orange-400 to-orange-600' },
          { 
            label: 'CA Total',
            value: formatCurrency(filteredContacts.filter(c => c.type === 'Client').reduce((acc, c) => acc + c.ca, 0)),
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

      {/* Grille des contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContacts.map((contact, index) => (
          <ContactCard key={contact.id} contact={contact} index={index} />
        ))}
      </div>

      {/* Message si aucun contact */}
      {filteredContacts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={getClasses('card', 'p-12 text-center')}
        >
          <div className="text-6xl mb-4">📇</div>
          <h3 className={getClasses('text', 'text-xl font-bold mb-2')}>Aucun contact trouvé</h3>
          <p className={getClasses('textMuted')}>Essayez de modifier vos critères de recherche</p>
        </motion.div>
      )}

      {/* Modal de détails */}
      <AnimatePresence>
        {showModal && selectedContact && (
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
              className={getClasses('card', 'max-w-4xl w-full max-h-[90vh] overflow-y-auto')}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-6">
                    <div className={getClasses('glass', 'w-20 h-20 flex items-center justify-center rounded-3xl text-5xl')}>
                      {selectedContact.avatar}
                    </div>
                    <div>
                      <h2 className={getClasses('text', 'text-3xl font-bold mb-2')}>
                        {selectedContact.nom}
                      </h2>
                      <p className={getClasses('accent', 'text-xl font-semibold mb-1')}>
                        {selectedContact.entreprise}
                      </p>
                      <p className={getClasses('textMuted')}>
                        {selectedContact.poste}
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Informations de contact</h3>
                    <div className={getClasses('glass', 'p-6 rounded-xl space-y-4')}>
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className={getClasses('accent', 'w-5 h-5')} />
                        <span className={getClasses('text', 'font-medium')}>{selectedContact.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <PhoneIcon className={getClasses('accent', 'w-5 h-5')} />
                        <span className={getClasses('text', 'font-medium')}>{selectedContact.telephone}</span>
                      </div>
                      {selectedContact.mobile && (
                        <div className="flex items-center gap-3">
                          <DevicePhoneMobileIcon className={getClasses('accent', 'w-5 h-5')} />
                          <span className={getClasses('text', 'font-medium')}>{selectedContact.mobile}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <MapPinIcon className={getClasses('accent', 'w-5 h-5 mt-1')} />
                        <span className={getClasses('text', 'font-medium')}>{selectedContact.adresse}</span>
                      </div>
                      {selectedContact.site && (
                        <div className="flex items-center gap-3">
                          <GlobeAltIcon className={getClasses('accent', 'w-5 h-5')} />
                          <a 
                            href={selectedContact.site} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={getClasses('accent', 'font-medium hover:underline')}
                          >
                            {selectedContact.site}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Données business</h3>
                    <div className={getClasses('glass', 'p-6 rounded-xl space-y-4')}>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Type:</span>
                        <div className="mt-1">
                          <motion.span 
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTypeColor(selectedContact.type)} text-white shadow-lg`}
                          >
                            {selectedContact.type}
                          </motion.span>
                        </div>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Secteur:</span>
                        <p className={getClasses('text', 'font-bold text-lg')}>{selectedContact.secteur}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Score:</span>
                        <div className="mt-1">
                          <StarRating rating={selectedContact.score} />
                        </div>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>CA généré:</span>
                        <p className={getClasses('accent', 'font-bold text-2xl')}>
                          {selectedContact.ca > 0 ? formatCurrency(selectedContact.ca) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Dernière interaction:</span>
                        <p className={getClasses('text', 'font-medium')}>
                          {new Date(selectedContact.derniereInteraction).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedContact.notes && (
                  <div className="mt-8">
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Notes</h3>
                    <div className={getClasses('glass', 'p-6 rounded-xl')}>
                      <p className={getClasses('text')}>{selectedContact.notes}</p>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Tags</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedContact.tags.map((tag, idx) => (
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
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    Appeler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={getClasses('button', 'flex-1')}
                  >
                    <EnvelopeIcon className="w-5 h-5 mr-2" />
                    Envoyer Email
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Modal d'import */}
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowImportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'max-w-2xl w-full p-8')}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={getClasses('text', 'text-2xl font-bold')}>Importer des Contacts</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className={getClasses('glass', 'p-2 rounded-xl hover:bg-red-500/20')}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(importFormats).map(([key, format]) => {
                  const Icon = format.icon;
                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      className={getClasses('glass', 'p-6 rounded-xl cursor-pointer text-center')}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = key === 'csv' ? '.csv' : key === 'vcard' ? '.vcf' : '*';
                        input.onchange = (e) => handleImport(key, e.target.files[0]);
                        input.click();
                      }}
                    >
                      <Icon className={getClasses('accent', 'w-12 h-12 mx-auto mb-3')} />
                      <h3 className={getClasses('text', 'font-bold text-lg mb-1')}>{format.name}</h3>
                      <p className={getClasses('textMuted', 'text-sm')}>{format.description}</p>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className={getClasses('glass', 'p-4 rounded-xl')}>
                <h4 className={getClasses('text', 'font-semibold mb-2')}>Instructions :</h4>
                <ul className={getClasses('textMuted', 'text-sm space-y-1')}>
                  <li>• CSV : Format standard avec colonnes nom, email, téléphone, entreprise</li>
                  <li>• vCard : Fichiers .vcf exportés depuis votre carnet d'adresses</li>
                  <li>• Google Contacts : Export depuis Google Contacts</li>
                  <li>• Outlook : Fichiers de contacts Outlook</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Modal email groupé */}
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'max-w-4xl w-full p-8')}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={getClasses('text', 'text-2xl font-bold')}>Email Groupé à {selectedContacts.length} contact(s)</h2>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className={getClasses('glass', 'p-2 rounded-xl hover:bg-red-500/20')}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className={getClasses('text', 'text-lg font-bold mb-4')}>Destinataires</h3>
                  <div className={getClasses('glass', 'p-4 rounded-xl max-h-60 overflow-y-auto')}>
                    {contactsData
                      .filter(c => selectedContacts.includes(c.id))
                      .map(contact => (
                        <div key={contact.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                          <div className="text-2xl">{contact.avatar}</div>
                          <div>
                            <p className={getClasses('text', 'font-medium')}>{contact.nom}</p>
                            <p className={getClasses('textMuted', 'text-sm')}>{contact.email}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <h3 className={getClasses('text', 'text-lg font-bold mb-4')}>Template</h3>
                  <div className="space-y-4">
                    <select 
                      value={emailTemplate}
                      onChange={(e) => setEmailTemplate(e.target.value)}
                      className={getClasses('input', 'w-full')}
                    >
                      {Object.entries(emailTemplates).map(([key, template]) => (
                        <option key={key} value={key}>{template.subject}</option>
                      ))}
                    </select>
                    
                    <div className={getClasses('glass', 'p-4 rounded-xl')}>
                      <h4 className={getClasses('text', 'font-semibold mb-2')}>Objet :</h4>
                      <input 
                        type="text" 
                        value={emailTemplates[emailTemplate].subject}
                        className={getClasses('input', 'w-full mb-4')}
                        readOnly
                      />
                      
                      <h4 className={getClasses('text', 'font-semibold mb-2')}>Message :</h4>
                      <textarea 
                        rows={8}
                        value={emailTemplates[emailTemplate].body}
                        className={getClasses('input', 'w-full resize-none')}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGroupEmail}
                  className={getClasses('buttonPrimary', 'flex-1')}
                >
                  <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                  Envoyer à {selectedContacts.length} contact(s)
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEmailModal(false)}
                  className={getClasses('button', 'px-6')}
                >
                  Annuler
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Modal historique de communication */}
        {showHistoryModal && selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8')}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={getClasses('text', 'text-2xl font-bold')}>Historique - {selectedContact.nom}</h2>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className={getClasses('glass', 'p-2 rounded-xl hover:bg-red-500/20')}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedContact.communicationHistory?.map(comm => {
                  const Icon = getCommunicationIcon(comm.type);
                  return (
                    <motion.div
                      key={comm.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={getClasses('glass', 'p-4 rounded-xl')}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${
                          comm.type === 'email' ? 'bg-blue-100' :
                          comm.type === 'call' ? 'bg-green-100' :
                          'bg-purple-100'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className={getClasses('text', 'font-semibold')}>{comm.subject}</h4>
                            <span className={getClasses('textMuted', 'text-sm')}>
                              {new Date(comm.date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={getClasses('textMuted', 'text-sm capitalize')}>{comm.type}</span>
                            {comm.duration && (
                              <span className={getClasses('textMuted', 'text-sm')}>Durée: {comm.duration}</span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              comm.status === 'completed' ? 'bg-green-100 text-green-800' :
                              comm.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {comm.status === 'completed' ? 'Terminé' : 
                               comm.status === 'sent' ? 'Envoyé' : 'Reçu'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={getClasses('buttonPrimary', 'w-full')}
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Ajouter une Communication
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Modal gestion des rôles */}
        {showRoleModal && selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRoleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'max-w-2xl w-full p-8')}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={getClasses('text', 'text-2xl font-bold')}>Rôles et Permissions - {selectedContact.nom}</h2>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className={getClasses('glass', 'p-2 rounded-xl hover:bg-red-500/20')}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className={getClasses('text', 'text-lg font-bold mb-4')}>Rôle Actuel</h3>
                  <div className={getClasses('glass', 'p-4 rounded-xl')}>
                    <motion.span 
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${getRoleColor(selectedContact.role)} text-white shadow-lg`}
                    >
                      <ShieldCheckIcon className="w-4 h-4 mr-2" />
                      {selectedContact.role}
                    </motion.span>
                  </div>
                </div>
                
                <div>
                  <h3 className={getClasses('text', 'text-lg font-bold mb-4')}>Changer de Rôle</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {roles.map(role => (
                      <motion.div
                        key={role}
                        whileHover={{ scale: 1.02 }}
                        className={`
                          ${getClasses('glass', 'p-4 rounded-xl cursor-pointer text-center')}
                          ${role === selectedContact.role ? 'ring-2 ring-blue-500' : ''}
                        `}
                      >
                        <motion.span 
                          className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${getRoleColor(role)} text-white shadow-lg mb-2`}
                        >
                          <ShieldCheckIcon className="w-4 h-4 mr-1" />
                          {role}
                        </motion.span>
                        <p className={getClasses('textMuted', 'text-xs')}>
                          {role === 'Administrateur' ? 'Accès complet' :
                           role === 'Utilisateur' ? 'Accès standard' :
                           role === 'Visiteur' ? 'Accès limité' :
                           'Accès archivé'}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className={getClasses('text', 'text-lg font-bold mb-4')}>Permissions Détaillées</h3>
                  <div className={getClasses('glass', 'p-4 rounded-xl')}>
                    {[
                      { name: 'Voir les projets', granted: ['Administrateur', 'Utilisateur'].includes(selectedContact.role) },
                      { name: 'Modifier les données', granted: ['Administrateur'].includes(selectedContact.role) },
                      { name: 'Accès aux devis', granted: ['Administrateur', 'Utilisateur'].includes(selectedContact.role) },
                      { name: 'Communication directe', granted: true },
                      { name: 'Archivé', granted: selectedContact.role === 'Ancien Client' }
                    ].map((perm, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className={getClasses('text', 'text-sm')}>{perm.name}</span>
                        <span className={`w-3 h-3 rounded-full ${
                          perm.granted ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={getClasses('buttonPrimary', 'flex-1')}
                >
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  Sauvegarder les Modifications
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRoleModal(false)}
                  className={getClasses('button', 'px-6')}
                >
                  Annuler
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Modal gestion des photos */}
        {showPhotoModal && selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPhotoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={getClasses('card', 'max-w-xl w-full p-8')}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={getClasses('text', 'text-2xl font-bold')}>Photo - {selectedContact.nom}</h2>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className={getClasses('glass', 'p-2 rounded-xl hover:bg-red-500/20')}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="text-center space-y-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
                  {selectedContact.photo ? (
                    <img src={selectedContact.photo} alt={selectedContact.nom} className="w-full h-full object-cover" />
                  ) : (
                    <div className={getClasses('glass', 'w-full h-full flex items-center justify-center text-6xl')}>
                      {selectedContact.avatar}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => photoInputRef.current?.click()}
                    className={getClasses('buttonPrimary', 'w-full')}
                  >
                    <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                    Télécharger une Photo
                  </motion.button>
                  
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handlePhotoUpload(selectedContact.id, e.target.files[0]);
                        setShowPhotoModal(false);
                      }
                    }}
                  />
                  
                  {selectedContact.photo && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={getClasses('button', 'w-full border-red-200 hover:bg-red-50')}
                    >
                      <TrashIcon className="w-5 h-5 mr-2" />
                      Supprimer la Photo
                    </motion.button>
                  )}
                </div>
                
                <div className={getClasses('glass', 'p-4 rounded-xl text-left')}>
                  <h4 className={getClasses('text', 'font-semibold mb-2')}>Format supportés :</h4>
                  <p className={getClasses('textMuted', 'text-sm')}>JPG, PNG, GIF - Taille max: 5MB</p>
                  <p className={getClasses('textMuted', 'text-sm')}>Recommandé: Images carrées 400x400px minimum</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default ContactsUltraPremium;