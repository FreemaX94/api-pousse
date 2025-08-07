import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TruckIcon, 
  CalendarIcon, 
  UserIcon, 
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useDeleteVehicle, useAssignVehicle, useUnassignVehicle } from '../../hooks/useVehicles';
import toast from 'react-hot-toast';

const statusConfig = {
  available: {
    label: 'Disponible',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircleIcon
  },
  in_use: {
    label: 'En service',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: TruckIcon
  },
  maintenance: {
    label: 'Maintenance',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: WrenchScrewdriverIcon
  },
  out_of_service: {
    label: 'Hors service',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: ExclamationTriangleIcon
  },
  retired: {
    label: 'Retiré',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: ClockIcon
  }
};

const typeConfig = {
  truck: { label: 'Camion', icon: '🚛' },
  van: { label: 'Fourgon', icon: '🚐' },
  car: { label: 'Voiture', icon: '🚗' },
  trailer: { label: 'Remorque', icon: '🚜' },
  motorcycle: { label: 'Moto', icon: '🏍️' },
  equipment: { label: 'Équipement', icon: '🚧' }
};

const VehicleCard = ({ vehicle, onEdit, onView }) => {
  const [showActions, setShowActions] = useState(false);
  const deleteVehicle = useDeleteVehicle();
  const assignVehicle = useAssignVehicle();
  const unassignVehicle = useUnassignVehicle();

  const status = statusConfig[vehicle.status] || statusConfig.available;
  const StatusIcon = status.icon;
  const type = typeConfig[vehicle.type] || typeConfig.van;

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le véhicule ${vehicle.licensePlate} ?`)) {
      try {
        await deleteVehicle.mutateAsync(vehicle._id);
        toast.success('Véhicule supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleAssignToggle = async () => {
    try {
      if (vehicle.assignedTo) {
        await unassignVehicle.mutateAsync(vehicle._id);
        toast.success('Véhicule désassigné');
      } else {
        // Pour simplifier, on peut ajouter une modal de sélection d'utilisateur plus tard
        toast.info('Fonctionnalité d\'assignation en développement');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'assignation');
    }
  };

  const calculateAge = () => {
    return new Date().getFullYear() - vehicle.year;
  };

  const isMaintenanceDue = () => {
    if (vehicle.maintenance?.schedule?.nextServiceDate) {
      return new Date(vehicle.maintenance.schedule.nextServiceDate) <= new Date();
    }
    return false;
  };

  const isDocumentExpiring = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const insuranceExpiry = vehicle.insurance?.endDate ? new Date(vehicle.insurance.endDate) : null;
    const inspectionExpiry = vehicle.documents?.inspection?.nextDueDate ? new Date(vehicle.documents.inspection.nextDueDate) : null;
    
    return (insuranceExpiry && insuranceExpiry <= thirtyDaysFromNow) ||
           (inspectionExpiry && inspectionExpiry <= thirtyDaysFromNow);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, shadow: '0 10px 25px rgba(0,0,0,0.15)' }}
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header avec status et alertes */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${status.color}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </span>
            <span className="text-lg">{type.icon}</span>
            <span className="text-xs text-gray-500">{type.label}</span>
          </div>
          
          {/* Alertes */}
          <div className="flex space-x-1">
            {isMaintenanceDue() && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-orange-500 rounded-full"
                title="Maintenance due"
              />
            )}
            {isDocumentExpiring() && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-red-500 rounded-full"
                title="Documents expirant bientôt"
              />
            )}
          </div>
        </div>
      </div>

      {/* Image du véhicule */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {vehicle.images && vehicle.images.length > 0 ? (
          <img
            src={vehicle.images.find(img => img.isPrimary)?.url || vehicle.images[0]?.url}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TruckIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Actions overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showActions ? 1 : 0 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onView(vehicle)}
            className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            title="Voir les détails"
          >
            <EyeIcon className="w-5 h-5 text-gray-700" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(vehicle)}
            className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            title="Modifier"
          >
            <PencilIcon className="w-5 h-5 text-blue-600" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            title="Supprimer"
            disabled={deleteVehicle.isLoading}
          >
            <TrashIcon className="w-5 h-5 text-red-600" />
          </motion.button>
        </motion.div>
      </div>

      {/* Contenu principal */}
      <div className="p-4">
        {/* Titre et plaque */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {vehicle.brand} {vehicle.model}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
              {vehicle.licensePlate}
            </span>
            <span className="text-xs text-gray-500">
              {vehicle.year} • {calculateAge()} ans
            </span>
          </div>
        </div>

        {/* Informations clés */}
        <div className="space-y-2 mb-4">
          {/* Kilométrage */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-20 text-gray-500">Km :</span>
            <span className="font-medium">
              {vehicle.mileage?.current?.toLocaleString() || 'N/A'} km
            </span>
          </div>

          {/* Assignation */}
          <div className="flex items-center text-sm text-gray-600">
            <UserIcon className="w-4 h-4 mr-1 text-gray-400" />
            <span className="w-16 text-gray-500">Assigné :</span>
            {vehicle.assignedTo ? (
              <span className="font-medium text-blue-600">
                {vehicle.assignedTo.username}
              </span>
            ) : (
              <span className="text-gray-400 italic">Non assigné</span>
            )}
          </div>

          {/* Capacité */}
          {vehicle.capacity?.weight && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-20 text-gray-500">Capacité :</span>
              <span className="font-medium">
                {vehicle.capacity.weight} kg
              </span>
            </div>
          )}

          {/* Prochaine maintenance */}
          {vehicle.maintenance?.schedule?.nextServiceDate && (
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
              <span className="w-16 text-gray-500">Maintenance :</span>
              <span className={`font-medium ${isMaintenanceDue() ? 'text-orange-600' : 'text-gray-700'}`}>
                {new Date(vehicle.maintenance.schedule.nextServiceDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <DocumentTextIcon className="w-3 h-3 mr-1" />
              <span>Docs</span>
            </div>
            
            {/* Indicateurs de documents */}
            <div className="flex space-x-1">
              {vehicle.documents?.registration?.expiryDate && (
                <div 
                  className={`w-2 h-2 rounded-full ${
                    new Date(vehicle.documents.registration.expiryDate) <= new Date(Date.now() + 30*24*60*60*1000) 
                      ? 'bg-red-400' 
                      : 'bg-green-400'
                  }`}
                  title="Carte grise"
                />
              )}
              {vehicle.insurance?.endDate && (
                <div 
                  className={`w-2 h-2 rounded-full ${
                    new Date(vehicle.insurance.endDate) <= new Date(Date.now() + 30*24*60*60*1000) 
                      ? 'bg-red-400' 
                      : 'bg-green-400'
                  }`}
                  title="Assurance"
                />
              )}
              {vehicle.documents?.inspection?.nextDueDate && (
                <div 
                  className={`w-2 h-2 rounded-full ${
                    new Date(vehicle.documents.inspection.nextDueDate) <= new Date(Date.now() + 30*24*60*60*1000) 
                      ? 'bg-red-400' 
                      : 'bg-green-400'
                  }`}
                  title="Contrôle technique"
                />
              )}
            </div>
          </div>

          <span className="text-xs text-gray-400">
            ID: {vehicle.vehicleId || vehicle._id.slice(-6)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleCard;