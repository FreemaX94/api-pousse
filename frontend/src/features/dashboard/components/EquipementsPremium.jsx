import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  WrenchScrewdriverIcon,
  CpuChipIcon,
  SignalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CogIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  BeakerIcon,
  ServerIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { WrenchScrewdriverIcon as WrenchSolidIcon } from '@heroicons/react/24/solid';

const EquipementsPremium = ({ theme = 'dark' }) => {
  const [selectedEquipement, setSelectedEquipement] = useState(null);
  const [activeView, setActiveView] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Données démo des équipements
  const equipements = [
    {
      id: 1,
      nom: 'Système d\'arrosage A1',
      type: 'Arrosage automatique',
      client: 'ADAGIO OPERA',
      status: 'Actif',
      sante: 95,
      derniereIntervention: '2024-12-15',
      prochaineIntervention: '2025-01-15',
      temperature: 22,
      humidite: 65,
      pression: 1.2,
      cycles: 15234,
      alertes: 0,
      garantie: '2025-06-30',
      modele: 'RAIN-PRO-3000',
      numeroSerie: 'RP3K-2024-001',
      localisation: 'Terrasse Executive'
    },
    {
      id: 2,
      nom: 'Jardinière connectée JC-02',
      type: 'IoT Jardinière',
      client: 'ADVANCY CONSEIL',
      status: 'Maintenance',
      sante: 72,
      derniereIntervention: '2024-12-20',
      prochaineIntervention: '2024-12-28',
      temperature: 24,
      humidite: 58,
      pression: 1.1,
      cycles: 8456,
      alertes: 2,
      garantie: '2025-09-15',
      modele: 'SMART-POT-500',
      numeroSerie: 'SP500-2024-045',
      localisation: 'Hall d\'entrée'
    },
    {
      id: 3,
      nom: 'Mur végétal MV-001',
      type: 'Mur végétalisé',
      client: 'AE75 SAS',
      status: 'Actif',
      sante: 88,
      derniereIntervention: '2024-12-10',
      prochaineIntervention: '2025-01-10',
      temperature: 21,
      humidite: 70,
      pression: 1.3,
      cycles: 12890,
      alertes: 1,
      garantie: '2025-12-31',
      modele: 'GREEN-WALL-XL',
      numeroSerie: 'GW-XL-2024-008',
      localisation: 'Salle de réunion'
    },
    {
      id: 4,
      nom: 'Station météo SM-04',
      type: 'Capteur environnemental',
      client: 'AQUILAE GESTION',
      status: 'Actif',
      sante: 98,
      derniereIntervention: '2024-11-30',
      prochaineIntervention: '2025-02-28',
      temperature: 19,
      humidite: 55,
      pression: 1.0,
      cycles: 45678,
      alertes: 0,
      garantie: '2026-01-15',
      modele: 'WEATHER-PRO',
      numeroSerie: 'WP-2024-112',
      localisation: 'Toiture'
    },
    {
      id: 5,
      nom: 'Système hydroponique SH-05',
      type: 'Culture hydroponique',
      client: 'BERENBERG BANK',
      status: 'Alerte',
      sante: 45,
      derniereIntervention: '2024-12-01',
      prochaineIntervention: '2024-12-25',
      temperature: 26,
      humidite: 78,
      pression: 0.9,
      cycles: 3456,
      alertes: 5,
      garantie: '2025-03-20',
      modele: 'HYDRO-GROW-2K',
      numeroSerie: 'HG2K-2024-067',
      localisation: 'Cafétéria'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Actif': return 'from-green-500 to-emerald-500';
      case 'Maintenance': return 'from-yellow-500 to-amber-500';
      case 'Alerte': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSanteColor = (sante) => {
    if (sante >= 80) return 'from-green-500 to-emerald-500';
    if (sante >= 60) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  const filteredEquipements = filterStatus === 'all' 
    ? equipements 
    : equipements.filter(e => e.status.toLowerCase() === filterStatus);

  // Statistiques globales
  const stats = {
    total: equipements.length,
    actifs: equipements.filter(e => e.status === 'Actif').length,
    maintenance: equipements.filter(e => e.status === 'Maintenance').length,
    alertes: equipements.reduce((acc, e) => acc + e.alertes, 0),
    santeMoyenne: Math.round(equipements.reduce((acc, e) => acc + e.sante, 0) / equipements.length)
  };

  return (
    <div className={`min-h-screen ${themeColors.bg} p-6`}>
      {/* En-tête avec statistiques */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${themeColors.text} mb-2`}>
              Gestion des Équipements
            </h1>
            <p className="text-gray-400">
              Maintenance prédictive et suivi en temps réel
            </p>
          </div>
          
          {/* Boutons de vue et filtre */}
          <div className="flex items-center space-x-4">
            <div className="flex rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <button
                onClick={() => setActiveView('grid')}
                className={`px-4 py-2 transition-all ${
                  activeView === 'grid' 
                    ? `bg-gradient-to-r ${themeColors.primary} text-white` 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`px-4 py-2 transition-all ${
                  activeView === 'list' 
                    ? `bg-gradient-to-r ${themeColors.primary} text-white` 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Liste
              </button>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-gray-300 focus:outline-none focus:border-purple-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="maintenance">Maintenance</option>
              <option value="alerte">Alerte</option>
            </select>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Total équipements', value: stats.total, icon: ServerIcon, color: themeColors.primary },
            { label: 'Actifs', value: stats.actifs, icon: CheckCircleIcon, color: 'from-green-500 to-emerald-500' },
            { label: 'En maintenance', value: stats.maintenance, icon: CogIcon, color: 'from-yellow-500 to-amber-500' },
            { label: 'Alertes', value: stats.alertes, icon: ExclamationTriangleIcon, color: 'from-red-500 to-rose-500' },
            { label: 'Santé moyenne', value: `${stats.santeMoyenne}%`, icon: ShieldCheckIcon, color: getSanteColor(stats.santeMoyenne) }
          ].map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
              <div className={`relative ${themeColors.card} backdrop-blur-xl rounded-2xl p-6 border ${themeColors.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vue en grille */}
      {activeView === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipements.map((equipement) => (
            <div
              key={equipement.id}
              onClick={() => setSelectedEquipement(equipement)}
              className="relative group cursor-pointer"
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${themeColors.accent} rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
              
              <div className={`relative ${themeColors.card} backdrop-blur-xl rounded-2xl p-6 border ${themeColors.border}`}>
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {equipement.nom}
                    </h3>
                    <p className="text-sm text-gray-400">{equipement.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{equipement.client}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(equipement.status)} text-white`}>
                    {equipement.status}
                  </div>
                </div>

                {/* Indicateur de santé */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>Santé de l'équipement</span>
                    <span className="font-medium">{equipement.sante}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getSanteColor(equipement.sante)} rounded-full`}
                      style={{ width: `${equipement.sante}%` }}
                    />
                  </div>
                </div>

                {/* Métriques en temps réel */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Temp.</div>
                    <div className="text-sm font-medium text-cyan-400">{equipement.temperature}°C</div>
                  </div>
                  <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Humid.</div>
                    <div className="text-sm font-medium text-blue-400">{equipement.humidite}%</div>
                  </div>
                  <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Press.</div>
                    <div className="text-sm font-medium text-purple-400">{equipement.pression} bar</div>
                  </div>
                </div>

                {/* Informations de maintenance */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Dernière intervention</span>
                    <span className="text-gray-300">{new Date(equipement.derniereIntervention).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Prochaine intervention</span>
                    <span className="text-yellow-400">{new Date(equipement.prochaineIntervention).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {/* Alertes et cycles */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ArrowPathIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{equipement.cycles.toLocaleString()} cycles</span>
                    </div>
                  </div>
                  {equipement.alertes > 0 && (
                    <div className="flex items-center space-x-1">
                      <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-red-400">{equipement.alertes} alertes</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vue en liste */}
      {activeView === 'list' && (
        <div className={`${themeColors.card} backdrop-blur-xl rounded-2xl border ${themeColors.border} overflow-hidden`}>
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Équipement
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Santé
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Métriques
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Prochaine maintenance
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Alertes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredEquipements.map((equipement) => (
                <tr 
                  key={equipement.id}
                  onClick={() => setSelectedEquipement(equipement)}
                  className="hover:bg-gray-800/30 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{equipement.nom}</div>
                      <div className="text-xs text-gray-400">{equipement.type}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {equipement.client}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(equipement.status)} text-white`}>
                      {equipement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getSanteColor(equipement.sante)} rounded-full`}
                          style={{ width: `${equipement.sante}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-300">{equipement.sante}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="text-cyan-400">{equipement.temperature}°C</span>
                      <span className="text-blue-400">{equipement.humidite}%</span>
                      <span className="text-purple-400">{equipement.pression}bar</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-yellow-400">
                    {new Date(equipement.prochaineIntervention).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    {equipement.alertes > 0 ? (
                      <div className="flex items-center space-x-1">
                        <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium text-red-400">{equipement.alertes}</span>
                      </div>
                    ) : (
                      <CheckCircleIcon className="w-5 h-5 text-green-400" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de détails */}
      {selectedEquipement && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEquipement(null)}
        >
          <div 
            className={`${themeColors.card} backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border ${themeColors.border}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedEquipement.nom}
                </h2>
                <p className="text-gray-400">{selectedEquipement.type} - {selectedEquipement.client}</p>
              </div>
              <button
                onClick={() => setSelectedEquipement(null)}
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
                    <span className="text-gray-400">Modèle</span>
                    <span className="text-white">{selectedEquipement.modele}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">N° de série</span>
                    <span className="text-white font-mono">{selectedEquipement.numeroSerie}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Localisation</span>
                    <span className="text-white">{selectedEquipement.localisation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Garantie jusqu'au</span>
                    <span className="text-green-400">{new Date(selectedEquipement.garantie).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              {/* Métriques détaillées */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">Métriques temps réel</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Température</div>
                    <div className="text-xl font-bold text-cyan-400">{selectedEquipement.temperature}°C</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Humidité</div>
                    <div className="text-xl font-bold text-blue-400">{selectedEquipement.humidite}%</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Pression</div>
                    <div className="text-xl font-bold text-purple-400">{selectedEquipement.pression} bar</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Cycles totaux</div>
                    <div className="text-xl font-bold text-green-400">{selectedEquipement.cycles.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-6 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                Historique complet
              </button>
              <button className={`px-6 py-2 rounded-xl bg-gradient-to-r ${themeColors.primary} text-white hover:opacity-90 transition-opacity`}>
                Planifier maintenance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipementsPremium;