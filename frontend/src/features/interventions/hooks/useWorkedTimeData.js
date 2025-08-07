import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, startOfWeek, startOfMonth, addDays, addWeeks, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

// Données mock pour la simulation
const mockInterventions = [
  {
    id: 1,
    date: '2025-07-01',
    type: 'Effectué terminé',
    adresse: 'Singular - 38 Rue Des Jeûneurs, 75002, Paris',
    dureeMinutes: 120,
    budgetTemps: 75.50,
    budgetReel: 85.00,
    statut: 'effectue'
  },
  {
    id: 2,
    date: '2025-07-02',
    type: 'Effectué terminé',
    adresse: 'TORAY CE - 18 Avenue de la Porte d\'Italie, 75013, Paris',
    dureeMinutes: 90,
    budgetTemps: 56.25,
    budgetReel: 62.50,
    statut: 'effectue'
  },
  {
    id: 3,
    date: '2025-07-02',
    type: 'Effectué terminé',
    adresse: 'CREDIT MUTUEL - 88 Rue de Rivoli, 75001, Paris',
    dureeMinutes: 150,
    budgetTemps: 93.75,
    budgetReel: 105.00,
    statut: 'effectue'
  },
  {
    id: 4,
    date: '2025-07-03',
    type: 'Effectué terminé',
    adresse: 'SOCIETE GENERALE - 29 Boulevard Haussmann, 75009, Paris',
    dureeMinutes: 180,
    budgetTemps: 112.50,
    budgetReel: 125.00,
    statut: 'effectue'
  },
  {
    id: 5,
    date: '2025-07-04',
    type: 'Effectué terminé',
    adresse: 'BNP PARIBAS - 16 Boulevard des Italiens, 75009, Paris',
    dureeMinutes: 135,
    budgetTemps: 84.35,
    budgetReel: 95.00,
    statut: 'effectue'
  },
  {
    id: 6,
    date: '2025-07-05',
    type: 'Effectué terminé',
    adresse: 'L\'OREAL - 41 Rue Martre, 92110, Clichy',
    dureeMinutes: 105,
    budgetTemps: 65.65,
    budgetReel: 72.50,
    statut: 'effectue'
  },
  {
    id: 7,
    date: '2025-07-08',
    type: 'Effectué terminé',
    adresse: 'DANONE - 17 Boulevard Haussmann, 75009, Paris',
    dureeMinutes: 165,
    budgetTemps: 103.15,
    budgetReel: 115.00,
    statut: 'effectue'
  },
  {
    id: 8,
    date: '2025-07-09',
    type: 'Effectué terminé',
    adresse: 'TOTAL ENERGIES - 2 Place Jean Millier, 92400, Courbevoie',
    dureeMinutes: 195,
    budgetTemps: 121.85,
    budgetReel: 135.00,
    statut: 'effectue'
  },
  {
    id: 9,
    date: '2025-07-10',
    type: 'Effectué terminé',
    adresse: 'MICROSOFT - 37 Quai du Président Roosevelt, 92130, Issy-les-Moulineaux',
    dureeMinutes: 125,
    budgetTemps: 78.15,
    budgetReel: 87.50,
    statut: 'effectue'
  },
  {
    id: 10,
    date: '2025-07-11',
    type: 'Effectué terminé',
    adresse: 'ORANGE - 78 Rue Olivier de Serres, 75015, Paris',
    dureeMinutes: 140,
    budgetTemps: 87.50,
    budgetReel: 97.50,
    statut: 'effectue'
  },
  {
    id: 11,
    date: '2025-07-12',
    type: 'Effectué terminé',
    adresse: 'Station F - 5 Parvis Alan Turing, 75013, Paris',
    dureeMinutes: 110,
    budgetTemps: 68.75,
    budgetReel: 77.00,
    statut: 'effectue'
  },
  {
    id: 12,
    date: '2025-07-15',
    type: 'Effectué terminé',
    adresse: 'SEPHORA - 70 Rue de Rivoli, 75004, Paris',
    dureeMinutes: 85,
    budgetTemps: 53.15,
    budgetReel: 59.50,
    statut: 'effectue'
  },
  {
    id: 13,
    date: '2025-07-16',
    type: 'Effectué terminé',
    adresse: 'HERMES - 24 Rue du Faubourg Saint-Honoré, 75008, Paris',
    dureeMinutes: 200,
    budgetTemps: 125.00,
    budgetReel: 140.00,
    statut: 'effectue'
  },
  {
    id: 14,
    date: '2025-07-17',
    type: 'Effectué terminé',
    adresse: 'SPOTIFY - 10 Rue Washington, 75008, Paris',
    dureeMinutes: 95,
    budgetTemps: 59.35,
    budgetReel: 66.50,
    statut: 'effectue'
  },
  {
    id: 15,
    date: '2025-07-18',
    type: 'Effectué terminé',
    adresse: 'WINAMAX - 16 Boulevard Saint-Germain, 75005, Paris',
    dureeMinutes: 175,
    budgetTemps: 109.35,
    budgetReel: 122.50,
    statut: 'effectue'
  }
];

export const useWorkedTimeData = ({ dateRange, timeGroup, dataChoice }) => {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);

  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setRawData(mockInterventions);
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

  // Grouper les données selon la granularité (Jour/Semaine/Mois)
  const groupedData = useMemo(() => {
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
          type: 'Effectué terminé',
          adresses: new Set(),
          interventions: 0,
          dureeMinutes: 0,
          budgetTemps: 0,
          budgetReel: 0
        };
      }

      groups[groupKey].adresses.add(item.adresse);
      groups[groupKey].interventions += 1;
      groups[groupKey].dureeMinutes += item.dureeMinutes;
      groups[groupKey].budgetTemps += item.budgetTemps;
      groups[groupKey].budgetReel += item.budgetReel;
    });

    // Convertir les Set en nombre
    Object.keys(groups).forEach(key => {
      groups[key].adresses = groups[key].adresses.size;
    });

    return groups;
  }, [filteredData, timeGroup]);

  // Préparer les données pour le graphique
  const chartData = useMemo(() => {
    const sortedKeys = Object.keys(groupedData).sort();
    
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
        heures: Math.round(groupedData[key].dureeMinutes / 60 * 100) / 100, // Convertir en heures
        date: key
      };
    });
  }, [groupedData, timeGroup]);

  // Préparer les données pour le tableau
  const tableData = useMemo(() => {
    const sortedKeys = Object.keys(groupedData).sort();
    
    return sortedKeys.map(key => {
      const group = groupedData[key];
      return {
        date: format(parseISO(key), timeGroup === 'Mois' ? 'MMM yyyy' : 'dd/MM/yyyy', { locale: fr }),
        type: group.type,
        adresses: group.adresses,
        interventions: group.interventions,
        dureeMinutes: group.dureeMinutes,
        budgetTemps: Math.round(group.budgetTemps * 100) / 100,
        budgetReel: Math.round(group.budgetReel * 100) / 100
      };
    });
  }, [groupedData, timeGroup]);

  // Fonction d'export
  const exportData = (format = 'csv') => {
    if (format === 'csv') {
      const headers = [
        'Date',
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
          row.date,
          row.type,
          row.adresses,
          row.interventions,
          row.dureeMinutes,
          row.budgetTemps,
          row.budgetReel
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `temps-travaille-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return {
    chartData,
    tableData,
    loading,
    exportData
  };
};