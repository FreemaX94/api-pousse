import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  PencilIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarDaysIcon,
  ClockIcon,
  UsersIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import AjouterInterventionModal from '../../planning/components/AjouterInterventionModal';
import { PlanningFiltersProvider } from '../../planning/context/PlanningFiltersContext';

type SubTab = 'vue-globale' | 'synthese-fin-journee';
type StatusFilter = 'toutes' | 'terminees' | 'planifiees' | 'a-faire';
type SortField = 'collaborateur' | 'debut' | 'fin' | 'tempsPassé';
type SortOrder = 'asc' | 'desc';

interface Intervention {
  id: string;
  collaborateur: string;
  collaborateurGroup: 'bureau' | 'terrain';
  hasPermisB: boolean;
  client: string;
  adresse: string;
  actionsCourantes: string[];
  debut: string;
  fin: string;
  tempsPassé: number; // en minutes
  status: 'terminee' | 'planifiee' | 'a-faire';
  date: Date;
}

interface DayFilters {
  collaborateur: string;
  date: Date | null;
  status: StatusFilter;
}

interface CollaboratorSynthesis {
  collaborateur: string;
  terminées: number;
  aFaire: number;
  tempsTotal: number; // en minutes
}

const InterventionsJournee: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('vue-globale');
  const [filters, setFilters] = useState<DayFilters>({
    collaborateur: 'tous',
    date: new Date(),
    status: 'terminees'
  });
  const [sortField, setSortField] = useState<SortField>('debut');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [showAjouterIntervention, setShowAjouterIntervention] = useState(false);

  // Données d'exemple
  const mockInterventions: Intervention[] = [
    {
      id: '1',
      collaborateur: 'Sophie Leroy',
      collaborateurGroup: 'terrain',
      hasPermisB: true,
      client: 'BNP PARIBAS',
      adresse: '16 Boulevard des Italiens, 75009 Paris',
      actionsCourantes: ['Arrosage', 'Taille'],
      debut: '09:00',
      fin: '11:30',
      tempsPassé: 150,
      status: 'terminee',
      date: new Date()
    },
    {
      id: '2',
      collaborateur: 'Pierre Martin',
      collaborateurGroup: 'terrain',
      hasPermisB: true,
      client: 'SOCIETE GENERALE',
      adresse: '29 Boulevard Haussmann, 75009 Paris',
      actionsCourantes: ['Installation'],
      debut: '14:00',
      fin: '16:00',
      tempsPassé: 120,
      status: 'a-faire',
      date: new Date()
    },
    {
      id: '3',
      collaborateur: 'Marie Dubois',
      collaborateurGroup: 'bureau',
      hasPermisB: false,
      client: 'CREDIT MUTUEL',
      adresse: '88 Rue de Rivoli, 75001 Paris',
      actionsCourantes: ['Diagnostic', 'Conseil'],
      debut: '10:00',
      fin: '12:00',
      tempsPassé: 120,
      status: 'terminee',
      date: new Date()
    },
    {
      id: '4',
      collaborateur: 'Lucas Bernard',
      collaborateurGroup: 'terrain',
      hasPermisB: true,
      client: 'TOTAL ENERGIES',
      adresse: '2 Place Jean Millier, 92400 Courbevoie',
      actionsCourantes: ['Entretien'],
      debut: '15:00',
      fin: '17:30',
      tempsPassé: 150,
      status: 'planifiee',
      date: new Date()
    },
    {
      id: '5',
      collaborateur: 'Simon Henry',
      collaborateurGroup: 'terrain',
      hasPermisB: true,
      client: 'LA POSTE',
      adresse: '44 Boulevard de Vaugirard, 75015 Paris',
      actionsCourantes: ['Formation'],
      debut: '08:30',
      fin: '10:00',
      tempsPassé: 90,
      status: 'terminee',
      date: new Date()
    }
  ];

  const collaborateurs = [
    { value: 'tous', label: 'Tous les intervenants' },
    { value: 'sophie-leroy', label: 'Sophie Leroy', hasPermisB: true, group: 'terrain' },
    { value: 'pierre-martin', label: 'Pierre Martin', hasPermisB: true, group: 'terrain' },
    { value: 'marie-dubois', label: 'Marie Dubois', hasPermisB: false, group: 'bureau' },
    { value: 'lucas-bernard', label: 'Lucas Bernard', hasPermisB: true, group: 'terrain' },
    { value: 'simon-henry', label: 'Simon Henry', hasPermisB: true, group: 'terrain' }
  ];

  const statusOptions = [
    { value: 'toutes', label: 'Toutes' },
    { value: 'terminees', label: 'Interventions terminées' },
    { value: 'planifiees', label: 'Planifiées' },
    { value: 'a-faire', label: 'À faire' }
  ];

  // Filtrage et tri
  const filteredAndSortedInterventions = useMemo(() => {
    let filtered = mockInterventions.filter(intervention => {
      // Filtre par collaborateur
      if (filters.collaborateur !== 'tous') {
        const selectedCollaborator = collaborateurs.find(c => c.value === filters.collaborateur);
        if (selectedCollaborator && intervention.collaborateur !== selectedCollaborator.label) {
          return false;
        }
      }

      // Filtre par date (pour l'exemple, on garde toutes les interventions du jour actuel)
      if (filters.date && intervention.date.toDateString() !== filters.date.toDateString()) {
        return false;
      }

      // Filtre par statut
      if (filters.status !== 'toutes') {
        if (filters.status === 'terminees' && intervention.status !== 'terminee') return false;
        if (filters.status === 'planifiees' && intervention.status !== 'planifiee') return false;
        if (filters.status === 'a-faire' && intervention.status !== 'a-faire') return false;
      }

      return true;
    });

    // Tri
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'tempsPassé') {
        aValue = a.tempsPassé;
        bValue = b.tempsPassé;
      } else if (sortField === 'debut' || sortField === 'fin') {
        aValue = a[sortField];
        bValue = b[sortField];
      } else if (sortField === 'collaborateur') {
        aValue = a.collaborateur.toLowerCase();
        bValue = b.collaborateur.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [mockInterventions, filters, sortField, sortOrder]);

  // Pagination
  const totalItems = filteredAndSortedInterventions.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedInterventions = filteredAndSortedInterventions.slice(startIndex, startIndex + pageSize);

  // Calcul du temps total
  const tempsTotal = filteredAndSortedInterventions.reduce((total, intervention) => total + intervention.tempsPassé, 0);

  // Synthèse par collaborateur
  const collaboratorSynthesis = useMemo(() => {
    const synthesis: { [key: string]: CollaboratorSynthesis } = {};

    filteredAndSortedInterventions.forEach(intervention => {
      if (!synthesis[intervention.collaborateur]) {
        synthesis[intervention.collaborateur] = {
          collaborateur: intervention.collaborateur,
          terminées: 0,
          aFaire: 0,
          tempsTotal: 0
        };
      }

      const collab = synthesis[intervention.collaborateur];
      collab.tempsTotal += intervention.tempsPassé;

      if (intervention.status === 'terminee') {
        collab.terminées++;
      } else if (intervention.status === 'a-faire' || intervention.status === 'planifiee') {
        collab.aFaire++;
      }
    });

    return Object.values(synthesis);
  }, [filteredAndSortedInterventions]);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    console.log('Filtres appliqués:', filters);
  };

  // Composant en-tête triable
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
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Interventions</h1>
      
      {/* Sous-onglets */}
      <div className="flex space-x-8 border-b border-gray-200">
        {[
          { key: 'vue-globale', label: 'Vue globale' },
          { key: 'synthese-fin-journee', label: 'Synthèse fin de journée' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key as SubTab)}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeSubTab === tab.key
                ? 'border-[#2170E3] text-[#2170E3]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Section bouton d'action
  const renderActionSection = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAjouterIntervention(true)}
        className="flex items-center space-x-2 bg-[#2170E3] text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        <PlusIcon className="w-4 h-4" />
        <span>Ajouter une intervention</span>
      </motion.button>
    </div>
  );

  // Barre de filtres
  const renderFilters = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center space-x-4">
        {/* Select Collaborateur */}
        <div className="flex-1">
          <select
            value={filters.collaborateur}
            onChange={(e) => setFilters(prev => ({ ...prev, collaborateur: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {collaborateurs.map(collab => (
              <option key={collab.value} value={collab.value}>
                {collab.label}
                {collab.hasPermisB && ' (Permis B)'}
                {collab.group && ` - ${collab.group === 'bureau' ? 'Bureau' : 'Terrain'}`}
              </option>
            ))}
          </select>
        </div>

        {/* Select Date */}
        <div className="flex-1">
          <input
            type="date"
            value={filters.date ? filters.date.toISOString().split('T')[0] : ''}
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              date: e.target.value ? new Date(e.target.value) : null 
            }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="JJ/MM/YYYY"
          />
        </div>

        {/* Select Type */}
        <div className="flex-1">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as StatusFilter }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton Filtrer */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFilter}
          className="px-6 py-2 bg-[#2170E3] text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
        >
          Filtrer
        </motion.button>
      </div>
    </div>
  );

  // Tableau Vue globale
  const renderGlobalTable = () => (
    <div className="bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableHeader field="collaborateur">Collaborateur</SortableHeader>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions courantes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adresse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableHeader field="debut">Début</SortableHeader>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableHeader field="fin">Fin</SortableHeader>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableHeader field="tempsPassé">Temps passé</SortableHeader>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedInterventions.map((intervention) => (
              <tr
                key={intervention.id}
                className="hover:bg-gray-50"
              >
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {intervention.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-wrap gap-1">
                      {intervention.actionsCourantes.map((action, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                          {action}
                        </span>
                      ))}
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Ajouter une action">
                      <PlusIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div>
                    <div className="font-medium">{intervention.client}</div>
                    <div className="text-gray-500 text-xs">{intervention.adresse}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {intervention.debut}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {intervention.fin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {formatTime(intervention.tempsPassé)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900" title="Voir">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900" title="Éditer">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Temps total */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">
              Temps total : {formatTime(tempsTotal)}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {totalItems} intervention{totalItems > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Pagination (masquée si moins de 20 lignes) */}
      {totalItems > pageSize && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === i + 1
                    ? 'bg-[#2170E3] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Synthèse fin de journée
  const renderSynthesis = () => {
    const totalTerminees = collaboratorSynthesis.reduce((sum, c) => sum + c.terminées, 0);
    const totalAFaire = collaboratorSynthesis.reduce((sum, c) => sum + c.aFaire, 0);
    const totalTemps = collaboratorSynthesis.reduce((sum, c) => sum + c.tempsTotal, 0);

    return (
      <div className="bg-white p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            <UsersIcon className="w-5 h-5" />
            <span>Synthèse par collaborateur</span>
          </h3>

          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Collaborateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interventions terminées
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interventions à faire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temps total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {collaboratorSynthesis.map((collab, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {collab.collaborateur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">{collab.terminées}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <ExclamationCircleIcon className="w-4 h-4 text-orange-500" />
                        <span className="text-orange-600 font-medium">{collab.aFaire}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatTime(collab.tempsTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grand total */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">Grand total</h4>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  <span className="text-2xl font-bold text-green-600">{totalTerminees}</span>
                </div>
                <p className="text-sm text-gray-600">Interventions terminées</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ExclamationCircleIcon className="w-6 h-6 text-orange-500" />
                  <span className="text-2xl font-bold text-orange-600">{totalAFaire}</span>
                </div>
                <p className="text-sm text-gray-600">Interventions à faire</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ClockIcon className="w-6 h-6 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-600">{formatTime(totalTemps)}</span>
                </div>
                <p className="text-sm text-gray-600">Temps total</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {renderHeader()}
      {activeSubTab === 'vue-globale' && renderActionSection()}
      {activeSubTab === 'vue-globale' && renderFilters()}
      
      <div className="flex-1 overflow-auto">
        {activeSubTab === 'vue-globale' ? renderGlobalTable() : renderSynthesis()}
      </div>

      <AjouterInterventionModal
        isOpen={showAjouterIntervention}
        onClose={() => setShowAjouterIntervention(false)}
        selectedDate={filters.date}
      />
    </div>
  );
};

export default InterventionsJournee;