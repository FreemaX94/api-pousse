import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentIcon,
  FolderIcon,
  FolderOpenIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EllipsisVerticalIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  TrashIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  LockClosedIcon,
  ClockIcon,
  TagIcon,
  UserGroupIcon,
  EyeIcon,
  PhotoIcon,
  DocumentTextIcon,
  TableCellsIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  PlusIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const FichiersPremium = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState('grid');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState(['root']);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const folderStructure = {
    id: 'root',
    name: 'Documents',
    type: 'folder',
    children: [
      {
        id: 'clients',
        name: 'Clients',
        type: 'folder',
        icon: '👥',
        files: 45,
        size: '2.3 GB',
        children: [
          {
            id: 'contracts',
            name: 'Contrats',
            type: 'folder',
            icon: '📋',
            files: 23,
            size: '850 MB'
          },
          {
            id: 'invoices',
            name: 'Factures',
            type: 'folder',
            icon: '💰',
            files: 22,
            size: '1.5 GB'
          }
        ]
      },
      {
        id: 'projects',
        name: 'Projets',
        type: 'folder',
        icon: '🚀',
        files: 67,
        size: '4.7 GB',
        children: [
          {
            id: 'proj2024',
            name: 'Projets 2024',
            type: 'folder',
            icon: '📅',
            files: 34,
            size: '2.1 GB'
          },
          {
            id: 'archives',
            name: 'Archives',
            type: 'folder',
            icon: '📦',
            files: 33,
            size: '2.6 GB'
          }
        ]
      },
      {
        id: 'media',
        name: 'Médias',
        type: 'folder',
        icon: '🎨',
        files: 128,
        size: '8.9 GB'
      }
    ]
  };

  const recentFiles = [
    {
      id: 1,
      name: 'Contrat_Client_TechSolutions.pdf',
      type: 'pdf',
      size: '2.4 MB',
      modified: '2024-03-20 14:30',
      modifiedBy: 'Jean Dupont',
      version: 'v3.2',
      status: 'approved',
      tags: ['Important', 'Client', 'Contrat'],
      starred: true,
      shared: ['Marie Martin', 'Pierre Bernard'],
      preview: true,
      icon: '📄'
    },
    {
      id: 2,
      name: 'Présentation_Q1_2024.pptx',
      type: 'presentation',
      size: '15.8 MB',
      modified: '2024-03-19 09:15',
      modifiedBy: 'Marie Martin',
      version: 'v2.0',
      status: 'draft',
      tags: ['Présentation', 'Q1'],
      starred: false,
      shared: ['Jean Dupont'],
      preview: true,
      icon: '📊'
    },
    {
      id: 3,
      name: 'Budget_Previsionnel_2024.xlsx',
      type: 'spreadsheet',
      size: '4.2 MB',
      modified: '2024-03-18 16:45',
      modifiedBy: 'Pierre Bernard',
      version: 'v1.5',
      status: 'in_review',
      tags: ['Finance', 'Budget'],
      starred: true,
      shared: [],
      preview: true,
      icon: '📈'
    },
    {
      id: 4,
      name: 'Logo_Entreprise_Final.png',
      type: 'image',
      size: '856 KB',
      modified: '2024-03-17 11:20',
      modifiedBy: 'Sophie Leclerc',
      version: 'v4.0',
      status: 'approved',
      tags: ['Design', 'Logo'],
      starred: false,
      shared: ['Marketing Team'],
      preview: true,
      icon: '🎨'
    }
  ];

  const getFileTypeIcon = (type) => {
    const icons = {
      pdf: <DocumentTextIcon className="w-5 h-5" />,
      image: <PhotoIcon className="w-5 h-5" />,
      spreadsheet: <TableCellsIcon className="w-5 h-5" />,
      presentation: <DocumentIcon className="w-5 h-5" />,
      video: <VideoCameraIcon className="w-5 h-5" />,
      audio: <MusicalNoteIcon className="w-5 h-5" />,
      code: <CodeBracketIcon className="w-5 h-5" />
    };
    return icons[type] || <DocumentIcon className="w-5 h-5" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      in_review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      approved: <CheckCircleIcon className="w-4 h-4" />,
      draft: <DocumentIcon className="w-4 h-4" />,
      in_review: <ClockIcon className="w-4 h-4" />,
      rejected: <XCircleIcon className="w-4 h-4" />
    };
    return icons[status] || <InformationCircleIcon className="w-4 h-4" />;
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const renderFolderTree = (folder, level = 0) => (
    <div key={folder.id} className="select-none">
      <div
        className={`flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors ${
          selectedFolder?.id === folder.id ? 'bg-purple-50 text-purple-600' : ''
        }`}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={() => {
          setSelectedFolder(folder);
          if (folder.children) toggleFolder(folder.id);
        }}
      >
        {folder.children && (
          <ChevronRightIcon
            className={`w-4 h-4 transition-transform ${
              expandedFolders.includes(folder.id) ? 'rotate-90' : ''
            }`}
          />
        )}
        {!folder.children && <div className="w-4" />}
        
        {expandedFolders.includes(folder.id) ? (
          <FolderOpenIcon className="w-5 h-5 text-yellow-500" />
        ) : (
          <FolderIcon className="w-5 h-5 text-yellow-500" />
        )}
        
        <span className="text-sm font-medium flex-1">{folder.name}</span>
        {folder.files && (
          <span className="text-xs text-gray-500">{folder.files}</span>
        )}
      </div>
      
      {folder.children && expandedFolders.includes(folder.id) && (
        <div>
          {folder.children.map(child => renderFolderTree(child, level + 1))}
        </div>
      )}
    </div>
  );

  const renderFileCard = (file) => (
    <motion.div
      key={file.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group"
      onClick={() => setSelectedFile(file)}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{file.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
              <p className="text-sm text-gray-500">{file.size}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              file.starred = !file.starred;
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {file.starred ? (
              <StarSolid className="w-5 h-5 text-yellow-500" />
            ) : (
              <StarIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(file.status)}`}>
            {getStatusIcon(file.status)}
            <span>{file.status}</span>
          </span>
          <span className="text-xs text-gray-500">v{file.version}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {file.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-3 h-3" />
            <span>{file.modified}</span>
          </div>
          <div className="flex items-center space-x-1">
            <UserGroupIcon className="w-3 h-3" />
            <span>Modifié par {file.modifiedBy}</span>
          </div>
        </div>

        {file.shared.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {file.shared.slice(0, 3).map((person, index) => (
                  <div key={index} className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600 border-2 border-white">
                    {person.charAt(0)}
                  </div>
                ))}
                {file.shared.length > 3 && (
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                    +{file.shared.length - 3}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <ArrowDownTrayIcon className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <ShareIcon className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <EyeIcon className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="flex h-full">
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <button
          onClick={() => setShowUploadModal(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300 mb-6"
        >
          <CloudArrowUpIcon className="w-5 h-5" />
          <span>Nouveau fichier</span>
        </button>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dossiers</h3>
            {renderFolderTree(folderStructure)}
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Stockage</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Utilisé</span>
                <span className="font-medium">15.9 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '63%' }}></div>
              </div>
              <p className="text-xs text-gray-500">63% de 25 GB utilisés</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Filtres rapides</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between">
                <span>Mes fichiers</span>
                <span className="text-xs text-gray-500">24</span>
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between">
                <span>Partagés avec moi</span>
                <span className="text-xs text-gray-500">18</span>
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between">
                <span>Favoris</span>
                <span className="text-xs text-gray-500">8</span>
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between">
                <span>Récents</span>
                <span className="text-xs text-gray-500">12</span>
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between text-red-600">
                <span>Corbeille</span>
                <span className="text-xs">3</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion documentaire</h1>
            <p className="text-gray-600 mt-1">Preview, versioning et gestion avancée des documents</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowPathIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-white rounded-lg transition-colors">
              <FunnelIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un fichier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedView('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  selectedView === 'grid' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setSelectedView('list')}
                className={`p-2 rounded-lg transition-colors ${
                  selectedView === 'list' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
          >
            <DocumentIcon className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">240</p>
            <p className="text-sm opacity-80">Total fichiers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-6 text-white"
          >
            <FolderIcon className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">28</p>
            <p className="text-sm opacity-80">Dossiers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl p-6 text-white"
          >
            <UserGroupIcon className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm opacity-80">Partagés</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white"
          >
            <StarIcon className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm opacity-80">Favoris</p>
          </motion.div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Fichiers récents</h2>
          <div className={selectedView === 'grid' ? 'grid grid-cols-3 gap-6' : 'space-y-4'}>
            <AnimatePresence>
              {recentFiles.map(file => renderFileCard(file))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="flex h-full">
                <div className="flex-1 p-6 border-r">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Aperçu du document</h2>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{selectedFile.icon}</div>
                      <p className="text-gray-600">Aperçu du fichier</p>
                      <p className="text-sm text-gray-500 mt-2">{selectedFile.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-80 p-6 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-4">Informations</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Nom</p>
                      <p className="font-medium">{selectedFile.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Taille</p>
                      <p className="font-medium">{selectedFile.size}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Modifié</p>
                      <p className="font-medium">{selectedFile.modified}</p>
                      <p className="text-sm text-gray-600">par {selectedFile.modifiedBy}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Version</p>
                      <p className="font-medium">{selectedFile.version}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedFile.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Partagé avec</p>
                      <div className="space-y-2">
                        {selectedFile.shared.map((person, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600">
                              {person.charAt(0)}
                            </div>
                            <span className="text-sm">{person}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-2">
                      <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        <span>Télécharger</span>
                      </button>
                      <button className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2">
                        <ShareIcon className="w-5 h-5" />
                        <span>Partager</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FichiersPremium;