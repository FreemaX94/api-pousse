import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  BookmarkIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AddressFiltersPanel = ({ isOpen, onClose, onApplyFilters, onSaveFilter }) => {
  const [activeTab, setActiveTab] = useState('principaux');
  const [filters, setFilters] = useState({
    // Champs principaux
    numero: '',
    client: '',
    codePostal: '',
    rue: '',
    avecGeolocalisation: 'Tous',
    societe: '',
    favoris: 'Tous',
    actif: 'Tous',
    
    // Champs secondaires
    ville: '',
    departement: 'Tous',
    email: '',
    telephone: '',
    commentaire: '',
    prenom: '',
    nom: '',
    typeActivite: 'Tous'
  });

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    // Filtrer les valeurs vides et les valeurs par défaut
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value && value !== '' && value !== 'Tous') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    onApplyFilters(activeFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      numero: '',
      client: '',
      codePostal: '',
      rue: '',
      avecGeolocalisation: 'Tous',
      societe: '',
      favoris: 'Tous',
      actif: 'Tous',
      ville: '',
      departement: 'Tous',
      email: '',
      telephone: '',
      commentaire: '',
      prenom: '',
      nom: '',
      typeActivite: 'Tous'
    });
  };

  const renderField = (field, label, type = 'text', options = null) => (
    <div className="space-y-1">
      <label 
        htmlFor={field}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      
      {type === 'select' ? (
        <select
          id={field}
          value={filters[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 bg-white"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={field}
          type={type}
          value={filters[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 bg-white"
          placeholder={`Filtrer par ${label.toLowerCase()}...`}
          step={type === 'number' ? '1' : undefined}
        />
      )}
    </div>
  );

  const champsPrincipaux = [
    { field: 'numero', label: 'N°', type: 'number' },
    { field: 'client', label: 'Client', type: 'text' },
    { field: 'codePostal', label: 'Code postal', type: 'text' },
    { field: 'rue', label: 'Rue', type: 'text' },
    { 
      field: 'avecGeolocalisation', 
      label: 'Avec géolocalisation ?', 
      type: 'select',
      options: [
        { value: 'Tous', label: 'Tous' },
        { value: 'Oui', label: 'Oui' },
        { value: 'Non', label: 'Non' }
      ]
    },
    { field: 'societe', label: 'Société', type: 'text' },
    { 
      field: 'favoris', 
      label: 'Favoris ?', 
      type: 'select',
      options: [
        { value: 'Tous', label: 'Tous' },
        { value: 'Oui', label: 'Oui' },
        { value: 'Non', label: 'Non' }
      ]
    },
    { 
      field: 'actif', 
      label: 'Actif ?', 
      type: 'select',
      options: [
        { value: 'Tous', label: 'Tous' },
        { value: 'Oui', label: 'Oui' },
        { value: 'Non', label: 'Non' }
      ]
    }
  ];

  const champsSecondaires = [
    { field: 'ville', label: 'Ville', type: 'text' },
    { 
      field: 'departement', 
      label: 'Département', 
      type: 'select',
      options: [
        { value: 'Tous', label: 'Tous' },
        { value: '75', label: '75 - Paris' },
        { value: '92', label: '92 - Hauts-de-Seine' },
        { value: '93', label: '93 - Seine-Saint-Denis' },
        { value: '94', label: '94 - Val-de-Marne' },
        { value: '77', label: '77 - Seine-et-Marne' },
        { value: '78', label: '78 - Yvelines' },
        { value: '91', label: '91 - Essonne' },
        { value: '95', label: '95 - Val-d\'Oise' },
        { value: '33', label: '33 - Gironde' },
        { value: '69', label: '69 - Rhône' }
      ]
    },
    { field: 'email', label: 'Email', type: 'email' },
    { field: 'telephone', label: 'Téléphone', type: 'tel' },
    { field: 'commentaire', label: 'Commentaire', type: 'text' },
    { field: 'prenom', label: 'Prénom', type: 'text' },
    { field: 'nom', label: 'Nom', type: 'text' },
    { 
      field: 'typeActivite', 
      label: 'Type d\'activité', 
      type: 'select',
      options: [
        { value: 'Tous', label: 'Tous' },
        { value: 'Commerce', label: 'Commerce' },
        { value: 'Industrie', label: 'Industrie' },
        { value: 'Services', label: 'Services' },
        { value: 'Agriculture', label: 'Agriculture' },
        { value: 'Construction', label: 'Construction' },
        { value: 'Transport', label: 'Transport' },
        { value: 'Hôtellerie', label: 'Hôtellerie' },
        { value: 'Santé', label: 'Santé' }
      ]
    }
  ];

  const tabs = [
    { id: 'principaux', label: 'Champs principaux', fields: champsPrincipaux },
    { id: 'secondaires', label: 'Champs secondaires', fields: champsSecondaires }
  ];

  const activeFields = tabs.find(tab => tab.id === activeTab)?.fields || [];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
      >
        {/* En-tête avec onglets */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#2170E3] text-[#2170E3]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Champs de filtres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {activeFields.map((field) => (
            <div key={field.field}>
              {renderField(field.field, field.label, field.type, field.options)}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApplyFilters}
              className="inline-flex items-center px-6 py-2 bg-[#2170E3] text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3] transition-colors"
            >
              <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
              Chercher
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSaveFilter && onSaveFilter(filters)}
              className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <BookmarkIcon className="w-4 h-4 mr-2" />
              Enregistrer ce filtre
            </motion.button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
            >
              Annuler ces filtres
            </button>
            
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Indicateur de filtres actifs */}
        {Object.values(filters).some(value => value && value !== '' && value !== 'Tous') && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <span className="font-medium">
                {Object.values(filters).filter(value => value && value !== '' && value !== 'Tous').length}
              </span>
              {' '}filtre(s) actif(s)
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AddressFiltersPanel;