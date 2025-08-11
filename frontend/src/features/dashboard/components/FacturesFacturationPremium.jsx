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
  ShareIcon
} from '@heroicons/react/24/outline';

const FacturesFacturationPremium = () => {
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const facturesData = [
    {
      id: 'FAC-2024-001',
      numeroDevis: 'DEV-2024-001',
      client: 'Villa Moderne SARL',
      contact: 'Jean Dupont',
      email: 'j.dupont@villamoderne.fr',
      adresse: '12 Rue des Jardins, 69001 Lyon',
      dateEmission: '2024-03-20',
      dateEcheance: '2024-04-19',
      datePaiement: '2024-03-18',
      status: 'payee',
      montantHT: 2450.00,
      tva: 490.00,
      montantTTC: 2940.00,
      acompteVerse: 882.00, // 30%
      solde: 0,
      moyenPaiement: 'virement',
      services: [
        { nom: 'Taille haies de laurier', quantite: 1, prixUnitaire: 800, total: 800 },
        { nom: 'Élagage arbres fruitiers', quantite: 3, prixUnitaire: 350, total: 1050 },
        { nom: 'Nettoyage et évacuation', quantite: 1, prixUnitaire: 600, total: 600 }
      ],
      retards: 0,
      relances: 0
    },
    {
      id: 'FAC-2024-002',
      numeroDevis: 'DEV-2024-002',
      client: 'Résidence Harmony',
      contact: 'Sophie Martin',
      email: 's.martin@residence-harmony.fr',
      adresse: '45 Avenue des Roses, 69003 Lyon',
      dateEmission: '2024-03-22',
      dateEcheance: '2024-04-21',
      datePaiement: null,
      status: 'envoyee',
      montantHT: 8750.00,
      tva: 1750.00,
      montantTTC: 10500.00,
      acompteVerse: 4200.00, // 40%
      solde: 6300.00,
      moyenPaiement: null,
      services: [
        { nom: 'Aménagement paysager complet', quantite: 1, prixUnitaire: 6000, total: 6000 },
        { nom: 'Installation système arrosage', quantite: 1, prixUnitaire: 2000, total: 2000 },
        { nom: 'Plantation arbustes décoratifs', quantite: 25, prixUnitaire: 30, total: 750 }
      ],
      retards: 0,
      relances: 1
    },
    {
      id: 'FAC-2024-003',
      numeroDevis: 'DEV-2024-004',
      client: 'EHPAD Les Jardins',
      contact: 'Marie Rousseau',
      email: 'm.rousseau@ehpad-jardins.fr',
      adresse: '12 Avenue de la Santé, 69003 Lyon',
      dateEmission: '2024-03-25',
      dateEcheance: '2024-04-24',
      datePaiement: null,
      status: 'en_retard',
      montantHT: 4500.00,
      tva: 900.00,
      montantTTC: 5400.00,
      acompteVerse: 1350.00, // 25%
      solde: 4050.00,
      moyenPaiement: null,
      services: [
        { nom: 'Création jardin thérapeutique', quantite: 1, prixUnitaire: 3500, total: 3500 },
        { nom: 'Installation mobilier adapté PMR', quantite: 5, prixUnitaire: 200, total: 1000 }
      ],
      retards: 5,
      relances: 2
    },
    {
      id: 'FAC-2024-004',
      numeroDevis: null,
      client: 'Mairie de Lyon',
      contact: 'Service Espaces Verts',
      email: 'espaces.verts@mairie-lyon.fr',
      adresse: 'Place des Terreaux, 69001 Lyon',
      dateEmission: '2024-03-28',
      dateEcheance: '2024-05-27',
      datePaiement: null,
      status: 'brouillon',
      montantHT: 12500.00,
      tva: 2500.00,
      montantTTC: 15000.00,
      acompteVerse: 0,
      solde: 15000.00,
      moyenPaiement: null,
      services: [
        { nom: 'Maintenance espaces verts publics', quantite: 1, prixUnitaire: 8000, total: 8000 },
        { nom: 'Plantation arbres boulevard', quantite: 20, prixUnitaire: 125, total: 2500 },
        { nom: 'Installation mobilier urbain', quantite: 8, prixUnitaire: 250, total: 2000 }
      ],
      retards: 0,
      relances: 0
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'brouillon': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'envoyee': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'payee': return 'bg-green-100 text-green-800 border-green-200';
      case 'en_retard': return 'bg-red-100 text-red-800 border-red-200';
      case 'annulee': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'brouillon': return DocumentTextIcon;
      case 'envoyee': return PaperAirplaneIcon;
      case 'payee': return CheckCircleIcon;
      case 'en_retard': return ExclamationTriangleIcon;
      case 'annulee': return XCircleIcon;
      default: return ClockIcon;
    }
  };

  const filteredFactures = facturesData.filter(facture => {
    const matchesStatus = filterStatus === 'all' || facture.status === filterStatus;
    const matchesSearch = facture.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facture.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facture.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statsFactures = {
    total: facturesData.length,
    envoyees: facturesData.filter(f => f.status === 'envoyee').length,
    payees: facturesData.filter(f => f.status === 'payee').length,
    enRetard: facturesData.filter(f => f.status === 'en_retard').length,
    montantTotal: facturesData.reduce((sum, facture) => sum + facture.montantTTC, 0),
    montantEncaisse: facturesData.filter(f => f.status === 'payee').reduce((sum, facture) => sum + facture.montantTTC, 0),
    montantEnAttente: facturesData.filter(f => f.status !== 'payee' && f.status !== 'brouillon').reduce((sum, facture) => sum + facture.solde, 0)
  };

  const generatePDF = (facture) => {
    console.log('Génération PDF pour facture:', facture.id);
    // Logique de génération PDF
  };

  const sendFacture = (facture) => {
    console.log('Envoi facture:', facture.id);
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
      className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Factures
            </h1>
            <p className="text-gray-600 mt-2">Génération PDF automatique et suivi des paiements</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center">
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filtres
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg flex items-center">
              <PlusIcon className="w-5 h-5 mr-2" />
              Nouvelle Facture
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{statsFactures.total}</div>
          <div className="text-xs text-gray-600">Total factures</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{statsFactures.envoyees}</div>
          <div className="text-xs text-gray-600">Envoyées</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{statsFactures.payees}</div>
          <div className="text-xs text-gray-600">Payées</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{statsFactures.enRetard}</div>
          <div className="text-xs text-gray-600">En retard</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{statsFactures.montantTotal.toLocaleString()}€</div>
          <div className="text-xs text-gray-600">Montant total</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{statsFactures.montantEncaisse.toLocaleString()}€</div>
          <div className="text-xs text-gray-600">Encaissé</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{statsFactures.montantEnAttente.toLocaleString()}€</div>
          <div className="text-xs text-gray-600">En attente</div>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une facture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="brouillon">Brouillons</option>
              <option value="envoyee">Envoyées</option>
              <option value="payee">Payées</option>
              <option value="en_retard">En retard</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Factures Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Liste des factures</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facture</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFactures.map((facture, index) => {
                const StatusIcon = getStatusIcon(facture.status);
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
                      <div className="text-sm font-medium text-gray-900">
                        {facture.montantTTC.toLocaleString()}€ TTC
                      </div>
                      <div className="text-sm text-gray-500">
                        {facture.montantHT.toLocaleString()}€ HT
                      </div>
                      {facture.acompteVerse > 0 && (
                        <div className="text-sm text-blue-600">
                          Acompte: {facture.acompteVerse.toLocaleString()}€
                        </div>
                      )}
                      {facture.solde > 0 && (
                        <div className="text-sm text-red-600">
                          Solde: {facture.solde.toLocaleString()}€
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Émise: {new Date(facture.dateEmission).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        Échéance: {new Date(facture.dateEcheance).toLocaleDateString('fr-FR')}
                      </div>
                      {facture.datePaiement && (
                        <div className="text-sm text-green-600">
                          Payée: {new Date(facture.datePaiement).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {facture.status === 'payee' ? (
                        <div className="text-sm">
                          <div className="text-green-600 font-medium">Payé</div>
                          <div className="text-gray-500 capitalize">{facture.moyenPaiement}</div>
                        </div>
                      ) : facture.status === 'brouillon' ? (
                        <div className="text-sm text-gray-500">-</div>
                      ) : (
                        <div className="text-sm text-orange-600">En attente</div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedFacture(facture)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
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
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-200"
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
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Facture {selectedFacture.id}</h3>
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
                {/* Même structure que DevisFacturationPremium mais adaptée aux factures */}
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

                  {/* Facture Info */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Détails de la facture</h4>
                    <div className="space-y-3">
                      <div><span className="text-gray-600">Date émission:</span> <span className="font-medium">{new Date(selectedFacture.dateEmission).toLocaleDateString('fr-FR')}</span></div>
                      <div><span className="text-gray-600">Date échéance:</span> <span className="font-medium">{new Date(selectedFacture.dateEcheance).toLocaleDateString('fr-FR')}</span></div>
                      {selectedFacture.datePaiement && (
                        <div><span className="text-gray-600">Date paiement:</span> <span className="font-medium text-green-600">{new Date(selectedFacture.datePaiement).toLocaleDateString('fr-FR')}</span></div>
                      )}
                      <div><span className="text-gray-600">Acompte versé:</span> <span className="font-medium">{selectedFacture.acompteVerse.toLocaleString()}€</span></div>
                      <div><span className="text-gray-600">Solde restant:</span> <span className="font-medium">{selectedFacture.solde.toLocaleString()}€</span></div>
                    </div>
                  </div>
                </div>

                {/* Services - même structure que dans DevisFacturationPremium */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Services facturés</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix unit.</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedFacture.services.map((service, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.nom}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{service.quantite}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{service.prixUnitaire}€</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.total}€</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Sous-total HT:</span>
                      <span className="font-semibold">{selectedFacture.montantHT.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">TVA (20%):</span>
                      <span className="font-semibold">{selectedFacture.tva.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between items-center mb-2 border-t pt-2">
                      <span className="text-lg font-bold">Total TTC:</span>
                      <span className="text-lg font-bold text-blue-600">{selectedFacture.montantTTC.toLocaleString()}€</span>
                    </div>
                    {selectedFacture.acompteVerse > 0 && (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">Acompte versé:</span>
                          <span className="font-semibold text-green-600">-{selectedFacture.acompteVerse.toLocaleString()}€</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold text-red-600 border-t pt-2">
                          <span>Solde à payer:</span>
                          <span>{selectedFacture.solde.toLocaleString()}€</span>
                        </div>
                      </>
                    )}
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
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                >
                  <ShareIcon className="w-5 h-5 mr-2" />
                  Envoyer
                </button>
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

export default FacturesFacturationPremium;