import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const defaultFormData = {
  nom: '',
  couleur: '#3B82F6',
  tauxHoraire: 35,
  dureeStandard: '02:00',
  commentaire: ''
};

export const useInterventionCategoryModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('add'); // 'add' ou 'edit'
  const [categoryId, setCategoryId] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Ouvrir le modal en mode ajout
  const openAddModal = useCallback(() => {
    setMode('add');
    setCategoryId(null);
    setFormData(defaultFormData);
    setErrors({});
    setIsOpen(true);
  }, []);

  // Ouvrir le modal en mode édition
  const openEditModal = useCallback((category) => {
    setMode('edit');
    setCategoryId(category.id);
    setFormData({
      nom: category.nom || '',
      couleur: category.couleur || '#3B82F6',
      tauxHoraire: category.tauxHoraire || 35,
      dureeStandard: category.dureeStandard || '02:00',
      commentaire: category.commentaire || ''
    });
    setErrors({});
    setIsOpen(true);
  }, []);

  // Fermer le modal
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setFormData(defaultFormData);
      setErrors({});
      setCategoryId(null);
    }, 300);
  }, []);

  // Mettre à jour les données du formulaire
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Valider le formulaire
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validation du nom
    if (!formData.nom || formData.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation du taux horaire
    if (formData.tauxHoraire < 0) {
      newErrors.tauxHoraire = 'Le taux horaire doit être positif';
    }

    // Validation de la durée standard
    const [hours, minutes] = formData.dureeStandard.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes < 15) {
      newErrors.dureeStandard = 'La durée doit être d\'au moins 15 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Enregistrer la catégorie
  const saveCategory = useCallback(async (onSuccess) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En production, ce serait :
      // const response = await fetch(
      //   mode === 'add' 
      //     ? '/api/intervention-categories'
      //     : `/api/intervention-categories/${categoryId}`,
      //   {
      //     method: mode === 'add' ? 'POST' : 'PUT',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(formData)
      //   }
      // );
      // 
      // if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');

      toast.success(
        mode === 'add' 
          ? 'Catégorie créée avec succès'
          : 'Catégorie modifiée avec succès'
      );
      
      closeModal();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [mode, categoryId, formData, validateForm, closeModal]);

  return {
    isOpen,
    mode,
    formData,
    loading,
    errors,
    openAddModal,
    openEditModal,
    closeModal,
    updateFormData,
    saveCategory
  };
};