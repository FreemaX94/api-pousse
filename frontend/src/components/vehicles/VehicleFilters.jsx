import React from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  XMarkIcon,
  TruckIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const statusOptions = [
  { value: '', label: 'Tous les statuts', icon: FunnelIcon, color: 'text-gray-600' },
  { value: 'available', label: 'Disponible', icon: CheckCircleIcon, color: 'text-green-600' },
  { value: 'in_use', label: 'En service', icon: TruckIcon, color: 'text-blue-600' },
  { value: 'maintenance', label: 'Maintenance', icon: WrenchScrewdriverIcon, color: 'text-yellow-600' },
  { value: 'out_of_service', label: 'Hors service', icon: ExclamationTriangleIcon, color: 'text-red-600' },
  { value: 'retired', label: 'Retiré', icon: XMarkIcon, color: 'text-gray-600' }
];

const typeOptions = [
  { value: '', label: 'Tous les types' },
  { value: 'truck', label: 'Camion' },
  { value: 'van', label: 'Fourgon' },
  { value: 'car', label: 'Voiture' },
  { value: 'trailer', label: 'Remorque' },
  { value: 'motorcycle', label: 'Moto' },
  { value: 'equipment', label: 'Équipement' }
];

const sortOptions = [
  { value: 'createdAt', label: 'Date de création' },
  { value: 'licensePlate', label: 'Plaque d\'immatriculation' },
  { value: 'brand', label: 'Marque' },
  { value: 'model', label: 'Modèle' },
  { value: 'year', label: 'Année' },
  { value: 'mileage.current', label: 'Kilométrage' }
];

const VehicleFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  vehicleCount = 0,
  isCompact = false 
}) => {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleStatusChange = (status) => {
    onFilterChange({ status: status === filters.status ? '' : status });
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const hasActiveFilters = filters.search || filters.status || filters.type;

  if (isCompact) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-4 mb-6"
      >
        <div className="flex flex-wrap items-center gap-3">
          {/* Recherche */}
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par plaque, marque, modèle..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtres rapides */}
          <div className="flex items-center space-x-2">
            {statusOptions.slice(0, 4).map((status) => {
              const Icon = status.icon;
              const isActive = filters.status === status.value;
              
              return (
                <motion.button
                  key={status.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStatusChange(status.value)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {status.label}
                </motion.button>
              );
            })}
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearFilters}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Effacer
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
          {vehicleCount > 0 && (
            <span className="text-sm text-gray-500">
              ({vehicleCount} véhicule{vehicleCount > 1 ? 's' : ''})
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearFilters}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            Effacer les filtres
          </motion.button>
        )}
      </div>

      {/* Recherche */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recherche
        </label>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par plaque, marque, modèle, VIN..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filtres par statut */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Statut
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {statusOptions.map((status) => {
            const Icon = status.icon;
            const isActive = filters.status === status.value;
            
            return (
              <motion.button
                key={status.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusChange(status.value)}
                className={`inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-200 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-blue-600' : status.color}`} />
                {status.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Autres filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type de véhicule */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de véhicule
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {typeOptions.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tri */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trier par
          </label>
          <select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {sortOptions.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ordre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordre
          </label>
          <select
            value={filters.sortOrder || 'desc'}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="desc">Décroissant</option>
            <option value="asc">Croissant</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleFilters;