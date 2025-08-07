import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, startOfWeek, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

// Données mock pour la simulation - données par pays
const mockCountryInterventions = [
  {
    id: 1,
    date: '2025-07-01',
    collaborateur: 'Simon Henry',
    fonction: 'Chef d\'équipe',
    client: 'Singular',
    adresse: 'Singular - 38 Rue Des Jeûneurs, 75002, Paris',
    pays: 'France',
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
    client: 'TORAY CE',
    adresse: 'TORAY CE - 18 Avenue de la Porte d\'Italie, 75013, Paris',
    pays: 'France',
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
    client: 'BMW Group Benelux',
    adresse: 'BMW Group Benelux - Chaussée de Louvain 816, 1140, Bruxelles',
    pays: 'Belgique',
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
    client: 'UBS Switzerland',
    adresse: 'UBS Switzerland - Bahnhofstrasse 45, 8001, Zürich',
    pays: 'Suisse',
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
    client: 'BNP PARIBAS',
    adresse: 'BNP PARIBAS - 16 Boulevard des Italiens, 75009, Paris',
    pays: 'France',
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
    client: 'Deutsche Bank Luxembourg',
    adresse: 'Deutsche Bank Luxembourg - 2 Boulevard Konrad Adenauer, 1115, Luxembourg',
    pays: 'Luxembourg',
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
    client: 'KPMG Italia',
    adresse: 'KPMG Italia - Via Vittor Pisani 25, 20124, Milano',
    pays: 'Italie',
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
    client: 'Siemens Deutschland',
    adresse: 'Siemens Deutschland - Werner-von-Siemens-Straße 1, 80333, München',
    pays: 'Allemagne',
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
    client: 'ING Bank Nederland',
    adresse: 'ING Bank Nederland - Bijlmerplein 888, 1102, Amsterdam',
    pays: 'Pays-Bas',
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
    client: 'ORANGE',
    adresse: 'ORANGE - 78 Rue Olivier de Serres, 75015, Paris',
    pays: 'France',
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
    client: 'Banco Santander España',
    adresse: 'Banco Santander España - Paseo de la Castellana 24, 28046, Madrid',
    pays: 'Espagne',
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
    client: 'BMW Group Benelux',
    adresse: 'BMW Group Benelux - Chaussée de Louvain 816, 1140, Bruxelles',
    pays: 'Belgique',
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
    client: 'Credit Suisse',
    adresse: 'Credit Suisse - Paradeplatz 8, 8001, Zürich',
    pays: 'Suisse',
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
    client: 'Spotify AB',
    adresse: 'Spotify AB - Regeringsgatan 19, 111 53, Stockholm',
    pays: 'Suède',
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
    client: 'KPMG Italia',
    adresse: 'KPMG Italia - Via Vittor Pisani 25, 20124, Milano',
    pays: 'Italie',
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
    client: 'Siemens Deutschland',
    adresse: 'Siemens Deutschland - Werner-von-Siemens-Straße 1, 80333, München',
    pays: 'Allemagne',
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
    client: 'ING Bank Nederland',
    adresse: 'ING Bank Nederland - Bijlmerplein 888, 1102, Amsterdam',
    pays: 'Pays-Bas',
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
    client: 'Banco Santander España',
    adresse: 'Banco Santander España - Paseo de la Castellana 24, 28046, Madrid',
    pays: 'Espagne',
    dureeMinutes: 145,
    budgetTemps: 90.65,
    budgetReel: 101.50,
    statut: 'effectue',
    tarifHoraire: 33.00
  },
  {
    id: 19,
    date: '2025-07-24',
    collaborateur: 'Alexis Fournier',
    fonction: 'Technicien espaces verts',
    client: 'Deutsche Bank Luxembourg',
    adresse: 'Deutsche Bank Luxembourg - 2 Boulevard Konrad Adenauer, 1115, Luxembourg',
    pays: 'Luxembourg',
    dureeMinutes: 155,
    budgetTemps: 96.85,
    budgetReel: 108.50,
    statut: 'effectue',
    tarifHoraire: 35.00
  },
  {
    id: 20,
    date: '2025-07-25',
    collaborateur: 'Céline Vidal',
    fonction: 'Spécialiste plantes d\'intérieur',
    client: 'Spotify AB',
    adresse: 'Spotify AB - Regeringsgatan 19, 111 53, Stockholm',
    pays: 'Suède',
    dureeMinutes: 190,
    budgetTemps: 118.75,
    budgetReel: 133.00,
    statut: 'effectue',
    tarifHoraire: 38.00
  },
  {
    id: 21,
    date: '2025-07-03',
    collaborateur: 'Simon Henry',
    fonction: 'Chef d\'équipe',
    client: 'SOCIETE GENERALE',
    adresse: 'SOCIETE GENERALE - 29 Boulevard Haussmann, 75009, Paris',
    pays: 'France',
    dureeMinutes: 95,
    budgetTemps: 59.35,
    budgetReel: 66.50,
    statut: 'effectue',
    tarifHoraire: 42.00
  },
  {
    id: 22,
    date: '2025-07-08',
    collaborateur: 'Marie Dubois',
    fonction: 'Technicien espaces verts',
    client: 'Royal Bank of Scotland',
    adresse: 'Royal Bank of Scotland - 36 St Andrew Square, EH2 2YB, Edinburgh',
    pays: 'Royaume-Uni',
    dureeMinutes: 170,
    budgetTemps: 106.25,
    budgetReel: 118.50,
    statut: 'effectue',
    tarifHoraire: 35.00
  },
  {
    id: 23,
    date: '2025-07-14',
    collaborateur: 'Paul Moreno',
    fonction: 'Jardinier paysagiste',
    client: 'Nordea Bank AB',
    adresse: 'Nordea Bank AB - Smålandsgatan 17, 105 71, Stockholm',
    pays: 'Suède',
    dureeMinutes: 115,
    budgetTemps: 71.85,
    budgetReel: 80.50,
    statut: 'effectue',
    tarifHoraire: 37.50
  },
  {
    id: 24,
    date: '2025-07-20',
    collaborateur: 'Isabelle Blanc',
    fonction: 'Spécialiste arrosage',
    client: 'Royal Bank of Scotland',
    adresse: 'Royal Bank of Scotland - 36 St Andrew Square, EH2 2YB, Edinburgh',
    pays: 'Royaume-Uni',
    dureeMinutes: 185,
    budgetTemps: 115.65,
    budgetReel: 129.50,
    statut: 'effectue',
    tarifHoraire: 33.00
  },
  {
    id: 25,
    date: '2025-07-01',
    collaborateur: 'Emma Moreau',
    fonction: 'Jardinier paysagiste',
    client: 'Singular',
    adresse: 'Singular - 38 Rue Des Jeûneurs, 75002, Paris',
    pays: 'France',
    dureeMinutes: 80,
    budgetTemps: 50.00,
    budgetReel: 55.50,
    statut: 'effectue',
    tarifHoraire: 37.50
  }
];

export const useCountryStatsData = ({ dateRange, timeGroup, dataChoice }) => {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);

  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setRawData(mockCountryInterventions);
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

  // Grouper les données par pays
  const groupedByCountry = useMemo(() => {
    if (!filteredData.length) return {};

    const groups = {};

    filteredData.forEach(item => {
      if (!groups[item.pays]) {
        groups[item.pays] = {
          pays: item.pays,
          type: 'Effectué terminé',
          adresses: new Set(),
          interventions: 0,
          dureeMinutes: 0,
          budgetTemps: 0,
          budgetReel: 0,
          tarifsHoraires: []
        };
      }

      groups[item.pays].adresses.add(item.adresse);
      groups[item.pays].interventions += 1;
      groups[item.pays].dureeMinutes += item.dureeMinutes;
      groups[item.pays].budgetTemps += item.budgetTemps;
      groups[item.pays].budgetReel += item.budgetReel;
      groups[item.pays].tarifsHoraires.push({
        tarif: item.tarifHoraire,
        heures: item.dureeMinutes / 60
      });
    });

    // Convertir les Set en nombre et calculer tarif moyen pondéré par pays
    Object.keys(groups).forEach(key => {
      groups[key].adresses = groups[key].adresses.size;
      
      // Calculer le tarif horaire moyen pondéré pour ce pays
      const totalHeuresPays = groups[key].dureeMinutes / 60;
      if (totalHeuresPays > 0) {
        const tarifPondere = groups[key].tarifsHoraires.reduce((sum, item) => {
          return sum + (item.tarif * item.heures);
        }, 0);
        groups[key].tarifHoraire = Math.round((tarifPondere / totalHeuresPays) * 100) / 100;
      } else {
        groups[key].tarifHoraire = 37.50; // Valeur par défaut
      }
      
      delete groups[key].tarifsHoraires;
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
    return Object.values(groupedByCountry).map(group => ({
      pays: group.pays,
      type: group.type,
      adresses: group.adresses,
      interventions: group.interventions,
      dureeMinutes: group.dureeMinutes,
      budgetTemps: Math.round(group.budgetTemps * 100) / 100,
      budgetReel: Math.round(group.budgetReel * 100) / 100,
      tarifHoraire: group.tarifHoraire
    }));
  }, [groupedByCountry]);

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

  // Calculer le tarif horaire moyen global pondéré
  const tarifHoraire = useMemo(() => {
    if (!tableData.length) return 37.50;
    
    // Pondérer par les heures travaillées de chaque pays
    const totalHeures = totalData.dureeMinutes / 60;
    if (totalHeures === 0) return 37.50;
    
    const tarifPondere = tableData.reduce((sum, item) => {
      const heuresPays = item.dureeMinutes / 60;
      return sum + (item.tarifHoraire * heuresPays);
    }, 0);
    
    return Math.round((tarifPondere / totalHeures) * 100) / 100;
  }, [tableData, totalData]);

  // Fonction d'export
  const exportData = (format = 'csv') => {
    if (format === 'csv') {
      const headers = [
        'Pays',
        'Type',
        'Adresses',
        'Interventions',
        'Durée (heures)',
        'Durée (minutes)',
        'Budget (temps de travail)',
        'Budget (réel)',
        'Tarif horaire'
      ];

      const csvContent = [
        headers.join(','),
        ...tableData.map(row => [
          `"${row.pays}"`,
          row.type,
          row.adresses,
          row.interventions,
          Math.round(row.dureeMinutes / 60 * 100) / 100,
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
          Math.round(totalData.dureeMinutes / 60 * 100) / 100,
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
      link.setAttribute('download', `temps-travaille-pays-${format(new Date(), 'yyyy-MM-dd')}.csv`);
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