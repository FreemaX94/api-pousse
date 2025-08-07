import React from 'react';
import InterventionCategoryModal from './InterventionCategoryModal';

export default {
  title: 'Interventions/InterventionCategoryModal',
  component: InterventionCategoryModal,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    mode: {
      control: { type: 'radio' },
      options: ['add', 'edit']
    },
    isOpen: {
      control: 'boolean'
    }
  }
};

// Template de base
const Template = (args) => {
  const [formData, setFormData] = React.useState(args.formData);
  
  const handleUpdateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div style={{ minHeight: '600px' }}>
      <InterventionCategoryModal
        {...args}
        formData={formData}
        onUpdateField={handleUpdateField}
        onSave={() => console.log('Save:', formData)}
        onClose={() => console.log('Close')}
      />
    </div>
  );
};

// Story : Mode ajout
export const AddMode = Template.bind({});
AddMode.args = {
  isOpen: true,
  mode: 'add',
  formData: {
    nom: '',
    couleur: '#3B82F6',
    tauxHoraire: 35,
    dureeStandard: '02:00',
    commentaire: ''
  },
  errors: {},
  loading: false
};

// Story : Mode édition
export const EditMode = Template.bind({});
EditMode.args = {
  isOpen: true,
  mode: 'edit',
  formData: {
    nom: 'Entretien régulier',
    couleur: '#10B981',
    tauxHoraire: 35.50,
    dureeStandard: '02:30',
    commentaire: 'Entretien standard des espaces verts incluant arrosage et nettoyage'
  },
  errors: {},
  loading: false
};

// Story : Avec erreurs de validation
export const WithErrors = Template.bind({});
WithErrors.args = {
  isOpen: true,
  mode: 'add',
  formData: {
    nom: 'E',
    couleur: '#EF4444',
    tauxHoraire: -10,
    dureeStandard: '00:10',
    commentaire: ''
  },
  errors: {
    nom: 'Le nom doit contenir au moins 2 caractères',
    tauxHoraire: 'Le taux horaire doit être positif',
    dureeStandard: 'La durée doit être d\'au moins 15 minutes'
  },
  loading: false
};

// Story : État de chargement
export const Loading = Template.bind({});
Loading.args = {
  isOpen: true,
  mode: 'add',
  formData: {
    nom: 'Nouvelle catégorie',
    couleur: '#8B5CF6',
    tauxHoraire: 40,
    dureeStandard: '01:30',
    commentaire: 'Test de sauvegarde'
  },
  errors: {},
  loading: true
};

// Story : Modal fermé
export const Closed = Template.bind({});
Closed.args = {
  isOpen: false,
  mode: 'add',
  formData: {
    nom: '',
    couleur: '#3B82F6',
    tauxHoraire: 35,
    dureeStandard: '02:00',
    commentaire: ''
  },
  errors: {},
  loading: false
};