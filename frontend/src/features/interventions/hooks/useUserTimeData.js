import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, startOfWeek, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

// Données mock pour la simulation - données par collaborateur
const mockCollaboratorInterventions = [
  {
    id: 1,
    date: '2025-07-01',
    collaborateur: 'Simon Henry',
    adresse: 'Singular - 38 Rue Des Jeûneurs, 75002, Paris',
    dureeMinutes: 120,
    budgetTemps: 75.50,
    budgetReel: 85.00,
    statut: 'effectue',
    tarifHoraire: 37.75
  },
  {
    id: 2,
    date: '2025-07-02',
    collaborateur: 'Elodie Treveten',
    adresse: 'TORAY CE - 18 Avenue de la Porte d\'Italie, 75013, Paris',
    dureeMinutes: 90,
    budgetTemps: 56.25,
    budgetReel: 62.50,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 3,
    date: '2025-07-02',
    collaborateur: 'Marie Dubois',
    adresse: 'CREDIT MUTUEL - 88 Rue de Rivoli, 75001, Paris',
    dureeMinutes: 150,
    budgetTemps: 93.75,
    budgetReel: 105.00,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 4,
    date: '2025-07-03',
    collaborateur: 'Pierre Martin',
    adresse: 'SOCIETE GENERALE - 29 Boulevard Haussmann, 75009, Paris',
    dureeMinutes: 180,
    budgetTemps: 112.50,
    budgetReel: 125.00,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 5,
    date: '2025-07-04',
    collaborateur: 'Sophie Leroy',
    adresse: 'BNP PARIBAS - 16 Boulevard des Italiens, 75009, Paris',
    dureeMinutes: 135,
    budgetTemps: 84.35,
    budgetReel: 95.00,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 6,
    date: '2025-07-05',
    collaborateur: 'Jean Dupont',
    adresse: 'L\'OREAL - 41 Rue Martre, 92110, Clichy',
    dureeMinutes: 105,
    budgetTemps: 65.65,
    budgetReel: 72.50,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 7,
    date: '2025-07-08',
    collaborateur: 'Lucas Bernard',
    adresse: 'DANONE - 17 Boulevard Haussmann, 75009, Paris',
    dureeMinutes: 165,
    budgetTemps: 103.15,
    budgetReel: 115.00,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 8,
    date: '2025-07-09',
    collaborateur: 'Emma Moreau',
    adresse: 'TOTAL ENERGIES - 2 Place Jean Millier, 92400, Courbevoie',
    dureeMinutes: 195,
    budgetTemps: 121.85,
    budgetReel: 135.00,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 9,
    date: '2025-07-10',
    collaborateur: 'Thomas Petit',
    adresse: 'MICROSOFT - 37 Quai du Président Roosevelt, 92130, Issy-les-Moulineaux',
    dureeMinutes: 125,
    budgetTemps: 78.15,
    budgetReel: 87.50,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 10,
    date: '2025-07-11',
    collaborateur: 'Camille Roux',
    adresse: 'ORANGE - 78 Rue Olivier de Serres, 75015, Paris',
    dureeMinutes: 140,
    budgetTemps: 87.50,
    budgetReel: 97.50,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 11,
    date: '2025-07-12',
    collaborateur: 'Simon Henry',
    adresse: 'Station F - 5 Parvis Alan Turing, 75013, Paris',
    dureeMinutes: 110,
    budgetTemps: 68.75,
    budgetReel: 77.00,
    statut: 'effectue',
    tarifHoraire: 37.75
  },
  {
    id: 12,
    date: '2025-07-15',
    collaborateur: 'Elodie Treveten',
    adresse: 'SEPHORA - 70 Rue de Rivoli, 75004, Paris',
    dureeMinutes: 85,
    budgetTemps: 53.15,
    budgetReel: 59.50,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 13,
    date: '2025-07-16',
    collaborateur: 'Marie Dubois',
    adresse: 'HERMES - 24 Rue du Faubourg Saint-Honoré, 75008, Paris',
    dureeMinutes: 200,
    budgetTemps: 125.00,
    budgetReel: 140.00,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 14,
    date: '2025-07-17',
    collaborateur: 'Pierre Martin',
    adresse: 'SPOTIFY - 10 Rue Washington, 75008, Paris',
    dureeMinutes: 95,
    budgetTemps: 59.35,
    budgetReel: 66.50,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 15,
    date: '2025-07-18',
    collaborateur: 'Sophie Leroy',
    adresse: 'WINAMAX - 16 Boulevard Saint-Germain, 75005, Paris',
    dureeMinutes: 175,
    budgetTemps: 109.35,
    budgetReel: 122.50,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 16,
    date: '2025-07-19',
    collaborateur: 'Jean Dupont',
    adresse: 'AIRBNB - 8 Rue de Londres, 75009, Paris',
    dureeMinutes: 160,
    budgetTemps: 100.00,
    budgetReel: 112.00,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 17,
    date: '2025-07-22',
    collaborateur: 'Lucas Bernard',
    adresse: 'NETFLIX - 12 Rue Lincoln, 75008, Paris',
    dureeMinutes: 130,
    budgetTemps: 81.25,
    budgetReel: 91.00,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 18,
    date: '2025-07-23',
    collaborateur: 'Emma Moreau',
    adresse: 'UBER - 20 Avenue Rapp, 75007, Paris',
    dureeMinutes: 145,
    budgetTemps: 90.65,
    budgetReel: 101.50,
    statut: 'effectue',
    tarifHoraire: 37.50
  }
];

export const useUserTimeData = ({ dateRange, timeGroup, dataChoice }) => {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);

  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setRawData(mockCollaboratorInterventions);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [dateRange, dataChoice]);

  // Filtrer les données selon la période
  const filteredData = useMemo(() => {
    if (!rawData.length) return [];

    return rawData.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      return itemDate >= startDate && itemDate <= endDate;
    });
  }, [rawData, dateRange]);

  // Grouper les données par collaborateur
  const groupedByCollaborator = useMemo(() => {
    if (!filteredData.length) return {};

    const groups = {};

    filteredData.forEach(item => {
      if (!groups[item.collaborateur]) {
        groups[item.collaborateur] = {
          collaborateur: item.collaborateur,
          type: 'Effectué terminé',
          adresses: new Set(),
          interventions: 0,
          dureeMinutes: 0,
          budgetTemps: 0,
          budgetReel: 0,
          tarifHoraire: item.tarifHoraire
        };
      }

      groups[item.collaborateur].adresses.add(item.adresse);
      groups[item.collaborateur].interventions += 1;
      groups[item.collaborateur].dureeMinutes += item.dureeMinutes;
      groups[item.collaborateur].budgetTemps += item.budgetTemps;
      groups[item.collaborateur].budgetReel += item.budgetReel;
    });

    // Convertir les Set en nombre
    Object.keys(groups).forEach(key => {
      groups[key].adresses = groups[key].adresses.size;
    });

    return groups;
  }, [filteredData]);

  // Grouper les données par période pour le graphique
  const groupedByPeriod = useMemo(() => {
    if (!filteredData.length) return {};

    const groups = {};

    filteredData.forEach(item => {
      let groupKey;
      const itemDate = parseISO(item.date);

      switch (timeGroup) {
        case 'Semaine':
          groupKey = format(startOfWeek(itemDate, { locale: fr }), 'yyyy-MM-dd');
          break;
        case 'Mois':
          groupKey = format(startOfMonth(itemDate), 'yyyy-MM');
          break;
        case 'Jour':
        default:
          groupKey = format(itemDate, 'yyyy-MM-dd');
          break;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = {
          date: groupKey,
          dureeMinutes: 0
        };
      }

      groups[groupKey].dureeMinutes += item.dureeMinutes;
    });

    return groups;
  }, [filteredData, timeGroup]);

  // Préparer les données pour le graphique
  const chartData = useMemo(() => {
    const sortedKeys = Object.keys(groupedByPeriod).sort();
    
    return sortedKeys.map(key => {
      let period;
      switch (timeGroup) {
        case 'Semaine':
          period = `Sem. ${format(parseISO(key), 'w', { locale: fr })}`;
          break;
        case 'Mois':
          period = format(parseISO(key + '-01'), 'MMM yyyy', { locale: fr });
          break;
        case 'Jour':
        default:
          period = format(parseISO(key), 'dd/MM', { locale: fr });
          break;
      }

      return {
        period,
        heures: Math.round(groupedByPeriod[key].dureeMinutes / 60 * 100) / 100,
        date: key
      };
    });
  }, [groupedByPeriod, timeGroup]);

  // Préparer les données pour le tableau
  const tableData = useMemo(() => {
    return Object.values(groupedByCollaborator).map(group => ({
      collaborateur: group.collaborateur,
      type: group.type,
      adresses: group.adresses,
      interventions: group.interventions,
      dureeMinutes: group.dureeMinutes,
      budgetTemps: Math.round(group.budgetTemps * 100) / 100,
      budgetReel: Math.round(group.budgetReel * 100) / 100,
      tarifHoraire: group.tarifHoraire
    }));
  }, [groupedByCollaborator]);

  // Calculer les totaux
  const totalData = useMemo(() => {
    if (!tableData.length) return {
      adresses: 0,
      interventions: 0,
      dureeMinutes: 0,
      budgetTemps: 0,
      budgetReel: 0
    };

    return tableData.reduce((totals, item) => ({
      adresses: totals.adresses + item.adresses,
      interventions: totals.interventions + item.interventions,
      dureeMinutes: totals.dureeMinutes + item.dureeMinutes,
      budgetTemps: totals.budgetTemps + item.budgetTemps,
      budgetReel: totals.budgetReel + item.budgetReel
    }), {
      adresses: 0,
      interventions: 0,
      dureeMinutes: 0,
      budgetTemps: 0,
      budgetReel: 0
    });
  }, [tableData]);

  // Calculer le tarif horaire moyen
  const tarifHoraire = useMemo(() => {
    if (!tableData.length) return 37.50;
    
    const totalTarif = tableData.reduce((sum, item) => sum + item.tarifHoraire, 0);
    return Math.round((totalTarif / tableData.length) * 100) / 100;
  }, [tableData]);

  // Fonction d'export
  const exportData = (format = 'csv') => {
    if (format === 'csv') {
      const headers = [
        'Collaborateur',
        'Type',
        'Adresses',
        'Interventions',
        'Durée (minutes)',
        'Budget (temps de travail)',
        'Budget (réel)'
      ];

      const csvContent = [
        headers.join(','),
        ...tableData.map(row => [
          row.collaborateur,
          row.type,
          row.adresses,
          row.interventions,
          row.dureeMinutes,
          row.budgetTemps,
          row.budgetReel
        ].join(',')),
        // Ligne de total
        [
          'TOTAL',
          '-',
          totalData.adresses,
          totalData.interventions,
          totalData.dureeMinutes,
          totalData.budgetTemps,
          totalData.budgetReel
        ].join(',')
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `temps-travaille-collaborateurs-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return {
    chartData,
    tableData,
    totalData,
    tarifHoraire,
    loading,
    exportData
  };
};