import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  MapIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const AddAddressPage = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('donnees');
  const [formData, setFormData] = useState({
    client: '',
    email: '',
    prenom: '',
    nom: '',
    adresse: '',
    codePostal: '',
    ville: '',
    rechercheAdresse: '',
    longitude: '',
    latitude: '',
    commentaire: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Données d'exemple pour le dropdown client
  const clients = [
    { value: '', label: 'Sélectionner un client...' },
    { value: 'deodis', label: 'DEODIS' },
    { value: 'papot-bates', label: 'PAPOT-BATES' },
    { value: 'no-place-like-work', label: 'NO PLACE LIKE WORK REPUBLIQUE' },
    { value: 'initiale', label: 'INITIALE' },
    { value: 'nouveaux-bureaux', label: 'LES NOUVEAUX BUREAUX' }
  ];

  const validateForm = () => {
    const newErrors = {};

    // Client obligatoire
    if (!formData.client.trim()) {
      newErrors.client = 'Le client est obligatoire';
    }

    // Validation email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Validation code postal
    if (formData.codePostal && !/^\d{5}$/.test(formData.codePostal)) {
      newErrors.codePostal = 'Le code postal doit contenir 5 chiffres';
    }

    // Validation longitude/latitude
    if (formData.longitude && (isNaN(parseFloat(formData.longitude)) || Math.abs(parseFloat(formData.longitude)) > 180)) {
      newErrors.longitude = 'Longitude invalide (-180 à 180)';
    }
    if (formData.latitude && (isNaN(parseFloat(formData.latitude)) || Math.abs(parseFloat(formData.latitude)) > 90)) {
      newErrors.latitude = 'Latitude invalide (-90 à 90)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Données de l\'adresse:', formData);
      
      // Redirection vers la liste des adresses
      navigate('/app', { state: { activeTab: 'Adresses' } });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSearchAddress = () => {
    // Simuler une recherche d'adresse
    if (formData.rechercheAdresse) {
      // En réalité, ici on ferait un appel à une API de géocodage
      console.log('Recherche d\'adresse:', formData.rechercheAdresse);
      
      // Simulation de coordonnées pour Paris
      handleInputChange('longitude', '2.3522');
      handleInputChange('latitude', '48.8566');
    }
  };

  const renderField = (
    field, 
    label, 
    type = 'text', 
    placeholder = '', 
    required = false,
    options = null,
    rows = null
  ) => (
    <div className="space-y-1">
      <label 
        htmlFor={field}
        className={`block text-sm font-medium ${
          required ? 'text-gray-900' : 'text-gray-700'
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'select' ? (
        <div className="flex space-x-2">
          <select
            id={field}
            value={formData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={`flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3] ${
              errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
            }`}
            disabled={isSubmitting}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {field === 'client' && (
            <button
              type="button"
              className="px-3 py-2 bg-[#2170E3] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3] transition-colors"
              title="Ajouter un nouveau client"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : type === 'textarea' ? (
        <textarea
          id={field}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          rows={rows || 3}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3] resize-vertical ${
            errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          disabled={isSubmitting}
        />
      ) : (
        <input
          id={field}
          type={type}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3] ${
            errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          disabled={isSubmitting}
          step={type === 'number' ? '0.000001' : undefined}
        />
      )}
      
      {errors[field] && (
        <div className="flex items-center space-x-1 text-red-600 text-xs">
          <ExclamationTriangleIcon className="w-4 h-4" />
          <span>{errors[field]}</span>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'donnees', label: 'Données', active: true },
    { id: 'autres', label: 'Autres informations', active: false },
    { id: 'fichiers', label: 'Fichiers', active: false }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'donnees':
        return (
          <div className="space-y-6">
            {/* Client obligatoire */}
            <div>
              {renderField(
                'client',
                'Client',
                'select',
                '',
                true,
                clients
              )}
            </div>

            {/* Email */}
            <div>
              {renderField(
                'email',
                'Email',
                'email',
                'Ex: contact@entreprise.com'
              )}
            </div>

            {/* Prénom et Nom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField(
                'prenom',
                'Prénom',
                'text',
                'Ex: Jean'
              )}
              {renderField(
                'nom',
                'Nom',
                'text',
                'Ex: Dupont'
              )}
            </div>

            {/* Adresse */}
            <div>
              {renderField(
                'adresse',
                'Adresse',
                'textarea',
                'Ex: 123 Rue de la Paix\nBâtiment A, 3ème étage',
                false,
                null,
                3
              )}
            </div>

            {/* Code postal et Ville */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField(
                'codePostal',
                'Code postal',
                'text',
                'Ex: 75001'
              )}
              {renderField(
                'ville',
                'Ville',
                'text',
                'Ex: Paris'
              )}
            </div>

            {/* Section Géolocalisation */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Géolocalisation
              </h3>
              
              {/* Recherche d'adresse */}
              <div className="space-y-1 mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Chercher une adresse
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.rechercheAdresse}
                    onChange={(e) => handleInputChange('rechercheAdresse', e.target.value)}
                    placeholder="Tapez l'adresse à rechercher..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3]"
                  />
                  <button
                    type="button"
                    onClick={handleSearchAddress}
                    className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-2"
                  >
                    <MapIcon className="w-4 h-4" />
                    <span>Afficher la carte</span>
                  </button>
                </div>
              </div>

              {/* Longitude et Latitude */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {renderField(
                  'longitude',
                  'Longitude',
                  'number',
                  'Ex: 2.3522'
                )}
                {renderField(
                  'latitude',
                  'Latitude',
                  'number',
                  'Ex: 48.8566'
                )}
              </div>

              <button
                type="button"
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <MapPinIcon className="w-4 h-4" />
                <span>Placer sur la carte</span>
              </button>
            </div>

            {/* Commentaire */}
            <div>
              {renderField(
                'commentaire',
                'Commentaire',
                'textarea',
                'Notes ou commentaires sur cette adresse...',
                false,
                null,
                4
              )}
            </div>
          </div>
        );
      
      case 'autres':
        return (
          <div className="text-center py-12 text-gray-500">
            <h3 className="text-lg font-medium mb-2">Autres informations</h3>
            <p>Cette section sera disponible prochainement</p>
          </div>
        );
      
      case 'fichiers':
        return (
          <div className="text-center py-12 text-gray-500">
            <h3 className="text-lg font-medium mb-2">Fichiers</h3>
            <p>Cette section sera disponible prochainement</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête de page */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Boutons d'action gauche */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={true}
              className="px-6 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed opacity-60"
            >
              <PlusIcon className="w-4 h-4 mr-2 inline" />
              Ajouter une adresse
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <FunnelIcon className="w-4 h-4 mr-2 inline" />
              Filtres
            </motion.button>
          </div>

          {/* Bouton options d'affichage */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
            <span>Options d'affichage</span>
          </motion.button>
        </div>

        {/* Fil d'Ariane */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-3">
          <button 
            onClick={() => navigate('/app', { state: { activeTab: 'Adresses' } })}
            className="hover:text-[#2170E3] transition-colors"
          >
            Adresses
          </button>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Ajouter une adresse</span>
        </nav>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Onglets de contenu */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.active && setActiveTab(tab.id)}
                disabled={!tab.active}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id && tab.active
                    ? 'border-[#2170E3] text-[#2170E3]'
                    : tab.active
                    ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    : 'border-transparent text-gray-300 cursor-not-allowed'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            {renderTabContent()}
          </div>

          {/* Boutons de soumission sticky */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate('/app', { state: { activeTab: 'Adresses' } })}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3] transition-colors"
            >
              Annuler
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#2170E3] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressPage;