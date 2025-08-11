import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CurrencyEuroIcon,
  CalendarDaysIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PrinterIcon,
  ShareIcon,
  BanknotesIcon,
  CreditCardIcon,
  BuildingOffice2Icon,
  PencilIcon
} from '@heroicons/react/24/outline';

const FacturesAcomptePremium = () => {
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEcheancier, setShowEcheancier] = useState(false);

  const facturesAcompteData = [
    {
      id: 'FAC-ACC-2024-001',
      numeroDevis: 'DEV-2024-001',
      numeroFacturePrincipale: 'FAC-2024-001',
      client: 'Villa Moderne SARL',
      contact: 'Jean Dupont',
      email: 'j.dupont@villamoderne.fr',
      adresse: '12 Rue des Jardins, 69001 Lyon',
      dateEmission: '2024-03-15',
      dateEcheance: '2024-03-30',
      datePaiement: '2024-03-14',
      status: 'paye',
      montantTotalProjet: 2940.00,
      pourcentageAcompte: 30,
      montantAcompte: 882.00,
      soldeRestant: 2058.00,
      moyenPaiement: 'virement',
      typeAcompte: 'commande',
      echeancier: [
        { etape: 'Acompte commande', pourcentage: 30, montant: 882.00, statut: 'paye', datePrevu: '2024-03-15', datePaiement: '2024-03-14' },
        { etape: 'Début travaux', pourcentage: 40, montant: 1176.00, statut: 'programme', datePrevu: '2024-04-01', datePaiement: null },
        { etape: 'Fin travaux', pourcentage: 30, montant: 882.00, statut: 'programme', datePrevu: '2024-04-15', datePaiement: null }
      ],
      services: [
        { nom: 'Taille haies de laurier', montant: 800 },
        { nom: 'Élagage arbres fruitiers', montant: 1050 },
        { nom: 'Nettoyage et évacuation', montant: 600 }
      ],
      conditionsPaiement: 'Acompte de 30% à la commande, 40% au début des travaux, solde à la livraison',
      retards: 0,
      relances: 0
    },
    {
      id: 'FAC-ACC-2024-002',
      numeroDevis: 'DEV-2024-002',
      numeroFacturePrincipale: 'FAC-2024-002',
      client: 'Résidence Harmony',
      contact: 'Sophie Martin',
      email: 's.martin@residence-harmony.fr',
      adresse: '45 Avenue des Roses, 69003 Lyon',
      dateEmission: '2024-03-18',
      dateEcheance: '2024-04-02',
      datePaiement: '2024-03-20',
      status: 'paye',
      montantTotalProjet: 10500.00,
      pourcentageAcompte: 40,
      montantAcompte: 4200.00,
      soldeRestant: 6300.00,
      moyenPaiement: 'cheque',
      typeAcompte: 'commande',
      echeancier: [
        { etape: 'Acompte commande', pourcentage: 40, montant: 4200.00, statut: 'paye', datePrevu: '2024-03-18', datePaiement: '2024-03-20' },
        { etape: 'Avancement 50%', pourcentage: 35, montant: 3675.00, statut: 'en_cours', datePrevu: '2024-04-10', datePaiement: null },
        { etape: 'Livraison finale', pourcentage: 25, montant: 2625.00, statut: 'programme', datePrevu: '2024-04-25', datePaiement: null }
      ],
      services: [
        { nom: 'Aménagement paysager complet', montant: 6000 },
        { nom: 'Installation système arrosage', montant: 2000 },
        { nom: 'Plantation arbustes décoratifs', montant: 750 }
      ],
      conditionsPaiement: 'Acompte 40% à la commande, 35% à mi-parcours, 25% à la livraison',
      retards: 0,
      relances: 0
    },
    {
      id: 'FAC-ACC-2024-003',
      numeroDevis: 'DEV-2024-005',
      numeroFacturePrincipale: null,
      client: 'Château de Versant',
      contact: 'Pierre Leroy',
      email: 'contact@chateau-versant.fr',
      adresse: '3 Rue du Château, 69130 Écully',
      dateEmission: '2024-03-25',
      dateEcheance: '2024-04-10',
      datePaiement: null,
      status: 'en_retard',
      montantTotalProjet: 25000.00,
      pourcentageAcompte: 50,
      montantAcompte: 12500.00,
      soldeRestant: 12500.00,
      moyenPaiement: null,
      typeAcompte: 'etude',
      echeancier: [
        { etape: 'Acompte étude projet', pourcentage: 50, montant: 12500.00, statut: 'en_retard', datePrevu: '2024-03-25', datePaiement: null },
        { etape: 'Validation projet', pourcentage: 30, montant: 7500.00, statut: 'programme', datePrevu: '2024-05-01', datePaiement: null },
        { etape: 'Livraison complète', pourcentage: 20, montant: 5000.00, statut: 'programme', datePrevu: '2024-06-15', datePaiement: null }
      ],
      services: [
        { nom: 'Restauration jardins historiques', montant: 20000 },
        { nom: 'Étude patrimoniale', montant: 5000 }
      ],
      conditionsPaiement: 'Acompte 50% pour études, 30% validation, 20% livraison',
      retards: 8,
      relances: 2
    },
    {
      id: 'FAC-ACC-2024-004',
      numeroDevis: 'DEV-2024-007',
      numeroFacturePrincipale: null,
      client: 'Entreprise BatiVert',
      contact: 'Marc Dubois',
      email: 'm.dubois@bativert.com',
      adresse: '78 Route de Caluire, 69300 Caluire',
      dateEmission: '2024-03-28',
      dateEcheance: '2024-04-12',
      datePaiement: null,
      status: 'envoyee',
      montantTotalProjet: 15800.00,
      pourcentageAcompte: 35,
      montantAcompte: 5530.00,
      soldeRestant: 10270.00,
      moyenPaiement: null,
      typeAcompte: 'materiel',
      echeancier: [
        { etape: 'Acompte matériel', pourcentage: 35, montant: 5530.00, statut: 'envoyee', datePrevu: '2024-03-28', datePaiement: null },
        { etape: 'Installation', pourcentage: 40, montant: 6320.00, statut: 'programme', datePrevu: '2024-04-15', datePaiement: null },
        { etape: 'Finition et garantie', pourcentage: 25, montant: 3950.00, statut: 'programme', datePrevu: '2024-05-01', datePaiement: null }
      ],
      services: [
        { nom: 'Fourniture végétaux premium', montant: 8500 },
        { nom: 'Installation complète', montant: 7300 }
      ],
      conditionsPaiement: 'Acompte 35% commande matériel, 40% installation, 25% finition',
      retards: 0,
      relances: 1
    },
    {
      id: 'FAC-ACC-2024-005',
      numeroDevis: 'DEV-2024-008',
      numeroFacturePrincipale: null,
      client: 'Mairie de Villeurbanne',
      contact: 'Service Espaces Verts',
      email: 'espaces.verts@villeurbanne.fr',
      adresse: 'Place Lazare Goujon, 69100 Villeurbanne',
      dateEmission: '2024-03-30',
      dateEcheance: '2024-05-30',
      datePaiement: null,
      status: 'brouillon',
      montantTotalProjet: 45000.00,
      pourcentageAcompte: 25,
      montantAcompte: 11250.00,
      soldeRestant: 33750.00,
      moyenPaiement: null,
      typeAcompte: 'commande',
      echeancier: [
        { etape: 'Acompte commande publique', pourcentage: 25, montant: 11250.00, statut: 'brouillon', datePrevu: '2024-03-30', datePaiement: null },
        { etape: 'Avancement 50%', pourcentage: 50, montant: 22500.00, statut: 'programme', datePrevu: '2024-05-15', datePaiement: null },
        { etape: 'Réception définitive', pourcentage: 25, montant: 11250.00, statut: 'programme', datePrevu: '2024-06-30', datePaiement: null }
      ],
      services: [
        { nom: 'Réaménagement parc municipal', montant: 35000 },
        { nom: 'Mobilier urbain', montant: 10000 }
      ],
      conditionsPaiement: 'Acompte 25% commande, 50% à mi-parcours, 25% réception',
      retards: 0,
      relances: 0
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'brouillon': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'envoyee': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paye': return 'bg-green-100 text-green-800 border-green-200';
      case 'en_retard': return 'bg-red-100 text-red-800 border-red-200';
      case 'annulee': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'brouillon': return DocumentTextIcon;
      case 'envoyee': return PaperAirplaneIcon;
      case 'paye': return CheckCircleIcon;
      case 'en_retard': return ExclamationTriangleIcon;
      case 'annulee': return XCircleIcon;
      default: return ClockIcon;
    }
  };

  const getEtapeStatusColor = (statut) => {
    switch (statut) {
      case 'paye': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'en_retard': return 'bg-red-100 text-red-800';
      case 'programme': return 'bg-gray-100 text-gray-800';
      case 'envoyee': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeAcompteIcon = (type) => {
    switch (type) {
      case 'commande': return DocumentTextIcon;
      case 'materiel': return BuildingOffice2Icon;
      case 'etude': return PencilIcon;
      default: return CurrencyEuroIcon;
    }
  };

  const filteredFactures = facturesAcompteData.filter(facture => {
    const matchesStatus = filterStatus === 'all' || facture.status === filterStatus;
    const matchesSearch = facture.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facture.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facture.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statsFactures = {
    total: facturesAcompteData.length,
    payees: facturesAcompteData.filter(f => f.status === 'paye').length,
    envoyees: facturesAcompteData.filter(f => f.status === 'envoyee').length,
    enRetard: facturesAcompteData.filter(f => f.status === 'en_retard').length,
    montantTotalAcomptes: facturesAcompteData.reduce((sum, facture) => sum + facture.montantAcompte, 0),
    montantEncaisse: facturesAcompteData.filter(f => f.status === 'paye').reduce((sum, facture) => sum + facture.montantAcompte, 0),
    soldeTotalRestant: facturesAcompteData.reduce((sum, facture) => sum + facture.soldeRestant, 0)
  };

  const generatePDF = (facture) => {
    console.log('Génération PDF pour facture acompte:', facture.id);
    // Logique de génération PDF
  };

  const sendFacture = (facture) => {
    console.log('Envoi facture acompte:', facture.id);
    // Logique d'envoi email
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="p-6 bg-gradient-to-br from-slate-50 to-emerald-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Factures d'Acompte
            </h1>
            <p className="text-gray-600 mt-2">Gestion avancée des échéanciers avec suivi automatisé</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center">
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filtres
            </button>
            <button 
              onClick={() => setShowEcheancier(true)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center"
            >
              <CalendarDaysIcon className="w-5 h-5 mr-2" />
              Échéancier Global
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg flex items-center">
              <PlusIcon className="w-5 h-5 mr-2" />
              Nouvelle Facture d'Acompte
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{statsFactures.total}</div>
          <div className="text-xs text-gray-600">Total acomptes</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{statsFactures.payees}</div>
          <div className="text-xs text-gray-600">Payés</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{statsFactures.envoyees}</div>
          <div className="text-xs text-gray-600">Envoyés</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{statsFactures.enRetard}</div>
          <div className="text-xs text-gray-600">En retard</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{statsFactures.montantTotalAcomptes.toLocaleString()}€</div>
          <div className="text-xs text-gray-600">Acomptes totaux</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-teal-600">{statsFactures.montantEncaisse.toLocaleString()}€</div>
          <div className="text-xs text-gray-600">Encaissé</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{statsFactures.soldeTotalRestant.toLocaleString()}€</div>
          <div className="text-xs text-gray-600">Soldes restants</div>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une facture d'acompte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="brouillon">Brouillons</option>
              <option value="envoyee">Envoyés</option>
              <option value="paye">Payés</option>
              <option value="en_retard">En retard</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Factures Acompte Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Liste des factures d'acompte</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facture</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acompte</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solde restant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFactures.map((facture, index) => {
                const StatusIcon = getStatusIcon(facture.status);
                const TypeIcon = getTypeAcompteIcon(facture.typeAcompte);
                const isOverdue = facture.status === 'en_retard';
                
                return (
                  <motion.tr
                    key={facture.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{facture.id}</div>
                          {facture.numeroDevis && (
                            <div className="text-sm text-gray-500">Devis: {facture.numeroDevis}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{facture.client}</div>
                        <div className="text-sm text-gray-500">{facture.contact}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TypeIcon className="w-4 h-4 text-emerald-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900 capitalize">{facture.typeAcompte}</span>
                      </div>
                      <div className="text-xs text-gray-500">{facture.pourcentageAcompte}% du total</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(facture.status)}`}>
                        {facture.status.replace('_', ' ')}
                      </span>
                      {isOverdue && (
                        <div className="text-xs text-red-600 mt-1">
                          {facture.retards} jour{facture.retards > 1 ? 's' : ''} de retard
                        </div>
                      )}
                      {facture.relances > 0 && (
                        <div className="text-xs text-orange-600 mt-1">
                          {facture.relances} relance{facture.relances > 1 ? 's' : ''}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-emerald-600">
                        {facture.montantAcompte.toLocaleString()}€
                      </div>
                      <div className="text-xs text-gray-500">
                        sur {facture.montantTotalProjet.toLocaleString()}€
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-orange-600">
                        {facture.soldeRestant.toLocaleString()}€
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((1 - facture.pourcentageAcompte/100) * 100)}% restant
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(facture.dateEcheance).toLocaleDateString('fr-FR')}
                      </div>
                      {facture.datePaiement && (
                        <div className="text-xs text-green-600">
                          Payé: {new Date(facture.datePaiement).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedFacture(facture)}
                          className="text-emerald-600 hover:text-emerald-900 p-1 rounded hover:bg-emerald-50 transition-colors duration-200"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => generatePDF(facture)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => generatePDF(facture)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors duration-200"
                        >
                          <PrinterIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => sendFacture(facture)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                        >
                          <ShareIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Facture Detail Modal */}
      <AnimatePresence>
        {selectedFacture && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFacture(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Facture d'Acompte {selectedFacture.id}</h3>
                    <p className="text-gray-600">{selectedFacture.client}</p>
                  </div>
                  <button
                    onClick={() => setSelectedFacture(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Client Info */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Informations client</h4>
                    <div className="space-y-3">
                      <div><span className="text-gray-600">Contact:</span> <span className="font-medium">{selectedFacture.contact}</span></div>
                      <div><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedFacture.email}</span></div>
                      <div><span className="text-gray-600">Adresse:</span> <span className="font-medium">{selectedFacture.adresse}</span></div>
                    </div>
                  </div>

                  {/* Acompte Info */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Détails de l'acompte</h4>
                    <div className="space-y-3">
                      <div><span className="text-gray-600">Type acompte:</span> <span className="font-medium capitalize">{selectedFacture.typeAcompte}</span></div>
                      <div><span className="text-gray-600">Pourcentage:</span> <span className="font-medium">{selectedFacture.pourcentageAcompte}%</span></div>
                      <div><span className="text-gray-600">Montant acompte:</span> <span className="font-medium text-emerald-600">{selectedFacture.montantAcompte.toLocaleString()}€</span></div>
                      <div><span className="text-gray-600">Total projet:</span> <span className="font-medium">{selectedFacture.montantTotalProjet.toLocaleString()}€</span></div>
                      <div><span className="text-gray-600">Solde restant:</span> <span className="font-medium text-orange-600">{selectedFacture.soldeRestant.toLocaleString()}€</span></div>
                      {selectedFacture.datePaiement && (
                        <div><span className="text-gray-600">Moyen paiement:</span> <span className="font-medium capitalize">{selectedFacture.moyenPaiement}</span></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Échéancier détaillé */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Échéancier de paiement</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étape</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">%</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date prévue</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date paiement</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedFacture.echeancier.map((etape, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{etape.etape}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{etape.pourcentage}%</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{etape.montant.toLocaleString()}€</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(etape.datePrevu).toLocaleDateString('fr-FR')}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {etape.datePaiement ? new Date(etape.datePaiement).toLocaleDateString('fr-FR') : '-'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEtapeStatusColor(etape.statut)}`}>
                                {etape.statut.replace('_', ' ')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Services concernés */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Services du projet</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      {selectedFacture.services.map((service, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">{service.nom}</span>
                          <span className="text-sm font-medium text-gray-900">{service.montant.toLocaleString()}€</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Conditions de paiement */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Conditions de paiement</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm">{selectedFacture.conditionsPaiement}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button 
                  onClick={() => generatePDF(selectedFacture)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  PDF
                </button>
                <button 
                  onClick={() => generatePDF(selectedFacture)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center"
                >
                  <PrinterIcon className="w-5 h-5 mr-2" />
                  Imprimer
                </button>
                <button 
                  onClick={() => sendFacture(selectedFacture)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                >
                  <ShareIcon className="w-5 h-5 mr-2" />
                  Envoyer
                </button>
                {selectedFacture.status !== 'paye' && (
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Marquer Payé
                  </button>
                )}
                <button 
                  onClick={() => setSelectedFacture(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FacturesAcomptePremium;