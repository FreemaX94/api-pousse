import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  ClockIcon,
  CurrencyEuroIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOffice2Icon,
  UserIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const DevisFacturationPremium = () => {
  const [selectedDevis, setSelectedDevis] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const devisData = [
    {
      id: 'DEV-2024-001',
      client: 'Villa Moderne SARL',
      contact: 'Jean Dupont',
      email: 'j.dupont@villamoderne.fr',
      telephone: '04.78.XX.XX.XX',
      adresse: '12 Rue des Jardins, 69001 Lyon',
      dateCreation: '2024-03-15',
      dateExpiration: '2024-04-15',
      status: 'envoye',
      montantHT: 2450.00,
      tva: 490.00,
      montantTTC: 2940.00,
      services: [
        { nom: 'Taille haies de laurier', quantite: 1, prixUnitaire: 800, total: 800 },
        { nom: 'Élagage arbres fruitiers', quantite: 3, prixUnitaire: 350, total: 1050 },
        { nom: 'Nettoyage et évacuation', quantite: 1, prixUnitaire: 600, total: 600 }
      ],
      notes: 'Intervention prévue pour avril 2024. Accès facile, parking disponible.',
      validite: 30,
      delaiPaiement: 30,
      acompte: 30,
      conditions: 'Conditions générales applicables. Acompte de 30% à la commande.'
    },
    {
      id: 'DEV-2024-002',
      client: 'Résidence Harmony',
      contact: 'Sophie Martin',
      email: 's.martin@residence-harmony.fr',
      telephone: '04.72.XX.XX.XX',
      adresse: '45 Avenue des Roses, 69003 Lyon',
      dateCreation: '2024-03-18',
      dateExpiration: '2024-04-18',
      status: 'accepte',
      montantHT: 8750.00,
      tva: 1750.00,
      montantTTC: 10500.00,
      services: [
        { nom: 'Aménagement paysager complet', quantite: 1, prixUnitaire: 6000, total: 6000 },
        { nom: 'Installation système arrosage', quantite: 1, prixUnitaire: 2000, total: 2000 },
        { nom: 'Plantation arbustes décoratifs', quantite: 25, prixUnitaire: 30, total: 750 }
      ],
      notes: 'Projet d\'aménagement sur 3 semaines. Matériaux premium souhaités.',
      validite: 45,
      delaiPaiement: 30,
      acompte: 40,
      conditions: 'Devis accepté. Acompte de 40% versé. Début des travaux prévu mi-avril.'
    },
    {
      id: 'DEV-2024-003',
      client: 'Château de Versant',
      contact: 'Pierre Leroy',
      email: 'contact@chateau-versant.fr',
      telephone: '04.78.XX.XX.XX',
      adresse: '3 Rue du Château, 69130 Écully',
      dateCreation: '2024-03-20',
      dateExpiration: '2024-04-20',
      status: 'refuse',
      montantHT: 15200.00,
      tva: 3040.00,
      montantTTC: 18240.00,
      services: [
        { nom: 'Restauration jardins historiques', quantite: 1, prixUnitaire: 12000, total: 12000 },
        { nom: 'Élagage arbres centenaires', quantite: 8, prixUnitaire: 400, total: 3200 }
      ],
      notes: 'Projet de restauration historique. Nécessite expertise spécialisée.',
      validite: 60,
      delaiPaiement: 45,
      acompte: 50,
      conditions: 'Devis refusé - budget trop élevé selon le client.'
    },
    {
      id: 'DEV-2024-004',
      client: 'EHPAD Les Jardins',
      contact: 'Marie Rousseau',
      email: 'm.rousseau@ehpad-jardins.fr',
      telephone: '04.69.XX.XX.XX',
      adresse: '12 Avenue de la Santé, 69003 Lyon',
      dateCreation: '2024-03-22',
      dateExpiration: '2024-05-22',
      status: 'brouillon',
      montantHT: 4500.00,
      tva: 900.00,
      montantTTC: 5400.00,
      services: [
        { nom: 'Création jardin thérapeutique', quantite: 1, prixUnitaire: 3500, total: 3500 },
        { nom: 'Installation mobilier adapté PMR', quantite: 5, prixUnitaire: 200, total: 1000 }
      ],
      notes: 'Jardin adapté aux personnes âgées. Plantes aromatiques et sensorielles.',
      validite: 60,
      delaiPaiement: 30,
      acompte: 25,
      conditions: 'Devis en cours de finalisation.'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'brouillon': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'envoye': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepte': return 'bg-green-100 text-green-800 border-green-200';
      case 'refuse': return 'bg-red-100 text-red-800 border-red-200';
      case 'expire': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'brouillon': return PencilIcon;
      case 'envoye': return ShareIcon;
      case 'accepte': return CheckCircleIcon;
      case 'refuse': return XCircleIcon;
      case 'expire': return ClockIcon;
      default: return DocumentTextIcon;
    }
  };

  const filteredDevis = devisData.filter(devis => {
    const matchesStatus = filterStatus === 'all' || devis.status === filterStatus;
    const matchesSearch = devis.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         devis.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         devis.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statsDevis = {
    total: devisData.length,
    envoyes: devisData.filter(d => d.status === 'envoye').length,
    acceptes: devisData.filter(d => d.status === 'accepte').length,
    refuses: devisData.filter(d => d.status === 'refuse').length,
    montantTotal: devisData.reduce((sum, devis) => sum + devis.montantTTC, 0),
    tauxAcceptation: Math.round((devisData.filter(d => d.status === 'accepte').length / devisData.filter(d => d.status !== 'brouillon').length) * 100)
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
      className="p-6 bg-gradient-to-br from-slate-50 to-green-50 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Devis & Facturation
            </h1>
            <p className="text-gray-600 mt-2">Builder avancé avec templates intelligents et suivi automatisé</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center">
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filtres
            </button>
            <button 
              onClick={() => setShowBuilder(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Nouveau Devis
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{statsDevis.total}</div>
          <div className="text-xs text-gray-600">Total devis</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{statsDevis.envoyes}</div>
          <div className="text-xs text-gray-600">Envoyés</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{statsDevis.acceptes}</div>
          <div className="text-xs text-gray-600">Acceptés</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{statsDevis.refuses}</div>
          <div className="text-xs text-gray-600">Refusés</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{statsDevis.montantTotal.toLocaleString()}€</div>
          <div className="text-xs text-gray-600">Montant total</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{statsDevis.tauxAcceptation}%</div>
          <div className="text-xs text-gray-600">Taux succès</div>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un devis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="brouillon">Brouillons</option>
              <option value="envoye">Envoyés</option>
              <option value="accepte">Acceptés</option>
              <option value="refuse">Refusés</option>
              <option value="expire">Expirés</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Devis Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Liste des devis</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDevis.map((devis, index) => {
                const StatusIcon = getStatusIcon(devis.status);
                const isExpired = new Date(devis.dateExpiration) < new Date();
                
                return (
                  <motion.tr
                    key={devis.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{devis.id}</div>
                          <div className="text-sm text-gray-500">
                            {devis.services.length} service{devis.services.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{devis.client}</div>
                        <div className="text-sm text-gray-500">{devis.contact}</div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(devis.status)}`}>
                        {devis.status}
                      </span>
                      {isExpired && devis.status === 'envoye' && (
                        <div className="text-xs text-red-600 mt-1">Expiré</div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {devis.montantTTC.toLocaleString()}€ TTC
                      </div>
                      <div className="text-sm text-gray-500">
                        {devis.montantHT.toLocaleString()}€ HT
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Créé: {new Date(devis.dateCreation).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        Expire: {new Date(devis.dateExpiration).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedDevis(devis)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-200"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors duration-200">
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors duration-200">
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

      {/* Devis Detail Modal */}
      <AnimatePresence>
        {selectedDevis && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDevis(null)}
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
                    <h3 className="text-2xl font-bold text-gray-900">Devis {selectedDevis.id}</h3>
                    <p className="text-gray-600">{selectedDevis.client}</p>
                  </div>
                  <button
                    onClick={() => setSelectedDevis(null)}
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
                      <div><span className="text-gray-600">Contact:</span> <span className="font-medium">{selectedDevis.contact}</span></div>
                      <div><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedDevis.email}</span></div>
                      <div><span className="text-gray-600">Téléphone:</span> <span className="font-medium">{selectedDevis.telephone}</span></div>
                      <div><span className="text-gray-600">Adresse:</span> <span className="font-medium">{selectedDevis.adresse}</span></div>
                    </div>
                  </div>

                  {/* Devis Info */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Détails du devis</h4>
                    <div className="space-y-3">
                      <div><span className="text-gray-600">Date création:</span> <span className="font-medium">{new Date(selectedDevis.dateCreation).toLocaleDateString('fr-FR')}</span></div>
                      <div><span className="text-gray-600">Date expiration:</span> <span className="font-medium">{new Date(selectedDevis.dateExpiration).toLocaleDateString('fr-FR')}</span></div>
                      <div><span className="text-gray-600">Validité:</span> <span className="font-medium">{selectedDevis.validite} jours</span></div>
                      <div><span className="text-gray-600">Acompte:</span> <span className="font-medium">{selectedDevis.acompte}%</span></div>
                      <div><span className="text-gray-600">Délai paiement:</span> <span className="font-medium">{selectedDevis.delaiPaiement} jours</span></div>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Services</h4>
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
                        {selectedDevis.services.map((service, idx) => (
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
                      <span className="font-semibold">{selectedDevis.montantHT.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">TVA (20%):</span>
                      <span className="font-semibold">{selectedDevis.tva.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-green-600 border-t pt-2">
                      <span>Total TTC:</span>
                      <span>{selectedDevis.montantTTC.toLocaleString()}€</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedDevis.notes && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800">{selectedDevis.notes}</p>
                    </div>
                  </div>
                )}

                {/* Conditions */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Conditions</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm">{selectedDevis.conditions}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Modifier
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center">
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  PDF
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center">
                  <ShareIcon className="w-5 h-5 mr-2" />
                  Envoyer
                </button>
                <button 
                  onClick={() => setSelectedDevis(null)}
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

export default DevisFacturationPremium;