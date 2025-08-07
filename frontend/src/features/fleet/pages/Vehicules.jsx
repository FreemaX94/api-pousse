import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { useVehicles } from '../hooks/useVehicles';
import VehicleCard from '../components/vehicles/VehicleCard';
import VehicleFilters from '../components/vehicles/VehicleFilters';
import VehicleStats from '../components/vehicles/VehicleStats';
import toast from 'react-hot-toast';

export default function Vehicules() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    status: '',
    type: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: vehiclesData, isLoading, error } = useVehicles(filters);

  const vehicles = vehiclesData?.data || [];
  const pagination = vehiclesData?.pagination || {};

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset page when filters change
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: '',
      status: '',
      type: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowForm(true);
  };

  const handleView = (vehicle) => {
    // Pour l'instant, on redirige vers edit, mais on pourrait créer une modal de détails
    setSelectedVehicle(vehicle);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedVehicle(null);
    setShowForm(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TruckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-500">
            {error.message || 'Impossible de charger les véhicules'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Gestion des Véhicules
            </h1>
            <p className="text-gray-600">
              Gérez votre flotte de véhicules, maintenance et documents
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {/* Toggle Filters */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
              Filtres
            </motion.button>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300 bg-white">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ListBulletIcon className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Add Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Ajouter un véhicule
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Dashboard */}
        <VehicleStats />

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <VehicleFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              vehicleCount={pagination.totalItems}
            />
          )}
        </AnimatePresence>

        {/* Compact Filters */}
        {!showFilters && (
          <VehicleFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            vehicleCount={pagination.totalItems}
            isCompact={true}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vehicles Grid/List */}
        {!isLoading && vehicles.length > 0 && (
          <motion.div
            layout
            className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }`}
          >
            <AnimatePresence>
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  onEdit={handleEdit}
                  onView={handleView}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && vehicles.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <TruckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.search || filters.status || filters.type
                ? 'Aucun véhicule trouvé'
                : 'Aucun véhicule enregistré'
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {filters.search || filters.status || filters.type
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Commencez par ajouter votre premier véhicule'
              }
            </p>
            {(!filters.search && !filters.status && !filters.type) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Ajouter un véhicule
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && vehicles.length > 0 && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-2 mt-8"
          >
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            
            <div className="flex items-center space-x-1">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1;
                const isCurrentPage = page === pagination.currentPage;
                
                if (
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isCurrentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === pagination.currentPage - 2 ||
                  page === pagination.currentPage + 2
                ) {
                  return (
                    <span key={page} className="px-2 py-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal pour VehicleForm */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowForm(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {selectedVehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
                </h2>
                {/* Ici on garderait le VehicleForm existant pour l'instant */}
                <p className="text-gray-500 mb-4">
                  Formulaire de véhicule à implémenter avec les nouvelles technologies
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      toast.success('Véhicule sauvegardé (simulation)');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

