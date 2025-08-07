import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { 
  PlusIcon, 
  ViewColumnsIcon, 
  Squares2X2Icon,
  ListBulletIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// Import des hooks et composants
import { 
  useEntretiens, 
  useEntretienStatistiques,
  useCreateEntretien,
  useDemarrerEntretien,
  useTerminerEntretien,
  useDeleteEntretien
} from '../hooks/useEntretiens';
import EntretienCard from '../components/entretien/EntretienCard';
import EntretienFilters from '../components/entretien/EntretienFilters';

const Entretien = () => {
  // État local
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table', 'calendar'
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedEntretien, setSelectedEntretien] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    statut: 'all',
    typeClient: 'all',
    typeContrat: 'all',
    priorite: 'all',
    dateDebut: '',
    dateFin: '',
    archive: 'false',
    sortBy: 'dateDebut',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });

  // Hooks React Query
  const { data: entretiensData, isLoading, error, refetch } = useEntretiens(filters);
  const { data: statistiques, isLoading: statsLoading } = useEntretienStatistiques();
  
  // Mutations
  const createMutation = useCreateEntretien();
  const startMutation = useDemarrerEntretien();
  const completeMutation = useTerminerEntretien();
  const deleteMutation = useDeleteEntretien();

  // Fonctions de gestion
  const handleFiltersChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleFiltersReset = () => {
    setFilters({
      search: '',
      statut: 'all',
      typeClient: 'all',
      typeContrat: 'all',
      priorite: 'all',
      dateDebut: '',
      dateFin: '',
      archive: 'false',
      sortBy: 'dateDebut',
      sortOrder: 'desc',
      page: 1,
      limit: 12
    });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleStartEntretien = (id) => {
    startMutation.mutate(id);
  };

  const handleCompleteEntretien = (id) => {
    const compteRendu = prompt('Compte-rendu de fin d\'intervention (optionnel):');
    completeMutation.mutate({ id, compteRendu: compteRendu || '' });
  };

  const handleDeleteEntretien = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir archiver cet entretien ?')) {
      deleteMutation.mutate(id);
    }
  };

  // Calcul des métriques pour le dashboard
  const metrics = useMemo(() => {
    if (!statistiques?.data) return [];
    
    const stats = statistiques.data;
    return [
      {
        title: 'Total entretiens',
        value: stats.total,
        icon: ListBulletIcon,
        color: 'blue',
        change: '+12%'
      },
      {
        title: 'Planifiés',
        value: stats.planifies,
        icon: CalendarDaysIcon,
        color: 'indigo',
        change: '+5%'
      },
      {
        title: 'En cours',
        value: stats.enCours,
        icon: ArrowPathIcon,
        color: 'yellow',
        change: '+8%'
      },
      {
        title: 'En retard',
        value: stats.enRetard,
        icon: ExclamationTriangleIcon,
        color: 'red',
        change: '-3%'
      },
      {
        title: 'CA ce mois',
        value: `${(stats.chiffreAffaireMois || 0).toLocaleString()} €`,
        icon: ChartBarIcon,
        color: 'green',
        change: '+15%'
      }
    ];
  }, [statistiques]);

  const renderMetricCard = (metric, index) => (
    <motion.div
      key={metric.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{metric.title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
          <p className={`text-sm mt-2 ${
            metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {metric.change} vs mois dernier
          </p>
        </div>
        <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
          <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <ArrowPathIcon className="w-8 h-8 text-blue-500" />
          </motion.div>
          <span className="ml-3 text-gray-600">Chargement des entretiens...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">Impossible de charger les entretiens</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Réessayer
          </motion.button>
        </div>
      );
    }

    const entretiens = entretiensData?.data || [];

    if (entretiens.length === 0) {
      return (
        <div className="text-center py-12">
          <InformationCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun entretien trouvé</h3>
          <p className="text-gray-600 mb-4">
            {filters.search || Object.values(filters).some(v => v && v !== 'all' && v !== 'false') 
              ? 'Aucun entretien ne correspond aux critères de recherche'
              : 'Commencez par créer votre premier entretien'
            }
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Créer un entretien
          </motion.button>
        </div>
      );
    }

    // Rendu selon le mode d'affichage
    switch (viewMode) {
      case 'cards':
        return (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {entretiens.map((entretien) => (
                <EntretienCard
                  key={entretien._id}
                  entretien={entretien}
                  onView={(id) => setSelectedEntretien(id)}
                  onEdit={(id) => setSelectedEntretien(id)}
                  onStart={handleStartEntretien}
                  onComplete={handleCompleteEntretien}
                  onCancel={handleDeleteEntretien}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        );

      case 'table':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {entretiens.map((entretien, index) => (
                      <motion.tr
                        key={entretien._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {entretien.client.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {entretien.numeroEntretien}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {entretien.typeContrat}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            {
                              planifie: 'bg-blue-100 text-blue-800',
                              en_cours: 'bg-yellow-100 text-yellow-800',
                              termine: 'bg-green-100 text-green-800',
                              annule: 'bg-red-100 text-red-800'
                            }[entretien.statut] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {entretien.statut.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(entretien.planification.dateDebut).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entretien.montantTotal?.toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedEntretien(entretien._id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Voir
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return renderContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Entretiens</h1>
              <p className="text-sm text-gray-600">
                Gestion des interventions et contrats d'entretien
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Modes d'affichage */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'cards' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <ViewColumnsIcon className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Bouton nouveau */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Nouvel entretien
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métriques */}
        {!statsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {metrics.map(renderMetricCard)}
          </div>
        )}

        {/* Filtres */}
        <div className="mb-6">
          <EntretienFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleFiltersReset}
            isOpen={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          />
        </div>

        {/* Contenu principal */}
        {renderContent()}

        {/* Pagination */}
        {entretiensData?.pagination && entretiensData.pagination.pages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Affichage de {((filters.page - 1) * filters.limit) + 1} à{' '}
                {Math.min(filters.page * filters.limit, entretiensData.pagination.total)} sur{' '}
                {entretiensData.pagination.total} entretiens
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={!entretiensData.pagination.hasPrev}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </motion.button>
              
              <span className="text-sm text-gray-700">
                Page {filters.page} sur {entretiensData.pagination.pages}
              </span>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={!entretiensData.pagination.hasNext}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Entretien;