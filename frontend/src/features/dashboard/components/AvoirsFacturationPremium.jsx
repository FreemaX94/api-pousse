import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentMinusIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PaperClipIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  UserIcon,
  BuildingOfficeIcon,
  TagIcon,
  DocumentTextIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  DocumentDuplicateIcon,
  PaperAirplaneIcon,
  CalculatorIcon,
  ReceiptPercentIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const AvoirsFacturationPremium = () => {
  const [avoirs, setAvoirs] = useState([
    {
      id: 1,
      numero: 'AV-2024-001',
      client: 'Tech Solutions SAS',
      auteur: 'Jean Dupont',
      commentairePrive: true,
      envoye: true,
      montantHT: 2500.00,
      montantTTC: 3000.00,
      tva: 500.00,
      dateCreation: '2024-03-15',
      dateValidite: '2024-04-15',
      statut: 'accepte',
      contrat: 'CT-2024-045',
      categorie: 'Remboursement',
      reference: 'FAC-2024-089',
      lignes: [
        { description: 'Remboursement prestation', quantite: 1, unite: 'unité', prixHT: 2500, tva: 20 }
      ]
    },
    {
      id: 2,
      numero: 'AV-2024-002',
      client: 'Green Energy Corp',
      auteur: 'Marie Martin',
      commentairePrive: false,
      envoye: false,
      montantHT: 1800.00,
      montantTTC: 2160.00,
      tva: 360.00,
      dateCreation: '2024-03-18',
      dateValidite: '2024-04-18',
      statut: 'brouillon',
      contrat: 'CT-2024-052',
      categorie: 'Réduction commerciale',
      reference: 'FAC-2024-095',
      lignes: [
        { description: 'Geste commercial', quantite: 1, unite: 'forfait', prixHT: 1800, tva: 20 }
      ]
    },
    {
      id: 3,
      numero: 'AV-2024-003',
      client: 'Design Studio',
      auteur: 'Pierre Bernard',
      commentairePrive: true,
      envoye: true,
      montantHT: 3200.00,
      montantTTC: 3840.00,
      tva: 640.00,
      dateCreation: '2024-03-20',
      dateValidite: '2024-04-20',
      statut: 'accepte',
      contrat: 'CT-2024-061',
      categorie: 'Erreur facturation',
      reference: 'FAC-2024-102',
      lignes: [
        { description: 'Correction erreur facturation', quantite: 1, unite: 'unité', prixHT: 3200, tva: 20 }
      ]
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateMin, setFilterDateMin] = useState('');
  const [filterDateMax, setFilterDateMax] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAvoir, setSelectedAvoir] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    client: '',
    contrat: '',
    categorie: '',
    rapportPersonnalise: '',
    dateAvoir: new Date().toISOString().split('T')[0],
    dateValidite: '',
    reference: '',
    commentairePublic: '',
    commentairePrive: '',
    lignes: [
      { id: 1, description: '', quantite: 1, unite: 'unité', prixHT: 0, tva: 20, reduction: 0 }
    ],
    fraisTraitement: 0,
    afficherReduction: false,
    fichiers: [],
    statut: 'brouillon'
  });

  const [totaux, setTotaux] = useState({
    totalHT: 0,
    totalTVA: 0,
    totalTTC: 0
  });

  const categories = [
    'Remboursement',
    'Réduction commerciale',
    'Erreur facturation',
    'Retour marchandise',
    'Geste commercial',
    'Annulation partielle'
  ];

  const clients = [
    'Tech Solutions SAS',
    'Green Energy Corp',
    'Design Studio',
    'Innovation Labs',
    'Digital Agency'
  ];

  const contrats = [
    'CT-2024-045',
    'CT-2024-052',
    'CT-2024-061',
    'CT-2024-073',
    'CT-2024-085'
  ];

  useEffect(() => {
    calculerTotaux();
  }, [formData.lignes, formData.fraisTraitement]);

  const calculerTotaux = () => {
    let totalHT = 0;
    let totalTVA = 0;

    formData.lignes.forEach(ligne => {
      const montantLigne = ligne.quantite * ligne.prixHT;
      const montantApresReduction = montantLigne * (1 - ligne.reduction / 100);
      totalHT += montantApresReduction;
      totalTVA += montantApresReduction * (ligne.tva / 100);
    });

    const totalTTC = totalHT + totalTVA + parseFloat(formData.fraisTraitement || 0);

    setTotaux({
      totalHT: totalHT.toFixed(2),
      totalTVA: totalTVA.toFixed(2),
      totalTTC: totalTTC.toFixed(2)
    });
  };

  const ajouterLigne = () => {
    setFormData({
      ...formData,
      lignes: [
        ...formData.lignes,
        { 
          id: formData.lignes.length + 1, 
          description: '', 
          quantite: 1, 
          unite: 'unité', 
          prixHT: 0, 
          tva: 20,
          reduction: 0
        }
      ]
    });
  };

  const supprimerLigne = (id) => {
    setFormData({
      ...formData,
      lignes: formData.lignes.filter(ligne => ligne.id !== id)
    });
  };

  const modifierLigne = (id, field, value) => {
    setFormData({
      ...formData,
      lignes: formData.lignes.map(ligne =>
        ligne.id === id ? { ...ligne, [field]: value } : ligne
      )
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      fichiers: [...formData.fichiers, ...files]
    });
  };

  const getStatutColor = (statut) => {
    switch(statut) {
      case 'accepte': return 'bg-green-100 text-green-800 border-green-300';
      case 'brouillon': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'annule': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatutIcon = (statut) => {
    switch(statut) {
      case 'accepte': return <CheckCircleIcon className="w-4 h-4" />;
      case 'brouillon': return <ClockIcon className="w-4 h-4" />;
      case 'annule': return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const filteredAvoirs = avoirs.filter(avoir => {
    const matchSearch = avoir.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       avoir.numero.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDateMin = !filterDateMin || avoir.dateCreation >= filterDateMin;
    const matchDateMax = !filterDateMax || avoir.dateCreation <= filterDateMax;
    return matchSearch && matchDateMin && matchDateMax;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAvoirs.length / itemsPerPage);
  const paginatedAvoirs = filteredAvoirs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: avoirs.length,
    montantTotal: avoirs.reduce((acc, avoir) => acc + avoir.montantHT, 0),
    envoyes: avoirs.filter(a => a.envoye).length,
    acceptes: avoirs.filter(a => a.statut === 'accepte').length,
    enAttente: avoirs.filter(a => a.statut === 'brouillon').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header avec stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <DocumentMinusIcon className="w-8 h-8 text-red-500" />
            <span>Avoirs</span>
            <motion.span
              className="ml-2 px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              GESTION AVANCÉE
            </motion.span>
          </h1>
          <p className="text-gray-600 mt-1">Gérez vos avoirs et remboursements clients</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            onClick={() => window.print()}
          >
            <PrinterIcon className="w-5 h-5" />
            <span>Imprimer</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>Exporter</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Ajouter un avoir</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-4 text-white"
        >
          <DocumentMinusIcon className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm opacity-80">Total avoirs</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl p-4 text-white"
        >
          <CurrencyEuroIcon className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{(stats.montantTotal/1000).toFixed(1)}k€</p>
          <p className="text-sm opacity-80">Montant total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-4 text-white"
        >
          <PaperAirplaneIcon className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{stats.envoyes}</p>
          <p className="text-sm opacity-80">Envoyés</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white"
        >
          <CheckCircleIcon className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{stats.acceptes}</p>
          <p className="text-sm opacity-80">Acceptés</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl p-4 text-white"
        >
          <ClockIcon className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-2xl font-bold">{stats.enAttente}</p>
          <p className="text-sm opacity-80">En attente</p>
        </motion.div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par client ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                showFilters ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filtres</span>
            </button>
          </div>

          <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Contrats acceptés, moi →
          </a>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t flex items-center space-x-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date min</label>
              <input
                type="date"
                value={filterDateMin}
                onChange={(e) => setFilterDateMin(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date max</label>
              <input
                type="date"
                value={filterDateMax}
                onChange={(e) => setFilterDateMax(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={() => {
                setFilterDateMin('');
                setFilterDateMax('');
                setSearchTerm('');
              }}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Réinitialiser
            </button>
          </motion.div>
        )}
      </div>

      {/* Tableau des avoirs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° / Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auteur
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comm. privé
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Envoyé ?
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant HT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {paginatedAvoirs.map((avoir, index) => (
                  <motion.tr
                    key={avoir.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{avoir.numero}</div>
                        <div className="text-sm text-gray-500">{avoir.client}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                          {avoir.auteur.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-900">{avoir.auteur}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={avoir.commentairePrive}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        disabled
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {avoir.envoye ? (
                        <CheckCircleSolid className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {avoir.montantHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </div>
                      <div className="text-xs text-gray-500">
                        TTC: {avoir.montantTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatutColor(avoir.statut)}`}>
                        {getStatutIcon(avoir.statut)}
                        <span>{avoir.statut === 'accepte' ? 'Accepté' : avoir.statut === 'brouillon' ? 'Brouillon' : 'Annulé'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <EyeIcon className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <PencilIcon className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredAvoirs.length)} sur {filteredAvoirs.length} avoirs
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === i + 1
                    ? 'bg-red-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Ajouter un avoir */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <DocumentMinusIcon className="w-6 h-6 text-red-500" />
                    <span>Ajouter un avoir</span>
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Informations générales */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-600" />
                    <span>Informations générales</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client *
                      </label>
                      <div className="flex space-x-2">
                        <select
                          value={formData.client}
                          onChange={(e) => setFormData({...formData, client: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Sélectionner un client</option>
                          {clients.map(client => (
                            <option key={client} value={client}>{client}</option>
                          ))}
                        </select>
                        <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <PlusIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contrat
                      </label>
                      <select
                        value={formData.contrat}
                        onChange={(e) => setFormData({...formData, contrat: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Sélectionner un contrat</option>
                        {contrats.map(contrat => (
                          <option key={contrat} value={contrat}>{contrat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie
                      </label>
                      <div className="flex items-center space-x-2">
                        <select
                          value={formData.categorie}
                          onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm whitespace-nowrap">
                          + Ajouter
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rapport personnalisé
                      </label>
                      <input
                        type="text"
                        value={formData.rapportPersonnalise}
                        onChange={(e) => setFormData({...formData, rapportPersonnalise: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Rapport personnalisé"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de l'avoir *
                      </label>
                      <input
                        type="date"
                        value={formData.dateAvoir}
                        onChange={(e) => setFormData({...formData, dateAvoir: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date limite de validité
                      </label>
                      <input
                        type="date"
                        value={formData.dateValidite}
                        onChange={(e) => setFormData({...formData, dateValidite: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Référence
                      </label>
                      <input
                        type="text"
                        value={formData.reference}
                        onChange={(e) => setFormData({...formData, reference: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Référence de la facture d'origine"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commentaire public
                      </label>
                      <textarea
                        value={formData.commentairePublic}
                        onChange={(e) => setFormData({...formData, commentairePublic: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows="3"
                        placeholder="Commentaire visible sur l'avoir"
                      />
                    </div>
                  </div>
                </div>

                {/* Lignes de l'avoir */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                      <span>Détail de l'avoir</span>
                    </h3>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.afficherReduction}
                        onChange={(e) => setFormData({...formData, afficherReduction: e.target.checked})}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Afficher colonne réduction</span>
                    </label>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Quantité</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Unité</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Prix HT</th>
                          {formData.afficherReduction && (
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Réduction %</th>
                          )}
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">TVA %</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Total HT</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {formData.lignes.map((ligne) => (
                          <tr key={ligne.id}>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={ligne.description}
                                onChange={(e) => modifierLigne(ligne.id, 'description', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                                placeholder="Description"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={ligne.quantite}
                                onChange={(e) => modifierLigne(ligne.id, 'quantite', parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <select
                                value={ligne.unite}
                                onChange={(e) => modifierLigne(ligne.id, 'unite', e.target.value)}
                                className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                              >
                                <option value="unité">unité</option>
                                <option value="heure">heure</option>
                                <option value="jour">jour</option>
                                <option value="forfait">forfait</option>
                                <option value="m²">m²</option>
                                <option value="ml">ml</option>
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={ligne.prixHT}
                                onChange={(e) => modifierLigne(ligne.id, 'prixHT', parseFloat(e.target.value) || 0)}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                                step="0.01"
                              />
                            </td>
                            {formData.afficherReduction && (
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  value={ligne.reduction}
                                  onChange={(e) => modifierLigne(ligne.id, 'reduction', parseFloat(e.target.value) || 0)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                                  min="0"
                                  max="100"
                                />
                              </td>
                            )}
                            <td className="px-4 py-2">
                              <select
                                value={ligne.tva}
                                onChange={(e) => modifierLigne(ligne.id, 'tva', parseFloat(e.target.value))}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                              >
                                <option value="0">0%</option>
                                <option value="5.5">5.5%</option>
                                <option value="10">10%</option>
                                <option value="20">20%</option>
                              </select>
                            </td>
                            <td className="px-4 py-2 text-center font-medium">
                              {(ligne.quantite * ligne.prixHT * (1 - ligne.reduction / 100)).toFixed(2)} €
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                onClick={() => supprimerLigne(ligne.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={ajouterLigne}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>Ajouter une ligne</span>
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Ajouter une intervention
                    </button>
                  </div>
                </div>

                {/* Totaux */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frais de traitement TTC
                        </label>
                        <input
                          type="number"
                          value={formData.fraisTraitement}
                          onChange={(e) => setFormData({...formData, fraisTraitement: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Commentaire privé
                        </label>
                        <textarea
                          value={formData.commentairePrive}
                          onChange={(e) => setFormData({...formData, commentairePrive: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          rows="3"
                          placeholder="Note interne (non visible sur l'avoir)"
                        />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <CalculatorIcon className="w-5 h-5 text-gray-600" />
                        <span>Récapitulatif</span>
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total HT</span>
                          <span className="font-medium">{totaux.totalHT} €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">TVA</span>
                          <span className="font-medium">{totaux.totalTVA} €</span>
                        </div>
                        {formData.fraisTraitement > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Frais de traitement</span>
                            <span className="font-medium">{formData.fraisTraitement.toFixed(2)} €</span>
                          </div>
                        )}
                        <div className="pt-2 border-t">
                          <div className="flex justify-between">
                            <span className="text-lg font-semibold text-gray-900">Total TTC</span>
                            <span className="text-lg font-bold text-red-600">{totaux.totalTTC} €</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload fichiers */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <PaperClipIcon className="w-5 h-5 text-gray-600" />
                    <span>Fichiers joints</span>
                  </h3>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <label className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-medium">Cliquez pour sélectionner</span>
                      <span className="text-gray-600"> ou glissez vos fichiers ici</span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG jusqu'à 10MB</p>
                  </div>
                  
                  {formData.fichiers.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.fichiers.map((fichier, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex items-center space-x-2">
                            <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-700">{fichier.name}</span>
                            <span className="text-xs text-gray-500">({(fichier.size / 1024).toFixed(0)} KB)</span>
                          </div>
                          <button
                            onClick={() => setFormData({
                              ...formData,
                              fichiers: formData.fichiers.filter((_, i) => i !== index)
                            })}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setFormData({...formData, statut: 'brouillon'})}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        formData.statut === 'brouillon'
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Brouillon
                    </button>
                    <button
                      onClick={() => setFormData({...formData, statut: 'accepte'})}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        formData.statut === 'accepte'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Accepté
                    </button>
                    <button
                      onClick={() => setFormData({...formData, statut: 'annule'})}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        formData.statut === 'annule'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Annulé
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2">
                      <CheckIcon className="w-5 h-5" />
                      <span>Créer l'avoir</span>
                    </button>
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

export default AvoirsFacturationPremium;