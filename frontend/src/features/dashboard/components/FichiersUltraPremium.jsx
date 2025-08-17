import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderIcon,
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
  ShareIcon,
  DocumentArrowDownIcon,
  DocumentDuplicateIcon,
  StarIcon,
  HeartIcon,
  TagIcon,
  ClockIcon,
  UserIcon,
  ChevronRightIcon,
  HomeIcon,
  FolderOpenIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  ChartBarIcon,
  CurrencyEuroIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  LinkIcon,
  QrCodeIcon,
  CommandLineIcon,
  CpuChipIcon,
  ServerIcon,
  CloudIcon,
  WifiIcon,
  SignalIcon,
  EyeSlashIcon,
  KeyIcon,
  DocumentMagnifyingGlassIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  DocumentChartBarIcon,
  PresentationChartLineIcon,
  CodeBracketIcon,
  FilmIcon,
  MusicalNoteIcon,
  CubeIcon,
  GiftIcon,
  BeakerIcon,
  BookOpenIcon,
  NewspaperIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import UltraPremiumContainer from './UltraPremiumContainer';

const FichiersUltraPremium = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('root');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [currentPath, setCurrentPath] = useState(['Racine']);
  const [isDragging, setIsDragging] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragCounter, setDragCounter] = useState(0);
  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);

  // Structure de dossiers simulée
  const folders = {
    root: {
      id: 'root',
      name: 'Racine',
      parent: null,
      subfolders: ['clients', 'projets', 'equipements', 'admin'],
      files: ['presentation-entreprise.pdf', 'catalogue-2024.pdf']
    },
    clients: {
      id: 'clients',
      name: 'Clients',
      parent: 'root',
      subfolders: ['mairie-lyon', 'techcorp', 'villa-beausoleil'],
      files: ['contrats-type.docx', 'tarifs-2024.xlsx']
    },
    'mairie-lyon': {
      id: 'mairie-lyon',
      name: 'Mairie de Lyon',
      parent: 'clients',
      subfolders: ['contrats', 'photos', 'plans'],
      files: ['contact-principal.pdf', 'historique-interventions.xlsx']
    },
    projets: {
      id: 'projets',
      name: 'Projets',
      parent: 'root',
      subfolders: ['chateau-fontaines', 'parc-tete-dor', 'techcorp-amenagement'],
      files: ['modeles-devis.xlsx', 'planning-template.pdf']
    },
    equipements: {
      id: 'equipements',
      name: 'Équipements',
      parent: 'root',
      subfolders: ['manuels', 'maintenances', 'assurances'],
      files: ['inventaire-complet.xlsx', 'planning-maintenance.pdf']
    }
  };

  // Données simulées de fichiers
  const files = [
    {
      id: 'F001',
      name: 'Contrat Mairie Lyon 2024.pdf',
      type: 'document',
      extension: 'pdf',
      size: 2456789,
      folder: 'mairie-lyon',
      created: new Date('2024-01-15'),
      modified: new Date('2024-08-05'),
      owner: 'Marc Leblanc',
      permissions: 'admin',
      shared: true,
      sharedWith: ['Paul Moreau', 'Luc Bernard'],
      tags: ['contrat', 'important', '2024'],
      favorite: true,
      downloads: 23,
      views: 67,
      description: 'Contrat annuel pour l\'entretien des espaces verts municipaux',
      version: '3.2',
      thumbnail: null,
      locked: false,
      encrypted: true,
      backup: true,
      cloudSync: true,
      versions: [
        { id: 'v3.2', date: '2024-08-05', size: 2456789, author: 'Marc Leblanc', comment: 'Ajout clause spéciale' },
        { id: 'v3.1', date: '2024-07-20', size: 2445123, author: 'Marc Leblanc', comment: 'Correction tarifs' },
        { id: 'v3.0', date: '2024-06-15', size: 2398456, author: 'Paul Moreau', comment: 'Version initiale 2024' }
      ],
      ocrText: 'Contrat d\'entretien des espaces verts - Ville de Lyon\nArticle 1: Prestations\n- Tonte des pelouses hebdomadaire\n- Taille des haies mensuellement\n- Entretien des massifs...',
      shareLinks: []
    },
    {
      id: 'F002',
      name: 'Photos Intervention Parc Tête d\'Or',
      type: 'folder',
      extension: 'folder',
      size: 0,
      folder: 'projets',
      created: new Date('2024-07-20'),
      modified: new Date('2024-08-10'),
      owner: 'Paul Moreau',
      permissions: 'write',
      shared: false,
      sharedWith: [],
      tags: ['photos', 'parc', 'intervention'],
      favorite: false,
      downloads: 0,
      views: 12,
      description: 'Collection de photos avant/après intervention',
      version: null,
      thumbnail: null,
      locked: false,
      encrypted: false,
      backup: true,
      cloudSync: true,
      filesCount: 45
    },
    {
      id: 'F003',
      name: 'Présentation Entreprise 2024.pptx',
      type: 'presentation',
      extension: 'pptx',
      size: 8956123,
      folder: 'root',
      created: new Date('2024-02-01'),
      modified: new Date('2024-07-15'),
      owner: 'Marc Leblanc',
      permissions: 'admin',
      shared: true,
      sharedWith: ['Équipe commerciale'],
      tags: ['presentation', 'commercial', 'entreprise'],
      favorite: true,
      downloads: 156,
      views: 234,
      description: 'Présentation officielle de l\'entreprise pour les clients',
      version: '2.1',
      thumbnail: '/thumbnails/presentation-thumb.jpg',
      locked: false,
      encrypted: false,
      backup: true,
      cloudSync: true,
      versions: [
        { id: 'v2.1', date: '2024-07-15', size: 8956123, author: 'Marc Leblanc', comment: 'Mise à jour slides marché' },
        { id: 'v2.0', date: '2024-05-10', size: 8745632, author: 'Paul Moreau', comment: 'Refonte complète' }
      ],
      ocrText: null,
      shareLinks: [
        { id: 'sh1', url: 'https://share.pousse.com/pres2024/aGh2X9k', expires: '2024-09-15', views: 45, password: true }
      ]
    },
    {
      id: 'F004',
      name: 'Manuel Nacelle MX200.pdf',
      type: 'manual',
      extension: 'pdf',
      size: 15678901,
      folder: 'equipements',
      created: new Date('2023-03-15'),
      modified: new Date('2023-03-15'),
      owner: 'Jean Durand',
      permissions: 'read',
      shared: true,
      sharedWith: ['Tous les utilisateurs'],
      tags: ['manuel', 'nacelle', 'sécurité'],
      favorite: false,
      downloads: 89,
      views: 123,
      description: 'Manuel d\'utilisation et de sécurité de la nacelle',
      version: '1.0',
      thumbnail: null,
      locked: true,
      encrypted: false,
      backup: true,
      cloudSync: true,
      versions: [
        { id: 'v1.0', date: '2023-03-15', size: 15678901, author: 'Jean Durand', comment: 'Version constructeur' }
      ],
      ocrText: 'MANUEL NACELLE MX200\nSÉCURITÉ ET UTILISATION\n\nChapitre 1: Consignes de sécurité\n- Port du harnais obligatoire\n- Vérification avant utilisation\n- Charge maximale 200kg...',
      shareLinks: [
        { id: 'sh2', url: 'https://share.pousse.com/manual/bT8wQ3r', expires: null, views: 89, password: false }
      ]
    },
    {
      id: 'F005',
      name: 'Vidéo Formation Élagage.mp4',
      type: 'video',
      extension: 'mp4',
      size: 456789012,
      folder: 'admin',
      created: new Date('2024-06-01'),
      modified: new Date('2024-06-01'),
      owner: 'Marc Leblanc',
      permissions: 'admin',
      shared: false,
      sharedWith: [],
      tags: ['formation', 'élagage', 'sécurité'],
      favorite: false,
      downloads: 34,
      views: 78,
      description: 'Vidéo de formation pour les techniques d\'élagage',
      version: '1.0',
      thumbnail: '/thumbnails/video-formation.jpg',
      locked: false,
      encrypted: true,
      backup: false,
      cloudSync: false,
      duration: '45:23'
    },
    {
      id: 'F006',
      name: 'Devis Château Fontaines.xlsx',
      type: 'spreadsheet',
      extension: 'xlsx',
      size: 3456789,
      folder: 'projets',
      created: new Date('2024-08-01'),
      modified: new Date('2024-08-11'),
      owner: 'Paul Moreau',
      permissions: 'write',
      shared: true,
      sharedWith: ['Marc Leblanc', 'Comptabilité'],
      tags: ['devis', 'château', 'premium'],
      favorite: true,
      downloads: 12,
      views: 34,
      description: 'Devis détaillé pour l\'aménagement du parc du château',
      version: '1.3',
      thumbnail: null,
      locked: false,
      encrypted: true,
      backup: true,
      cloudSync: true
    },
    {
      id: 'F007',
      name: 'Photos Client Villa Beausoleil',
      type: 'folder',
      extension: 'folder',
      size: 0,
      folder: 'clients',
      created: new Date('2024-05-15'),
      modified: new Date('2024-08-08'),
      owner: 'Luc Bernard',
      permissions: 'write',
      shared: true,
      sharedWith: ['Client'],
      tags: ['photos', 'villa', 'avant-après'],
      favorite: false,
      downloads: 0,
      views: 56,
      description: 'Photos du projet d\'aménagement de la villa',
      version: null,
      thumbnail: '/thumbnails/villa-photos.jpg',
      locked: false,
      encrypted: false,
      backup: true,
      cloudSync: true,
      filesCount: 23
    },
    {
      id: 'F008',
      name: 'Rapport Maintenance Mensuel.docx',
      type: 'document',
      extension: 'docx',
      size: 1234567,
      folder: 'equipements',
      created: new Date('2024-08-01'),
      modified: new Date('2024-08-10'),
      owner: 'Jean Durand',
      permissions: 'write',
      shared: false,
      sharedWith: [],
      tags: ['maintenance', 'rapport', 'mensuel'],
      favorite: false,
      downloads: 5,
      views: 15,
      description: 'Rapport de maintenance des équipements - Août 2024',
      version: '1.1',
      thumbnail: null,
      locked: false,
      encrypted: false,
      backup: true,
      cloudSync: true
    }
  ];

  // Filtrage des fichiers selon le dossier et les filtres
  const filteredFiles = files.filter(file => {
    const matchesSearch = !searchTerm || 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || file.type === selectedType;
    const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
    
    return matchesSearch && matchesType && matchesFolder;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch(sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'size': return b.size - a.size;
      case 'modified': return new Date(b.modified) - new Date(a.modified);
      case 'downloads': return b.downloads - a.downloads;
      default: return 0;
    }
  });

  // Statistiques
  const stats = {
    total: files.length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
    shared: files.filter(f => f.shared).length,
    favorites: files.filter(f => f.favorite).length,
    encrypted: files.filter(f => f.encrypted).length,
    totalViews: files.reduce((sum, f) => sum + f.views, 0),
    totalDownloads: files.reduce((sum, f) => sum + f.downloads, 0)
  };

  const getFileIcon = (type) => {
    switch(type) {
      case 'document': return DocumentTextIcon;
      case 'spreadsheet': return DocumentIcon;
      case 'presentation': return DocumentIcon;
      case 'video': return VideoCameraIcon;
      case 'photo': return PhotoIcon;
      case 'folder': return FolderIcon;
      case 'manual': return DocumentTextIcon;
      case 'archive': return ArchiveBoxIcon;
      default: return DocumentIcon;
    }
  };

  const getFileTypeColor = (type) => {
    switch(type) {
      case 'document': return 'text-blue-600 bg-blue-100';
      case 'spreadsheet': return 'text-green-600 bg-green-100';
      case 'presentation': return 'text-orange-600 bg-orange-100';
      case 'video': return 'text-purple-600 bg-purple-100';
      case 'photo': return 'text-pink-600 bg-pink-100';
      case 'folder': return 'text-yellow-600 bg-yellow-100';
      case 'manual': return 'text-gray-600 bg-gray-100';
      case 'archive': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (fileId) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };

  const handleFolderNavigation = (folderId) => {
    setSelectedFolder(folderId);
    const folder = folders[folderId];
    if (folder) {
      const pathToFolder = [];
      let current = folder;
      while (current) {
        pathToFolder.unshift(current.name);
        current = current.parent ? folders[current.parent] : null;
      }
      setCurrentPath(pathToFolder);
    }
  };
  
  // Gestion du drag & drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragCounter(dragCounter + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragCounter(dragCounter - 1);
    if (dragCounter - 1 === 0) {
      setIsDragging(false);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setDragCounter(0);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleMultipleUpload(droppedFiles);
  };
  
  // Upload multiple avec barre de progression
  const handleMultipleUpload = (filesList) => {
    filesList.forEach((file, index) => {
      const fileId = `upload-${Date.now()}-${index}`;
      
      // Simulation de l'upload avec progression
      setUploadProgress(prev => ({ ...prev, [fileId]: { name: file.name, progress: 0 } }));
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[fileId];
          if (current && current.progress < 100) {
            return {
              ...prev,
              [fileId]: { ...current, progress: current.progress + Math.random() * 15 }
            };
          } else {
            clearInterval(interval);
            // Supprimer de la liste après 2 secondes
            setTimeout(() => {
              setUploadProgress(prev => {
                const newState = { ...prev };
                delete newState[fileId];
                return newState;
              });
            }, 2000);
            return prev;
          }
        });
      }, 200);
    });
  };
  
  // Générer un lien de partage sécurisé
  const generateShareLink = (fileId, password = false, expiryDays = 30) => {
    const shareId = Math.random().toString(36).substr(2, 8);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    return {
      id: shareId,
      url: `https://share.pousse.com/file/${shareId}`,
      expires: expiryDays ? expiryDate.toISOString().split('T')[0] : null,
      views: 0,
      password
    };
  };
  
  // Simulation OCR
  const extractTextFromFile = (file) => {
    // Simulation d'extraction OCR
    const sampleTexts = {
      'pdf': 'Texte extrait du PDF : Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      'jpg': 'Texte détecté dans l\'image : Facture N° 2024-001, Montant: 1250€...',
      'png': 'OCR Image : Plan d\'aménagement - Zone A: Pelouse, Zone B: Massifs...'
    };
    
    setTimeout(() => {
      const extractedText = sampleTexts[file.extension] || 'Aucun texte détectable';
      // Mise à jour du fichier avec le texte OCR
      console.log('Texte extrait:', extractedText);
    }, 2000);
  };
  
  // Prévisualisation inline
  const getFilePreview = (file) => {
    switch(file.type) {
      case 'document':
      case 'presentation':
      case 'spreadsheet':
        return {
          type: 'office',
          content: `Prévisualisation de ${file.name}\n\nContenu simulé du document...`
        };
      case 'video':
        return {
          type: 'video',
          content: file.thumbnail || '/placeholder-video.jpg'
        };
      case 'photo':
        return {
          type: 'image',
          content: file.thumbnail || '/placeholder-image.jpg'
        };
      default:
        return {
          type: 'text',
          content: file.ocrText || 'Prévisualisation non disponible'
        };
    }
  };

  return (
    <UltraPremiumContainer
      title="Gestionnaire de Fichiers Quantum"
      icon={FolderIcon}
    >
      <div 
        ref={dropZoneRef}
        className={`space-y-6 relative ${
          isDragging ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl' : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Zone de drop overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm rounded-xl z-40 flex items-center justify-center">
            <div className="text-center">
              <CloudArrowUpIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <p className="text-xl font-bold text-blue-700">Déposez vos fichiers ici</p>
              <p className="text-blue-600">Upload multiple supporté</p>
            </div>
          </div>
        )}
        
        {/* Indicateurs d'upload en cours */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {Object.entries(uploadProgress).map(([id, upload]) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="bg-white rounded-lg shadow-lg p-4 min-w-80"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium truncate">{upload.name}</span>
                  <span className="text-sm text-gray-500">{Math.round(upload.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${upload.progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <motion.div 
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Fichiers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <DocumentIcon className="w-8 h-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Taille Total</p>
                <p className="text-2xl font-bold">{(stats.totalSize/(1024*1024*1024)).toFixed(1)}GB</p>
              </div>
              <ServerIcon className="w-8 h-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Partagés</p>
                <p className="text-2xl font-bold">{stats.shared}</p>
              </div>
              <ShareIcon className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Favoris</p>
                <p className="text-2xl font-bold">{stats.favorites}</p>
              </div>
              <StarIcon className="w-8 h-8 text-yellow-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Chiffrés</p>
                <p className="text-2xl font-bold">{stats.encrypted}</p>
              </div>
              <LockClosedIcon className="w-8 h-8 text-red-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Vues</p>
                <p className="text-2xl font-bold">{stats.totalViews}</p>
              </div>
              <EyeIcon className="w-8 h-8 text-indigo-200" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm">Téléch.</p>
                <p className="text-2xl font-bold">{stats.totalDownloads}</p>
              </div>
              <DocumentArrowDownIcon className="w-8 h-8 text-teal-200" />
            </div>
          </motion.div>
        </div>

        {/* Fil d'ariane */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white rounded-lg p-3 shadow">
          <HomeIcon className="w-4 h-4" />
          {currentPath.map((folder, index) => (
            <div key={index} className="flex items-center space-x-2">
              {index > 0 && <ChevronRightIcon className="w-4 h-4 text-gray-400" />}
              <button 
                className="hover:text-blue-600 transition-colors"
                onClick={() => index === 0 ? handleFolderNavigation('root') : null}
              >
                {folder}
              </button>
            </div>
          ))}
        </div>

        {/* Barre d'outils */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher fichiers et dossiers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Tous types</option>
                <option value="document">Documents</option>
                <option value="spreadsheet">Feuilles de calcul</option>
                <option value="presentation">Présentations</option>
                <option value="video">Vidéos</option>
                <option value="photo">Photos</option>
                <option value="folder">Dossiers</option>
              </select>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="name">Nom</option>
                <option value="size">Taille</option>
                <option value="modified">Date modif.</option>
                <option value="downloads">Téléchargements</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <ListBulletIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded ${viewMode === 'table' ? 'bg-white shadow' : ''}`}
                >
                  <TableCellsIcon className="w-4 h-4" />
                </button>
              </div>

              {selectedFiles.length > 0 && (
                <div className="flex space-x-2">
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <ShareIcon className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <DocumentArrowDownIcon className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <CloudArrowUpIcon className="w-5 h-5" />
                <span>Upload</span>
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => handleMultipleUpload(Array.from(e.target.files))}
              />

              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                <PlusIcon className="w-5 h-5" />
                <span>Nouveau</span>
              </button>
              
              {selectedFiles.length === 1 && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      const file = files.find(f => f.id === selectedFiles[0]);
                      setSelectedFile(file);
                      setShowVersionModal(true);
                    }}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1"
                  >
                    <DocumentDuplicateIcon className="w-4 h-4" />
                    <span>Versions</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      const file = files.find(f => f.id === selectedFiles[0]);
                      setSelectedFile(file);
                      setShowShareModal(true);
                    }}
                    className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-1"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Partager</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      const file = files.find(f => f.id === selectedFiles[0]);
                      if (file && (file.extension === 'pdf' || ['jpg', 'png'].includes(file.extension))) {
                        setSelectedFile(file);
                        setShowOcrModal(true);
                      }
                    }}
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-1"
                  >
                    <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                    <span>OCR</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dossiers rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(folders).slice(1, 7).map(([folderId, folder]) => (
            <motion.button
              key={folderId}
              className="p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-left"
              whileHover={{ scale: 1.02 }}
              onClick={() => handleFolderNavigation(folderId)}
            >
              <div className="flex items-center space-x-3">
                <FolderIcon className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">{folder.name}</p>
                  <p className="text-sm text-gray-500">
                    {(folder.subfolders?.length || 0) + (folder.files?.length || 0)} éléments
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Vue en grille */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedFiles.map((file, index) => {
              const FileIcon = getFileIcon(file.type);
              const isSelected = selectedFiles.includes(file.id);
              return (
                <motion.div
                  key={file.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleFileSelect(file.id)}
                >
                  {/* Thumbnail ou icône */}
                  <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                    {file.thumbnail ? (
                      <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <FileIcon className="w-16 h-16 text-gray-500" />
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex space-x-1">
                      {file.favorite && <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />}
                      {file.shared && <ShareIcon className="w-4 h-4 text-blue-500" />}
                      {file.encrypted && <LockClosedIcon className="w-4 h-4 text-red-500" />}
                      {file.cloudSync && <CloudIcon className="w-4 h-4 text-green-500" />}
                      {file.versions && file.versions.length > 1 && (
                        <div className="bg-purple-500 text-white rounded-full px-1 py-0.5 text-xs font-bold">
                          v{file.versions.length}
                        </div>
                      )}
                      {file.ocrText && <DocumentMagnifyingGlassIcon className="w-4 h-4 text-orange-500" />}
                    </div>

                    {/* Type badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getFileTypeColor(file.type)}`}>
                        {file.extension.toUpperCase()}
                      </span>
                    </div>

                    {/* Checkbox */}
                    <div className="absolute bottom-2 left-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleFileSelect(file.id)}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {file.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{file.modified.toLocaleDateString('fr-FR')}</span>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{file.owner}</span>
                        <div className="flex space-x-2">
                          <span>👁 {file.views}</span>
                          <span>⬇ {file.downloads}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {file.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {file.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                          {file.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{file.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-4 flex justify-between">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file);
                        setShowPreviewModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                      title="Prévisualisation"
                    >
                      <EyeIcon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group" title="Télécharger">
                      <DocumentArrowDownIcon className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file);
                        setShowShareModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                      title="Partager"
                    >
                      <ShareIcon className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file);
                        setShowVersionModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                      title="Versions"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4 text-gray-600 group-hover:text-orange-600" />
                    </button>
                    {file.ocrText && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(file);
                          setShowOcrModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                        title="Voir texte OCR"
                      >
                        <DocumentMagnifyingGlassIcon className="w-4 h-4 text-gray-600 group-hover:text-yellow-600" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Vue tableau */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propriétaire</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modifié</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedFiles.map((file, index) => {
                    const FileIcon = getFileIcon(file.type);
                    const isSelected = selectedFiles.includes(file.id);
                    return (
                      <motion.tr
                        key={file.id}
                        className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleFileSelect(file.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileIcon className="w-6 h-6 text-gray-600 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{file.name}</div>
                              <div className="text-sm text-gray-500">{file.version && `v${file.version}`}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFileTypeColor(file.type)}`}>
                            {file.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {file.owner}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {file.modified.toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            {file.shared && <ShareIcon className="w-4 h-4 text-blue-500" />}
                            {file.favorite && <StarIcon className="w-4 h-4 text-yellow-500" />}
                            {file.encrypted && <LockClosedIcon className="w-4 h-4 text-red-500" />}
                            {file.cloudSync && <CloudIcon className="w-4 h-4 text-green-500" />}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button className="text-gray-600 hover:text-blue-600">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-blue-600">
                            <DocumentArrowDownIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-blue-600">
                            <ShareIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-blue-600">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Modal de prévisualisation */}
        {showPreviewModal && selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Prévisualisation - {selectedFile.name}</h2>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {(() => {
                  const preview = getFilePreview(selectedFile);
                  switch(preview.type) {
                    case 'image':
                      return (
                        <div className="text-center">
                          <img 
                            src={preview.content} 
                            alt={selectedFile.name}
                            className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                          />
                        </div>
                      );
                    case 'video':
                      return (
                        <div className="text-center">
                          <div className="bg-gray-100 rounded-lg p-8">
                            <PlayIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Prévisualisation vidéo - {selectedFile.duration || 'Durée inconnue'}</p>
                          </div>
                        </div>
                      );
                    case 'office':
                      return (
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <DocumentTextIcon className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                              <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
                              <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)} • {selectedFile.version}</p>
                            </div>
                          </div>
                          <div className="bg-white rounded border p-4 max-h-64 overflow-y-auto">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{preview.content}</pre>
                          </div>
                        </div>
                      );
                    default:
                      return (
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="text-center">
                            <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">{preview.content}</p>
                          </div>
                        </div>
                      );
                  }
                })()}
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Télécharger
                </button>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Modal de gestion des versions */}
        {showVersionModal && selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowVersionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Historique des Versions</h2>
                  <p className="text-gray-600">{selectedFile.name}</p>
                </div>
                <button
                  onClick={() => setShowVersionModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {selectedFile.versions?.map((version, index) => (
                    <motion.div
                      key={version.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer
                        ${index === 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'}
                      `}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                          ${index === 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                        `}>
                          {version.id}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{version.comment}</p>
                          <p className="text-sm text-gray-600">
                            Par {version.author} • {new Date(version.date).toLocaleDateString('fr-FR')} • {formatFileSize(version.size)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {index === 0 && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            Actuelle
                          </span>
                        )}
                        <div className="flex space-x-1">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Télécharger">
                            <DocumentArrowDownIcon className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Comparer">
                            <DocumentDuplicateIcon className="w-4 h-4 text-gray-600" />
                          </button>
                          {index !== 0 && (
                            <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Restaurer">
                              <ArrowPathIcon className="w-4 h-4 text-blue-600" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Ajouter Nouvelle Version
                </button>
                <button 
                  onClick={() => setShowVersionModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Modal de partage sécurisé */}
        {showShareModal && selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Partage Sécurisé</h2>
                  <p className="text-gray-600">{selectedFile.name}</p>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Liens existants */}
                {selectedFile.shareLinks && selectedFile.shareLinks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Liens actifs</h3>
                    <div className="space-y-3">
                      {selectedFile.shareLinks.map(link => (
                        <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <LinkIcon className="w-4 h-4 text-blue-600" />
                              <code className="text-sm bg-white px-2 py-1 rounded border">{link.url}</code>
                              {link.password && <KeyIcon className="w-4 h-4 text-orange-500" />}
                            </div>
                            <p className="text-xs text-gray-600">
                              {link.views} vues • {link.expires ? `Expire le ${link.expires}` : 'Permanent'}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-1 hover:bg-gray-200 rounded" title="Copier">
                              <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-red-200 rounded" title="Supprimer">
                              <TrashIcon className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Créer nouveau lien */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Générer nouveau lien</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiration</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="7">7 jours</option>
                        <option value="30">30 jours</option>
                        <option value="90">90 jours</option>
                        <option value="0">Jamais</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sécurité</label>
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Mot de passe</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Notifications</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Cloud Storage */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Stockage Cloud</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Google Drive', icon: '📁', color: 'bg-blue-50 border-blue-200' },
                      { name: 'Dropbox', icon: '📦', color: 'bg-purple-50 border-purple-200' },
                      { name: 'OneDrive', icon: '☁️', color: 'bg-green-50 border-green-200' }
                    ].map(service => (
                      <button
                        key={service.name}
                        className={`p-3 border-2 rounded-lg transition-all hover:scale-105 ${service.color}`}
                      >
                        <div className="text-2xl mb-1">{service.icon}</div>
                        <p className="text-sm font-medium">{service.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  onClick={() => {
                    const newLink = generateShareLink(selectedFile.id, false, 30);
                    console.log('Nouveau lien:', newLink);
                    alert(`Lien généré : ${newLink.url}`);
                  }}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Générer Lien</span>
                </button>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Modal OCR */}
        {showOcrModal && selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOcrModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Extraction de Texte (OCR)</h2>
                  <p className="text-gray-600">{selectedFile.name}</p>
                </div>
                <button
                  onClick={() => setShowOcrModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Aperçu du fichier */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Aperçu</h3>
                    <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center h-64">
                      {selectedFile.thumbnail ? (
                        <img src={selectedFile.thumbnail} alt={selectedFile.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="text-center">
                          <DocumentMagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Fichier {selectedFile.extension.toUpperCase()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Texte extrait */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Texte Extrait</h3>
                    <div className="bg-gray-50 border rounded-lg h-64 overflow-y-auto">
                      {selectedFile.ocrText ? (
                        <div className="p-4">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedFile.ocrText}</pre>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <BeakerIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">Cliquez sur \'Extraire\' pour lancer l\'OCR</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Options OCR */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Options d\'extraction</h4>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Détection automatique de langue</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Conserver la mise en forme</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Extraire les tableaux</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                <div className="flex space-x-3">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      extractTextFromFile(selectedFile);
                      alert('Extraction OCR lancée ! Le texte sera disponible dans quelques secondes.');
                    }}
                  >
                    Extraire le Texte
                  </button>
                  {selectedFile.ocrText && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Copier le Texte
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => setShowOcrModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </UltraPremiumContainer>
  );
};

export default FichiersUltraPremium;