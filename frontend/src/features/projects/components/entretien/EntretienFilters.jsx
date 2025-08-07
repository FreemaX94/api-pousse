import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FunnelIcon, 
  XMarkIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const EntretienFilters = ({ 
  filters, 
  onFiltersChange, 
  onReset, 
  isOpen, 
  onToggle 
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== '' && value !== 'all'
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header des filtres */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </motion.button>

          <div className="flex items-center space-x-2">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un client, numéro..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="border-0 focus:ring-0 focus:outline-none text-sm placeholder-gray-400 bg-transparent min-w-0 flex-1"
            />
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
          >
            <XMarkIcon className="w-3 h-3" />
            <span>Réinitialiser</span>
          </motion.button>
        )}
      </div>

      {/* Filtres avancés */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 border-t border-gray-100">
              {/* Première ligne de filtres */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Statut */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    value={filters.statut || 'all'}
                    onChange={(e) => handleFilterChange('statut', e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="planifie">Planifié</option>
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                    <option value="annule">Annulé</option>
                    <option value="reporte">Reporté</option>
                    <option value="facture">Facturé</option>
                  </select>
                </div>

                {/* Type de client */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Type de client
                  </label>
                  <select
                    value={filters.typeClient || 'all'}
                    onChange={(e) => handleFilterChange('typeClient', e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tous</option>
                    <option value="Professionnel">Professionnel</option>
                    <option value="Particulier">Particulier</option>
                  </select>
                </div>

                {/* Type de contrat */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Type de contrat
                  </label>
                  <select
                    value={filters.typeContrat || 'all'}
                    onChange={(e) => handleFilterChange('typeContrat', e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tous</option>
                    <option value="Entretien">Entretien</option>
                    <option value="Abonnement">Abonnement</option>
                    <option value="Ponctuel">Ponctuel</option>
                  </select>
                </div>

                {/* Priorité */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Priorité
                  </label>
                  <select
                    value={filters.priorite || 'all'}
                    onChange={(e) => handleFilterChange('priorite', e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Toutes</option>
                    <option value="basse">Basse</option>
                    <option value="normale">Normale</option>
                    <option value="haute">Haute</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              {/* Deuxième ligne - Filtres de date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={filters.dateDebut || ''}
                      onChange={(e) => handleFilterChange('dateDebut', e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <CalendarIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={filters.dateFin || ''}
                      onChange={(e) => handleFilterChange('dateFin', e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <CalendarIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Affichage
                  </label>
                  <select
                    value={filters.archive || 'false'}
                    onChange={(e) => handleFilterChange('archive', e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="false">Actifs uniquement</option>
                    <option value="true">Archivés uniquement</option>
                    <option value="all">Tous</option>
                  </select>
                </div>
              </div>

              {/* Troisième ligne - Filtres avancés */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tri par
                  </label>
                  <select
                    value={filters.sortBy || 'dateDebut'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="dateDebut">Date de début</option>
                    <option value="client">Client</option>
                    <option value="statut">Statut</option>
                    <option value="priorite">Priorité</option>
                    <option value="montant">Montant</option>
                    <option value="createdAt">Date de création</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Ordre
                  </label>
                  <select
                    value={filters.sortOrder || 'desc'}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="desc">Décroissant</option>
                    <option value="asc">Croissant</option>
                  </select>
                </div>
              </div>

              {/* Raccourcis de filtres */}
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Raccourcis
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Aujourd\'hui', key: 'today' },
                    { label: 'Cette semaine', key: 'thisWeek' },
                    { label: 'Ce mois', key: 'thisMonth' },
                    { label: 'En retard', key: 'overdue' },
                    { label: 'Urgents', key: 'urgent' },
                    { label: 'Non facturés', key: 'unbilled' }
                  ].map((shortcut) => (
                    <motion.button
                      key={shortcut.key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFilterChange('shortcut', shortcut.key)}
                      className={`
                        px-3 py-1 text-xs font-medium rounded-full transition-colors
                        ${filters.shortcut === shortcut.key
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }
                      `}
                    >
                      {shortcut.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntretienFilters;