import React from 'react';
import { motion } from 'framer-motion';
import { 
  TruckIcon, 
  CheckCircleIcon, 
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useVehicleStats, useExpiringDocuments } from '../../hooks/useVehicles';

const VehicleStats = () => {
  const { data: stats, isLoading: statsLoading } = useVehicleStats();
  const { data: expiringDocs, isLoading: expiringLoading } = useExpiringDocuments(30);

  if (statsLoading || expiringLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total véhicules',
      value: stats?.totalVehicles || 0,
      icon: TruckIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Disponibles',
      value: stats?.available || 0,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'En maintenance',
      value: stats?.inMaintenance || 0,
      icon: WrenchScrewdriverIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Documents expirant',
      value: expiringDocs?.length || 0,
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      subtitle: 'Dans 30 jours'
    }
  ];

  const additionalStats = [
    {
      title: 'Âge moyen de la flotte',
      value: stats?.averageAge ? `${Math.round(stats.averageAge)} ans` : 'N/A',
      icon: CalendarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Kilométrage total',
      value: stats?.totalMileage ? `${(stats.totalMileage / 1000).toFixed(0)}k km` : 'N/A',
      icon: ChartBarIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      title: 'Coût maintenance/an',
      value: stats?.yearlyMaintenanceCost ? `${stats.yearlyMaintenanceCost.toLocaleString()} €` : 'N/A',
      icon: CurrencyEuroIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Temps d\'utilisation',
      value: stats?.utilizationRate ? `${Math.round(stats.utilizationRate)}%` : 'N/A',
      icon: ClockIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2, shadow: '0 8px 25px rgba(0,0,0,0.1)' }}
              className={`bg-white rounded-xl p-6 shadow-sm border-l-4 border-r border-t border-b border-gray-200 ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Statistiques avancées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {additionalStats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 4) * 0.1 }}
              whileHover={{ y: -2, shadow: '0 8px 25px rgba(0,0,0,0.1)' }}
              className={`bg-white rounded-xl p-6 shadow-sm border ${stat.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Alertes importantes */}
      {(stats?.maintenanceDue > 0 || (expiringDocs && expiringDocs.length > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6"
        >
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Alertes importantes
              </h3>
              <ul className="space-y-1 text-sm text-orange-800">
                {stats?.maintenanceDue > 0 && (
                  <li>
                    • {stats.maintenanceDue} véhicule{stats.maintenanceDue > 1 ? 's' : ''} 
                    {stats.maintenanceDue > 1 ? ' nécessitent' : ' nécessite'} une maintenance
                  </li>
                )}
                {expiringDocs && expiringDocs.length > 0 && (
                  <li>
                    • {expiringDocs.length} véhicule{expiringDocs.length > 1 ? 's ont' : ' a'} 
                    des documents expirant dans les 30 prochains jours
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VehicleStats;