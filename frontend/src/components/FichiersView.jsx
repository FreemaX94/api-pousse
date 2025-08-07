import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ArrowUpIcon,
  DocumentArrowUpIcon,
  CalendarIcon,
  CloudArrowDownIcon,
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
  FolderIcon,
  ClockIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const FichiersView = () => {
  // États pour la gestion de l'interface
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedFichiers, setSelectedFichiers] = useState([]);

  // États pour les blocs collapsibles du formulaire
  const [showSecondaryInfo, setShowSecondaryInfo] = useState(false);
  const [showAssociatedFiles, setShowAssociatedFiles] = useState(false);

  // États pour les filtres de date
  const [dateFilters, setDateFilters] = useState({
    dateDebut: '',
    dateFin: ''
  });

  // États pour les filtres
  const [filters, setFilters] = useState({
    numero: '',
    collaborateur: '',
    nomFichier: '',
    legende: '',
    categorie: 'all',
    poids: 'all',
    actif: 'all'
  });

  // États pour le formulaire d'ajout
  const [formData, setFormData] = useState({
    fichier: null,
    collaborateur: 'Jean Dupont',
    categorie: '',
    annee: new Date().getFullYear(),
    mois: new Date().getMonth() + 1,
    nomDocument: '',
    tailleDocument: '',
    largeurImage: '',
    hauteurImage: '',
    legende: '',
    dateCreation: '',
    heureCreation: '',
    liaisons: []
  });

  // Données d'exemple pour les fichiers
  const fichiers = [
    {
      id: 1,
      numero: 'F001',
      collaborateur: 'Jean Dupont',
      document: 'Contrat_ADAGIO_2024.pdf',
      type: 'pdf',
      poids: '2.4 MB',
      liaison: 'Contrat #CT001',
      categorie: 'Contrats',
      legende: 'Contrat principal ADAGIO OPERA',
      dateCreation: '15/01/2024 10:30',
      actif: true
    },
    {
      id: 2,
      numero: 'F002',
      collaborateur: 'Marie Martin',
      document: 'Photo_installation_sephora.jpg',
      type: 'image',
      poids: '8.7 MB',
      liaison: 'Intervention #INT025',
      categorie: 'Photos',
      legende: 'Installation terminée chez Sephora',
      dateCreation: '22/01/2024 14:15',
      actif: true
    },
    {
      id: 3,
      numero: 'F003',
      collaborateur: 'Paul Durand',
      document: 'Devis_spotify_amenagement.pdf',
      type: 'pdf',
      poids: '1.2 MB',
      liaison: 'Affaire #AFF012',
      categorie: 'Devis',
      legende: 'Devis aménagement espace Spotify',
      dateCreation: '05/02/2024 09:45',
      actif: true
    },
    {
      id: 4,
      numero: 'F004',
      collaborateur: 'Sophie Bernard',
      document: 'Facture_hermes_janvier.pdf',
      type: 'pdf',
      poids: '890 KB',
      liaison: 'Facture #FACT089',
      categorie: 'Factures',
      legende: 'Facturation mensuelle Hermès',
      dateCreation: '10/02/2024 16:20',
      actif: true
    },
    {
      id: 5,
      numero: 'F005',
      collaborateur: 'Luc Moreau',
      document: 'Video_formation_arrosage.mp4',
      type: 'video',
      poids: '45.2 MB',
      liaison: 'Formation #FORM003',
      categorie: 'Formations',
      legende: 'Tutoriel système d\'arrosage automatique',
      dateCreation: '18/02/2024 11:00',
      actif: false
    },
    {
      id: 6,
      numero: 'F006',
      collaborateur: 'Emma Dubois',
      document: 'Plan_bewiz_vegetalisation.dwg',
      type: 'dwg',
      poids: '3.1 MB',
      liaison: 'Projet #PROJ008',
      categorie: 'Plans',
      legende: 'Plan de végétalisation bureaux Bewiz',
      dateCreation: '25/02/2024 13:30',
      actif: true
    },
    {
      id: 7,
      numero: 'F007',
      collaborateur: 'Thomas Petit',
      document: 'Rapport_entretien_clareo.pdf',
      type: 'pdf',
      poids: '1.8 MB',
      liaison: 'Intervention #INT032',
      categorie: 'Rapports',
      legende: 'Rapport mensuel entretien Clareo',
      dateCreation: '03/03/2024 08:45',
      actif: true
    },
    {
      id: 8,
      numero: 'F008',
      collaborateur: 'Camille Roux',
      document: 'Certificat_phyto_2024.pdf',
      type: 'pdf',
      poids: '650 KB',
      liaison: 'Document administratif',
      categorie: 'Certifications',
      legende: 'Certificat phytosanitaire 2024',
      dateCreation: '12/03/2024 15:15',
      actif: true
    }
  ];

  const collaborateurs = ['Jean Dupont', 'Marie Martin', 'Paul Durand', 'Sophie Bernard', 'Luc Moreau', 'Emma Dubois', 'Thomas Petit', 'Camille Roux'];
  const categories = ['Contrats', 'Photos', 'Devis', 'Factures', 'Formations', 'Plans', 'Rapports', 'Certifications'];
  const liaisons = ['Contrat #CT001', 'Intervention #INT025', 'Affaire #AFF012', 'Facture #FACT089', 'Formation #FORM003', 'Projet #PROJ008'];

  // Fonctions utilitaires
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedFichiers(fichiers.map(fichier => fichier.id));
    } else {
      setSelectedFichiers([]);
    }
  };

  const handleSelectFichier = (id, checked) => {
    if (checked) {
      setSelectedFichiers([...selectedFichiers, id]);
    } else {
      setSelectedFichiers(selectedFichiers.filter(fichierId => fichierId !== id));
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDateFilterChange = (field, value) => {
    setDateFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      numero: '',
      collaborateur: '',
      nomFichier: '',
      legende: '',
      categorie: 'all',
      poids: 'all',
      actif: 'all'
    });
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
      case '14-jours':
        const fourteenDaysAgo = new Date(today);
        fourteenDaysAgo.setDate(today.getDate() - 14);
        setDateFilters({
          dateDebut: formatDate(fourteenDaysAgo),
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
      case '7-jours-suivants':
        const sevenDaysLater = new Date(today);
        sevenDaysLater.setDate(today.getDate() + 7);
        setDateFilters({
          dateDebut: formatDate(today),
          dateFin: formatDate(sevenDaysLater)
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
      case 'mois-precedent':
        const firstDayPrev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayPrev = new Date(today.getFullYear(), today.getMonth(), 0);
        setDateFilters({
          dateDebut: formatDate(firstDayPrev),
          dateFin: formatDate(lastDayPrev)
        });
        break;
      case 'mois-suivant':
        const firstDayNext = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const lastDayNext = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        setDateFilters({
          dateDebut: formatDate(firstDayNext),
          dateFin: formatDate(lastDayNext)
        });
        break;
      case 'annee-precedente':
        const firstDayPrevYear = new Date(today.getFullYear() - 1, 0, 1);
        const lastDayPrevYear = new Date(today.getFullYear() - 1, 11, 31);
        setDateFilters({
          dateDebut: formatDate(firstDayPrevYear),
          dateFin: formatDate(lastDayPrevYear)
        });
        break;
      case 'annee-cours':
        const firstDayYear = new Date(today.getFullYear(), 0, 1);
        const lastDayYear = new Date(today.getFullYear(), 11, 31);
        setDateFilters({
          dateDebut: formatDate(firstDayYear),
          dateFin: formatDate(lastDayYear)
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        fichier: file,
        nomDocument: file.name,
        tailleDocument: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      }));
      
      // Si c'est une image, récupérer les dimensions
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = function() {
          setFormData(prevData => ({
            ...prevData,
            largeurImage: this.width.toString(),
            hauteurImage: this.height.toString()
          }));
        };
        img.src = URL.createObjectURL(file);
      }
    }
  };

  const handleSubmitForm = () => {
    console.log('Enregistrer fichier:', formData);
    setShowAddForm(false);
    // Réinitialiser le formulaire
    setFormData({
      fichier: null,
      collaborateur: 'Jean Dupont',
      categorie: '',
      annee: new Date().getFullYear(),
      mois: new Date().getMonth() + 1,
      nomDocument: '',
      tailleDocument: '',
      largeurImage: '',
      hauteurImage: '',
      legende: '',
      dateCreation: '',
      heureCreation: '',
      liaisons: []
    });
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <DocumentIcon className="w-8 h-8 text-red-600" />;
      case 'image':
        return <PhotoIcon className="w-8 h-8 text-green-600" />;
      case 'video':
        return <VideoCameraIcon className="w-8 h-8 text-purple-600" />;
      case 'dwg':
        return <FolderIcon className="w-8 h-8 text-blue-600" />;
      default:
        return <DocumentIcon className="w-8 h-8 text-gray-600" />;
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
                  Recherche sur date de création
                </h3>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        console.log('Filtrer par dates:', dateFilters);
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
                      { key: '14-jours', label: '14 derniers jours' },
                      { key: '30-jours', label: '30 derniers jours' },
                      { key: '7-jours-suivants', label: '7 jours suivants' },
                      { key: 'mois-courant', label: 'Mois courant' },
                      { key: 'mois-precedent', label: 'Mois précédent' },
                      { key: 'mois-suivant', label: 'Mois suivant' },
                      { key: 'annee-precedente', label: 'Année précédente' },
                      { key: 'annee-cours', label: 'Année en cours' },
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

  // Composant Panneau de filtres
  const FiltersPanel = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Champs principaux</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">N°</label>
                <input
                  type="number"
                  value={filters.numero}
                  onChange={(e) => handleFilterChange('numero', e.target.value)}
                  className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collaborateur</label>
                <select
                  value={filters.collaborateur}
                  onChange={(e) => handleFilterChange('collaborateur', e.target.value)}
                  className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                >
                  <option value="">Tous</option>
                  {collaborateurs.map(collab => (
                    <option key={collab} value={collab}>{collab}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du fichier</label>
                <input
                  type="text"
                  value={filters.nomFichier}
                  onChange={(e) => handleFilterChange('nomFichier', e.target.value)}
                  className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Légende</label>
                <input
                  type="text"
                  value={filters.legende}
                  onChange={(e) => handleFilterChange('legende', e.target.value)}
                  className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={filters.categorie}
                  onChange={(e) => handleFilterChange('categorie', e.target.value)}
                  className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                >
                  <option value="all">Toutes</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poids</label>
                <select
                  value={filters.poids}
                  onChange={(e) => handleFilterChange('poids', e.target.value)}
                  className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                >
                  <option value="all">Tous</option>
                  <option value="small">Moins de 1 MB</option>
                  <option value="medium">1 MB - 10 MB</option>
                  <option value="large">Plus de 10 MB</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actif ?</label>
                <select
                  value={filters.actif}
                  onChange={(e) => handleFilterChange('actif', e.target.value)}
                  className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                >
                  <option value="all">Tous</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              </div>
            </div>

            {/* Actions des filtres */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Annuler ces filtres
              </button>
              <div className="flex space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Enregistrer ce filtre
                </button>
                <button className="px-4 py-2 bg-[#2170E3] text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Chercher
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Composant Tableau des fichiers
  const FichiersTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-[#2170E3] focus:ring-[#2170E3]"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('numero')}
              >
                <div className="flex items-center space-x-1">
                  <span>N°</span>
                  {sortColumn === 'numero' && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('collaborateur')}
              >
                <div className="flex items-center space-x-1">
                  <span>Collaborateur</span>
                  {sortColumn === 'collaborateur' && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('poids')}
              >
                <div className="flex items-center space-x-1">
                  <span>Poids</span>
                  {sortColumn === 'poids' && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Télécharger
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liaison
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Légende
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fichiers.map((fichier, index) => (
              <motion.tr
                key={fichier.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedFichiers.includes(fichier.id)}
                    onChange={(e) => handleSelectFichier(fichier.id, e.target.checked)}
                    className="rounded border-gray-300 text-[#2170E3] focus:ring-[#2170E3]"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {fichier.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-[#2170E3] hover:text-blue-800 hover:underline">
                    {fichier.collaborateur}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(fichier.type)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{fichier.document}</p>
                      <p className="text-xs text-gray-500">{fichier.dateCreation}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {fichier.poids}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-[#2170E3] hover:text-blue-900 hover:bg-blue-50 rounded-full"
                    title="Télécharger le fichier"
                  >
                    <CloudArrowDownIcon className="w-5 h-5" />
                  </motion.button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="text-[#2170E3] hover:text-blue-800 hover:underline flex items-center space-x-1">
                    <LinkIcon className="w-4 h-4" />
                    <span>{fichier.liaison}</span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {fichier.categorie}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {fichier.legende}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-[#2170E3] hover:text-blue-900"
                      title="Voir le fichier"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900"
                      title="Modifier le fichier"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Composant Formulaire d'ajout
  const AddFichierForm = () => (
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
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSubmitForm}
                    disabled={!formData.fichier}
                    className="inline-flex items-center px-4 py-2 bg-[#2170E3] text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Enregistrer
                  </button>
                  <nav className="text-sm text-gray-500">
                    Fichiers &gt; Ajouter un fichier
                  </nav>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Bloc Données */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Données</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ajouter un fichier <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-4 text-sm text-gray-600">
                        Glisser-déposer un fichier ici ou 
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label 
                          htmlFor="file-upload"
                          className="text-[#2170E3] hover:text-blue-800 ml-1 cursor-pointer"
                        >
                          parcourir
                        </label>
                      </p>
                      {formData.fichier && (
                        <p className="text-sm text-green-600 mt-2">
                          Fichier sélectionné: {formData.fichier.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Collaborateur</label>
                      <input
                        type="text"
                        value={formData.collaborateur}
                        readOnly
                        className="w-full border border-gray-200 rounded p-2 bg-gray-50 text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                      <div className="flex space-x-2">
                        <select
                          value={formData.categorie}
                          onChange={(e) => handleFormChange('categorie', e.target.value)}
                          className="flex-1 border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button className="px-3 py-2 border border-gray-200 rounded hover:bg-gray-50">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                      <input
                        type="number"
                        value={formData.annee}
                        readOnly
                        className="w-full border border-gray-200 rounded p-2 bg-gray-50 text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mois</label>
                      <input
                        type="number"
                        value={formData.mois}
                        readOnly
                        className="w-full border border-gray-200 rounded p-2 bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom du document</label>
                      <input
                        type="text"
                        value={formData.nomDocument}
                        readOnly
                        className="w-full border border-gray-200 rounded p-2 bg-gray-50 text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Taille du document</label>
                      <input
                        type="text"
                        value={formData.tailleDocument}
                        readOnly
                        className="w-full border border-gray-200 rounded p-2 bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>

                  {formData.largeurImage && formData.hauteurImage && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Largeur de l'image</label>
                        <input
                          type="text"
                          value={`${formData.largeurImage} px`}
                          readOnly
                          className="w-full border border-gray-200 rounded p-2 bg-gray-50 text-gray-600"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hauteur de l'image</label>
                        <input
                          type="text"
                          value={`${formData.hauteurImage} px`}
                          readOnly
                          className="w-full border border-gray-200 rounded p-2 bg-gray-50 text-gray-600"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Légende</label>
                    <input
                      type="text"
                      value={formData.legende}
                      onChange={(e) => handleFormChange('legende', e.target.value)}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      placeholder="Description du fichier..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de création</label>
                      <input
                        type="date"
                        value={formData.dateCreation}
                        onChange={(e) => handleFormChange('dateCreation', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure de création</label>
                      <input
                        type="time"
                        value={formData.heureCreation}
                        onChange={(e) => handleFormChange('heureCreation', e.target.value)}
                        className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Liaison(s)</label>
                    <select
                      multiple
                      value={formData.liaisons}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        handleFormChange('liaisons', values);
                      }}
                      className="w-full border border-gray-200 rounded p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 h-32"
                    >
                      {liaisons.map(liaison => (
                        <option key={liaison} value={liaison}>{liaison}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl/Cmd pour sélectionner plusieurs éléments</p>
                  </div>
                </div>
              </div>

              {/* Bloc Informations secondaires */}
              <div className="mb-8">
                <button
                  onClick={() => setShowSecondaryInfo(!showSecondaryInfo)}
                  className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4 hover:text-blue-600"
                >
                  <span>Informations secondaires</span>
                  <ChevronDownIcon className={`w-5 h-5 transition-transform ${showSecondaryInfo ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showSecondaryInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-gray-500"
                    >
                      Aucun champ supplémentaire pour le moment.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bloc Fichiers associés */}
              <div className="mb-8">
                <button
                  onClick={() => setShowAssociatedFiles(!showAssociatedFiles)}
                  className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4 hover:text-blue-600"
                >
                  <span>Fichiers associés</span>
                  <ChevronDownIcon className={`w-5 h-5 transition-transform ${showAssociatedFiles ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showAssociatedFiles && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-gray-500"
                    >
                      Aucun fichier associé pour le moment.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
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
                  onClick={handleSubmitForm}
                  disabled={!formData.fichier}
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
            Ajouter un fichier
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
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
              <TagIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded">
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Indicateur de sélection */}
      {selectedFichiers.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {selectedFichiers.length} fichier(s) sélectionné(s)
          </p>
        </div>
      )}

      {/* Panneau de filtres */}
      <FiltersPanel />

      {/* Tableau des fichiers */}
      <FichiersTable />
      
      {/* Pagination */}
      <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between rounded-b-lg">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page précédente">
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          
          <div className="flex space-x-1">
            <button className="px-3 py-1 text-sm rounded bg-[#2170E3] text-white">1</button>
            <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">2</button>
            <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">3</button>
            <span className="px-2 py-1 text-sm text-gray-500">...</span>
            <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">153</button>
            <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">154</button>
            <button className="px-3 py-1 text-sm rounded text-gray-700 hover:bg-gray-100">155</button>
          </div>
          
          <button className="p-2 text-gray-400 hover:text-gray-600" aria-label="Page suivante">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-sm text-gray-700">
          4639 résultats
        </div>
      </div>

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
      <AddFichierForm />
    </div>
  );
};

export default FichiersView;