import React, { useState } from 'react';
import { 
  CalendarIcon, 
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  FunnelIcon,
  UsersIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useInterventionStatsData } from '../hooks/useInterventionStatsData';
import AddInterventionModalSimple from './AddInterventionModalSimple';

const InterventionStats = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '2025-07-01',
    endDate: '2025-07-25'
  });
  const [filters, setFilters] = useState({
    statut: 'tous',
    collaborateur: 'tous',
    client: 'tous',
    categorie: 'tous'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showAddInterventionModal, setShowAddInterventionModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc', table: null });

  const {
    collaborateurStats,
    categorieStats,
    globalStats,
    filterOptions,
    loading
  } = useInterventionStatsData({ dateRange, filters });

  const handleSort = (key, table) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.table === table && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction, table });
  };

  const getSortedData = (data, table) => {
    if (!sortConfig.key || sortConfig.table !== table) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const SortButton = ({ column, table, children }) => (
    <button
      onClick={() => handleSort(column, table)}
      className="flex items-center space-x-1 text-left w-full hover:text-blue-600 transition-colors"
    >
      <span>{children}</span>
      {sortConfig.key === column && sortConfig.table === table && (
        sortConfig.direction === 'asc' ? 
          <ChevronUpIcon className="w-4 h-4" /> : 
          <ChevronDownIcon className="w-4 h-4" />
      )}
    </button>
  );

  const getPermisDisplay = (permis) => {
    if (!permis) return <span className="text-gray-400">-</span>;
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Permis {permis}
      </span>
    );
  };

  const getAvancementColor = (avancement) => {
    if (avancement >= 80) return 'text-green-600';
    if (avancement >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const FiltersModal = () => (
    showFilters && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-96">
          <h3 className="text-lg font-semibold mb-4">Filtres</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={filters.statut}
                onChange={(e) => setFilters(prev => ({ ...prev, statut: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="tous">Tous les statuts</option>
                <option value="effectue">Effectué</option>
                <option value="non-effectue">Non effectué</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collaborateur</label>
              <select
                value={filters.collaborateur}
                onChange={(e) => setFilters(prev => ({ ...prev, collaborateur: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="tous">Tous les collaborateurs</option>
                {filterOptions.collaborateurs.map(collab => (
                  <option key={collab} value={collab}>{collab}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                value={filters.client}
                onChange={(e) => setFilters(prev => ({ ...prev, client: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="tous">Tous les clients</option>
                {filterOptions.clients.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={filters.categorie}
                onChange={(e) => setFilters(prev => ({ ...prev, categorie: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="tous">Toutes les catégories</option>
                {filterOptions.categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>
    )
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const sortedCollaborateurStats = getSortedData(collaborateurStats, 'collaborateur');
  const sortedCategorieStats = getSortedData(categorieStats, 'categorie');

  return (
    <div className="p-6 space-y-6">
      {/* Barre d'action */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {/* Bouton d'ajout */}
          <button 
            onClick={() => setShowAddInterventionModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <PlusIcon className="w-4 h-4" />
            <span>Ajouter une intervention</span>
          </button>

          {/* Contrôles de droite */}
          <div className="flex items-center space-x-4">
            {/* Date range picker */}
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  startDate: e.target.value
                }))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              />
              <span className="text-gray-500">–</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  endDate: e.target.value
                }))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              />
            </div>

            {/* Bouton Filtres */}
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total interventions</div>
          <div className="text-2xl font-semibold text-gray-900">{globalStats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Effectuées</div>
          <div className="text-2xl font-semibold text-green-600">{globalStats.effectue}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Non effectuées</div>
          <div className="text-2xl font-semibold text-red-600">{globalStats.nonEffectue}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Avancement</div>
          <div className={`text-2xl font-semibold ${getAvancementColor(globalStats.avancement)}`}>
            {globalStats.avancement}%
          </div>
        </div>
      </div>

      {/* Deux cartes côte à côte */}
      <div className="grid grid-cols-2 gap-6">
        {/* Carte Assignation des interventions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <UsersIcon className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold">Assignation des interventions</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="collaborateur" table="collaborateur">Collaborateur</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permis
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="effectue" table="collaborateur">Effectuées</SortButton>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="nonEffectue" table="collaborateur">Non effectuées</SortButton>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="total" table="collaborateur">Total</SortButton>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="avancement" table="collaborateur">Avancement</SortButton>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCollaborateurStats.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <UsersIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-900 hover:underline">
                          {item.collaborateur}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPermisDisplay(item.permis)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">{item.effectue}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <XCircleIcon className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-sm font-medium text-red-600">{item.nonEffectue}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {item.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.avancement >= 80 ? 'bg-green-500' :
                              item.avancement >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${item.avancement}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getAvancementColor(item.avancement)}`}>
                          {item.avancement}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Carte Interventions par catégorie */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <TagIcon className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold">Interventions par catégorie</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="categorie" table="categorie">Catégorie</SortButton>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="effectue" table="categorie">Effectuées</SortButton>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="nonEffectue" table="categorie">Non effectuées</SortButton>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="total" table="categorie">Total</SortButton>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="avancement" table="categorie">Avancement</SortButton>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCategorieStats.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <TagIcon className="w-4 h-4 text-purple-600" />
                        </div>
                        <button className="text-sm font-medium text-purple-600 hover:text-purple-900 hover:underline">
                          {item.categorie}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">{item.effectue}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <XCircleIcon className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-sm font-medium text-red-600">{item.nonEffectue}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {item.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.avancement >= 80 ? 'bg-green-500' :
                              item.avancement >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${item.avancement}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getAvancementColor(item.avancement)}`}>
                          {item.avancement}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal des filtres */}
      <FiltersModal />
      
      {/* Modal d'ajout d'intervention */}
      <AddInterventionModalSimple
        isOpen={showAddInterventionModal}
        onClose={() => setShowAddInterventionModal(false)}
      />
    </div>
  );
};

export default InterventionStats;