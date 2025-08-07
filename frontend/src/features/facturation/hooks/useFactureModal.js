import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const defaultFormData = {
  client: null,
  contrat: '',
  categories: [],
  rapportPersonnalise: 'Facture',
  dateFacture: new Date().toISOString().split('T')[0],
  dateEcheance: '',
  reference: '',
  commentairePublic: '',
  lignes: [
    {
      id: 1,
      description: '',
      quantite: 1,
      unite: 'h',
      prixUnitaire: 0,
      tva: 20,
      reduction: 0,
      totalTTC: 0
    }
  ],
  fraisTraitement: 0,
  financementExterne: '',
  commentairePrive: '',
  liaisonFacture: '',
  fichiers: [],
  afficherReduction: false
};

export const useFactureModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('add'); // 'add' ou 'edit'
  const [factureId, setFactureId] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Ouvrir le modal en mode ajout
  const openAddModal = useCallback(() => {
    setMode('add');
    setFactureId(null);
    setFormData({
      ...defaultFormData,
      dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 jours
      reference: `F${new Date().getFullYear()}${String(Date.now()).slice(-6)}`
    });
    setErrors({});
    setIsOpen(true);
  }, []);

  // Ouvrir le modal en mode édition
  const openEditModal = useCallback((facture) => {
    setMode('edit');
    setFactureId(facture.id);
    setFormData({
      client: facture.client,
      contrat: facture.contrat || '',
      categories: facture.categories || [],
      rapportPersonnalise: facture.rapportPersonnalise || 'Facture',
      dateFacture: facture.dateFacture,
      dateEcheance: facture.dateEcheance,
      reference: facture.reference,
      commentairePublic: facture.commentairePublic || '',
      lignes: facture.lignes || [{
        id: 1,
        description: '',
        quantite: 1,
        unite: 'h',
        prixUnitaire: 0,
        tva: 20,
        reduction: 0,
        totalTTC: 0
      }],
      fraisTraitement: facture.fraisTraitement || 0,
      financementExterne: facture.financementExterne || '',
      commentairePrive: facture.commentairePrive || '',
      liaisonFacture: facture.liaisonFacture || '',
      fichiers: facture.fichiers || [],
      afficherReduction: facture.afficherReduction || false
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
      setFactureId(null);
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

  // Ajouter une ligne à la facture
  const addLigne = useCallback(() => {
    const newLigne = {
      id: Date.now(),
      description: '',
      quantite: 1,
      unite: 'h',
      prixUnitaire: 0,
      tva: 20,
      reduction: 0,
      totalTTC: 0
    };
    setFormData(prev => ({
      ...prev,
      lignes: [...prev.lignes, newLigne]
    }));
  }, []);

  // Supprimer une ligne de la facture
  const removeLigne = useCallback((ligneId) => {
    setFormData(prev => ({
      ...prev,
      lignes: prev.lignes.filter(l => l.id !== ligneId)
    }));
  }, []);

  // Mettre à jour une ligne de la facture
  const updateLigne = useCallback((ligneId, field, value) => {
    setFormData(prev => {
      const newLignes = prev.lignes.map(ligne => {
        if (ligne.id === ligneId) {
          const updatedLigne = { ...ligne, [field]: value };
          
          // Calculer automatiquement le total TTC
          if (field === 'quantite' || field === 'prixUnitaire' || field === 'tva' || field === 'reduction') {
            const quantite = field === 'quantite' ? value : updatedLigne.quantite;
            const prixUnitaire = field === 'prixUnitaire' ? value : updatedLigne.prixUnitaire;
            const tva = field === 'tva' ? value : updatedLigne.tva;
            const reduction = field === 'reduction' ? value : updatedLigne.reduction;
            
            const totalHT = quantite * prixUnitaire;
            const totalApresReduction = totalHT * (1 - reduction / 100);
            const totalTTC = totalApresReduction * (1 + tva / 100);
            updatedLigne.totalTTC = Math.round(totalTTC * 100) / 100;
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

  // Calculer les totaux de la facture
  const calculateTotals = useCallback(() => {
    const totalHT = formData.lignes.reduce((sum, ligne) => {
      const ligneHT = ligne.quantite * ligne.prixUnitaire;
      const ligneApresReduction = ligneHT * (1 - (ligne.reduction || 0) / 100);
      return sum + ligneApresReduction;
    }, 0);
    
    const totalTVA = formData.lignes.reduce((sum, ligne) => {
      const ligneHT = ligne.quantite * ligne.prixUnitaire;
      const ligneApresReduction = ligneHT * (1 - (ligne.reduction || 0) / 100);
      const ligneTVA = ligneApresReduction * (ligne.tva / 100);
      return sum + ligneTVA;
    }, 0);
    
    const totalTTC = totalHT + totalTVA + (formData.fraisTraitement || 0);
    
    return {
      totalHT: Math.round(totalHT * 100) / 100,
      totalTVA: Math.round(totalTVA * 100) / 100,
      totalTTC: Math.round(totalTTC * 100) / 100
    };
  }, [formData.lignes, formData.fraisTraitement]);

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

    // Validation de la date de facture
    if (!formData.dateFacture) {
      newErrors.dateFacture = 'La date de facture est requise';
    }

    // Validation de la référence
    if (!formData.reference || formData.reference.trim().length < 2) {
      newErrors.reference = 'La référence est requise (min. 2 caractères)';
    }

    // Validation des lignes
    const hasValidLignes = formData.lignes.some(ligne => 
      ligne.description && ligne.quantite > 0 && ligne.prixUnitaire > 0
    );
    if (!hasValidLignes) {
      newErrors.lignes = 'Au moins une ligne valide est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Enregistrer la facture avec statut
  const saveFacture = useCallback(async (statut = 'en-cours', onSuccess) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const totals = calculateTotals();
      const factureData = {
        ...formData,
        statut,
        montantHT: totals.totalHT,
        montantTVA: totals.totalTVA,
        montantTTC: totals.totalTTC
      };
      
      // En production, ce serait :
      // const response = await fetch(
      //   mode === 'add' 
      //     ? '/api/invoices?type=facture'
      //     : `/api/invoices/${factureId}`,
      //   {
      //     method: mode === 'add' ? 'POST' : 'PUT',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(factureData)
      //   }
      // );
      // 
      // if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');

      const messages = {
        'en-cours': 'Facture créée avec le statut "En cours"',
        'payee': 'Facture créée avec le statut "Payée"',
        'impayee': 'Facture créée avec le statut "Impayée"'
      };

      toast.success(
        mode === 'add' 
          ? messages[statut] || 'Facture créée avec succès'
          : 'Facture modifiée avec succès'
      );
      
      closeModal();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [mode, factureId, formData, validateForm, calculateTotals, closeModal]);

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
    calculateTotals,
    saveFacture
  };
};