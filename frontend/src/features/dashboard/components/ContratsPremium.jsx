import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  CalendarDaysIcon,
  CurrencyEuroIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  BellAlertIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentCheckIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { DocumentTextIcon as DocumentSolidIcon } from '@heroicons/react/24/solid';

const ContratsPremium = ({ theme = 'dark' }) => {
  const [selectedContrat, setSelectedContrat] = useState(null);
  const [activeView, setActiveView] = useState('timeline');
  const [filterType, setFilterType] = useState('all');

  const getThemeColors = (theme) => {
    switch(theme) {
      case 'neon':
        return {
          primary: 'from-purple-600 to-pink-600',
          secondary: 'from-blue-600 to-cyan-600',
          accent: 'from-pink-500 to-purple-500',
          bg: 'bg-gray-900',
          card: 'bg-gray-800/50',
          text: 'text-gray-100',
          border: 'border-purple-500/30'
        };
      case 'galaxy':
        return {
          primary: 'from-indigo-600 to-purple-700',
          secondary: 'from-blue-700 to-indigo-600',
          accent: 'from-purple-600 to-pink-600',
          bg: 'bg-slate-900',
          card: 'bg-slate-800/50',
          text: 'text-slate-100',
          border: 'border-indigo-500/30'
        };
      case 'sunset':
        return {
          primary: 'from-orange-500 to-red-600',
          secondary: 'from-yellow-500 to-orange-500',
          accent: 'from-red-500 to-pink-500',
          bg: 'bg-gray-900',
          card: 'bg-gray-800/50',
          text: 'text-gray-100',
          border: 'border-orange-500/30'
        };
      case 'ocean':
        return {
          primary: 'from-teal-500 to-blue-600',
          secondary: 'from-cyan-500 to-teal-500',
          accent: 'from-blue-500 to-indigo-500',
          bg: 'bg-slate-900',
          card: 'bg-slate-800/50',
          text: 'text-slate-100',
          border: 'border-teal-500/30'
        };
      default:
        return {
          primary: 'from-gray-700 to-gray-900',
          secondary: 'from-gray-600 to-gray-800',
          accent: 'from-gray-500 to-gray-700',
          bg: 'bg-gray-900',
          card: 'bg-gray-800/50',
          text: 'text-gray-100',
          border: 'border-gray-700'
        };
    }
  };

  const themeColors = getThemeColors(theme);

  // Données démo des contrats
  const contrats = [
    {
      id: 1,
      numero: 'CTR-2024-001',
      titre: 'Entretien annuel espaces verts',
      client: 'ADAGIO OPERA',
      type: 'Maintenance',
      statut: 'Actif',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      montantTotal: 24000,
      montantFacture: 22000,
      montantRestant: 2000,
      frequence: 'Mensuel',
      prochainePrestaton: '2025-01-05',
      nombreInterventions: 12,
      interventionsRealisees: 11,
      tauxCompletion: 92,
      alertes: [],
      responsable: 'Sophie Martin',
      services: ['Taille', 'Arrosage', 'Fertilisation', 'Nettoyage']
    },
    {
      id: 2,
      numero: 'CTR-2024-002',
      titre: 'Installation système arrosage',
      client: 'ADVANCY CONSEIL',
      type: 'Projet',
      statut: 'En cours',
      dateDebut: '2024-03-15',
      dateFin: '2024-06-30',
      montantTotal: 45000,
      montantFacture: 30000,
      montantRestant: 15000,
      frequence: 'Unique',
      prochainePrestaton: '2024-12-30',
      nombreInterventions: 5,
      interventionsRealisees: 3,
      tauxCompletion: 60,
      alertes: ['Retard livraison matériel'],
      responsable: 'Marc Dubois',
      services: ['Installation', 'Configuration', 'Formation']
    },
    {
      id: 3,
      numero: 'CTR-2024-003',
      titre: 'Maintenance trimestrielle',
      client: 'AE75 SAS',
      type: 'Maintenance',
      statut: 'À renouveler',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      montantTotal: 8000,
      montantFacture: 6000,
      montantRestant: 2000,
      frequence: 'Trimestriel',
      prochainePrestaton: '2025-01-15',
      nombreInterventions: 4,
      interventionsRealisees: 3,
      tauxCompletion: 75,
      alertes: ['Échéance proche'],
      responsable: 'Julie Bernard',
      services: ['Entretien', 'Contrôle', 'Remplacement']
    },
    {
      id: 4,
      numero: 'CTR-2024-004',
      titre: 'Aménagement terrasse executive',
      client: 'AQUILAE GESTION',
      type: 'Projet',
      statut: 'Terminé',
      dateDebut: '2024-02-01',
      dateFin: '2024-04-30',
      montantTotal: 35000,
      montantFacture: 35000,
      montantRestant: 0,
      frequence: 'Unique',
      prochainePrestaton: null,
      nombreInterventions: 8,
      interventionsRealisees: 8,
      tauxCompletion: 100,
      alertes: [],
      responsable: 'Thomas Laurent',
      services: ['Design', 'Installation', 'Plantation', 'Éclairage']
    },
    {
      id: 5,
      numero: 'CTR-2024-005',
      titre: 'Contrat cadre végétalisation',
      client: 'BERENBERG BANK',
      type: 'Cadre',
      statut: 'Suspendu',
      dateDebut: '2024-05-01',
      dateFin: '2025-04-30',
      montantTotal: 60000,
      montantFacture: 15000,
      montantRestant: 45000,
      frequence: 'À la demande',
      prochainePrestaton: null,
      nombreInterventions: 20,
      interventionsRealisees: 5,
      tauxCompletion: 25,
      alertes: ['Contrat suspendu'],
      responsable: 'Claire Moreau',
      services: ['Végétalisation', 'Décoration florale', 'Événements']
    }
  ];

  const getStatusColor = (statut) => {
    switch(statut) {
      case 'Actif': return 'from-green-500 to-emerald-500';
      case 'En cours': return 'from-blue-500 to-cyan-500';
      case 'À renouveler': return 'from-yellow-500 to-amber-500';
      case 'Terminé': return 'from-gray-500 to-gray-600';
      case 'Suspendu': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Maintenance': return ArrowPathIcon;
      case 'Projet': return ChartBarIcon;
      case 'Cadre': return DocumentDuplicateIcon;
      default: return DocumentTextIcon;
    }
  };

  const filteredContrats = filterType === 'all' 
    ? contrats 
    : contrats.filter(c => c.type === filterType);

  // Statistiques globales
  const stats = {
    total: contrats.length,
    actifs: contrats.filter(c => c.statut === 'Actif' || c.statut === 'En cours').length,
    valeurTotale: contrats.reduce((acc, c) => acc + c.montantTotal, 0),
    facturesEmises: contrats.reduce((acc, c) => acc + c.montantFacture, 0),
    resteAFacturer: contrats.reduce((acc, c) => acc + c.montantRestant, 0),
    tauxRealisationMoyen: Math.round(contrats.reduce((acc, c) => acc + c.tauxCompletion, 0) / contrats.length)
  };

  return (
    <div className={`min-h-screen ${themeColors.bg} p-6`}>
      {/* En-tête avec statistiques */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${themeColors.text} mb-2`}>
              Gestion des Contrats
            </h1>
            <p className="text-gray-400">
              Suivi des contrats, échéances et facturation
            </p>
          </div>
          
          {/* Boutons de vue et filtre */}
          <div className="flex items-center space-x-4">
            <div className="flex rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <button
                onClick={() => setActiveView('timeline')}
                className={`px-4 py-2 transition-all ${
                  activeView === 'timeline' 
                    ? `bg-gradient-to-r ${themeColors.primary} text-white` 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveView('cards')}
                className={`px-4 py-2 transition-all ${
                  activeView === 'cards' 
                    ? `bg-gradient-to-r ${themeColors.primary} text-white` 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Cartes
              </button>
              <button
                onClick={() => setActiveView('kanban')}
                className={`px-4 py-2 transition-all ${
                  activeView === 'kanban' 
                    ? `bg-gradient-to-r ${themeColors.primary} text-white` 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Kanban
              </button>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-gray-300 focus:outline-none focus:border-purple-500"
            >
              <option value="all">Tous les types</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Projet">Projet</option>
              <option value="Cadre">Contrat cadre</option>
            </select>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {[
            { label: 'Contrats', value: stats.total, icon: DocumentTextIcon, color: themeColors.primary },
            { label: 'Actifs', value: stats.actifs, icon: CheckCircleIcon, color: 'from-green-500 to-emerald-500' },
            { label: 'Valeur totale', value: `${(stats.valeurTotale/1000).toFixed(0)}k€`, icon: CurrencyEuroIcon, color: 'from-blue-500 to-cyan-500' },
            { label: 'Facturé', value: `${(stats.facturesEmises/1000).toFixed(0)}k€`, icon: BanknotesIcon, color: 'from-purple-500 to-pink-500' },
            { label: 'Reste à facturer', value: `${(stats.resteAFacturer/1000).toFixed(0)}k€`, icon: ClockIcon, color: 'from-yellow-500 to-amber-500' },
            { label: 'Taux réalisation', value: `${stats.tauxRealisationMoyen}%`, icon: ArrowTrendingUpIcon, color: 'from-green-500 to-teal-500' }
          ].map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
              <div className={`relative ${themeColors.card} backdrop-blur-xl rounded-2xl p-4 border ${themeColors.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-gray-400" />
                </div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vue Timeline */}
      {activeView === 'timeline' && (
        <div className={`${themeColors.card} backdrop-blur-xl rounded-2xl border ${themeColors.border} p-6`}>
          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-teal-500"></div>
            
            {/* Contrats sur la timeline */}
            <div className="space-y-8">
              {filteredContrats.map((contrat, index) => {
                const TypeIcon = getTypeIcon(contrat.type);
                return (
                  <div key={contrat.id} className="relative flex items-start">
                    {/* Point sur la timeline */}
                    <div className={`absolute left-6 w-4 h-4 rounded-full bg-gradient-to-r ${getStatusColor(contrat.statut)} ring-4 ring-gray-800`}></div>
                    
                    {/* Contenu */}
                    <div 
                      className="ml-16 flex-1 cursor-pointer"
                      onClick={() => setSelectedContrat(contrat)}
                    >
                      <div className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-r ${getStatusColor(contrat.statut)}`}>
                              <TypeIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-1">
                                {contrat.titre}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span>{contrat.numero}</span>
                                <span>•</span>
                                <span>{contrat.client}</span>
                                <span>•</span>
                                <span>{contrat.responsable}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(contrat.statut)} text-white`}>
                            {contrat.statut}
                          </div>
                        </div>
                        
                        {/* Période et progression */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Période</div>
                            <div className="text-sm text-gray-300">
                              {new Date(contrat.dateDebut).toLocaleDateString('fr-FR')} - {new Date(contrat.dateFin).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Interventions</div>
                            <div className="text-sm text-gray-300">
                              {contrat.interventionsRealisees} / {contrat.nombreInterventions}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Facturation</div>
                            <div className="text-sm text-gray-300">
                              {((contrat.montantFacture / contrat.montantTotal) * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                        
                        {/* Barre de progression */}
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getStatusColor(contrat.statut)} rounded-full`}
                            style={{ width: `${contrat.tauxCompletion}%` }}
                          />
                        </div>
                        
                        {/* Alertes */}
                        {contrat.alertes.length > 0 && (
                          <div className="mt-4 flex items-center space-x-2">
                            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-yellow-400">{contrat.alertes.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Vue Cartes */}
      {activeView === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContrats.map((contrat) => {
            const TypeIcon = getTypeIcon(contrat.type);
            return (
              <div
                key={contrat.id}
                onClick={() => setSelectedContrat(contrat)}
                className="relative group cursor-pointer"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${themeColors.accent} rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                
                <div className={`relative ${themeColors.card} backdrop-blur-xl rounded-2xl p-6 border ${themeColors.border}`}>
                  {/* En-tête */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${getStatusColor(contrat.statut)}`}>
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(contrat.statut)} text-white`}>
                      {contrat.statut}
                    </div>
                  </div>
                  
                  {/* Titre et client */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {contrat.titre}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{contrat.client}</p>
                  
                  {/* Montants */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Valeur totale</div>
                      <div className="text-lg font-bold text-white">
                        {(contrat.montantTotal / 1000).toFixed(0)}k€
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Reste à facturer</div>
                      <div className="text-lg font-bold text-yellow-400">
                        {(contrat.montantRestant / 1000).toFixed(0)}k€
                      </div>
                    </div>
                  </div>
                  
                  {/* Progression */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>Progression</span>
                      <span>{contrat.tauxCompletion}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getStatusColor(contrat.statut)} rounded-full`}
                        style={{ width: `${contrat.tauxCompletion}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>{new Date(contrat.dateFin).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {contrat.alertes.length > 0 && (
                      <BellAlertIcon className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vue Kanban */}
      {activeView === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['Actif', 'En cours', 'À renouveler', 'Terminé'].map((statut) => (
            <div key={statut} className={`${themeColors.card} backdrop-blur-xl rounded-2xl border ${themeColors.border} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">{statut}</h3>
                <span className="text-sm text-gray-400">
                  {contrats.filter(c => c.statut === statut).length}
                </span>
              </div>
              <div className="space-y-3">
                {contrats
                  .filter(c => c.statut === statut)
                  .map((contrat) => (
                    <div
                      key={contrat.id}
                      onClick={() => setSelectedContrat(contrat)}
                      className="bg-gray-800/50 rounded-lg p-3 cursor-pointer hover:bg-gray-800/70 transition-colors"
                    >
                      <div className="text-sm font-medium text-white mb-1">
                        {contrat.titre}
                      </div>
                      <div className="text-xs text-gray-400 mb-2">{contrat.client}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {(contrat.montantTotal / 1000).toFixed(0)}k€
                        </span>
                        <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getStatusColor(statut)} rounded-full`}
                            style={{ width: `${contrat.tauxCompletion}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de détails */}
      {selectedContrat && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedContrat(null)}
        >
          <div 
            className={`${themeColors.card} backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border ${themeColors.border}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedContrat.titre}
                </h2>
                <p className="text-gray-400">{selectedContrat.numero} • {selectedContrat.client}</p>
              </div>
              <button
                onClick={() => setSelectedContrat(null)}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span className="text-gray-400">✕</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations générales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">Informations générales</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type de contrat</span>
                    <span className="text-white">{selectedContrat.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Responsable</span>
                    <span className="text-white">{selectedContrat.responsable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fréquence</span>
                    <span className="text-white">{selectedContrat.frequence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Services inclus</span>
                    <span className="text-white">{selectedContrat.services.length} services</span>
                  </div>
                </div>
              </div>

              {/* Informations financières */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">Informations financières</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Montant total</span>
                    <span className="text-white font-bold">{selectedContrat.montantTotal.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Déjà facturé</span>
                    <span className="text-green-400">{selectedContrat.montantFacture.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reste à facturer</span>
                    <span className="text-yellow-400">{selectedContrat.montantRestant.toLocaleString('fr-FR')} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services inclus */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Services inclus</h3>
              <div className="flex flex-wrap gap-2">
                {selectedContrat.services.map((service, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full bg-gray-800 text-sm text-gray-300"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-6 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                Voir interventions
              </button>
              <button className={`px-6 py-2 rounded-xl bg-gradient-to-r ${themeColors.primary} text-white hover:opacity-90 transition-opacity`}>
                Générer facture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContratsPremium;