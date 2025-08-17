import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TableCellsIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArchiveBoxIcon,
  UserPlusIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FireIcon,
  TagIcon,
  UserIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  BoltIcon,
  SparklesIcon,
  CpuChipIcon,
  BeakerIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const DemandesClientTableauUltraPremium = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignedFilter, setAssignedFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  // Données simulées des demandes
  const allRequests = [
    {
      id: 'REQ-2024-001',
      client: 'Jardin Botanique',
      objet: 'Installation système d\'arrosage automatique',
      date: '2024-08-01T10:30:00Z',
      statut: 'completed',
      priorite: 'haute',
      assigne: 'Jean Dupont',
      equipe: 'Technique',
      categorie: 'Installation',
      progression: 100,
      tempsEcoule: 8.5,
      tempsEstime: 8,
      satisfaction: 4.8,
      notes: 'Projet terminé avec satisfaction client',
      contact: 'marie.martin@jardin.fr',
      telephone: '04 78 90 12 34'
    },
    {
      id: 'REQ-2024-002',
      client: 'Villa Moderne',
      objet: 'Entretien mensuel espaces verts',
      date: '2024-08-05T14:15:00Z',
      statut: 'inProgress',
      priorite: 'normale',
      assigne: 'Sophie Dubois',
      equipe: 'Entretien',
      categorie: 'Maintenance',
      progression: 65,
      tempsEcoule: 4.2,
      tempsEstime: 6,
      satisfaction: null,
      notes: 'En cours de réalisation - Phase 2/3',
      contact: 'contact@villa-moderne.fr',
      telephone: '04 78 45 67 89'
    },
    {
      id: 'REQ-2024-003',
      client: 'Mairie de Lyon',
      objet: 'Création jardin public avec aires de jeux',
      date: '2024-08-10T09:00:00Z',
      statut: 'pending',
      priorite: 'urgente',
      assigne: 'Pierre Lambert',
      equipe: 'Création',
      categorie: 'Aménagement',
      progression: 0,
      tempsEcoule: 0,
      tempsEstime: 120,
      satisfaction: null,
      notes: 'En attente validation budget',
      contact: 'projets@mairie-lyon.fr',
      telephone: '04 78 67 89 01'
    },
    {
      id: 'REQ-2024-004',
      client: 'TechCorp',
      objet: 'Traitement phytosanitaire urgente',
      date: '2024-08-11T16:45:00Z',
      statut: 'inProgress',
      priorite: 'urgente',
      assigne: 'Marie Rousseau',
      equipe: 'Traitement',
      categorie: 'Urgence',
      progression: 35,
      tempsEcoule: 2.5,
      tempsEstime: 6,
      satisfaction: null,
      notes: 'Intervention en cours - Problème parasites',
      contact: 'maintenance@techcorp.com',
      telephone: '04 78 23 45 67'
    },
    {
      id: 'REQ-2024-005',
      client: 'Résidence Harmony',
      objet: 'Devis rénovation complète jardins',
      date: '2024-08-08T11:20:00Z',
      statut: 'pending',
      priorite: 'normale',
      assigne: 'Antoine Moreau',
      equipe: 'Commercial',
      categorie: 'Devis',
      progression: 80,
      tempsEcoule: 3,
      tempsEstime: 4,
      satisfaction: null,
      notes: 'Devis en préparation - Attente rendez-vous',
      contact: 'syndic@harmony-residence.fr',
      telephone: '04 78 34 56 78'
    },
    {
      id: 'REQ-2024-006',
      client: 'Centre Commercial',
      objet: 'Maintenance végétaux intérieurs',
      date: '2024-08-07T13:30:00Z',
      statut: 'completed',
      priorite: 'basse',
      assigne: 'Lucie Bernard',
      equipe: 'Maintenance',
      categorie: 'Entretien',
      progression: 100,
      tempsEcoule: 2.5,
      tempsEstime: 3,
      satisfaction: 4.5,
      notes: 'Maintenance effectuée avec succès',
      contact: 'gestion@centre-commercial.fr',
      telephone: '04 78 56 78 90'
    },
    {
      id: 'REQ-2024-007',
      client: 'Hôtel des Roses',
      objet: 'Installation éclairage jardin',
      date: '2024-08-09T08:45:00Z',
      statut: 'cancelled',
      priorite: 'normale',
      assigne: 'Thomas Petit',
      equipe: 'Électrique',
      categorie: 'Installation',
      progression: 0,
      tempsEcoule: 1,
      tempsEstime: 12,
      satisfaction: null,
      notes: 'Annulé par le client - Budget insuffisant',
      contact: 'direction@hotel-roses.fr',
      telephone: '04 78 67 89 12'
    },
    {
      id: 'REQ-2024-008',
      client: 'École Primaire',
      objet: 'Aménagement cour de récréation',
      date: '2024-08-06T15:00:00Z',
      statut: 'inProgress',
      priorite: 'haute',
      assigne: 'Camille Durand',
      equipe: 'Aménagement',
      categorie: 'Éducation',
      progression: 45,
      tempsEcoule: 12,
      tempsEstime: 25,
      satisfaction: null,
      notes: 'Phase terrain terminée - Début plantations',
      contact: 'direction@ecole-primaire.edu',
      telephone: '04 78 78 90 12'
    },
    {
      id: 'REQ-2024-009',
      client: 'Clinique Verte',
      objet: 'Jardin thérapeutique pour patients',
      date: '2024-08-04T10:15:00Z',
      statut: 'pending',
      priorite: 'normale',
      assigne: 'Sylvain Martin',
      equipe: 'Spécialisé',
      categorie: 'Thérapeutique',
      progression: 20,
      tempsEcoule: 5,
      tempsEstime: 40,
      satisfaction: null,
      notes: 'Étude préliminaire en cours',
      contact: 'projets@clinique-verte.fr',
      telephone: '04 78 89 01 23'
    },
    {
      id: 'REQ-2024-010',
      client: 'Restaurant Gastronomique',
      objet: 'Jardin d\'herbes aromatiques',
      date: '2024-08-03T12:00:00Z',
      statut: 'completed',
      priorite: 'normale',
      assigne: 'Élodie Leroy',
      equipe: 'Spécialisé',
      categorie: 'Gastronomie',
      progression: 100,
      tempsEcoule: 8,
      tempsEstime: 10,
      satisfaction: 4.9,
      notes: 'Projet réussi - Client très satisfait',
      contact: 'chef@restaurant-gastro.fr',
      telephone: '04 78 90 12 45'
    },
    {
      id: 'REQ-2024-011',
      client: 'Copropriété Les Chênes',
      objet: 'Réparation système d\'arrosage',
      date: '2024-08-11T07:30:00Z',
      statut: 'pending',
      priorite: 'urgente',
      assigne: 'Nicolas Blanc',
      equipe: 'Technique',
      categorie: 'Réparation',
      progression: 0,
      tempsEcoule: 0,
      tempsEstime: 4,
      satisfaction: null,
      notes: 'Signalement fuite - Intervention urgente',
      contact: 'syndic@les-chenes.fr',
      telephone: '04 78 12 34 56'
    },
    {
      id: 'REQ-2024-012',
      client: 'Parc d\'Activités',
      objet: 'Entretien espaces communs',
      date: '2024-08-02T16:00:00Z',
      statut: 'inProgress',
      priorite: 'basse',
      assigne: 'Isabelle Roux',
      equipe: 'Entretien',
      categorie: 'Maintenance',
      progression: 75,
      tempsEcoule: 6,
      tempsEstime: 8,
      satisfaction: null,
      notes: 'Progression normale selon planning',
      contact: 'gestion@parc-activites.com',
      telephone: '04 78 23 45 89'
    }
  ];

  // Filtrage et tri des données
  const filteredAndSortedData = useMemo(() => {
    let filtered = allRequests.filter(item => {
      const matchesSearch = !searchTerm || 
        item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.objet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assigne.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.statut === statusFilter;
      const matchesPriority = priorityFilter === 'all' || item.priorite === priorityFilter;
      const matchesAssigned = assignedFilter === 'all' || item.assigne === assignedFilter;
      
      const matchesDate = dateFilter === 'all' || (() => {
        const itemDate = new Date(item.date);
        const today = new Date();
        const daysDiff = Math.floor((today - itemDate) / (1000 * 60 * 60 * 24));
        
        switch(dateFilter) {
          case 'today': return daysDiff === 0;
          case 'week': return daysDiff <= 7;
          case 'month': return daysDiff <= 30;
          default: return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesPriority && matchesAssigned && matchesDate;
    });

    // Tri
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [allRequests, searchTerm, statusFilter, priorityFilter, assignedFilter, dateFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  // Gestion de la sélection
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentData.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Gestion du tri
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Actions groupées
  const handleBulkAction = () => {
    if (!bulkAction || selectedItems.length === 0) return;
    
    console.log(`Action ${bulkAction} sur ${selectedItems.length} éléments:`, selectedItems);
    
    // Simuler l'action
    setTimeout(() => {
      setSelectedItems([]);
      setBulkAction('');
      setSelectAll(false);
    }, 1000);
  };

  // Utilitaires d'affichage
  const getStatusColor = (statut) => {
    switch(statut) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'inProgress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priorite) => {
    switch(priorite) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'haute': return 'bg-orange-100 text-orange-800';
      case 'normale': return 'bg-blue-100 text-blue-800';
      case 'basse': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (statut) => {
    switch(statut) {
      case 'completed': return 'Terminé';
      case 'inProgress': return 'En cours';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return statut;
    }
  };

  const getPriorityLabel = (priorite) => {
    switch(priorite) {
      case 'urgente': return 'Urgente';
      case 'haute': return 'Haute';
      case 'normale': return 'Normale';
      case 'basse': return 'Basse';
      default: return priorite;
    }
  };

  const getPriorityIcon = (priorite) => {
    switch(priorite) {
      case 'urgente': return <FireIcon className="w-4 h-4" />;
      case 'haute': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'normale': return <TagIcon className="w-4 h-4" />;
      case 'basse': return <ClockIcon className="w-4 h-4" />;
      default: return <TagIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ChevronUpDownIcon className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4 text-purple-500" /> : 
      <ChevronDownIcon className="w-4 h-4 text-purple-500" />;
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl overflow-hidden relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute grid grid-cols-10 gap-2 w-full h-full"
            animate={{ x: [0, -10, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          >
            {[...Array(50)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-sm" />
            ))}
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <TableCellsIcon className="w-8 h-8 mr-3" />
                Tableau Demandes Clients Ultra Premium
              </h1>
              <p className="text-purple-100">Gestion avancée avec tri, filtres et actions groupées</p>
              
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">Temps réel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="w-5 h-5" />
                  <span className="text-sm">Smart Filters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BeakerIcon className="w-5 h-5" />
                  <span className="text-sm">Auto Actions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm">Performance</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{filteredAndSortedData.length}</div>
              <div className="text-purple-100">demandes filtrées</div>
              <div className="mt-2 flex items-center justify-end space-x-2">
                <span className="px-3 py-1 bg-green-500/30 rounded-full text-sm font-bold">
                  {selectedItems.length} sélectionnées
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Barre de contrôles */}
      <motion.div 
        className="mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Recherche */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none w-64"
              />
            </div>

            {/* Bouton filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showFilters ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <FunnelIcon className="w-5 h-5 inline mr-2" />
              Filtres
            </button>

            {/* Actions groupées */}
            {selectedItems.length > 0 && (
              <div className="flex items-center space-x-2">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Actions groupées</option>
                  <option value="archive">Archiver</option>
                  <option value="assign">Réassigner</option>
                  <option value="priority">Changer priorité</option>
                  <option value="export">Exporter</option>
                  <option value="delete">Supprimer</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    bulkAction ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  Appliquer
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value={5}>5 par page</option>
              <option value={10}>10 par page</option>
              <option value={25}>25 par page</option>
              <option value={50}>50 par page</option>
            </select>
            
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <ArrowDownTrayIcon className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <PrinterIcon className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panneau de filtres */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="mt-4 pt-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="inProgress">En cours</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">Toutes priorités</option>
                    <option value="urgente">Urgente</option>
                    <option value="haute">Haute</option>
                    <option value="normale">Normale</option>
                    <option value="basse">Basse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigné</label>
                  <select
                    value={assignedFilter}
                    onChange={(e) => setAssignedFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">Tous les assignés</option>
                    <option value="Jean Dupont">Jean Dupont</option>
                    <option value="Sophie Dubois">Sophie Dubois</option>
                    <option value="Pierre Lambert">Pierre Lambert</option>
                    <option value="Marie Rousseau">Marie Rousseau</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">Toutes les dates</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tableau */}
      <motion.div 
        className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('id')}
                    className="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>ID</span>
                    {getSortIcon('id')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('client')}
                    className="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Client</span>
                    {getSortIcon('client')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('objet')}
                    className="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Objet</span>
                    {getSortIcon('objet')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Date</span>
                    {getSortIcon('date')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('statut')}
                    className="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Statut</span>
                    {getSortIcon('statut')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('priorite')}
                    className="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Priorité</span>
                    {getSortIcon('priorite')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('assigne')}
                    className="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Assigné</span>
                    {getSortIcon('assigne')}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progression
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((request, index) => (
                <motion.tr 
                  key={request.id}
                  className="hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(request.id)}
                      onChange={() => handleSelectItem(request.id)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {request.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{request.client}</div>
                      <div className="text-gray-500">{request.contact}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={request.objet}>
                      {request.objet}
                    </div>
                    <div className="text-xs text-gray-500">{request.categorie}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(request.date)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.statut)}`}>
                      {getStatusLabel(request.statut)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priorite)}`}>
                      {getPriorityIcon(request.priorite)}
                      <span className="ml-1">{getPriorityLabel(request.priorite)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium">{request.assigne}</div>
                        <div className="text-xs text-gray-500">{request.equipe}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          request.progression === 100 ? 'bg-green-500' :
                          request.progression >= 50 ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${request.progression}%` }}
                        transition={{ duration: 0.8, delay: index * 0.02 }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {request.progression}% - {request.tempsEcoule}h/{request.tempsEstime}h
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors" title="Voir">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-800 transition-colors" title="Modifier">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors" title="Archiver">
                        <ArchiveBoxIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-800 transition-colors" title="Supprimer">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{startIndex + 1}</span> à{' '}
                <span className="font-medium">{Math.min(endIndex, filteredAndSortedData.length)}</span> sur{' '}
                <span className="font-medium">{filteredAndSortedData.length}</span> résultats
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </nav>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistiques en bas */}
      <motion.div 
        className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-lg p-4 shadow-lg">
          <div className="text-2xl font-bold text-green-600">
            {allRequests.filter(r => r.statut === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Demandes terminées</div>
        </div>
        <div className="bg-white/90 backdrop-blur-lg rounded-lg p-4 shadow-lg">
          <div className="text-2xl font-bold text-blue-600">
            {allRequests.filter(r => r.statut === 'inProgress').length}
          </div>
          <div className="text-sm text-gray-600">En cours</div>
        </div>
        <div className="bg-white/90 backdrop-blur-lg rounded-lg p-4 shadow-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {allRequests.filter(r => r.statut === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">En attente</div>
        </div>
        <div className="bg-white/90 backdrop-blur-lg rounded-lg p-4 shadow-lg">
          <div className="text-2xl font-bold text-purple-600">
            {(allRequests.reduce((acc, r) => acc + r.progression, 0) / allRequests.length).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Progression moyenne</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DemandesClientTableauUltraPremium;