import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, startOfWeek, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

// Données mock pour la simulation - données par fonction/rôle
const mockRoleInterventions = [
  {
    id: 1,
    date: '2025-07-01',
    collaborateur: 'Simon Henry',
    fonction: 'Chef d\'équipe',
    adresse: 'Singular - 38 Rue Des Jeûneurs, 75002, Paris',
    dureeMinutes: 120,
    budgetTemps: 75.50,
    budgetReel: 85.00,
    statut: 'effectue',
    tarifHoraire: 42.00
  },
  {
    id: 2,
    date: '2025-07-02',
    collaborateur: 'Elodie Treveten',
    fonction: 'Jardinier paysagiste',
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
    fonction: 'Technicien espaces verts',
    adresse: 'CREDIT MUTUEL - 88 Rue de Rivoli, 75001, Paris',
    dureeMinutes: 150,
    budgetTemps: 93.75,
    budgetReel: 105.00,
    statut: 'effectue',
    tarifHoraire: 35.00
  },
  {
    id: 4,
    date: '2025-07-03',
    collaborateur: 'Pierre Martin',
    fonction: 'Jardinier paysagiste',
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
    fonction: 'Spécialiste arrosage',
    adresse: 'BNP PARIBAS - 16 Boulevard des Italiens, 75009, Paris',
    dureeMinutes: 135,
    budgetTemps: 84.35,
    budgetReel: 95.00,
    statut: 'effectue',
    tarifHoraire: 33.00
  },
  {
    id: 6,
    date: '2025-07-05',
    collaborateur: 'Jean Dupont',
    fonction: 'Technicien espaces verts',
    adresse: 'L\'OREAL - 41 Rue Martre, 92110, Clichy',
    dureeMinutes: 105,
    budgetTemps: 65.65,
    budgetReel: 72.50,
    statut: 'effectue',
    tarifHoraire: 35.00
  },
  {
    id: 7,
    date: '2025-07-08',
    collaborateur: 'Lucas Bernard',
    fonction: 'Chef d\'équipe',
    adresse: 'DANONE - 17 Boulevard Haussmann, 75009, Paris',
    dureeMinutes: 165,
    budgetTemps: 103.15,
    budgetReel: 115.00,
    statut: 'effectue',
    tarifHoraire: 42.00
  },
  {
    id: 8,
    date: '2025-07-09',
    collaborateur: 'Emma Moreau',
    fonction: 'Jardinier paysagiste',
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
    fonction: 'Spécialiste arrosage',
    adresse: 'MICROSOFT - 37 Quai du Président Roosevelt, 92130, Issy-les-Moulineaux',
    dureeMinutes: 125,
    budgetTemps: 78.15,
    budgetReel: 87.50,
    statut: 'effectue',
    tarifHoraire: 33.00
  },
  {
    id: 10,
    date: '2025-07-11',
    collaborateur: 'Camille Roux',
    fonction: 'Technicien espaces verts',
    adresse: 'ORANGE - 78 Rue Olivier de Serres, 75015, Paris',
    dureeMinutes: 140,
    budgetTemps: 87.50,
    budgetReel: 97.50,
    statut: 'effectue',
    tarifHoraire: 35.00
  },
  {
    id: 11,
    date: '2025-07-12',
    collaborateur: 'Antoine Durand',
    fonction: 'Chef d\'équipe',
    adresse: 'Station F - 5 Parvis Alan Turing, 75013, Paris',
    dureeMinutes: 110,
    budgetTemps: 68.75,
    budgetReel: 77.00,
    statut: 'effectue',
    tarifHoraire: 42.00
  },
  {
    id: 12,
    date: '2025-07-15',
    collaborateur: 'Mathilde Garcia',
    fonction: 'Jardinier paysagiste',
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
    collaborateur: 'Julien Moreau',
    fonction: 'Spécialiste plantes d\'intérieur',
    adresse: 'HERMES - 24 Rue du Faubourg Saint-Honoré, 75008, Paris',
    dureeMinutes: 200,
    budgetTemps: 125.00,
    budgetReel: 140.00,
    statut: 'effectue',
    tarifHoraire: 38.00
  },
  {
    id: 14,
    date: '2025-07-17',
    collaborateur: 'Claire Lefebvre',
    fonction: 'Jardinier paysagiste',
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
    collaborateur: 'Nicolas Blanc',
    fonction: 'Technicien espaces verts',
    adresse: 'WINAMAX - 16 Boulevard Saint-Germain, 75005, Paris',
    dureeMinutes: 175,
    budgetTemps: 109.35,
    budgetReel: 122.50,
    statut: 'effectue',
    tarifHoraire: 35.00
  },
  {
    id: 16,
    date: '2025-07-19',
    collaborateur: 'Amélie Martin',
    fonction: 'Spécialiste plantes d\'intérieur',
    adresse: 'AIRBNB - 8 Rue de Londres, 75009, Paris',
    dureeMinutes: 160,
    budgetTemps: 100.00,
    budgetReel: 112.00,
    statut: 'effectue',
    tarifHoraire: 38.00
  },
  {
    id: 17,
    date: '2025-07-22',
    collaborateur: 'Maxime Rousseau',
    fonction: 'Chef d\'équipe',
    adresse: 'NETFLIX - 12 Rue Lincoln, 75008, Paris',
    dureeMinutes: 130,
    budgetTemps: 81.25,
    budgetReel: 91.00,
    statut: 'effectue',
    tarifHoraire: 42.00
  },
  {
    id: 18,
    date: '2025-07-23',
    collaborateur: 'Laura Girard',
    fonction: 'Spécialiste arrosage',
    adresse: 'UBER - 20 Avenue Rapp, 75007, Paris',
    dureeMinutes: 145,
    budgetTemps: 90.65,
    budgetReel: 101.50,
    statut: 'effectue',
    tarifHoraire: 33.00
  }
];

export const useRoleTimeData = ({ dateRange, timeGroup, dataChoice }) => {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);

  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setRawData(mockRoleInterventions);
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

  // Grouper les données par fonction
  const groupedByRole = useMemo(() => {
    if (!filteredData.length) return {};

    const groups = {};

    filteredData.forEach(item => {
      if (!groups[item.fonction]) {
        groups[item.fonction] = {
          fonction: item.fonction,
          type: 'Effectué terminé',
          adresses: new Set(),
          interventions: 0,
          dureeMinutes: 0,
          budgetTemps: 0,
          budgetReel: 0,
          tarifHoraire: item.tarifHoraire,
          collaborateurs: new Set()
        };
      }

      groups[item.fonction].adresses.add(item.adresse);
      groups[item.fonction].collaborateurs.add(item.collaborateur);
      groups[item.fonction].interventions += 1;
      groups[item.fonction].dureeMinutes += item.dureeMinutes;
      groups[item.fonction].budgetTemps += item.budgetTemps;
      groups[item.fonction].budgetReel += item.budgetReel;
    });

    // Convertir les Set en nombre et calculer tarif moyen par fonction
    Object.keys(groups).forEach(key => {
      groups[key].adresses = groups[key].adresses.size;
      const collaborateursArray = Array.from(groups[key].collaborateurs);
      
      // Calculer le tarif horaire moyen pour cette fonction
      const tarifsCollabs = filteredData
        .filter(item => item.fonction === key)
        .map(item => item.tarifHoraire);
      
      const tarifMoyen = tarifsCollabs.reduce((sum, tarif) => sum + tarif, 0) / tarifsCollabs.length;
      groups[key].tarifHoraire = Math.round(tarifMoyen * 100) / 100;
      
      delete groups[key].collaborateurs; // On n'en a plus besoin
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
    return Object.values(groupedByRole).map(group => ({
      fonction: group.fonction,
      type: group.type,
      adresses: group.adresses,
      interventions: group.interventions,
      dureeMinutes: group.dureeMinutes,
      budgetTemps: Math.round(group.budgetTemps * 100) / 100,
      budgetReel: Math.round(group.budgetReel * 100) / 100,
      tarifHoraire: group.tarifHoraire
    }));
  }, [groupedByRole]);

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

  // Calculer le tarif horaire moyen global
  const tarifHoraire = useMemo(() => {
    if (!tableData.length) return 37.50;
    
    // Pondérer par les heures travaillées de chaque fonction
    const totalHeures = totalData.dureeMinutes / 60;
    if (totalHeures === 0) return 37.50;
    
    const tarifPondere = tableData.reduce((sum, item) => {
      const heuresFonction = item.dureeMinutes / 60;
      return sum + (item.tarifHoraire * heuresFonction);
    }, 0);
    
    return Math.round((tarifPondere / totalHeures) * 100) / 100;
  }, [tableData, totalData]);

  // Fonction d'export
  const exportData = (format = 'csv') => {
    if (format === 'csv') {
      const headers = [
        'Fonction',
        'Type',
        'Adresses',
        'Interventions',
        'Durée (minutes)',
        'Budget (temps de travail)',
        'Budget (réel)',
        'Tarif horaire'
      ];

      const csvContent = [
        headers.join(','),
        ...tableData.map(row => [
          row.fonction,
          row.type,
          row.adresses,
          row.interventions,
          row.dureeMinutes,
          row.budgetTemps,
          row.budgetReel,
          row.tarifHoraire
        ].join(',')),
        // Ligne de total
        [
          'TOTAL',
          '-',
          totalData.adresses,
          totalData.interventions,
          totalData.dureeMinutes,
          totalData.budgetTemps,
          totalData.budgetReel,
          tarifHoraire
        ].join(',')
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `temps-travaille-fonctions-${format(new Date(), 'yyyy-MM-dd')}.csv`);
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