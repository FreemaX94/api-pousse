import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

interface Intervention {
  id: string;
  title: string;
  client?: string;
  address?: string;
  type: string;
  collaborator?: string;
  hasComment?: boolean;
}

interface InterventionTagProps {
  intervention: Intervention;
  color: string;
  onAssignDate: (interventionId: string) => void;
  onEdit: (interventionId: string) => void;
  onDelete: (interventionId: string) => void;
}

const InterventionTag: React.FC<InterventionTagProps> = ({
  intervention,
  color,
  onAssignDate,
  onEdit,
  onDelete
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleTagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  const handleActionClick = (action: () => void) => {
    action();
    setShowActions(false);
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleTagClick}
        className="inline-flex items-center px-3 py-2 rounded-lg text-white text-sm font-medium cursor-pointer shadow-sm hover:shadow-md transition-all"
        style={{ backgroundColor: color }}
      >
        <span className="truncate max-w-xs">
          {intervention.title}
          {intervention.client && ` - ${intervention.client}`}
        </span>
        {intervention.hasComment && (
          <ChatBubbleLeftIcon className="w-3 h-3 ml-2 flex-shrink-0" />
        )}
        <EllipsisVerticalIcon className="w-4 h-4 ml-2 flex-shrink-0" />
      </motion.div>

      {/* Menu d'actions */}
      <AnimatePresence>
        {showActions && (
          <>
            {/* Overlay pour fermer le menu */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowActions(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            >
              <div className="py-1">
                <button
                  onClick={() => handleActionClick(() => onAssignDate(intervention.id))}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <CalendarDaysIcon className="w-4 h-4 mr-3" />
                  Attribuer une date/heure
                </button>
                
                <button
                  onClick={() => handleActionClick(() => onEdit(intervention.id))}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <PencilIcon className="w-4 h-4 mr-3" />
                  Modifier
                </button>
                
                <hr className="my-1 border-gray-100" />
                
                <button
                  onClick={() => handleActionClick(() => onDelete(intervention.id))}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <TrashIcon className="w-4 h-4 mr-3" />
                  Supprimer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterventionTag;