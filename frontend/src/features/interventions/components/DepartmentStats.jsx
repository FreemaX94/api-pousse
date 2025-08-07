import React, { useState } from 'react';
import { 
  CalendarIcon, 
  CogIcon, 
  ChevronDownIcon,
  ArrowDownTrayIcon,
  ChevronUpIcon,
  DocumentArrowDownIcon,
  InformationCircleIcon,
  UserIcon,
  UsersIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  TagIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  UserGroupIcon,
  MegaphoneIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDepartmentStatsData } from '../hooks/useDepartmentStatsData';

const DepartmentStats = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '2025-07-01',
    endDate: '2025-07-25'
  });
  const [timeGroup, setTimeGroup] = useState('Jour');
  const [dataChoice, setDataChoice] = useState('interventions-effectuees');
  const [measure, setMeasure] = useState('heures');
  const [showDisplayOptions, setShowDisplayOptions] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeStatsTab, setActiveStatsTab] = useState('Departement');
  
  const [visibleColumns, setVisibleColumns] = useState({
    pays: true,
    region: true,
    departement: true,
    type: true,
    adresses: true,
    interventions: true,
    dureeHeures: true,
    dureeMinutes: true,
    budgetTemps: true,
    budgetReel: true,
    action: true
  });

  const {
    chartData,
    tableData,
    totalData,
    tarifHoraire,
    loading,
    exportData
  } = useDepartmentStatsData({
    dateRange,
    timeGroup,
    dataChoice,
    measure
  });

  // Onglets de statistiques
  const statsTabsConfig = [
    { key: 'General', label: 'Général', icon: ChevronDownIcon },
    { key: 'Collaborateur', label: 'Collaborateur', icon: UserIcon },
    { key: 'Fonction des utilisateurs', label: 'Fonction des utilisateurs', icon: BriefcaseIcon },
    { key: 'Equipe', label: 'Équipe', icon: UserGroupIcon },
    { key: 'Client', label: 'Client', icon: BuildingOfficeIcon },
    { key: 'Provenance', label: 'Provenance des clients', icon: MegaphoneIcon },
    { key: 'Contrat', label: 'Contrat', icon: DocumentArrowDownIcon },
    { key: 'Adresse', label: 'Adresse', icon: MapPinIcon },
    { key: 'Action', label: 'Action', icon: TagIcon },
    { key: 'Champ personnalise', label: 'Champ personnalisé', icon: TagIcon },
    { key: 'Pays', label: 'Pays', icon: GlobeAltIcon },
    { key: 'Region', label: 'Région', icon: MapPinIcon },
    { key: 'Departement', label: 'Département', icon: MapPinIcon },
    { key: 'Ville', label: 'Ville', icon: MapPinIcon }
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedData = getSortedData(tableData);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const SortButton = ({ column, children }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center space-x-1 text-left w-full hover:text-blue-600 transition-colors"
    >
      <span>{children}</span>
      {sortConfig.key === column && (
        sortConfig.direction === 'asc' ? 
          <ChevronUpIcon className="w-4 h-4" /> : 
          <ChevronDownIcon className="w-4 h-4" />
      )}
    </button>
  );

  // Configuration du tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      let unit = 'h';
      if (measure === 'chiffre-affaires') {
        unit = '€';
      } else if (measure === 'interventions') {
        unit = '';
      }

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-yellow-600">
            {`${payload[0].name}: ${payload[0].value}${unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const DisplayOptionsModal = () => (
    showDisplayOptions && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-96">
          <h3 className="text-lg font-semibold mb-4">Options d'affichage</h3>
          <div className="space-y-3">
            {Object.entries(visibleColumns).map(([key, value]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setVisibleColumns(prev => ({
                    ...prev,
                    [key]: e.target.checked
                  }))}
                  className="mr-2"
                />
                <span className="text-sm">
                  {key === 'pays' && 'Pays'}
                  {key === 'region' && 'Région'}
                  {key === 'departement' && 'Département'}
                  {key === 'type' && 'Type'}
                  {key === 'adresses' && 'Adresses'}
                  {key === 'interventions' && 'Interventions'}
                  {key === 'dureeHeures' && 'Durée (heures)'}
                  {key === 'dureeMinutes' && 'Durée (minutes)'}
                  {key === 'budgetTemps' && 'Budget (temps de travail)'}
                  {key === 'budgetReel' && 'Budget (réel)'}
                  {key === 'action' && 'Action'}
                </span>
              </label>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => setShowDisplayOptions(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              onClick={() => setShowDisplayOptions(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Fonction pour obtenir l'icône du département
  const getDepartmentIcon = (departement) => {
    // Icônes spécifiques par département français
    if (departement.includes('Paris (75)')) {
      return '🗼'; // Tour Eiffel
    } else if (departement.includes('Rhône (69)')) {
      return '🦁'; // Lion de Lyon
    } else if (departement.includes('Haute-Garonne (31)')) {
      return '✈️'; // Avion pour Toulouse
    } else if (departement.includes('Gironde (33)')) {
      return '🍷'; // Vin de Bordeaux
    } else if (departement.includes('Nord (59)')) {
      return '🏭'; // Industrie du Nord
    } else if (departement.includes('Ille-et-Vilaine (35)')) {
      return '🌊'; // Océan Bretagne
    } else if (departement.includes('Maine-et-Loire (49)')) {
      return '🏰'; // Châteaux de la Loire
    } else if (departement.includes('Hauts-de-Seine (92)')) {
      return '🏢'; // Business La Défense
    } else if (departement.includes('Puy-de-Dôme (63)')) {
      return '🌋'; // Volcans d'Auvergne
    } else if (departement.includes('Isère (38)')) {
      return '⛷️'; // Ski Alpes
    } else if (departement.includes('Haute-Savoie (74)')) {
      return '🏔️'; // Montagnes
    } else if (departement.includes('Marne (51)')) {
      return '🍾'; // Champagne
    } else if (departement.includes('Bruxelles-Capitale')) {
      return '🇪🇺'; // UE
    } else if (departement.includes('Flandre-Orientale')) {
      return '🍺'; // Bière flamande
    } else if (departement.includes('Zurich')) {
      return '🏦'; // Banques suisses
    } else if (departement.includes('Vaud')) {
      return '⛰️'; // Alpes suisses
    } else if (departement.includes('Luxembourg')) {
      return '💰'; // Finance Luxembourg
    } else {
      return '🏛️'; // Bâtiment administratif générique
    }
  };

  // Fonction pour obtenir le drapeau du pays
  const getCountryFlag = (pays) => {
    const flags = {
      'France': '🇫🇷',
      'Belgique': '🇧🇪',
      'Suisse': '🇨🇭',
      'Luxembourg': '🇱🇺'
    };
    return flags[pays] || '🌍';
  };

  // Obtenir le libellé de la mesure pour le graphique
  const getMeasureLabel = () => {
    switch (measure) {
      case 'chiffre-affaires':
        return 'Chiffre d\'affaires par';
      case 'interventions':
        return 'Nombre d\'interventions par';
      case 'heures':
      default:
        return 'Heures travaillées par';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Menu latéral */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Statistiques</h3>
          <nav className="space-y-1">
            {statsTabsConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveStatsTab(tab.key)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeStatsTab === tab.key
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Barre de filtres */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              {/* Date range picker */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-gray-500" />
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      startDate: e.target.value
                    }))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  />
                  <span className="text-gray-500">–</span>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      endDate: e.target.value
                    }))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  />
                </div>

                {/* Sélecteur de mesure */}
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5 text-gray-500" />
                  <select
                    value={measure}
                    onChange={(e) => setMeasure(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="heures">Heures</option>
                    <option value="chiffre-affaires">Chiffre d'affaires</option>
                    <option value="interventions">Nombre d'interventions</option>
                  </select>
                </div>
              </div>

              {/* Contrôles de droite */}
              <div className="flex items-center space-x-4">
                {/* Choix des données */}
                <select
                  value={dataChoice}
                  onChange={(e) => setDataChoice(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="interventions-effectuees">Interventions effectuées</option>
                  <option value="interventions-planifiees">Interventions planifiées</option>
                  <option value="toutes-interventions">Toutes les interventions</option>
                </select>

                {/* Groupe de temps */}
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  {['Jour', 'Semaine', 'Mois'].map((group) => (
                    <button
                      key={group}
                      onClick={() => setTimeGroup(group)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        timeGroup === group
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>

                {/* Options d'affichage */}
                <button
                  onClick={() => setShowDisplayOptions(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md"
                  title="Options d'affichage"
                >
                  <CogIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Alerte d'information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              Les heures sont calculées à partir des heures des interventions considérées comme <em>effectuées</em>.
            </p>
          </div>

          {/* Graphique */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">{getMeasureLabel()} {timeGroup.toLowerCase()} - Départements</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="period" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    tickFormatter={(value) => {
                      if (measure === 'chiffre-affaires') return `${value}€`;
                      if (measure === 'interventions') return `${value}`;
                      return `${value}h`;
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="rect"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="heures" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2, fill: '#FEF3C7' }}
                    name="Interventions effectuées terminées"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tableau des départements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* En-tête du tableau */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Détails par département</h3>
              <button
                onClick={() => exportData('csv')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>Télécharger</span>
              </button>
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {visibleColumns.pays && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <SortButton column="pays">Pays</SortButton>
                      </th>
                    )}
                    {visibleColumns.region && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <SortButton column="region">Région</SortButton>
                      </th>
                    )}
                    {visibleColumns.departement && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <SortButton column="departement">Département</SortButton>
                      </th>
                    )}
                    {visibleColumns.type && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <SortButton column="type">Type</SortButton>
                      </th>
                    )}
                    {visibleColumns.adresses && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <SortButton column="adresses">Adresses</SortButton>
                      </th>
                    )}
                    {visibleColumns.interventions && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <SortButton column="interventions">Interventions</SortButton>
                      </th>
                    )}
                    {visibleColumns.dureeHeures && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <SortButton column="dureeMinutes">Durée (heures)</SortButton>
                      </th>
                    )}
                    {visibleColumns.dureeMinutes && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <SortButton column="dureeMinutes">Durée (minutes)</SortButton>
                      </th>
                    )}
                    {visibleColumns.budgetTemps && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <SortButton column="budgetTemps">Budget (temps de travail)</SortButton>
                      </th>
                    )}
                    {visibleColumns.budgetReel && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <SortButton column="budgetReel">Budget (réel)</SortButton>
                      </th>
                    )}
                    {visibleColumns.action && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {visibleColumns.pays && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{getCountryFlag(item.pays)}</span>
                            <span className="font-medium text-gray-700">{item.pays}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.region && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.region}
                        </td>
                      )}
                      {visibleColumns.departement && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-lg">{getDepartmentIcon(item.departement)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="font-medium text-cyan-600 hover:text-cyan-900 hover:underline">
                                {item.departement}
                              </button>
                              <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
                            </div>
                          </div>
                        </td>
                      )}
                      {visibleColumns.type && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {item.type}
                          </span>
                        </td>
                      )}
                      {visibleColumns.adresses && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.adresses}
                        </td>
                      )}
                      {visibleColumns.interventions && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button className="text-blue-600 hover:text-blue-900 hover:underline">
                            {item.interventions}
                          </button>
                        </td>
                      )}
                      {visibleColumns.dureeHeures && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {formatDuration(item.dureeMinutes)}
                        </td>
                      )}
                      {visibleColumns.dureeMinutes && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.dureeMinutes}
                        </td>
                      )}
                      {visibleColumns.budgetTemps && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.budgetTemps)}
                        </td>
                      )}
                      {visibleColumns.budgetReel && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.budgetReel)}
                        </td>
                      )}
                      {visibleColumns.action && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            className="p-1 text-green-600 hover:text-green-900"
                            title="Exporter"
                          >
                            <DocumentArrowDownIcon className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  
                  {/* Ligne de total */}
                  <tr className="bg-gray-50 font-medium">
                    {visibleColumns.pays && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        Total
                      </td>
                    )}
                    {visibleColumns.region && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        -
                      </td>
                    )}
                    {visibleColumns.departement && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        -
                      </td>
                    )}
                    {visibleColumns.type && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        -
                      </td>
                    )}
                    {visibleColumns.adresses && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        {totalData.adresses}
                      </td>
                    )}
                    {visibleColumns.interventions && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        {totalData.interventions}
                      </td>
                    )}
                    {visibleColumns.dureeHeures && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono font-bold">
                        {formatDuration(totalData.dureeMinutes)}
                      </td>
                    )}
                    {visibleColumns.dureeMinutes && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        {totalData.dureeMinutes}
                      </td>
                    )}
                    {visibleColumns.budgetTemps && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        {formatCurrency(totalData.budgetTemps)}
                      </td>
                    )}
                    {visibleColumns.budgetReel && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        {formatCurrency(totalData.budgetReel)}
                      </td>
                    )}
                    {visibleColumns.action && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tarif horaire */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Tarif horaire : <span className="font-medium">{formatCurrency(tarifHoraire)}</span>
              </p>
            </div>
          </div>

          {/* Modal des options d'affichage */}
          <DisplayOptionsModal />
        </div>
      </div>
    </div>
  );
};

export default DepartmentStats;