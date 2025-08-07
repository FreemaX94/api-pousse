import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  FunnelIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import AjouterInterventionModal from '../../planning/components/AjouterInterventionModal';
import ResourceFilterModal from '../../planning/components/ResourceFilterModal';
import OptionsAffichageInterventionsModal from './OptionsAffichageInterventionsModal';
import { PlanningFiltersProvider } from '../../planning/context/PlanningFiltersContext';
import { type ResourceFilters } from '../../planning/hooks/useResourceFilters';

interface Intervention {
  id: string;
  numero: string;
  titre: string;
  client: string;
  adresse: string;
  collaborateur: string;
  collaborateurGroup: 'bureau' | 'terrain';
  hasPermisB: boolean;
  dateCreation: Date;
  datePlanifiee?: Date;
  heurePlanifiee?: string;
  dateEffectuee?: Date;
  heureEffectuee?: string;
  effectue: boolean;
  actif: boolean;
  envoiRapport: boolean;
  envoiConfirmation: boolean;
  envoiAvisPassage: boolean;
  demandesClient: boolean;
  status: 'planifie' | 'effectue' | 'en_cours';
}

type StatusTab = 'tout' | 'planifie' | 'effectue';
type SortField = 'numero' | 'titre' | 'client' | 'collaborateur' | 'dateCreation' | 'datePlanifiee' | 'dateEffectuee';
type SortOrder = 'asc' | 'desc';

const InterventionsTableauDeBordContent: React.FC = () => {
  const [activeStatusTab, setActiveStatusTab] = useState<StatusTab>('tout');
  const [showAjouterIntervention, setShowAjouterIntervention] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showOptionsAffichage, setShowOptionsAffichage] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Tri
  const [sortField, setSortField] = useState<SortField>('dateCreation');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Sélection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Filtres
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [activeFilters, setActiveFilters] = useState<ResourceFilters>({
    numero: '',
    titre: '',
    client: '',
    collaborateur: 'tous',
    categorie: 'toutes',
    actif: 'tous'
  });

  // Données d'exemple
  const mockInterventions: Intervention[] = [
    {
      id: '1',
      numero: 'INT-2025-001',
      titre: 'Entretien jardins BNP',
      client: 'BNP PARIBAS',
      adresse: '16 Boulevard des Italiens, 75009 Paris',
      collaborateur: 'Sophie Leroy',
      collaborateurGroup: 'terrain',
      hasPermisB: true,
      dateCreation: new Date(2025, 6, 10, 14, 30),
      datePlanifiee: new Date(2025, 6, 14, 9, 0),
      heurePlanifiee: '09:00',
      dateEffectuee: new Date(2025, 6, 14, 9, 15),
      heureEffectuee: '09:15',
      effectue: true,
      actif: true,
      envoiRapport: true,
      envoiConfirmation: true,
      envoiAvisPassage: false,
      demandesClient: true,
      status: 'effectue'
    },
    {
      id: '2',
      numero: 'INT-2025-002',
      titre: 'Installation plantes SOCIETE GENERALE',
      client: 'SOCIETE GENERALE',
      adresse: '29 Boulevard Haussmann, 75009 Paris',
      collaborateur: 'Pierre Martin',
      collaborateurGroup: 'terrain',
      hasPermisB: true,
      dateCreation: new Date(2025, 6, 11, 10, 15),
      datePlanifiee: new Date(2025, 6, 15, 14, 0),
      heurePlanifiee: '14:00',
      effectue: false,
      actif: true,
      envoiRapport: false,
      envoiConfirmation: false,
      envoiAvisPassage: false,
      demandesClient: false,
      status: 'planifie'
    },
    {
      id: '3',
      numero: 'INT-2025-003',
      titre: 'Maintenance bureaux CREDIT MUTUEL',
      client: 'CREDIT MUTUEL',
      adresse: '88 Rue de Rivoli, 75001 Paris',
      collaborateur: 'Marie Dubois',
      collaborateurGroup: 'bureau',
      hasPermisB: false,
      dateCreation: new Date(2025, 6, 12, 16, 45),
      datePlanifiee: new Date(2025, 6, 16, 10, 0),
      heurePlanifiee: '10:00',
      effectue: false,
      actif: true,
      envoiRapport: false,
      envoiConfirmation: true,
      envoiAvisPassage: true,
      demandesClient: true,
      status: 'planifie'
    }
  ];

  // Filtrage et tri des données
  const filteredAndSortedInterventions = useMemo(() => {
    let filtered = mockInterventions.filter(intervention => {
      // Filtre par statut
      if (activeStatusTab !== 'tout') {
        if (activeStatusTab === 'planifie' && intervention.status !== 'planifie') return false;
        if (activeStatusTab === 'effectue' && intervention.status !== 'effectue') return false;
      }
      
      // Filtres de recherche
      if (activeFilters.numero && !intervention.numero.toLowerCase().includes(activeFilters.numero.toLowerCase())) {
        return false;
      }
      if (activeFilters.titre && !intervention.titre.toLowerCase().includes(activeFilters.titre.toLowerCase())) {
        return false;
      }
      if (activeFilters.client && !intervention.client.toLowerCase().includes(activeFilters.client.toLowerCase())) {
        return false;
      }
      
      return true;
    });

    // Tri
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'dateCreation' || sortField === 'datePlanifiee' || sortField === 'dateEffectuee') {
        aValue = aValue?.getTime() || 0;
        bValue = bValue?.getTime() || 0;
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [mockInterventions, activeStatusTab, activeFilters, sortField, sortOrder]);

  // Pagination
  const totalItems = filteredAndSortedInterventions.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedInterventions = filteredAndSortedInterventions.slice(startIndex, startIndex + pageSize);

  // Gestion du tri
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Gestion de la sélection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedInterventions.map(i => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  // Gestion des filtres
  const handleFiltersChange = (filters: ResourceFilters) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset à la première page
  };

  // Actions sur les interventions
  const handleView = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setEditMode(false);
    setShowAjouterIntervention(true);
  };

  const handleEdit = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setEditMode(true);
    setShowAjouterIntervention(true);
  };

  // Composant pour les icônes de statut
  const StatusIcon: React.FC<{ status: boolean; type: 'send' | 'check' }> = ({ status, type }) => {
    if (type === 'send') {
      return status ? (
        <CheckIcon className="w-4 h-4 text-green-600" />
      ) : (
        <button className="w-4 h-4 text-gray-400 hover:text-blue-600">
          <EnvelopeIcon className="w-4 h-4" />
        </button>
      );
    } else {
      return status ? (
        <CheckIcon className="w-4 h-4 text-green-600" />
      ) : (
        <XMarkIcon className="w-4 h-4 text-red-500" />
      );
    }
  };

  // Composant pour l'en-tête de colonne triable
  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-700 hover:text-gray-900"
    >
      <span>{children}</span>
      {sortField === field && (
        sortOrder === 'asc' ? 
          <ChevronUpIcon className="w-4 h-4" /> : 
          <ChevronDownIcon className="w-4 h-4" />
      )}
    </button>
  );

  // En-tête
  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      {/* Première ligne : titre et options */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Tableau de bord des interventions</h1>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowOptionsAffichage(true)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Options d'affichage"
          >
            <Cog6ToothIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Deuxième ligne : boutons d'action */}
      <div className="flex items-center space-x-4">
        {/* Bouton Ajouter une intervention */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAjouterIntervention(true)}
          className="flex items-center space-x-2 bg-[#2170E3] text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Ajouter une intervention</span>
        </motion.button>

        {/* Sélecteur de plage de dates */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <CalendarDaysIcon className="w-4 h-4" />
            <span className="text-sm">
              {dateRange.start && dateRange.end
                ? `${dateRange.start.toLocaleDateString('fr-FR')} – ${dateRange.end.toLocaleDateString('fr-FR')}`
                : 'date min. – date max.'
              }
            </span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          
          {showDatePicker && (
            <div className="absolute left-1/2 transform -translate-x-1/2 top-12 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-[600px]">
              <div className="grid grid-cols-2 gap-6 p-4">
                {/* Zone de saisie de la période */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Période</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Du</label>
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                          onChange={(e) => setDateRange(prev => ({ 
                            ...prev, 
                            start: e.target.value ? new Date(e.target.value) : null 
                          }))}
                          placeholder="jj/mm/aaaa"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Au</label>
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                          onChange={(e) => setDateRange(prev => ({ 
                            ...prev, 
                            end: e.target.value ? new Date(e.target.value) : null 
                          }))}
                          placeholder="jj/mm/aaaa"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        console.log('Filtrer avec la plage:', dateRange);
                        setShowDatePicker(false);
                      }}
                      className="w-full bg-[#2170E3] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
                    >
                      Filtrer
                    </button>
                  </div>
                </div>

                {/* Raccourcis de période */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Raccourcis</h3>
                  <div className="space-y-1 text-sm">
                    {/* Raccourcis relatifs */}
                    <button
                      onClick={() => {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        setDateRange({ start: yesterday, end: yesterday });
                        setShowDatePicker(false);
                      }}
                      className="block text-blue-600 hover:text-blue-800 text-left"
                    >
                      Hier ({new Date(Date.now() - 86400000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })})
                    </button>
                    <button
                      onClick={() => {
                        const today = new Date();
                        setDateRange({ start: today, end: today });
                        setShowDatePicker(false);
                      }}
                      className="block text-blue-600 hover:text-blue-800 text-left"
                    >
                      Aujourd'hui ({new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })})
                    </button>
                    <button
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        setDateRange({ start: tomorrow, end: tomorrow });
                        setShowDatePicker(false);
                      }}
                      className="block text-blue-600 hover:text-blue-800 text-left"
                    >
                      Demain ({new Date(Date.now() + 86400000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })})
                    </button>

                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <button
                        onClick={() => {
                          const end = new Date();
                          const start = new Date();
                          start.setDate(start.getDate() - 7);
                          setDateRange({ start, end });
                          setShowDatePicker(false);
                        }}
                        className="block text-blue-600 hover:text-blue-800 text-left"
                      >
                        7 derniers jours
                      </button>
                      <button
                        onClick={() => {
                          const end = new Date();
                          const start = new Date();
                          start.setDate(start.getDate() - 14);
                          setDateRange({ start, end });
                          setShowDatePicker(false);
                        }}
                        className="block text-blue-600 hover:text-blue-800 text-left"
                      >
                        14 derniers jours
                      </button>
                      <button
                        onClick={() => {
                          const end = new Date();
                          const start = new Date();
                          start.setDate(start.getDate() - 30);
                          setDateRange({ start, end });
                          setShowDatePicker(false);
                        }}
                        className="block text-blue-600 hover:text-blue-800 text-left"
                      >
                        30 derniers jours
                      </button>
                      <button
                        onClick={() => {
                          const start = new Date();
                          const end = new Date();
                          end.setDate(end.getDate() + 7);
                          setDateRange({ start, end });
                          setShowDatePicker(false);
                        }}
                        className="block text-blue-600 hover:text-blue-800 text-left"
                      >
                        7 prochains jours
                      </button>
                    </div>

                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <button
                        onClick={() => {
                          const now = new Date();
                          const start = new Date(now.getFullYear(), now.getMonth(), 1);
                          const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                          setDateRange({ start, end });
                          setShowDatePicker(false);
                        }}
                        className="block text-blue-600 hover:text-blue-800 text-left"
                      >
                        Mois courant : {new Date().toLocaleDateString('fr-FR', { month: 'long' })}
                      </button>
                      <button
                        onClick={() => {
                          const now = new Date();
                          const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                          const end = new Date(now.getFullYear(), now.getMonth(), 0);
                          setDateRange({ start, end });
                          setShowDatePicker(false);
                        }}
                        className="block text-blue-600 hover:text-blue-800 text-left"
                      >
                        Mois précédent : {new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString('fr-FR', { month: 'long' })}
                      </button>
                      <button
                        onClick={() => {
                          const now = new Date();
                          const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                          const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
                          setDateRange({ start, end });
                          setShowDatePicker(false);
                        }}
                        className="block text-blue-600 hover:text-blue-800 text-left"
                      >
                        Mois suivant : {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('fr-FR', { month: 'long' })}
                      </button>
                    </div>

                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <button
                        onClick={() => {
                          const now = new Date();
                          const start = new Date(now.getFullYear() - 1, 0, 1);
                          const end = new Date(now.getFullYear() - 1, 11, 31);
                          setDateRange({ start, end });
                          setShowDatePicker(false);
                        }}
                        className="block text-blue-600 hover:text-blue-800 text-left"
                      >
                        Année précédente
                      </button>
                      <button
                        onClick={() => {
                          const now = new Date();
                          const start = new Date(now.getFullYear(), 0, 1);
                          const end = new Date(now.getFullYear(), 11, 31);
                          setDateRange({ start, end });
                          setShowDatePicker(false);
                        }}
                        className="block text-blue-600 hover:text-blue-800 text-left"
                      >
                        Année en cours
                      </button>
                      <button
                        onClick={() => {
                          // Pour l'exemple, on prend le 1er janvier de l'année précédente
                          const start = new Date(new Date().getFullYear() - 1, 0, 1);
                          const end = new Date();
                          setDateRange({ start, end });
                          setShowDatePicker(false);
                        }}
                        className="block text-blue-600 hover:text-blue-800 text-left"
                      >
                        Depuis le dernier bilan
                      </button>
                      <button
                        onClick={() => {
                          // Depuis une date très ancienne jusqu'à aujourd'hui
                          const start = new Date(2020, 0, 1);
                          const end = new Date();
                          setDateRange({ start, end });
                          setShowDatePicker(false);
                        }}
                        className="block text-blue-600 hover:text-blue-800 text-left"
                      >
                        Depuis toujours
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bouton Filtres */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilterModal(true)}
          className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          <FunnelIcon className="w-4 h-4" />
          <span>Filtres</span>
        </motion.button>

        {/* Bouton Options d'affichage */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowOptionsAffichage(true)}
          className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          <Cog6ToothIcon className="w-4 h-4" />
          <span>Options d'affichage</span>
        </motion.button>
      </div>
    </div>
  );

  // Onglets de statut
  const renderStatusTabs = () => (
    <div className="bg-white border-b border-gray-200 px-6">
      <div className="flex space-x-8">
        {[
          { key: 'tout', label: 'Tout', count: mockInterventions.length },
          { key: 'planifie', label: 'Planifié', count: mockInterventions.filter(i => i.status === 'planifie').length },
          { key: 'effectue', label: 'Effectué', count: mockInterventions.filter(i => i.status === 'effectue').length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveStatusTab(tab.key as StatusTab);
              setCurrentPage(1);
            }}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
              activeStatusTab === tab.key
                ? 'border-[#2170E3] text-[#2170E3]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.label}</span>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  // Pagination
  const renderPagination = () => (
    <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        
        <div className="flex space-x-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === pageNum
                    ? 'bg-[#2170E3] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && (
            <>
              <span className="px-3 py-1 text-sm text-gray-500">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-sm text-gray-700">
        {totalItems} résultat{totalItems > 1 ? 's' : ''}
      </div>
    </div>
  );

  // Tableau des interventions
  const renderTable = () => (
    <div className="bg-white overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={selectedIds.length === paginatedInterventions.length && paginatedInterventions.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Envoi rapport
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Envoi confirmation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Envoi avis de passage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              📅 (planifié)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ● (planifié)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actif ?
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SortableHeader field="dateCreation">Date/heure de création</SortableHeader>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SortableHeader field="numero">N°</SortableHeader>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SortableHeader field="titre">Titre / Client / Adresse</SortableHeader>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Demandes client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SortableHeader field="collaborateur">Collaborateur</SortableHeader>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              📅 (effectué)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Effectué ?
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedInterventions.map((intervention) => (
            <motion.tr
              key={intervention.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(intervention.id)}
                  onChange={(e) => handleSelectItem(intervention.id, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <StatusIcon status={intervention.envoiRapport} type="send" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <StatusIcon status={intervention.envoiConfirmation} type="send" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <StatusIcon status={intervention.envoiAvisPassage} type="send" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {intervention.datePlanifiee && (
                  <CalendarDaysIcon className="w-4 h-4 text-blue-600 mx-auto" />
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {intervention.datePlanifiee && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto"></div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <StatusIcon status={intervention.actif} type="check" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {intervention.dateCreation.toLocaleDateString('fr-FR')} à {intervention.dateCreation.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {intervention.numero}
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="font-medium text-gray-900">{intervention.titre}</div>
                <div className="text-gray-600">{intervention.client}</div>
                <div className="text-gray-500 text-xs">{intervention.adresse}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {intervention.demandesClient && (
                  <InformationCircleIcon className="w-4 h-4 text-blue-600 mx-auto" />
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900">{intervention.collaborateur}</span>
                  {intervention.hasPermisB && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Permis B
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    intervention.collaborateurGroup === 'bureau' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {intervention.collaborateurGroup === 'bureau' ? 'Bureau' : 'Terrain'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {intervention.dateEffectuee && (
                  <CalendarDaysIcon className="w-4 h-4 text-green-600 mx-auto" />
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <input
                  type="checkbox"
                  checked={intervention.effectue}
                  readOnly
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleView(intervention)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Voir"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(intervention)}
                    className="text-gray-600 hover:text-gray-900"
                    title="Éditer"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {renderHeader()}
      {renderStatusTabs()}
      {renderPagination()}
      
      <div className="flex-1 overflow-auto">
        {renderTable()}
      </div>
      
      {renderPagination()}
      
      <AjouterInterventionModal
        isOpen={showAjouterIntervention}
        onClose={() => {
          setShowAjouterIntervention(false);
          setSelectedIntervention(null);
          setEditMode(false);
        }}
      />
      
      <ResourceFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFiltersChange={handleFiltersChange}
      />
      
      <OptionsAffichageInterventionsModal
        isOpen={showOptionsAffichage}
        onClose={() => setShowOptionsAffichage(false)}
      />
    </div>
  );
};

const InterventionsTableauDeBord: React.FC = () => {
  return (
    <PlanningFiltersProvider>
      <InterventionsTableauDeBordContent />
    </PlanningFiltersProvider>
  );
};

export default InterventionsTableauDeBord;