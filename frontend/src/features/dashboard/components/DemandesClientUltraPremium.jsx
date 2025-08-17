import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UltraPremiumContainer from './UltraPremiumContainer';
import useThemeUltraPremium from '../hooks/useThemeUltraPremium';
import {
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TagIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ArrowUpIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon as ClockPendingIcon,
  UserGroupIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const DemandesClientUltraPremium = () => {
  const { getClasses } = useThemeUltraPremium();
  
  const [activeTab, setActiveTab] = useState('Tableau');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDemandes, setSelectedDemandes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // cards, table, kanban

  // Données enrichies pour les demandes client
  const [demandesData] = useState([
    {
      id: 1,
      numero: 'DC001',
      titre: 'Problème d\'arrosage automatique',
      statut: 'En cours',
      priorite: 'Haut',
      client: 'ADAGIO OPERA',
      clientLogo: '🏢',
      dateDebut: '09/07/2025 09:00',
      dateFin: '09/07/2025 17:00',
      dateClôture: null,
      assignation: 'Aymeric Tireau',
      emailDemandeur: 'marie.dubois@adagio-opera.fr',
      actif: true,
      couleurLigne: 'yellow',
      progression: 65,
      urgence: 'medium',
      tags: ['Maintenance', 'Arrosage'],
      description: 'Système d\'arrosage automatique en panne depuis ce matin. Intervention urgente requise.'
    },
    {
      id: 2,
      numero: 'DC002',
      titre: 'Remplacement plantes mortes',
      statut: 'Résolu',
      priorite: 'Normal',
      client: 'SEPHORA',
      clientLogo: '💄',
      dateDebut: '08/07/2025 14:00',
      dateFin: '08/07/2025 16:00',
      dateClôture: '08/07/2025 15:30',
      assignation: 'Lucie Garcia',
      emailDemandeur: 'facilities@sephora.fr',
      actif: true,
      couleurLigne: 'green',
      progression: 100,
      urgence: 'low',
      tags: ['Remplacement', 'Entretien'],
      description: 'Remplacement de plusieurs plantes desséchées dans l\'espace d\'accueil.'
    },
    {
      id: 3,
      numero: 'DC003',
      titre: 'Installation urgente mur végétal',
      statut: 'Nouveau',
      priorite: 'Immédiat',
      client: 'SPOTIFY',
      clientLogo: '🎵',
      dateDebut: '10/07/2025 08:00',
      dateFin: '10/07/2025 18:00',
      dateClôture: null,
      assignation: 'David Celeste',
      emailDemandeur: 'office@spotify.com',
      actif: true,
      couleurLigne: 'red',
      progression: 15,
      urgence: 'high',
      tags: ['Installation', 'Mur végétal', 'Urgent'],
      description: 'Installation d\'un mur végétal pour l\'inauguration des nouveaux locaux.'
    },
    {
      id: 4,
      numero: 'DC004',
      titre: 'Entretien mensuel espaces verts',
      statut: 'En cours',
      priorite: 'Normal',
      client: 'HERMES',
      clientLogo: '👜',
      dateDebut: '11/07/2025 10:00',
      dateFin: '11/07/2025 15:00',
      dateClôture: null,
      assignation: 'Elodie Treveten',
      emailDemandeur: 'garden@hermes.com',
      actif: true,
      couleurLigne: 'none',
      progression: 40,
      urgence: 'low',
      tags: ['Entretien', 'Récurrent'],
      description: 'Entretien mensuel programmé des espaces verts et jardins d\'entreprise.'
    },
    {
      id: 5,
      numero: 'DC005',
      titre: 'Diagnostic parasites plantes',
      statut: 'Résolu',
      priorite: 'Haut',
      client: 'LYDIA SOLUTIONS',
      clientLogo: '💳',
      dateDebut: '07/07/2025 13:00',
      dateFin: '07/07/2025 17:00',
      dateClôture: '07/07/2025 16:45',
      assignation: 'Estelle Delapierre',
      emailDemandeur: 'support@lydia-app.com',
      actif: true,
      couleurLigne: 'green',
      progression: 100,
      urgence: 'medium',
      tags: ['Diagnostic', 'Parasites', 'Traitement'],
      description: 'Diagnostic et traitement des plantes infectées par des parasites.'
    }
  ]);

  const collaborateurs = [
    'Aymeric Tireau', 'David Celeste', 'Elodie Treveten', 'Estelle Delapierre',
    'Florence ROGER', 'Lucie Garcia', 'Marine Sandoz', 'Simon Henry'
  ];
  
  const clients = ['ADAGIO OPERA', 'SEPHORA', 'SPOTIFY', 'HERMES', 'LYDIA SOLUTIONS'];
  const priorites = ['Faible', 'Normal', 'Haut', 'Urgent', 'Immédiat'];
  const statuts = ['Nouveau', 'En cours', 'Attente de réponse', 'Résolu', 'Fermé', 'Rejeté'];

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
      case 'Urgent':
        filtered = demandesData.filter(d => d.priorite === 'Urgent' || d.priorite === 'Immédiat');
        break;
      default:
        filtered = demandesData;
    }
    
    return filtered;
  };

  const filteredDemandes = getFilteredDemandes();

  const getPriorityBadge = (priorite) => {
    const colors = {
      'Faible': 'from-green-400 to-green-600',
      'Normal': 'from-gray-400 to-gray-600',
      'Haut': 'from-yellow-400 to-yellow-600',
      'Urgent': 'from-orange-400 to-orange-600',
      'Immédiat': 'from-red-400 to-red-600'
    };
    return colors[priorite] || 'from-gray-400 to-gray-600';
  };

  const getStatusBadge = (statut) => {
    const colors = {
      'Nouveau': 'from-blue-400 to-blue-600',
      'Ouvert': 'from-purple-400 to-purple-600',
      'En cours': 'from-yellow-400 to-yellow-600',
      'Résolu': 'from-green-400 to-green-600',
      'Clôturé': 'from-gray-400 to-gray-600'
    };
    return colors[statut] || 'from-gray-400 to-gray-600';
  };

  const getPriorityIcon = (priorite) => {
    const icons = {
      'Immédiat': '🚨',
      'Urgent': '🔥',
      'Haut': '⚡',
      'Normal': '📋',
      'Faible': '📝'
    };
    return icons[priorite] || '📋';
  };

  const ProgressBar = ({ value, className = '' }) => (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-2 rounded-full bg-gradient-to-r ${getClasses('primary')}`}
      />
    </div>
  );

  const DemandeCard = ({ demande, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={getClasses('card', 'p-6 cursor-pointer group relative overflow-hidden')}
      onClick={() => {setSelectedDemande(demande); setShowModal(true);}}
    >
      {/* Indicateur d'urgence */}
      <div className={`absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-b-[30px] ${
        demande.urgence === 'high' ? 'border-b-red-500' :
        demande.urgence === 'medium' ? 'border-b-yellow-500' : 'border-b-transparent'
      }`} />

      {/* Header avec client et priorité */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={getClasses('glass', 'w-12 h-12 flex items-center justify-center rounded-xl text-2xl')}>
            {demande.clientLogo}
          </div>
          <div>
            <h3 className={getClasses('text', 'font-bold text-lg')}>
              {demande.client}
            </h3>
            <p className={getClasses('textMuted', 'text-sm')}>
              #{demande.numero}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getPriorityIcon(demande.priorite)}
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPriorityBadge(demande.priorite)} text-white shadow-lg`}
          >
            {demande.priorite}
          </motion.span>
        </div>
      </div>

      {/* Titre de la demande */}
      <div className="mb-4">
        <h4 className={getClasses('text', 'font-semibold text-lg mb-2')}>
          {demande.titre}
        </h4>
        <p className={getClasses('textMuted', 'text-sm line-clamp-2')}>
          {demande.description}
        </p>
      </div>

      {/* Statut */}
      <div className="mb-4">
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusBadge(demande.statut)} text-white shadow-lg`}
        >
          {demande.statut}
        </motion.span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {demande.tags.slice(0, 3).map((tag, idx) => (
          <motion.span
            key={idx}
            whileHover={{ scale: 1.05 }}
            className={getClasses('glass', 'px-2 py-1 rounded-full text-xs font-medium')}
          >
            {tag}
          </motion.span>
        ))}
        {demande.tags.length > 3 && (
          <span className={getClasses('textMuted', 'text-xs')}>
            +{demande.tags.length - 3} autres
          </span>
        )}
      </div>

      {/* Progression */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className={getClasses('text', 'text-sm font-medium')}>Progression</span>
          <span className={getClasses('accent', 'text-sm font-bold')}>{demande.progression}%</span>
        </div>
        <ProgressBar value={demande.progression} />
      </div>

      {/* Dates et assignation */}
      <div className={getClasses('glass', 'p-4 rounded-xl space-y-3')}>
        <div className="flex items-center gap-2">
          <ClockIcon className={getClasses('accent', 'w-4 h-4')} />
          <span className={getClasses('text', 'text-sm')}>
            Début: {demande.dateDebut}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className={getClasses('accent', 'w-4 h-4')} />
          <span className={getClasses('text', 'text-sm')}>
            Fin: {demande.dateFin}
          </span>
        </div>
        {demande.dateClôture && (
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
            <span className="text-green-600 text-sm">
              Clôturé: {demande.dateClôture}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <UserIcon className={getClasses('accent', 'w-4 h-4')} />
          <span className={getClasses('text', 'text-sm font-medium')}>
            {demande.assignation}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-4">
        <div className={getClasses('textMuted', 'text-xs')}>
          {demande.emailDemandeur}
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
            title="Voir la demande"
          >
            <EyeIcon className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={getClasses('glass', 'p-2 rounded-lg transition-all hover:shadow-lg')}
            title="Modifier la demande"
          >
            <PencilIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <UltraPremiumContainer
      title="Demandes Client Ultra Premium"
      icon={UserGroupIcon}
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
              <span>Nouvelle Demande</span>
              <SparklesIcon className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={getClasses('glass', 'flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:shadow-lg')}
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filtres</span>
            </motion.button>
          </div>

          {/* Modes d'affichage */}
          <div className="flex items-center gap-2">
            {[
              { mode: 'cards', icon: '🏗️', label: 'Cartes' },
              { mode: 'table', icon: '📊', label: 'Tableau' },
              { mode: 'kanban', icon: '📋', label: 'Kanban' }
            ].map((option) => (
              <motion.button
                key={option.mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(option.mode)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                  ${viewMode === option.mode
                    ? getClasses('buttonPrimary')
                    : getClasses('glass', 'hover:shadow-lg')
                  }
                `}
                title={option.label}
              >
                <span>{option.icon}</span>
                <span className="hidden sm:inline">{option.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Onglets */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={getClasses('glass', 'rounded-xl mb-8 overflow-hidden')}
      >
        <div className="flex flex-wrap">
          {[  
            { key: 'Tableau', label: 'Toutes', count: demandesData.length },
            { key: 'Ouverts', label: 'Ouvertes', count: demandesData.filter(d => d.statut !== 'Résolu' && d.statut !== 'Fermé').length },
            { key: 'Clôturés', label: 'Clôturées', count: demandesData.filter(d => d.statut === 'Résolu' || d.statut === 'Fermé').length },
            { key: 'Urgent', label: 'Urgentes', count: demandesData.filter(d => d.priorite === 'Urgent' || d.priorite === 'Immédiat').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                py-4 px-6 font-semibold text-sm transition-all duration-200 whitespace-nowrap flex items-center gap-2
                ${activeTab === tab.key
                  ? `${getClasses('accent')} bg-gradient-to-r ${getClasses('primary')} bg-opacity-10`
                  : `${getClasses('textMuted')} hover:${getClasses('text')}`
                }
              `}
            >
              {tab.label}
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.key ? 'bg-white/20' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Demandes', value: filteredDemandes.length, icon: '📊', color: 'from-blue-400 to-blue-600' },
          { label: 'En Cours', value: filteredDemandes.filter(d => d.statut === 'En cours').length, icon: '⏳', color: 'from-yellow-400 to-yellow-600' },
          { label: 'Urgentes', value: filteredDemandes.filter(d => d.priorite === 'Urgent' || d.priorite === 'Immédiat').length, icon: '🚨', color: 'from-red-400 to-red-600' },
          { label: 'Résolues', value: filteredDemandes.filter(d => d.statut === 'Résolu').length, icon: '✅', color: 'from-green-400 to-green-600' }
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

      {/* Affichage des demandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDemandes.map((demande, index) => (
          <DemandeCard key={demande.id} demande={demande} index={index} />
        ))}
      </div>

      {/* Message si aucune demande */}
      {filteredDemandes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={getClasses('card', 'p-12 text-center')}
        >
          <div className="text-6xl mb-4">📋</div>
          <h3 className={getClasses('text', 'text-xl font-bold mb-2')}>Aucune demande trouvée</h3>
          <p className={getClasses('textMuted')}>Essayez de changer d'onglet ou de modifier vos filtres</p>
        </motion.div>
      )}

      {/* Modal de détails */}
      <AnimatePresence>
        {showModal && selectedDemande && (
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
                  <div>
                    <h2 className={getClasses('text', 'text-3xl font-bold mb-2')}>
                      {selectedDemande.titre}
                    </h2>
                    <p className={getClasses('textMuted')}>
                      Demande #{selectedDemande.numero} - {selectedDemande.client}
                    </p>
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
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Détails</h3>
                    <div className={getClasses('glass', 'p-6 rounded-xl space-y-4')}>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Description:</span>
                        <p className={getClasses('text', 'font-medium')}>{selectedDemande.description}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Assigné à:</span>
                        <p className={getClasses('text', 'font-medium')}>{selectedDemande.assignation}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Email demandeur:</span>
                        <p className={getClasses('text', 'font-medium')}>{selectedDemande.emailDemandeur}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Priorité:</span>
                        <div className="mt-1">
                          <motion.span 
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPriorityBadge(selectedDemande.priorite)} text-white shadow-lg`}
                          >
                            {getPriorityIcon(selectedDemande.priorite)} {selectedDemande.priorite}
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Planning</h3>
                    <div className={getClasses('glass', 'p-6 rounded-xl space-y-4')}>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Début:</span>
                        <p className={getClasses('text', 'font-bold text-lg')}>{selectedDemande.dateDebut}</p>
                      </div>
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Fin prévue:</span>
                        <p className={getClasses('text', 'font-bold text-lg')}>{selectedDemande.dateFin}</p>
                      </div>
                      {selectedDemande.dateClôture && (
                        <div>
                          <span className={getClasses('textMuted', 'text-sm')}>Clôturé le:</span>
                          <p className={getClasses('accent', 'font-bold text-lg')}>{selectedDemande.dateClôture}</p>
                        </div>
                      )}
                      <div>
                        <span className={getClasses('textMuted', 'text-sm')}>Progression:</span>
                        <div className="mt-2">
                          <ProgressBar value={selectedDemande.progression} />
                          <p className={getClasses('accent', 'font-bold text-center mt-2')}>{selectedDemande.progression}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className={getClasses('text', 'text-xl font-bold mb-4')}>Tags</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedDemande.tags.map((tag, idx) => (
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
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Marquer comme résolu
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UltraPremiumContainer>
  );
};

export default DemandesClientUltraPremium;