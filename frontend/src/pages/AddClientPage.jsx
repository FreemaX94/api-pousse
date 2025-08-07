import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRightIcon,
  TagIcon,
  EyeIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  MapIcon,
  MapPinIcon,
  PlusIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

const AddClientPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Champ principal
    libellePrincipal: '',
    
    // Colonne Contact
    type: 'Client',
    civiliteContact: '',
    prenomContact: '',
    nomContact: '',
    email: '',
    telephoneFixe: '',
    telephoneMobile: '',
    
    // Colonne Entreprise
    estEntreprise: false,
    nomSociete: '',
    siteWeb: '',
    
    // Colonne Divers
    provenance: '',
    commentaire: '',
    fichiers: [],
    
    // Adresse principale
    adresse: {
      prenom: '',
      nom: '',
      rue: '',
      codePostal: '',
      ville: '',
      commentaireAdresse: '',
      longitude: '',
      latitude: '',
      rechercheAdresse: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Libellé principal obligatoire
    if (!formData.libellePrincipal.trim()) {
      newErrors.libellePrincipal = 'Le libellé principal est obligatoire';
    }

    // Validation email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Validation téléphones
    const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
    if (formData.telephoneFixe && !phoneRegex.test(formData.telephoneFixe.replace(/\s/g, ''))) {
      newErrors.telephoneFixe = 'Format de téléphone invalide';
    }
    if (formData.telephoneMobile && !phoneRegex.test(formData.telephoneMobile.replace(/\s/g, ''))) {
      newErrors.telephoneMobile = 'Format de téléphone invalide';
    }

    // Validation URL site web
    if (formData.siteWeb && !/^https?:\/\/.+/.test(formData.siteWeb)) {
      newErrors.siteWeb = 'L\'URL doit commencer par http:// ou https://';
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
      
      console.log('Données du client:', formData);
      
      // Redirection vers la liste des clients
      navigate('/app');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value, isAddressField = false) => {
    if (isAddressField) {
      setFormData(prev => ({
        ...prev,
        adresse: {
          ...prev.adresse,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      fichiers: [...prev.fichiers, ...files]
    }));
  };

  const renderField = (
    field, 
    label, 
    type = 'text', 
    placeholder = '', 
    required = false,
    options = null,
    isAddressField = false
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
        <select
          id={field}
          value={isAddressField ? formData.adresse[field] : formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value, isAddressField)}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3] ${
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
      ) : type === 'textarea' ? (
        <textarea
          id={field}
          value={isAddressField ? formData.adresse[field] : formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value, isAddressField)}
          placeholder={placeholder}
          rows={3}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3] resize-vertical ${
            errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          disabled={isSubmitting}
        />
      ) : (
        <input
          id={field}
          type={type}
          value={isAddressField ? formData.adresse[field] : formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value, isAddressField)}
          placeholder={placeholder}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3] ${
            errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          }`}
          disabled={isSubmitting}
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête de page */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Bouton Enregistrer et fil d'Ariane */}
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#2170E3] text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </motion.button>
            
            {/* Fil d'Ariane */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <button 
                onClick={() => navigate('/app')}
                className="hover:text-[#2170E3] transition-colors"
              >
                Clients
              </button>
              <ChevronRightIcon className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Ajouter un client</span>
            </nav>
          </div>

          {/* Options d'affichage */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <TagIcon className="w-5 h-5" />
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <EyeIcon className="w-4 h-4" />
              <span>Options d'affichage</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Formulaire principal */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            
            {/* Libellé principal */}
            <div className="mb-6">
              {renderField(
                'libellePrincipal',
                'Libellé principal',
                'text',
                'Ex: ACME CORP',
                true
              )}
            </div>

            {/* Trois colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Colonne Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Contact
                </h3>
                
                {renderField(
                  'type',
                  'Type',
                  'select',
                  '',
                  false,
                  [
                    { value: 'Client', label: 'Client' },
                    { value: 'Prospect', label: 'Prospect' },
                    { value: 'Fournisseur', label: 'Fournisseur' }
                  ]
                )}

                {renderField(
                  'civiliteContact',
                  'Civilité du contact',
                  'select',
                  '',
                  false,
                  [
                    { value: '', label: 'Sélectionner...' },
                    { value: 'M.', label: 'M.' },
                    { value: 'Mme', label: 'Mme' },
                    { value: 'Indéfini', label: 'Indéfini' }
                  ]
                )}

                {renderField(
                  'prenomContact',
                  'Prénom du contact',
                  'text',
                  'Ex: Jean'
                )}

                {renderField(
                  'nomContact',
                  'Nom du contact',
                  'text',
                  'Ex: Dupont'
                )}

                {renderField(
                  'email',
                  'Email',
                  'email',
                  'Ex: contact@entreprise.com'
                )}

                {renderField(
                  'telephoneFixe',
                  'Téléphone fixe',
                  'tel',
                  'Ex: 01 23 45 67 89'
                )}

                {renderField(
                  'telephoneMobile',
                  'Téléphone mobile',
                  'tel',
                  'Ex: 06 12 34 56 78'
                )}
              </div>

              {/* Colonne Entreprise */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Entreprise
                </h3>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="estEntreprise"
                    checked={formData.estEntreprise}
                    onChange={(e) => handleInputChange('estEntreprise', e.target.checked)}
                    className="w-4 h-4 text-[#2170E3] border-gray-300 rounded focus:ring-[#2170E3]"
                  />
                  <label htmlFor="estEntreprise" className="text-sm font-medium text-gray-700">
                    Il s'agit d'une entreprise
                  </label>
                </div>

                {renderField(
                  'nomSociete',
                  'Nom de la société',
                  'text',
                  'Ex: ACME Corporation'
                )}

                {renderField(
                  'siteWeb',
                  'Site web',
                  'url',
                  'Ex: https://www.entreprise.com'
                )}
              </div>

              {/* Colonne Divers */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Divers
                </h3>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Provenance
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={formData.provenance}
                      onChange={(e) => handleInputChange('provenance', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3]"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Recommandation">Recommandation</option>
                      <option value="Site web">Site web</option>
                      <option value="Publicité">Publicité</option>
                      <option value="Salon">Salon</option>
                    </select>
                    <button
                      type="button"
                      className="px-3 py-2 text-sm text-[#2170E3] border border-[#2170E3] rounded-md hover:bg-blue-50 transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="text-xs text-[#2170E3] hover:underline">
                    Ajouter une provenance
                  </button>
                </div>

                {renderField(
                  'commentaire',
                  'Commentaire',
                  'textarea',
                  'Notes ou commentaires sur ce client...'
                )}

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Fichiers
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="sr-only"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">
                        Cliquez pour ajouter des fichiers
                      </span>
                    </label>
                  </div>
                  {formData.fichiers.length > 0 && (
                    <div className="text-xs text-gray-500">
                      {formData.fichiers.length} fichier(s) sélectionné(s)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section Adresse principale */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-4 mb-6">
              Adresse principale
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Informations générales */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800 mb-4">
                  Informations générales
                </h4>
                
                {renderField(
                  'prenom',
                  'Prénom',
                  'text',
                  'Ex: Jean',
                  false,
                  null,
                  true
                )}

                {renderField(
                  'nom',
                  'Nom',
                  'text',
                  'Ex: Dupont',
                  false,
                  null,
                  true
                )}

                {renderField(
                  'rue',
                  'Rue',
                  'textarea',
                  'Ex: 123 Rue de la Paix\nBâtiment A, 3ème étage',
                  false,
                  null,
                  true
                )}

                <div className="grid grid-cols-2 gap-4">
                  {renderField(
                    'codePostal',
                    'Code postal',
                    'text',
                    'Ex: 75001',
                    false,
                    null,
                    true
                  )}

                  {renderField(
                    'ville',
                    'Ville',
                    'text',
                    'Ex: Paris',
                    false,
                    null,
                    true
                  )}
                </div>

                {renderField(
                  'commentaireAdresse',
                  'Commentaire',
                  'textarea',
                  'Informations complémentaires sur l\'adresse...',
                  false,
                  null,
                  true
                )}
              </div>

              {/* Localisation */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800 mb-4">
                  Localisation
                </h4>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Chercher une adresse
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.adresse.rechercheAdresse}
                      onChange={(e) => handleInputChange('rechercheAdresse', e.target.value, true)}
                      placeholder="Tapez l'adresse à rechercher..."
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2170E3]"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                      <MapIcon className="w-4 h-4" />
                      <span>Afficher la carte</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {renderField(
                    'longitude',
                    'Longitude',
                    'text',
                    'Ex: 2.3522',
                    false,
                    null,
                    true
                  )}

                  {renderField(
                    'latitude',
                    'Latitude',
                    'text',
                    'Ex: 48.8566',
                    false,
                    null,
                    true
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
            </div>
          </div>

          {/* Boutons de soumission sticky */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate('/app')}
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

export default AddClientPage;