import { useState, useEffect, useCallback } from 'react';

interface DisplayOptions {
  boutonImpression: boolean;
  fenetreConfirmationDeplacement: boolean;
  aidePremiereUtilisation: boolean;
  interventionsSansDate: boolean;
}

const DEFAULT_OPTIONS: DisplayOptions = {
  boutonImpression: true,
  fenetreConfirmationDeplacement: true,
  aidePremiereUtilisation: false,
  interventionsSansDate: true
};

const STORAGE_KEY = 'planning-display-options';

export const useDisplayOptions = () => {
  const [options, setOptions] = useState<DisplayOptions>(DEFAULT_OPTIONS);
  const [tempOptions, setTempOptions] = useState<DisplayOptions>(DEFAULT_OPTIONS);

  // Charger les options depuis le localStorage au montage
  useEffect(() => {
    try {
      const savedOptions = localStorage.getItem(STORAGE_KEY);
      if (savedOptions) {
        const parsed = JSON.parse(savedOptions) as DisplayOptions;
        setOptions(parsed);
        setTempOptions(parsed);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des options d\'affichage:', error);
    }
  }, []);

  // Mettre à jour les options temporaires
  const updateTempOption = useCallback((key: keyof DisplayOptions, value: boolean) => {
    setTempOptions(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Sauvegarder les options (persister)
  const saveOptions = useCallback(() => {
    try {
      setOptions(tempOptions);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tempOptions));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des options d\'affichage:', error);
      return false;
    }
  }, [tempOptions]);

  // Annuler les modifications (restaurer état précédent)
  const cancelChanges = useCallback(() => {
    setTempOptions(options);
  }, [options]);

  // Réinitialiser aux valeurs par défaut
  const resetToDefaults = useCallback(() => {
    setTempOptions(DEFAULT_OPTIONS);
  }, []);

  // Vérifier si des changements ont été faits
  const hasChanges = useCallback(() => {
    return JSON.stringify(options) !== JSON.stringify(tempOptions);
  }, [options, tempOptions]);

  return {
    options, // Options actuellement sauvegardées
    tempOptions, // Options temporaires (en cours d'édition)
    updateTempOption,
    saveOptions,
    cancelChanges,
    resetToDefaults,
    hasChanges
  };
};