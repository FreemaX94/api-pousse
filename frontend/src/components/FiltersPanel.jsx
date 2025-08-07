import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  BookmarkIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const FiltersPanel = ({ isOpen, onClose, onApplyFilters, onSaveFilter }) => {
  const [activeTab, setActiveTab] = useState('principaux');
  const [filters, setFilters] = useState({
    // Champs principaux
    numero: '',
    libellePrincipal: '',
    nomSociete: '',
    prenomContact: '',
    nomContact: '',
    email: '',
    telephone: '',
    collaborateur: 'Tous',
    autreIdentifiant: '',
    favoris: 'Tous',
    actif: 'Tous',
    
    // Champs secondaires
    compteComptable: '',
    compteAuxiliaire: '',
    posteEntreprise: '',
    departementEntreprise: '',
    siren: '',
    siret: '',
    ape: '',
    numeroRCS: '',
    siteWeb: '',
    language: 'Tous',
    provenance: 'Toutes',
    typeActivite: 'Tous',
    villeAdresse: '',
    codePostalAdresse: '',
    rueAdresse: ''
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
      if (value && value !== '' && value !== 'Tous' && value !== 'Toutes') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    onApplyFilters(activeFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      numero: '',
      libellePrincipal: '',
      nomSociete: '',
      prenomContact: '',
      nomContact: '',
      email: '',
      telephone: '',
      collaborateur: 'Tous',
      autreIdentifiant: '',
      favoris: 'Tous',
      actif: 'Tous',
      compteComptable: '',
      compteAuxiliaire: '',
      posteEntreprise: '',
      departementEntreprise: '',
      siren: '',
      siret: '',
      ape: '',
      numeroRCS: '',
      siteWeb: '',
      language: 'Tous',
      provenance: 'Toutes',
      typeActivite: 'Tous',
      villeAdresse: '',
      codePostalAdresse: '',
      rueAdresse: ''
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
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3] focus:border-[#2170E3] bg-white"
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
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3] focus:border-[#2170E3] bg-white"
          placeholder={`Filtrer par ${label.toLowerCase()}...`}
        />
      )}
    </div>
  );

  const champsPrincipaux = [
    { field: 'numero', label: 'N°', type: 'number' },
    { field: 'libellePrincipal', label: 'Libellé principal', type: 'text' },
    { field: 'nomSociete', label: 'Nom de la société', type: 'text' },
    { field: 'prenomContact', label: 'Prénom du contact', type: 'text' },
    { field: 'nomContact', label: 'Nom du contact', type: 'text' },
    { field: 'email', label: 'Email', type: 'email' },
    { field: 'telephone', label: 'Téléphone', type: 'tel' },
    { 
      field: 'collaborateur', 
      label: 'Collaborateur', 
      type: 'select',
      options: [
        { value: 'Tous', label: 'Tous' },
        { value: 'Jean Dupont', label: 'Jean Dupont' },
        { value: 'Marie Martin', label: 'Marie Martin' },
        { value: 'Pierre Durand', label: 'Pierre Durand' }
      ]
    },
    { field: 'autreIdentifiant', label: 'Autre identifiant', type: 'text' },
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
    { field: 'compteComptable', label: 'Compte comptable', type: 'text' },
    { field: 'compteAuxiliaire', label: 'Compte auxiliaire', type: 'text' },
    { field: 'posteEntreprise', label: 'Poste dans l\'entreprise', type: 'text' },
    { field: 'departementEntreprise', label: 'Département dans l\'entreprise', type: 'text' },
    { field: 'siren', label: 'SIREN', type: 'text' },
    { field: 'siret', label: 'SIRET', type: 'text' },
    { field: 'ape', label: 'APE', type: 'text' },
    { field: 'numeroRCS', label: 'N° RCS', type: 'text' },
    { field: 'siteWeb', label: 'Site web', type: 'url' },
    { 
      field: 'language', 
      label: 'Language', 
      type: 'select',
      options: [
        { value: 'Tous', label: 'Tous' },
        { value: 'Français', label: 'Français' },
        { value: 'Anglais', label: 'Anglais' },
        { value: 'Espagnol', label: 'Espagnol' },
        { value: 'Allemand', label: 'Allemand' }
      ]
    },
    { 
      field: 'provenance', 
      label: 'Provenance', 
      type: 'select',
      options: [
        { value: 'Toutes', label: 'Toutes' },
        { value: 'Recommandation', label: 'Recommandation' },
        { value: 'Site web', label: 'Site web' },
        { value: 'Publicité', label: 'Publicité' },
        { value: 'Salon', label: 'Salon' }
      ]
    },
    { 
      field: 'typeActivite', 
      label: 'Type d\'activité', 
      type: 'select',
      options: [
        { value: 'Tous', label: 'Tous' },
        { value: 'Commerce', label: 'Commerce' },
        { value: 'Industrie', label: 'Industrie' },
        { value: 'Services', label: 'Services' },
        { value: 'Agriculture', label: 'Agriculture' }
      ]
    },
    { field: 'villeAdresse', label: 'Ville (Adresse principale)', type: 'text' },
    { field: 'codePostalAdresse', label: 'Code postal (Adresse principale)', type: 'text' },
    { field: 'rueAdresse', label: 'Rue (Adresse principale)', type: 'text' }
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
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-4"
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
        {Object.values(filters).some(value => value && value !== '' && value !== 'Tous' && value !== 'Toutes') && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <span className="font-medium">
                {Object.values(filters).filter(value => value && value !== '' && value !== 'Tous' && value !== 'Toutes').length}
              </span>
              {' '}filtre(s) actif(s)
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FiltersPanel;