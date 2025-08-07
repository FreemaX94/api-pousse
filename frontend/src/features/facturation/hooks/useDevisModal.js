import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const defaultFormData = {
  client: null,
  categories: [],
  dateCreation: new Date().toISOString().split('T')[0],
  statut: 'En cours',
  datePlanification: '',
  assigneA: '',
  lignes: [
    {
      id: 1,
      libelle: '',
      quantite: 1,
      prixUnitaire: 0,
      tva: 20,
      total: 0
    }
  ],
  commentairePrive: ''
};

export const useDevisModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('add'); // 'add' ou 'edit'
  const [devisId, setDevisId] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Ouvrir le modal en mode ajout
  const openAddModal = useCallback(() => {
    setMode('add');
    setDevisId(null);
    setFormData(defaultFormData);
    setErrors({});
    setIsOpen(true);
  }, []);

  // Ouvrir le modal en mode édition
  const openEditModal = useCallback((devis) => {
    setMode('edit');
    setDevisId(devis.id);
    setFormData({
      client: devis.client,
      categories: devis.categories || [],
      dateCreation: devis.dateCreation,
      statut: devis.statut,
      datePlanification: devis.datePlanification || '',
      assigneA: devis.assigneA || '',
      lignes: devis.lignes || [{
        id: 1,
        libelle: '',
        quantite: 1,
        prixUnitaire: 0,
        tva: 20,
        total: 0
      }],
      commentairePrive: devis.commentairePrive || ''
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
      setDevisId(null);
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

  // Ajouter une ligne au devis
  const addLigne = useCallback(() => {
    const newLigne = {
      id: Date.now(),
      libelle: '',
      quantite: 1,
      prixUnitaire: 0,
      tva: 20,
      total: 0
    };
    setFormData(prev => ({
      ...prev,
      lignes: [...prev.lignes, newLigne]
    }));
  }, []);

  // Supprimer une ligne du devis
  const removeLigne = useCallback((ligneId) => {
    setFormData(prev => ({
      ...prev,
      lignes: prev.lignes.filter(l => l.id !== ligneId)
    }));
  }, []);

  // Mettre à jour une ligne du devis
  const updateLigne = useCallback((ligneId, field, value) => {
    setFormData(prev => {
      const newLignes = prev.lignes.map(ligne => {
        if (ligne.id === ligneId) {
          const updatedLigne = { ...ligne, [field]: value };
          
          // Calculer automatiquement le total
          if (field === 'quantite' || field === 'prixUnitaire' || field === 'tva') {
            const quantite = field === 'quantite' ? value : updatedLigne.quantite;
            const prixUnitaire = field === 'prixUnitaire' ? value : updatedLigne.prixUnitaire;
            const tva = field === 'tva' ? value : updatedLigne.tva;
            
            const totalHT = quantite * prixUnitaire;
            const totalTTC = totalHT * (1 + tva / 100);
            updatedLigne.total = Math.round(totalTTC * 100) / 100;
          }
          
          return updatedLigne;
        }
        return ligne;
      });
      
      return {
        ...prev,
        lignes: newLignes
      };
    });
  }, []);

  // Calculer le montant total du devis
  const calculateTotal = useCallback(() => {
    const totalHT = formData.lignes.reduce((sum, ligne) => {
      return sum + (ligne.quantite * ligne.prixUnitaire);
    }, 0);
    
    const totalTTC = formData.lignes.reduce((sum, ligne) => {
      const ligneHT = ligne.quantite * ligne.prixUnitaire;
      const ligneTTC = ligneHT * (1 + ligne.tva / 100);
      return sum + ligneTTC;
    }, 0);
    
    return {
      totalHT: Math.round(totalHT * 100) / 100,
      totalTTC: Math.round(totalTTC * 100) / 100
    };
  }, [formData.lignes]);

  // Valider le formulaire
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validation du client
    if (!formData.client) {
      newErrors.client = 'Le client est requis';
    }

    // Validation des catégories
    if (!formData.categories || formData.categories.length === 0) {
      newErrors.categories = 'Au moins une catégorie est requise';
    }

    // Validation de la date de création
    if (!formData.dateCreation) {
      newErrors.dateCreation = 'La date de création est requise';
    }

    // Validation des lignes
    const hasValidLignes = formData.lignes.some(ligne => 
      ligne.libelle && ligne.quantite > 0 && ligne.prixUnitaire > 0
    );
    if (!hasValidLignes) {
      newErrors.lignes = 'Au moins une ligne valide est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Enregistrer le devis
  const saveDevis = useCallback(async (onSuccess) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const totals = calculateTotal();
      const devisData = {
        ...formData,
        montantHT: totals.totalHT,
        montantTTC: totals.totalTTC
      };
      
      // En production, ce serait :
      // const response = await fetch(
      //   mode === 'add' 
      //     ? '/api/devis'
      //     : `/api/devis/${devisId}`,
      //   {
      //     method: mode === 'add' ? 'POST' : 'PUT',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(devisData)
      //   }
      // );
      // 
      // if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');

      toast.success(
        mode === 'add' 
          ? 'Devis créé avec succès'
          : 'Devis modifié avec succès'
      );
      
      closeModal();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [mode, devisId, formData, validateForm, calculateTotal, closeModal]);

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
    addLigne,
    removeLigne,
    updateLigne,
    calculateTotal,
    saveDevis
  };
};