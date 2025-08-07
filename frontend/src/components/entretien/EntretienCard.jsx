import React from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  BuildingOfficeIcon, 
  HomeIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as DelayIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const EntretienCard = ({ 
  entretien, 
  onEdit, 
  onView, 
  onStart, 
  onComplete, 
  onCancel, 
  onReschedule 
}) => {
  // Fonction pour obtenir la couleur selon le statut
  const getStatusColor = (statut) => {
    const colors = {
      planifie: 'bg-blue-100 text-blue-800 border-blue-200',
      en_cours: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      termine: 'bg-green-100 text-green-800 border-green-200',
      annule: 'bg-red-100 text-red-800 border-red-200',
      reporte: 'bg-orange-100 text-orange-800 border-orange-200',
      facture: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Fonction pour obtenir l'icône selon le statut
  const getStatusIcon = (statut) => {
    const icons = {
      planifie: CalendarIcon,
      en_cours: ClockIcon,
      termine: CheckCircleIcon,
      annule: XCircleIcon,
      reporte: DelayIcon,
      facture: CheckCircleIcon
    };
    const IconComponent = icons[statut] || CalendarIcon;
    return <IconComponent className="w-4 h-4" />;
  };

  // Fonction pour obtenir la couleur de priorité
  const getPriorityColor = (priorite) => {
    const colors = {
      basse: 'bg-gray-500',
      normale: 'bg-blue-500',
      haute: 'bg-orange-500',
      urgente: 'bg-red-500'
    };
    return colors[priorite] || 'bg-gray-500';
  };

  // Calculer si l'entretien est en retard
  const isOverdue = entretien.estEnRetard;
  const isToday = format(new Date(entretien.planification.dateDebut), 'yyyy-MM-dd') === 
                  format(new Date(), 'yyyy-MM-dd');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      className={`
        bg-white rounded-xl shadow-md border border-gray-200 p-6 cursor-pointer
        transition-all duration-200 hover:border-blue-300
        ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
        ${isToday ? 'border-l-4 border-l-blue-500' : ''}
      `}
      onClick={() => onView(entretien._id)}
    >
      {/* Header avec statut et priorité */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
            ${getStatusColor(entretien.statut)}
          `}>
            {getStatusIcon(entretien.statut)}
            <span className="ml-1 capitalize">{entretien.statut.replace('_', ' ')}</span>
          </span>
          
          {/* Indicateur de priorité */}
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(entretien.priorite)}`} />
            <span className="text-xs text-gray-500 capitalize">{entretien.priorite}</span>
          </div>
        </div>

        {/* Alertes */}
        <div className="flex items-center space-x-2">
          {isOverdue && (
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" title="En retard" />
          )}
          {isToday && (
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Aujourd'hui" />
          )}
        </div>
      </div>

      {/* Numéro d'entretien */}
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-600">
          {entretien.numeroEntretien}
        </span>
      </div>

      {/* Client */}
      <div className="flex items-center space-x-2 mb-3">
        {entretien.client.typeClient === 'Professionnel' ? (
          <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
        ) : (
          <HomeIcon className="w-5 h-5 text-gray-400" />
        )}
        <div>
          <h3 className="font-semibold text-gray-900 truncate">
            {entretien.client.nom}
          </h3>
          <span className="text-xs text-gray-500">
            {entretien.client.typeClient}
          </span>
        </div>
      </div>

      {/* Titre de l'entretien */}
      {entretien.titre && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {entretien.titre}
        </p>
      )}

      {/* Type de contrat */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
          {entretien.typeContrat}
        </span>
        
        {entretien.tarification?.montantEstime && (
          <span className="text-sm font-semibold text-green-600">
            {entretien.montantTotal?.toFixed(2)} €
          </span>
        )}
      </div>

      {/* Dates et durée */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CalendarIcon className="w-4 h-4" />
          <span>
            {format(new Date(entretien.planification.dateDebut), 'Pp', { locale: fr })}
          </span>
        </div>
        
        {entretien.dureeEstimee > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClockIcon className="w-4 h-4" />
            <span>
              {Math.floor(entretien.dureeEstimee / 60)}h{entretien.dureeEstimee % 60 > 0 && 
                `${entretien.dureeEstimee % 60}min`}
            </span>
          </div>
        )}
      </div>

      {/* Techniciens assignés */}
      {entretien.techniciens && entretien.techniciens.length > 0 && (
        <div className="flex items-center space-x-2 mb-4">
          <UserIcon className="w-4 h-4 text-gray-400" />
          <div className="flex -space-x-1">
            {entretien.techniciens.slice(0, 3).map((tech, index) => (
              <div
                key={index}
                className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white"
                title={tech.nom}
              >
                {tech.nom.charAt(0).toUpperCase()}
              </div>
            ))}
            {entretien.techniciens.length > 3 && (
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500 border-2 border-white">
                +{entretien.techniciens.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Barre de progression */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Progression</span>
          <span>{entretien.progression}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              entretien.progression === 100 ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${entretien.progression}%` }}
          />
        </div>
      </div>

      {/* Actions rapides */}
      <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
        {entretien.statut === 'planifie' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onStart(entretien._id);
            }}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PlayIcon className="w-3 h-3 mr-1" />
            Démarrer
          </motion.button>
        )}

        {entretien.statut === 'en_cours' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onComplete(entretien._id);
            }}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Terminer
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(entretien._id);
          }}
          className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Modifier
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EntretienCard;