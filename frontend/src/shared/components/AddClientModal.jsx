import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  XMarkIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AddClientModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nomSociete: '',
    libellePrincipal: '',
    type: 'Client',
    civiliteContact: 'M.',
    provenance: 'Indéfini',
    adresseLigne1: '',
    adresseLigne2: '',
    codePostal: '',
    ville: '',
    pays: 'France',
    telephone: '',
    email: '',
    nomContact: '',
    resteAPayer: '',
    indiceConfiance: 'Confiance'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Champs obligatoires
    if (!formData.nomSociete.trim()) {
      newErrors.nomSociete = 'Le nom de la société est obligatoire';
    }

    if (!formData.libellePrincipal.trim()) {
      newErrors.libellePrincipal = 'Le libellé principal est obligatoire';
    }

    if (!formData.type.trim()) {
      newErrors.type = 'Le type de client est obligatoire';
    }

    // Validation email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Validation téléphone (format français basique)
    if (formData.telephone && !/^(\+33|0)[1-9](\d{8})$/.test(formData.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = 'Format de téléphone invalide';
    }

    // Validation code postal
    if (formData.codePostal && !/^\d{5}$/.test(formData.codePostal)) {
      newErrors.codePostal = 'Le code postal doit contenir 5 chiffres';
    }

    // Validation reste à payer
    if (formData.resteAPayer && isNaN(parseFloat(formData.resteAPayer))) {
      newErrors.resteAPayer = 'Le montant doit être un nombre valide';
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
      
      // Préparer les données pour la sauvegarde
      const clientData = {
        ...formData,
        resteAPayer: formData.resteAPayer ? parseFloat(formData.resteAPayer) : 0,
        dateCreation: new Date().toISOString()
      };
      
      onSave(clientData);
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
    
    // Effacer l'erreur pour ce champ quand l'utilisateur tape
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const renderField = (
    field, 
    label, 
    type = 'text', 
    placeholder = '', 
    required = false, 
    helpText = '',
    options = []
  ) => (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <label 
          htmlFor={field}
          className={`block text-sm font-medium ${
            required ? 'text-gray-900' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {helpText && (
          <div className="relative group">
            <QuestionMarkCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {helpText}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
            </div>
          </div>
        )}
      </div>
      
      {type === 'select' ? (
        <select
          id={field}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors[field] 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 bg-white'
          }`}
          disabled={isSubmitting}
        >
          {options.length > 0 ? (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            <>
              <option value="Confiance">Confiance</option>
              <option value="Vigilance">Vigilance</option>
            </>
          )}
        </select>
      ) : (
        <input
          id={field}
          type={type}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors[field] 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 bg-white'
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* En-tête */}
          <div className="bg-[#2170E3] text-white px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Ajouter un nouveau client</h3>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-1 hover:bg-blue-600 rounded transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Contenu du formulaire */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="px-6 py-6 space-y-6">
              
              {/* Section informations principales */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Informations principales
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    'nomSociete',
                    'Nom de la société',
                    'text',
                    'Ex: ACME Corporation',
                    true,
                    'Nom officiel de l\'entreprise cliente'
                  )}
                  
                  {renderField(
                    'libellePrincipal',
                    'Libellé principal',
                    'text',
                    'Ex: ACME CORP',
                    true,
                    'Nom court pour identifier rapidement le client'
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderField(
                    'type',
                    'Type',
                    'select',
                    '',
                    true,
                    'Nature de la relation commerciale',
                    [
                      { value: 'Client', label: 'Client' },
                      { value: 'Prospect', label: 'Prospect' },
                      { value: 'Partenaire', label: 'Partenaire' }
                    ]
                  )}

                  {renderField(
                    'civiliteContact',
                    'Civilité du contact',
                    'select',
                    '',
                    false,
                    'Civilité de la personne de contact',
                    [
                      { value: 'M.', label: 'M.' },
                      { value: 'Mme', label: 'Mme' },
                      { value: 'Mlle', label: 'Mlle' },
                      { value: 'Dr.', label: 'Dr.' },
                      { value: 'Prof.', label: 'Prof.' }
                    ]
                  )}

                  {renderField(
                    'provenance',
                    'Provenance',
                    'select',
                    '',
                    false,
                    'Comment avez-vous connu ce client ?',
                    [
                      { value: 'Indéfini', label: 'Indéfini' },
                      { value: 'Accès SAP', label: 'Accès SAP' },
                      { value: 'Autre', label: 'Autre' },
                      { value: 'Bouche-à-oreille', label: 'Bouche-à-oreille' },
                      { value: 'Client', label: 'Client' },
                      { value: 'Elisa', label: 'Elisa' },
                      { value: 'Email', label: 'Email' },
                      { value: 'Google', label: 'Google' },
                      { value: 'Makko', label: 'Makko' },
                      { value: 'Packplant', label: 'Packplant' },
                      { value: 'Réseau', label: 'Réseau' },
                      { value: 'Recherche Google', label: 'Recherche Google' },
                      { value: 'Salon', label: 'Salon' },
                      { value: 'Téléphone', label: 'Téléphone' }
                    ]
                  )}
                </div>
              </div>

              {/* Section adresse */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Adresse principale
                </h4>
                
                <div className="space-y-4">
                  {renderField(
                    'adresseLigne1',
                    'Adresse (ligne 1)',
                    'text',
                    'Ex: 123 Rue de la Paix'
                  )}
                  
                  {renderField(
                    'adresseLigne2',
                    'Adresse (ligne 2)',
                    'text',
                    'Ex: Bâtiment A, 3ème étage'
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    
                    {renderField(
                      'pays',
                      'Pays',
                      'text',
                      'Ex: France'
                    )}
                  </div>
                </div>
              </div>

              {/* Section contact */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Informations de contact
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    'telephone',
                    'Téléphone',
                    'tel',
                    'Ex: 01 23 45 67 89',
                    false,
                    'Numéro de téléphone principal'
                  )}
                  
                  {renderField(
                    'email',
                    'Email',
                    'email',
                    'Ex: contact@acme.com',
                    false,
                    'Adresse email principale'
                  )}
                </div>
                
                {renderField(
                  'nomContact',
                  'Nom du contact principal',
                  'text',
                  'Ex: Jean Dupont',
                  false,
                  'Personne de référence chez le client'
                )}
              </div>

              {/* Section financière */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Informations financières
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField(
                    'resteAPayer',
                    'Reste à payer initial',
                    'number',
                    'Ex: 1250.00',
                    false,
                    'Montant initial dû par le client (en euros)'
                  )}
                  
                  {renderField(
                    'indiceConfiance',
                    'Indice de confiance',
                    'select',
                    '',
                    false,
                    'Niveau de confiance accordé au client'
                  )}
                </div>
              </div>

            </div>

            {/* Pied de modal avec boutons */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Annuler
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-[#2170E3] border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddClientModal;