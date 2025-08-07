import { useState, useEffect, useMemo } from 'react';
import { addDays, addWeeks, addMonths, format, isWeekend } from 'date-fns';
import { fr } from 'date-fns/locale';

const useRecurrenceForm = (isOpen) => {
  const [formData, setFormData] = useState({
    titre: '',
    modele: '',
    statut: 'planifie', // 'planifie' ou 'effectue'
    frequence: {
      nombre: 1,
      unite: 'semaine' // 'jour', 'semaine', '2semaines', 'mois'
    },
    excludeWeekends: false,
    typeFin: 'aucune', // 'aucune', 'occurrences', 'date'
    nombreOccurrences: 10,
    dateFin: '',
    prochaineCreation: '',
    genererDocument: {
      joursAvant: 0,
      generationImmediate: false
    },
    recevoirMail: false,
    envoyerMailClient: false,
    commentaire: ''
  });

  const [errors, setErrors] = useState({});

  // Réinitialiser le formulaire à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setFormData({
        titre: '',
        modele: '',
        statut: 'planifie',
        frequence: {
          nombre: 1,
          unite: 'semaine'
        },
        excludeWeekends: false,
        typeFin: 'aucune',
        nombreOccurrences: 10,
        dateFin: '',
        prochaineCreation: '',
        genererDocument: {
          joursAvant: 0,
          generationImmediate: false
        },
        recevoirMail: false,
        envoyerMailClient: false,
        commentaire: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  // Options pour les selects
  const modeleOptions = [
    { value: 'entretien-bnp', label: 'Entretien jardins BNP PARIBAS' },
    { value: 'maintenance-hermes', label: 'Maintenance espaces verts HERMES' },
    { value: 'installation-sephora', label: 'Installation plantes SEPHORA' },
    { value: 'nettoyage-spotify', label: 'Nettoyage terrasse SPOTIFY' },
    { value: 'arrosage-winamax', label: 'Arrosage automatique WINAMAX' }
  ];

  const uniteOptions = [
    { value: 'jour', label: 'jour' },
    { value: 'semaine', label: 'semaine' },
    { value: '2semaines', label: '2 semaines' },
    { value: 'mois', label: 'mois' }
  ];

  const joursAvantOptions = [
    { value: 0, label: 'Le jour même' },
    { value: 1, label: '1 jour avant' },
    { value: 2, label: '2 jours avant' },
    { value: 3, label: '3 jours avant' },
    { value: 7, label: '1 semaine avant' },
    { value: 14, label: '2 semaines avant' }
  ];

  // Calculer les prochaines dates
  const calculerProchainesDates = useMemo(() => {
    if (!formData.prochaineCreation) return [];

    const dates = [];
    let currentDate = new Date(formData.prochaineCreation);
    const maxDates = formData.typeFin === 'occurrences' ? formData.nombreOccurrences : 10;
    const limitDate = formData.typeFin === 'date' && formData.dateFin ? new Date(formData.dateFin) : null;

    for (let i = 0; i < maxDates && dates.length < 10; i++) {
      // Vérifier la limite de date
      if (limitDate && currentDate > limitDate) break;

      // Exclure les week-ends si demandé
      if (formData.excludeWeekends && isWeekend(currentDate)) {
        // Avancer d'un jour et continuer
        currentDate = addDays(currentDate, 1);
        i--; // Ne pas compter cette itération
        continue;
      }

      dates.push(new Date(currentDate));

      // Calculer la prochaine date selon la fréquence
      switch (formData.frequence.unite) {
        case 'jour':
          currentDate = addDays(currentDate, formData.frequence.nombre);
          break;
        case 'semaine':
          currentDate = addWeeks(currentDate, formData.frequence.nombre);
          break;
        case '2semaines':
          currentDate = addWeeks(currentDate, 2 * formData.frequence.nombre);
          break;
        case 'mois':
          currentDate = addMonths(currentDate, formData.frequence.nombre);
          break;
        default:
          currentDate = addWeeks(currentDate, formData.frequence.nombre);
      }
    }

    return dates;
  }, [
    formData.prochaineCreation,
    formData.frequence,
    formData.excludeWeekends,
    formData.typeFin,
    formData.nombreOccurrences,
    formData.dateFin
  ]);

  // Mettre à jour un champ
  const updateField = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });

    // Effacer l'erreur si elle existe
    if (errors[path]) {
      setErrors(prev => ({
        ...prev,
        [path]: ''
      }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est obligatoire';
    }

    if (!formData.modele) {
      newErrors.modele = 'Le modèle est obligatoire';
    }

    if (!formData.prochaineCreation) {
      newErrors.prochaineCreation = 'La date de prochaine création est obligatoire';
    }

    if (formData.typeFin === 'occurrences' && (!formData.nombreOccurrences || formData.nombreOccurrences < 1)) {
      newErrors.nombreOccurrences = 'Le nombre d\'occurrences doit être supérieur à 0';
    }

    if (formData.typeFin === 'date' && !formData.dateFin) {
      newErrors.dateFin = 'La date de fin est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    updateField,
    validateForm,
    calculerProchainesDates,
    modeleOptions,
    uniteOptions,
    joursAvantOptions
  };
};

export default useRecurrenceForm;