import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  PlusIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  DocumentArrowUpIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { usePlanningFilters } from '../context/PlanningFiltersContext';
import { useAuth } from '../../../contexts/AuthContext';

interface AjouterInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  selectedTime?: string;
}

interface InterventionForm {
  // Informations générales
  client: string;
  contact: string;
  titre: string;
  collaborateur: string;
  categorieIntervention: string;
  chantier: string;
  contrat: string;
  affaire: string;
  rapportPersonnalise: string;

  // Intervention planifiée
  planifiee: {
    priorite: string;
    dateDebut: string;
    heureDebut: string;
    dateFin: string;
    heureFin: string;
    dureeTravail: string;
    nonTravaille: string;
    budgetEstime: string;
    commentaire: string;
    actionsCourantes: string[];
  };

  // Intervention effectuée
  effectuee: {
    effectue: boolean;
    dateDebut: string;
    heureDebut: string;
    dateFin: string;
    heureFin: string;
    dureeTravail: string;
    nonTravaille: string;
    budget: string;
    commentaire: string;
    actionsCourantes: string[];
  };
}

const AjouterInterventionModal: React.FC<AjouterInterventionModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedDate,
  selectedTime 
}) => {
  const { collaborators } = usePlanningFilters();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<InterventionForm>({
    // Informations générales
    client: '',
    contact: '',
    titre: '',
    collaborateur: user?.collaboratorId || '',
    categorieIntervention: 'entretien',
    chantier: '',
    contrat: '',
    affaire: '',
    rapportPersonnalise: 'generique',

    // Intervention planifiée
    planifiee: {
      priorite: 'normal',
      dateDebut: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      heureDebut: selectedTime || '09:00',
      dateFin: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      heureFin: '17:00',
      dureeTravail: '08:00',
      nonTravaille: '00:00',
      budgetEstime: '',
      commentaire: '',
      actionsCourantes: []
    },

    // Intervention effectuée
    effectuee: {
      effectue: false,
      dateDebut: '',
      heureDebut: '09:00',
      dateFin: '',
      heureFin: '17:00',
      dureeTravail: '08:00',
      nonTravaille: '00:00',
      budget: '',
      commentaire: '',
      actionsCourantes: []
    }
  });

  // Options pour les selects
  const clientOptions = [
    { value: 'bnp', label: 'BNP PARIBAS' },
    { value: 'sg', label: 'SOCIETE GENERALE' },
    { value: 'cm', label: 'CREDIT MUTUEL' },
    { value: 'total', label: 'TOTAL ENERGIES' },
    { value: 'orange', label: 'ORANGE' },
    { value: 'microsoft', label: 'MICROSOFT FRANCE' }
  ];

  const contactOptions = [
    { value: 'contact1', label: 'Jean Dupont - BNP PARIBAS' },
    { value: 'contact2', label: 'Marie Martin - SOCIETE GENERALE' },
    { value: 'contact3', label: 'Pierre Leroy - CREDIT MUTUEL' }
  ];

  const categoriesIntervention = [
    { value: 'abonnement', label: 'Abonnement' },
    { value: 'creation', label: 'Création' },
    { value: 'entretien', label: 'Entretien' },
    { value: 'location', label: 'Location' },
    { value: 'packplant', label: 'PackPlant' },
    { value: 'plant_sitting', label: 'Plant sitting' },
    { value: 'rdv_reperage', label: 'RDV de repérage' }
  ];

  const prioriteOptions = [
    { value: 'faible', label: 'Faible' },
    { value: 'normal', label: 'Normal' },
    { value: 'haut', label: 'Haut' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'immediat', label: 'Immédiat' }
  ];

  const rapportOptions = [
    { value: 'generique', label: 'Modèle générique...' },
    { value: 'entretien', label: 'Rapport d\'entretien' },
    { value: 'installation', label: 'Rapport d\'installation' }
  ];

  // Groupement des collaborateurs
  const bureauCollaborators = collaborators.filter(c => c.group === 'bureau');
  const terrainCollaborators = collaborators.filter(c => c.group === 'terrain');

  // Réinitialiser le formulaire à l'ouverture
  useEffect(() => {
    if (isOpen) {
      const defaultDate = selectedDate ? 
        selectedDate.toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0];
      
      const defaultStartTime = selectedTime || '09:00';
      
      setFormData({
        client: '',
        contact: '',
        titre: '',
        collaborateur: user?.collaboratorId || '',
        categorieIntervention: 'entretien',
        chantier: '',
        contrat: '',
        affaire: '',
        rapportPersonnalise: 'generique',
        planifiee: {
          priorite: 'normal',
          dateDebut: defaultDate,
          heureDebut: defaultStartTime,
          dateFin: defaultDate,
          heureFin: '17:00',
          dureeTravail: '08:00',
          nonTravaille: '00:00',
          budgetEstime: '',
          commentaire: '',
          actionsCourantes: []
        },
        effectuee: {
          effectue: false,
          dateDebut: '',
          heureDebut: '09:00',
          dateFin: '',
          heureFin: '17:00',
          dureeTravail: '08:00',
          nonTravaille: '00:00',
          budget: '',
          commentaire: '',
          actionsCourantes: []
        }
      });
      setErrors({});
    }
  }, [isOpen, selectedDate, selectedTime, user?.collaboratorId]);

  // Fonction pour gérer les changements dans les champs principaux
  const handleInputChange = (field: keyof InterventionForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Fonction pour gérer les changements dans les sous-sections
  const handleNestedInputChange = (section: 'planifiee' | 'effectuee', field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Fonction pour calculer la durée de travail
  const calculateDuration = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return '00:00';
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (end <= start) return '00:00';
    
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Recalcul automatique de la durée quand les heures changent
  const handleTimeChange = (section: 'planifiee' | 'effectuee', field: 'heureDebut' | 'heureFin', value: string) => {
    const newData = {
      ...formData[section],
      [field]: value
    };
    
    // Recalculer la durée si on a les deux heures
    if (newData.heureDebut && newData.heureFin) {
      newData.dureeTravail = calculateDuration(newData.heureDebut, newData.heureFin);
    }
    
    setFormData(prev => ({
      ...prev,
      [section]: newData
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est obligatoire';
    }

    if (!formData.client.trim()) {
      newErrors.client = 'Le client est obligatoire';
    }

    if (!formData.collaborateur) {
      newErrors.collaborateur = 'Le collaborateur est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Nouvelle intervention créée:', formData);
      
      // Fermer le modal après succès
      onClose();
      
      // TODO: Rafraîchir les données du planning
      // TODO: Afficher un message de succès
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'intervention:', error);
      // TODO: Afficher un message d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  // Composant Select avec recherche et bouton +
  const SearchableSelect: React.FC<{
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    onAdd?: () => void;
    placeholder?: string;
    error?: string;
  }> = ({ label, value, options, onChange, onAdd, placeholder, error }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">{placeholder || `Sélectionner ${label.toLowerCase()}...`}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <PlusIcon className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );

  // Composant Select groupé pour collaborateurs
  const CollaboratorSelect: React.FC = () => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">Collaborateur *</label>
      <select
        value={formData.collaborateur}
        onChange={(e) => handleInputChange('collaborateur', e.target.value)}
        className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.collaborateur ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Sélectionner un collaborateur...</option>
        <optgroup label="Bureau">
          {bureauCollaborators.map(collaborator => (
            <option key={collaborator.id} value={collaborator.id}>
              {collaborator.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="Terrain">
          {terrainCollaborators.map(collaborator => (
            <option key={collaborator.id} value={collaborator.id}>
              {collaborator.name}
            </option>
          ))}
        </optgroup>
      </select>
      {errors.collaborateur && <p className="text-sm text-red-600">{errors.collaborateur}</p>}
    </div>
  );

  // Composant pour les sections Planifiée/Effectuée
  const InterventionSection: React.FC<{
    title: string;
    data: typeof formData.planifiee | typeof formData.effectuee;
    section: 'planifiee' | 'effectuee';
  }> = ({ title, data, section }) => (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
        {title}
      </h4>
      
      {/* Actions courantes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Actions courantes</label>
        <button
          type="button"
          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="text-sm">Ajouter une action</span>
        </button>
      </div>

      {/* Commentaire */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Commentaire</label>
        <textarea
          value={data.commentaire}
          onChange={(e) => handleNestedInputChange(section, 'commentaire', e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Commentaire sur l'intervention..."
        />
      </div>

      {/* Champs spécifiques selon la section */}
      {section === 'planifiee' && (
        <>
          {/* Priorité */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Priorité</label>
            <select
              value={data.priorite}
              onChange={(e) => handleNestedInputChange(section, 'priorite', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {prioriteOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Création multiple */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Création multiple</label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Aucune</span>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Modifier
              </button>
            </div>
          </div>
        </>
      )}

      {section === 'effectuee' && (
        <div className="space-y-1">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={data.effectue}
              onChange={(e) => handleNestedInputChange(section, 'effectue', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Effectué ?</span>
          </label>
        </div>
      )}

      {/* Dates et heures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Début</label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={data.dateDebut}
              onChange={(e) => handleNestedInputChange(section, 'dateDebut', e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={data.heureDebut}
              onChange={(e) => handleTimeChange(section, 'heureDebut', e.target.value)}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Fin</label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={data.dateFin}
              onChange={(e) => handleNestedInputChange(section, 'dateFin', e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={data.heureFin}
              onChange={(e) => handleTimeChange(section, 'heureFin', e.target.value)}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Durée et budget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Durée de travail</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={data.dureeTravail}
              readOnly
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50"
            />
            <button
              type="button"
              onClick={() => {
                if (data.heureDebut && data.heureFin) {
                  const newDuration = calculateDuration(data.heureDebut, data.heureFin);
                  handleNestedInputChange(section, 'dureeTravail', newDuration);
                }
              }}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Recalculer"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Non travaillé</label>
          <input
            type="text"
            value={data.nonTravaille}
            onChange={(e) => handleNestedInputChange(section, 'nonTravaille', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="00:00"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Budget {section === 'planifiee' ? '(estimé)' : ''}
          </label>
          <input
            type="text"
            value={section === 'planifiee' ? data.budgetEstime : (data as any).budget}
            onChange={(e) => handleNestedInputChange(
              section, 
              section === 'planifiee' ? 'budgetEstime' : 'budget', 
              e.target.value
            )}
            disabled={section === 'planifiee'}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            placeholder="0 €"
          />
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[9998]"
              onClick={onClose}
            />

            {/* Modal - Plus large */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Ajouter une intervention
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="px-6 py-6">
                <div className="space-y-8">
                  {/* Informations générales - Grid 3 colonnes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SearchableSelect
                      label="Client *"
                      value={formData.client}
                      options={clientOptions}
                      onChange={(value) => handleInputChange('client', value)}
                      onAdd={() => console.log('Ajouter client')}
                      error={errors.client}
                    />

                    <SearchableSelect
                      label="Contact"
                      value={formData.contact}
                      options={contactOptions}
                      onChange={(value) => handleInputChange('contact', value)}
                      onAdd={() => console.log('Ajouter contact')}
                    />

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Titre *</label>
                      <input
                        type="text"
                        value={formData.titre}
                        onChange={(e) => handleInputChange('titre', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.titre ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: Entretien jardins BNP"
                      />
                      {errors.titre && <p className="text-sm text-red-600">{errors.titre}</p>}
                    </div>
                  </div>

                  {/* Deuxième ligne d'informations */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <CollaboratorSelect />

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Catégorie d'intervention</label>
                      <div className="flex space-x-2">
                        <select
                          value={formData.categorieIntervention}
                          onChange={(e) => handleInputChange('categorieIntervention', e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {categoriesIntervention.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Ajouter une catégorie d'intervention
                      </button>
                    </div>

                    <SearchableSelect
                      label="Chantier"
                      value={formData.chantier}
                      options={[]}
                      onChange={(value) => handleInputChange('chantier', value)}
                      onAdd={() => console.log('Ajouter chantier')}
                      placeholder="Sélectionner un chantier..."
                    />

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Contrat</label>
                      <select
                        value={formData.contrat}
                        onChange={(e) => handleInputChange('contrat', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner un contrat...</option>
                      </select>
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Ajouter un contrat
                      </button>
                    </div>
                  </div>

                  {/* Troisième ligne */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <SearchableSelect
                      label="Affaire"
                      value={formData.affaire}
                      options={[]}
                      onChange={(value) => handleInputChange('affaire', value)}
                      onAdd={() => console.log('Ajouter affaire')}
                      placeholder="Sélectionner une affaire..."
                    />

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Demandes client</label>
                      <button
                        type="button"
                        className="flex items-center space-x-2 w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span className="text-sm">Ajouter</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Équipements</label>
                      <button
                        type="button"
                        className="flex items-center space-x-2 w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span className="text-sm">Ajouter</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Rapport personnalisé</label>
                      <select
                        value={formData.rapportPersonnalise}
                        onChange={(e) => handleInputChange('rapportPersonnalise', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {rapportOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Section Planifiée vs Effectuée */}
                  <div className="border-t border-gray-200 pt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <InterventionSection
                        title="Intervention planifiée"
                        data={formData.planifiee}
                        section="planifiee"
                      />
                      <InterventionSection
                        title="Intervention effectuée"
                        data={formData.effectuee}
                        section="effectuee"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer avec upload et boutons */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <DocumentArrowUpIcon className="w-5 h-5" />
                        <span>Ajouter un fichier</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Annuler
                      </button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-[#2170E3] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Enregistrement...</span>
                          </>
                        ) : (
                          <span>Enregistrer</span>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AjouterInterventionModal;