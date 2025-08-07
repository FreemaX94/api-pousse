import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ArrowUpIcon,
  CalendarIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  CloudArrowUpIcon,
  LinkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const DemandesClientPlanning = () => {
  // États pour la gestion de l'interface
  const [activeTab, setActiveTab] = useState('dates');
  const [viewMode, setViewMode] = useState('Semaine');
  const [showFilters, setShowFilters] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // États pour les filtres de date
  const [dateType, setDateType] = useState('debut');
  const [dateFilters, setDateFilters] = useState({
    dateDebut: '',
    dateFin: ''
  });

  // États pour le formulaire d'ajout
  const [formData, setFormData] = useState({
    titre: '',
    client: '',
    responsable: '',
    contrat: '',
    statut: 'Nouveau',
    priorite: 'Normal',
    categorie: '',
    provenance: 'Autre',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    rapportPersonnalise: '',
    contenu: '',
    fichiers: []
  });

  // Données d'exemple pour les demandes dans le planning
  const demandesPlanning = [
    {
      id: 1,
      titre: 'Installation mur végétal',
      client: 'SPOTIFY',
      responsable: 'Paul Durand',
      dateDebut: '2025-07-15T09:00',
      dateFin: '2025-07-15T17:00',
      dateEcheance: '2025-07-15',
      statut: 'En cours',
      priorite: 'Haut',
      couleur: 'bg-blue-500'
    },
    {
      id: 2,
      titre: 'Maintenance espaces verts',
      client: 'HERMES',
      responsable: 'Sophie Bernard',
      dateDebut: '2025-07-16T10:00',
      dateFin: '2025-07-16T15:00',
      dateEcheance: '2025-07-16',
      statut: 'Planifié',
      priorite: 'Normal',
      couleur: 'bg-green-500'
    },
    {
      id: 3,
      titre: 'Diagnostic parasites',
      client: 'LYDIA SOLUTIONS',
      responsable: 'Luc Moreau',
      dateDebut: '2025-07-17T13:00',
      dateFin: '2025-07-17T16:00',
      dateEcheance: '2025-07-17',
      statut: 'Urgent',
      priorite: 'Immédiat',
      couleur: 'bg-red-500'
    },
    {
      id: 4,
      titre: 'Remplacement plantes',
      client: 'SEPHORA',
      responsable: 'Marie Martin',
      dateDebut: '2025-07-18T08:00',
      dateFin: '2025-07-18T12:00',
      dateEcheance: '2025-07-20',
      statut: 'Nouveau',
      priorite: 'Normal',
      couleur: 'bg-purple-500'
    }
  ];

  const clients = ['ADAGIO OPERA', 'SEPHORA', 'SPOTIFY', 'HERMES', 'LYDIA SOLUTIONS', 'BEWIZ', 'CLAREO', 'AAREAL BANK', 'BERENBERG BANK', 'AQUILAE GESTION'];
  const responsables = [
    'Aymeric Tireau',
    'David Celeste',
    'Elodie Treveten',
    'Estelle Delapierre',
    'Florence ROGER',
    'Lucie Garcia',
    'Marine Sandoz',
    'Simon Henry'
  ];
  const statuts = ['Nouveau', 'En cours', 'Attente de réponse', 'Résolu', 'Fermé', 'Rejeté'];
  const priorites = ['Faible', 'Normal', 'Haut', 'Urgent', 'Immédiat'];
  const provenances = ['Autre', 'En personne', 'Par email', 'Par téléphone'];
  const categories = ['Entretien', 'Installation', 'Dépannage', 'Conseil', 'Urgence'];
  const contrats = [
    'N°240',
    'N°278',
    'N°261',
    'N°276 : Aléa',
    'N°271 : B-CE Euro Ariane',
    'N°270 : B-CE New Flag',
    'N°204 : CE – My Flex Office'
  ];
  const rapportsPersonnalises = [
    'Rapport standard maintenance',
    'Rapport intervention urgente',
    'Rapport diagnostic',
    'Rapport installation',
    'Rapport entretien préventif'
  ];

  // Fonctions utilitaires
  const handleDateFilterChange = (field, value) => {
    setDateFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetDateFilters = () => {
    setDateFilters({
      dateDebut: '',
      dateFin: ''
    });
  };

  const applyDateShortcut = (shortcut) => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    switch (shortcut) {
      case 'hier':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        setDateFilters({
          dateDebut: formatDate(yesterday),
          dateFin: formatDate(yesterday)
        });
        break;
      case 'aujourd\'hui':
        setDateFilters({
          dateDebut: formatDate(today),
          dateFin: formatDate(today)
        });
        break;
      case 'demain':
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        setDateFilters({
          dateDebut: formatDate(tomorrow),
          dateFin: formatDate(tomorrow)
        });
        break;
      case '7-jours':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        setDateFilters({
          dateDebut: formatDate(sevenDaysAgo),
          dateFin: formatDate(today)
        });
        break;
      case '30-jours':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        setDateFilters({
          dateDebut: formatDate(thirtyDaysAgo),
          dateFin: formatDate(today)
        });
        break;
      case 'mois-courant':
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setDateFilters({
          dateDebut: formatDate(firstDay),
          dateFin: formatDate(lastDay)
        });
        break;
      case 'depuis-toujours':
        setDateFilters({
          dateDebut: '',
          dateFin: ''
        });
        break;
      default:
        break;
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'Jour':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case '4 Jours':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 4 : -4));
        break;
      case 'Semaine':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'Mois':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      default:
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatPeriodTitle = () => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    
    switch (viewMode) {
      case 'Jour':
        return currentDate.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      case '4 Jours':
        const endDate4 = new Date(currentDate);
        endDate4.setDate(currentDate.getDate() + 3);
        return `${currentDate.toLocaleDateString('fr-FR', options)} - ${endDate4.toLocaleDateString('fr-FR', options)}`;
      case 'Semaine':
        const startWeek = new Date(currentDate);
        startWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        const endWeek = new Date(startWeek);
        endWeek.setDate(startWeek.getDate() + 6);
        return `${startWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${endWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`.toUpperCase();
      case 'Mois':
        return currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      default:
        return '';
    }
  };

  const generateHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(`${i.toString().padStart(2, '0')}h`);
    }
    return hours;
  };

  const generateDaysForView = () => {
    const days = [];
    const startDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'Jour':
        days.push(new Date(currentDate));
        break;
      case '4 Jours':
        for (let i = 0; i < 4; i++) {
          const day = new Date(currentDate);
          day.setDate(currentDate.getDate() + i);
          days.push(day);
        }
        break;
      case 'Semaine':
        startDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        for (let i = 0; i < 7; i++) {
          const day = new Date(startDate);
          day.setDate(startDate.getDate() + i);
          days.push(day);
        }
        break;
      case 'Mois':
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        for (let i = 1; i <= lastDay.getDate(); i++) {
          const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
          days.push(day);
        }
        break;
      default:
        break;
    }
    return days;
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Dimanche ou Samedi
  };

  const isHoliday = (date) => {
    // Exemple de jours fériés français 2025
    const holidays = [
      '2025-07-14', // Fête Nationale
      '2025-08-15', // Assomption
      '2025-11-01', // Toussaint
    ];
    const dateStr = date.toISOString().split('T')[0];
    return holidays.includes(dateStr);
  };

  const getHolidayName = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const holidayNames = {
      '2025-07-14': 'Fête Nationale',
      '2025-08-15': 'Assomption',
      '2025-11-01': 'Toussaint',
    };
    return holidayNames[dateStr] || '';
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      fichiers: [...prev.fichiers, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      fichiers: prev.fichiers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitForm = (continuer = false) => {
    console.log('Enregistrer demande planning:', formData);
    if (!continuer) {
      setShowAddForm(false);
    }
    // Réinitialiser le formulaire si on ne continue pas
    if (!continuer) {
      setFormData({
        titre: '',
        client: '',
        responsable: '',
        contrat: '',
        contenu: '',
        statut: 'Nouveau',
        priorite: 'Normal',
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: '',
        provenance: '',
        categorie: '',
        rapportPersonnalise: '',
        fichiers: []
      });
    }
  };

  // Composant Sélecteur de date
  const DatePickerModal = () => (
    <AnimatePresence>
      {showDatePicker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sélecteur de date
                </h3>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Radio buttons pour le type de date */}
                <div className="md:col-span-3 mb-4">
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="dateType"
                        value="debut"
                        checked={dateType === 'debut'}
                        onChange={(e) => setDateType(e.target.value)}
                        className="mr-2 text-[#2170E3] focus:ring-[#2170E3]"
                      />
                      Date de début
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="dateType"
                        value="fin"
                        checked={dateType === 'fin'}
                        onChange={(e) => setDateType(e.target.value)}
                        className="mr-2 text-[#2170E3] focus:ring-[#2170E3]"
                      />
                      Date de fin
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="dateType"
                        value="echeance"
                        checked={dateType === 'echeance'}
                        onChange={(e) => setDateType(e.target.value)}
                        className="mr-2 text-[#2170E3] focus:ring-[#2170E3]"
                      />
                      Date d'échéance
                    </label>
                  </div>
                </div>

                {/* Champs de date */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Du</label>
                      <input
                        type="date"
                        value={dateFilters.dateDebut}
                        onChange={(e) => handleDateFilterChange('dateDebut', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Au</label>
                      <input
                        type="date"
                        value={dateFilters.dateFin}
                        onChange={(e) => handleDateFilterChange('dateFin', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <button
                      onClick={() => {
                        console.log('Filtrer par dates:', dateFilters, 'Type:', dateType);
                        setShowDatePicker(false);
                      }}
                      className="px-4 py-2 bg-[#2170E3] text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Filtrer
                    </button>
                    <button
                      onClick={() => {
                        resetDateFilters();
                        setShowDatePicker(false);
                      }}
                      className="text-[#2170E3] hover:text-blue-800 text-sm"
                    >
                      Annuler ces filtres
                    </button>
                  </div>
                </div>

                {/* Raccourcis */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Raccourcis</h4>
                  <div className="space-y-1">
                    {[
                      { key: 'hier', label: 'Hier' },
                      { key: 'aujourd\'hui', label: 'Aujourd\'hui' },
                      { key: 'demain', label: 'Demain' },
                      { key: '7-jours', label: '7 derniers jours' },
                      { key: '30-jours', label: '30 derniers jours' },
                      { key: 'mois-courant', label: 'Mois courant' },
                      { key: 'depuis-toujours', label: 'Depuis toujours' }
                    ].map((shortcut) => (
                      <button
                        key={shortcut.key}
                        onClick={() => applyDateShortcut(shortcut.key)}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        {shortcut.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Composant Vue Calendrier par dates
  const CalendarView = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {viewMode === 'Liste' ? (
        // Vue Liste
        <div className="p-6">
          <div className="space-y-4">
            {demandesPlanning.map((demande) => (
              <motion.div
                key={demande.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{demande.titre}</h3>
                    <p className="text-sm text-gray-600">{demande.client}</p>
                    <p className="text-sm text-gray-500">Responsable: {demande.responsable}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{new Date(demande.dateDebut).toLocaleDateString('fr-FR')}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(demande.dateDebut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(demande.dateFin).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${demande.couleur} text-white mt-1`}>
                      {demande.statut}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        // Vue Grille
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* En-tête des jours */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-4 bg-gray-50 border-r border-gray-200">
                <span className="text-sm font-medium text-gray-500">Heure</span>
              </div>
              {generateDaysForView().map((day, index) => (
                <div
                  key={index}
                  className={`p-4 text-center border-r border-gray-200 ${
                    isWeekend(day) ? 'bg-gray-50' : 'bg-white'
                  } ${isHoliday(day) ? 'bg-red-50' : ''}`}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {day.getDate()}
                  </div>
                  {isHoliday(day) && (
                    <div className="text-xs text-red-600 bg-red-100 px-1 py-0.5 rounded mt-1">
                      {getHolidayName(day)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Corps du calendrier */}
            <div className="relative">
              {generateHours().map((hour, hourIndex) => (
                <div key={hourIndex} className="grid grid-cols-8 border-b border-gray-100">
                  <div className="p-2 bg-gray-50 border-r border-gray-200 text-xs text-gray-500">
                    {hour}
                  </div>
                  {generateDaysForView().map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`h-12 border-r border-gray-100 relative ${
                        isWeekend(day) ? 'bg-gray-25' : ''
                      }`}
                    >
                      {/* Affichage des événements */}
                      {demandesPlanning
                        .filter(demande => {
                          const demandeDate = new Date(demande.dateDebut);
                          const demandeHour = demandeDate.getHours();
                          return demandeDate.toDateString() === day.toDateString() && 
                                 demandeHour === hourIndex;
                        })
                        .map(demande => (
                          <motion.div
                            key={demande.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`absolute inset-1 ${demande.couleur} text-white text-xs p-1 rounded cursor-pointer hover:shadow-md transition-shadow`}
                            title={`${demande.titre} - ${demande.client}`}
                          >
                            <div className="font-semibold truncate">{demande.titre}</div>
                            <div className="truncate">{demande.client}</div>
                          </motion.div>
                        ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Composant Vue par échéance
  const EcheanceView = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* En-tête des jours */}
          <div className="grid grid-cols-8">
            <div className="p-4 bg-gray-50 border-r border-gray-200">
              <span className="text-sm font-medium text-gray-500">Échéances</span>
            </div>
            {generateDaysForView().map((day, index) => (
              <div
                key={index}
                className={`p-4 text-center border-r border-gray-200 ${
                  isWeekend(day) ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="text-sm font-medium text-gray-900">
                  {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Corps des échéances */}
          <div className="grid grid-cols-8 min-h-96">
            <div className="bg-gray-50 border-r border-gray-200"></div>
            {generateDaysForView().map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`border-r border-gray-100 p-2 relative ${
                  isWeekend(day) ? 'bg-gray-25' : ''
                }`}
              >
                {/* Affichage des échéances */}
                {demandesPlanning
                  .filter(demande => {
                    const echeanceDate = new Date(demande.dateEcheance);
                    return echeanceDate.toDateString() === day.toDateString();
                  })
                  .map((demande, index) => (
                    <motion.div
                      key={demande.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-2"
                    >
                      <div className={`w-full h-1 ${demande.couleur} rounded mb-1`}></div>
                      <div className="text-xs">
                        <div className="font-semibold text-gray-900 truncate">{demande.titre}</div>
                        <div className="text-gray-600 truncate">{demande.client}</div>
                        <div className="text-gray-500">{demande.responsable}</div>
                        <span className={`inline-block px-1 py-0.5 text-xs rounded ${demande.couleur} text-white mt-1`}>
                          {demande.priorite}
                        </span>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Composant Formulaire d'ajout
  const AddDemandeForm = () => (
    <AnimatePresence>
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleSubmitForm(false)}
                    disabled={!formData.titre}
                    className="inline-flex items-center px-4 py-2 bg-[#2170E3] text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => handleSubmitForm(true)}
                    disabled={!formData.titre}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  >
                    Enregistrer et continuer
                  </button>
                  <nav className="text-sm text-gray-500">
                    Demandes client &gt; Planning &gt; Ajouter une demande client
                  </nav>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
                    <TagIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
                    <Cog6ToothIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Titre */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => handleFormChange('titre', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  placeholder="Saisissez le titre de la demande..."
                  required
                />
              </div>

              {/* Bloc principal en deux colonnes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Colonne gauche */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={formData.client}
                        onChange={(e) => handleFormChange('client', e.target.value)}
                        className="flex-1 border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        required
                      >
                        <option value="">Sélectionner un client</option>
                        {clients.map(client => (
                          <option key={client} value={client}>{client}</option>
                        ))}
                      </select>
                      <button className="px-3 py-2 border border-gray-200 rounded hover:bg-gray-50" title="Ajouter un client">
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                    <select
                      value={formData.responsable}
                      onChange={(e) => handleFormChange('responsable', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    >
                      <option value="">Sélectionner un responsable</option>
                      {responsables.map(resp => (
                        <option key={resp} value={resp}>{resp}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contrat</label>
                    <div className="space-y-2">
                      <select
                        value={formData.contrat}
                        onChange={(e) => handleFormChange('contrat', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        <option value="">Sélectionner un contrat</option>
                        {contrats.map(contrat => (
                          <option key={contrat} value={contrat}>{contrat}</option>
                        ))}
                      </select>
                      <button className="text-[#2170E3] hover:text-blue-800 text-sm flex items-center">
                        <LinkIcon className="w-4 h-4 mr-1" />
                        Ajouter un contrat
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                    <textarea
                      value={formData.contenu}
                      onChange={(e) => handleFormChange('contenu', e.target.value)}
                      rows={6}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      placeholder="Décrivez le contenu de la demande..."
                    />
                  </div>
                </div>

                {/* Colonne droite */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.statut}
                      onChange={(e) => handleFormChange('statut', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      required
                    >
                      {statuts.map(statut => (
                        <option key={statut} value={statut}>{statut}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priorité <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.priorite}
                      onChange={(e) => handleFormChange('priorite', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      required
                    >
                      {priorites.map(priorite => (
                        <option key={priorite} value={priorite}>{priorite}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                    <input
                      type="date"
                      value={formData.dateDebut}
                      onChange={(e) => handleFormChange('dateDebut', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                    <input
                      type="date"
                      value={formData.dateFin}
                      onChange={(e) => handleFormChange('dateFin', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provenance</label>
                    <div className="space-y-2">
                      <select
                        value={formData.provenance}
                        onChange={(e) => handleFormChange('provenance', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        <option value="">Sélectionner une provenance</option>
                        {provenances.map(prov => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                      <button className="text-[#2170E3] hover:text-blue-800 text-sm flex items-center">
                        <LinkIcon className="w-4 h-4 mr-1" />
                        Ajouter une nouvelle provenance
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <div className="space-y-2">
                      <select
                        value={formData.categorie}
                        onChange={(e) => handleFormChange('categorie', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button className="text-[#2170E3] hover:text-blue-800 text-sm flex items-center">
                        <LinkIcon className="w-4 h-4 mr-1" />
                        Ajouter une nouvelle catégorie
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rapport personnalisé</label>
                    <select
                      value={formData.rapportPersonnalise}
                      onChange={(e) => handleFormChange('rapportPersonnalise', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    >
                      <option value="">Aucun</option>
                      <option value="standard">Rapport standard</option>
                      <option value="detaille">Rapport détaillé</option>
                      <option value="personnalise">Rapport personnalisé</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section Fichiers */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fichiers</label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Glisser-déposer des fichiers ici ou 
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload-planning"
                      />
                      <label 
                        htmlFor="file-upload-planning"
                        className="text-[#2170E3] hover:text-blue-800 ml-1 cursor-pointer"
                      >
                        parcourir
                      </label>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Formats acceptés: PDF, JPG, PNG, DOC (max 10MB)
                    </p>
                  </div>

                  {/* Liste des fichiers ajoutés */}
                  {formData.fichiers.length > 0 && (
                    <div className="space-y-2">
                      {formData.fichiers.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-900">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleSubmitForm(true)}
                  disabled={!formData.titre}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                >
                  Enregistrer et continuer
                </button>
                <div className="text-sm text-gray-500">
                  © 2025 Organilog · 
                  <button className="text-[#2170E3] hover:text-blue-800 mx-1">CGU</button>
                  ·
                  <button className="text-[#2170E3] hover:text-blue-800 mx-1">Mentions légales</button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center space-x-1 text-[#2170E3] hover:text-blue-800 text-sm"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                  <span>Retour en haut</span>
                </button>
                <button
                  onClick={() => handleSubmitForm(false)}
                  disabled={!formData.titre}
                  className="px-6 py-2 bg-[#2170E3] text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="p-6">
      {/* En-tête avec boutons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-[#2170E3] text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Ajouter une demande client
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDatePicker(true)}
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {dateFilters.dateDebut || dateFilters.dateFin 
              ? `${dateFilters.dateDebut || '...'} - ${dateFilters.dateFin || '...'}`
              : 'date min. - date max.'
            }
          </motion.button>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filtres
          </motion.button>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded" title="Imprimer">
              <PrinterIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded" title="Exporter">
              <DocumentArrowDownIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded" title="Tags">
              <TagIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded" title="Options d'affichage">
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Onglets de planning */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm mb-6">
        <div className="flex space-x-6 px-6 overflow-x-auto">
          {[
            { key: 'dates', label: 'Affichage par dates' },
            { key: 'echeance', label: 'Affichage par échéance' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 px-3 border-b-3 font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-[#2170E3] text-[#2170E3] bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-[#2170E3] hover:border-gray-300 hover:bg-gray-50'
              }`}
              aria-live="polite"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sélecteur de période */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          {/* Navigation et titre */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={goToToday}
              className="px-3 py-1 bg-[#2170E3] text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Aujourd'hui
            </button>
            
            <h2 className="text-lg font-semibold text-gray-900 min-w-64 text-center">
              {formatPeriodTitle()}
            </h2>
            
            <button
              onClick={() => navigateDate('next')}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Modes d'affichage */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {['4 Jours', 'Jour', 'Semaine', 'Mois', 'Liste'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-[#2170E3] font-medium shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Corps du planning */}
      {activeTab === 'dates' ? <CalendarView /> : <EcheanceView />}

      {/* Footer */}
      <footer className="mt-8 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            © 2025 Organilog · 
            <button className="text-[#2170E3] hover:text-blue-800 mx-1">CGU</button>
            ·
            <button className="text-[#2170E3] hover:text-blue-800 mx-1">Mentions légales</button>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-1 text-[#2170E3] hover:text-blue-800 text-sm"
          >
            <ArrowUpIcon className="w-4 h-4" />
            <span>Retour en haut</span>
          </button>
        </div>
      </footer>

      {/* Modales */}
      <DatePickerModal />
      <AddDemandeForm />
    </div>
  );
};

export default DemandesClientPlanning;