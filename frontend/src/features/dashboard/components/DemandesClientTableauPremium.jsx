import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  TagIcon,
  CurrencyEuroIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const DemandesClientTableauPremium = () => {
  const [viewMode, setViewMode] = useState('table');
  const [selectedDemandes, setSelectedDemandes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showQuickView, setShowQuickView] = useState(null);

  // Données enrichies des demandes
  const demandesData = [
    {
      id: 'DEM-2024-001',
      date: '2024-08-07 09:15',
      client: {
        nom: 'Jean Dupont',
        type: 'Premium',
        tel: '06 12 34 56 78',
        email: 'jean.dupont@email.com',
        historique: 12
      },
      intervention: {
        type: 'Élagage urgent',
        categorie: 'Urgente',
        description: 'Branche dangereuse suite tempête',
        lieu: '12 Rue des Jardins, Lyon',
        surface: '250m²'
      },
      status: {
        etat: 'urgent',
        progression: 0,
        delai: '2h',
        priorite: 'haute'
      },
      technicien: {
        nom: 'Marc Leblanc',
        disponible: true,
        specialite: 'Élagage'
      },
      finance: {
        estimation: 450,
        devise: '€',
        paiement: 'En attente'
      },
      satisfaction: null,
      commentaires: 3,
      documents: 2,
      tags: ['urgent', 'sécurité', 'tempête']
    },
    {
      id: 'DEM-2024-002',
      date: '2024-08-07 10:30',
      client: {
        nom: 'Marie Martin',
        type: 'Standard',
        tel: '06 98 76 54 32',
        email: 'marie.martin@email.com',
        historique: 5
      },
      intervention: {
        type: 'Entretien jardin',
        categorie: 'Planifiée',
        description: 'Entretien mensuel complet',
        lieu: '45 Avenue des Roses, Villeurbanne',
        surface: '180m²'
      },
      status: {
        etat: 'en_cours',
        progression: 65,
        delai: 'Aujourd\'hui',
        priorite: 'normale'
      },
      technicien: {
        nom: 'Paul Moreau',
        disponible: false,
        specialite: 'Entretien'
      },
      finance: {
        estimation: 180,
        devise: '€',
        paiement: 'Validé'
      },
      satisfaction: null,
      commentaires: 1,
      documents: 1,
      tags: ['récurrent', 'contrat']
    },
    {
      id: 'DEM-2024-003',
      date: '2024-08-06 14:00',
      client: {
        nom: 'Sophie Dubois',
        type: 'Premium',
        tel: '06 45 67 89 10',
        email: 'sophie.dubois@email.com',
        historique: 8
      },
      intervention: {
        type: 'Plantation',
        categorie: 'Normale',
        description: 'Plantation haie de lauriers',
        lieu: '78 Chemin des Oliviers, Caluire',
        surface: '50m linéaire'
      },
      status: {
        etat: 'complete',
        progression: 100,
        delai: 'Terminé',
        priorite: 'basse'
      },
      technicien: {
        nom: 'Luc Bernard',
        disponible: true,
        specialite: 'Plantation'
      },
      finance: {
        estimation: 850,
        devise: '€',
        paiement: 'Payé'
      },
      satisfaction: 5,
      commentaires: 2,
      documents: 4,
      tags: ['plantation', 'haie']
    }
  ];

  const getStatusBadge = (status) => {
    const configs = {
      urgent: {
        bg: 'bg-gradient-to-r from-red-500 to-orange-500',
        text: 'text-white',
        icon: <ExclamationTriangleIcon className="w-4 h-4" />,
        label: 'Urgent',
        animation: 'animate-pulse'
      },
      en_cours: {
        bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
        text: 'text-white',
        icon: <ClockIcon className="w-4 h-4" />,
        label: 'En cours',
        animation: ''
      },
      complete: {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
        text: 'text-white',
        icon: <CheckCircleIcon className="w-4 h-4" />,
        label: 'Complété',
        animation: ''
      },
      planifie: {
        bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
        text: 'text-white',
        icon: <CalendarIcon className="w-4 h-4" />,
        label: 'Planifié',
        animation: ''
      }
    };

    const config = configs[status] || configs.planifie;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text} ${config.animation}`}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </span>
    );
  };

  const getPriorityIndicator = (priority) => {
    const colors = {
      haute: 'bg-red-500',
      normale: 'bg-yellow-500',
      basse: 'bg-green-500'
    };
    return (
      <div className="flex items-center space-x-1">
        {priority === 'haute' && <FireIcon className="w-4 h-4 text-red-500 animate-pulse" />}
        {priority === 'normale' && <BoltIcon className="w-4 h-4 text-yellow-500" />}
        {priority === 'basse' && <SparklesIcon className="w-4 h-4 text-green-500" />}
        <div className={`w-2 h-2 rounded-full ${colors[priority]}`}></div>
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Premium */}
      <motion.div 
        className="mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-100 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Titre et stats */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Tableau de Bord Demandes
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-600">
                  <span className="font-bold text-purple-600">{demandesData.length}</span> demandes totales
                </span>
                <span className="text-sm text-gray-600">
                  <span className="font-bold text-orange-600">2</span> urgentes
                </span>
                <span className="text-sm text-gray-600">
                  <span className="font-bold text-blue-600">5</span> en cours
                </span>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="flex items-center space-x-3">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                + Nouvelle Demande
              </button>
              <button className="p-3 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300">
                <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300">
                <PrinterIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Filtres avancés */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {/* Recherche */}
            <div className="flex-1 min-w-[300px] relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par client, intervention, lieu..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-purple-500 focus:bg-white transition-all duration-300"
              />
            </div>

            {/* Filtres status */}
            <div className="flex items-center space-x-2">
              {['all', 'urgent', 'en_cours', 'complete', 'planifie'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    filterStatus === status
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {status === 'all' ? 'Tous' : status.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Vue */}
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${viewMode === 'table' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Table Premium */}
      <motion.div 
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white">
                <th className="px-6 py-4 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  ID / Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Intervention
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                  Priorité
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Technicien
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {demandesData.map((demande, index) => (
                  <motion.tr
                    key={demande.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group"
                    onMouseEnter={() => setShowQuickView(demande.id)}
                    onMouseLeave={() => setShowQuickView(null)}
                  >
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-purple-600">{demande.id}</span>
                        <span className="text-xs text-gray-500">{demande.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                          {demande.client.nom.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{demande.client.nom}</div>
                          <div className="text-xs text-gray-500 flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              demande.client.type === 'Premium' 
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' 
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {demande.client.type}
                            </span>
                            <span>{demande.client.historique} cmd</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="font-medium text-gray-900 flex items-center">
                          <TagIcon className="w-4 h-4 mr-1 text-purple-500" />
                          {demande.intervention.type}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{demande.intervention.description}</div>
                        <div className="flex items-center mt-1 text-xs text-gray-400">
                          <MapPinIcon className="w-3 h-3 mr-1" />
                          {demande.intervention.lieu}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        {getStatusBadge(demande.status.etat)}
                        {demande.status.progression > 0 && demande.status.progression < 100 && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${demande.status.progression}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getPriorityIndicator(demande.status.priorite)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${demande.technicien.disponible ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{demande.technicien.nom}</div>
                          <div className="text-xs text-gray-500">{demande.technicien.specialite}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold text-green-600">
                          {demande.finance.estimation}€
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          demande.finance.paiement === 'Payé' ? 'bg-green-100 text-green-700' :
                          demande.finance.paiement === 'Validé' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {demande.finance.paiement}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="p-2 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                          <EyeIcon className="w-4 h-4 text-purple-600" />
                        </button>
                        <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                          <PencilIcon className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-green-100 rounded-lg transition-colors duration-200">
                          <ChatBubbleLeftRightIcon className="w-4 h-4 text-green-600" />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200">
                          <TrashIcon className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Affichage <span className="font-bold">1-10</span> sur <span className="font-bold">48</span> résultats
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-white rounded-lg transition-colors duration-200">
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'hover:bg-white text-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="p-2 hover:bg-white rounded-lg transition-colors duration-200">
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DemandesClientTableauPremium;