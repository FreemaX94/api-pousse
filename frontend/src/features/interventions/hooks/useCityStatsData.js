import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, startOfWeek, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

// Données mock pour la simulation - données par ville
const mockCityInterventions = [
  {
    id: 1,
    date: '2025-07-01',
    collaborateur: 'Simon Henry',
    fonction: 'Chef d\'équipe',
    client: 'Singular',
    adresse: 'Singular - 38 Rue Des Jeûneurs, 75002, Paris',
    pays: 'France',
    region: 'Île-de-France',
    departement: 'Paris (75)',
    ville: 'Paris',
    codePostal: '75002',
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
    region: 'Île-de-France',
    departement: 'Paris (75)',
    ville: 'Paris',
    codePostal: '75013',
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
    client: 'Peugeot Lyon',
    adresse: 'Peugeot Lyon - 75 Avenue Jean Jaurès, 69007, Lyon',
    pays: 'France',
    region: 'Auvergne-Rhône-Alpes',
    departement: 'Rhône (69)',
    ville: 'Lyon',
    codePostal: '69007',
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
    client: 'Airbus Toulouse',
    adresse: 'Airbus Toulouse - 2 Rond-Point Emile Dewoitine, 31700, Blagnac',
    pays: 'France',
    region: 'Occitanie',
    departement: 'Haute-Garonne (31)',
    ville: 'Blagnac',
    codePostal: '31700',
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
    client: 'BMW Group Benelux',
    adresse: 'BMW Group Benelux - Chaussée de Louvain 816, 1140, Bruxelles',
    pays: 'Belgique',
    region: 'Région de Bruxelles-Capitale',
    departement: 'Bruxelles-Capitale',
    ville: 'Bruxelles',
    codePostal: '1140',
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
    client: 'Michelin Clermont',
    adresse: 'Michelin Clermont - 23 Place des Carmes-Déchaux, 63000, Clermont-Ferrand',
    pays: 'France',
    region: 'Auvergne-Rhône-Alpes',
    departement: 'Puy-de-Dôme (63)',
    ville: 'Clermont-Ferrand',
    codePostal: '63000',
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
    client: 'Dassault Bordeaux',
    adresse: 'Dassault Bordeaux - 78 Quai de Bacalan, 33300, Bordeaux',
    pays: 'France',
    region: 'Nouvelle-Aquitaine',
    departement: 'Gironde (33)',
    ville: 'Bordeaux',
    codePostal: '33300',
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
    client: 'UBS Switzerland',
    adresse: 'UBS Switzerland - Bahnhofstrasse 45, 8001, Zürich',
    pays: 'Suisse',
    region: 'Zurich',
    departement: 'Zurich',
    ville: 'Zürich',
    codePostal: '8001',
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
    client: 'Sanofi Lille',
    adresse: 'Sanofi Lille - 82 Avenue Hobson, 59120, Loos',
    pays: 'France',
    region: 'Hauts-de-France',
    departement: 'Nord (59)',
    ville: 'Loos',
    codePostal: '59120',
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
    client: 'Thales Rennes',
    adresse: 'Thales Rennes - 4 Avenue Réaumur, 35700, Rennes',
    pays: 'France',
    region: 'Bretagne',
    departement: 'Ille-et-Vilaine (35)',
    ville: 'Rennes',
    codePostal: '35700',
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
    client: 'Credit Suisse',
    adresse: 'Credit Suisse - Paradeplatz 8, 8001, Zürich',
    pays: 'Suisse',
    region: 'Zurich',
    departement: 'Zurich',
    ville: 'Zürich',
    codePostal: '8001',
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
    client: 'Nestlé Vevey',
    adresse: 'Nestlé Vevey - Avenue Nestlé 55, 1800, Vevey',
    pays: 'Suisse',
    region: 'Vaud',
    departement: 'Vaud',
    ville: 'Vevey',
    codePostal: '1800',
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
    client: 'Decathlon Lille',
    adresse: 'Decathlon Lille - 4 Boulevard de Mons, 59650, Villeneuve-d\'Ascq',
    pays: 'France',
    region: 'Hauts-de-France',
    departement: 'Nord (59)',
    ville: 'Villeneuve-d\'Ascq',
    codePostal: '59650',
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
    client: 'Carrefour Angers',
    adresse: 'Carrefour Angers - 2 Rue de la Mairie, 49000, Angers',
    pays: 'France',
    region: 'Pays de la Loire',
    departement: 'Maine-et-Loire (49)',
    ville: 'Angers',
    codePostal: '49000',
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
    client: 'Philips Gent',
    adresse: 'Philips Gent - Benson & Hedgesstraat 5, 9000, Gent',
    pays: 'Belgique',
    region: 'Flandre-Orientale',
    departement: 'Flandre-Orientale',
    ville: 'Gent',
    codePostal: '9000',
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
    client: 'Vinci Nanterre',
    adresse: 'Vinci Nanterre - 1 Cours Ferdinand de Lesseps, 92851, Rueil-Malmaison',
    pays: 'France',
    region: 'Île-de-France',
    departement: 'Hauts-de-Seine (92)',
    ville: 'Rueil-Malmaison',
    codePostal: '92851',
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
    client: 'L\'Oréal Lyon',
    adresse: 'L\'Oréal Lyon - 62 Quai Charles de Gaulle, 69006, Lyon',
    pays: 'France',
    region: 'Auvergne-Rhône-Alpes',
    departement: 'Rhône (69)',
    ville: 'Lyon',
    codePostal: '69006',
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
    client: 'Schneider Electric Grenoble',
    adresse: 'Schneider Electric Grenoble - 38 Rue Joseph Cugnot, 38000, Grenoble',
    pays: 'France',
    region: 'Auvergne-Rhône-Alpes',
    departement: 'Isère (38)',
    ville: 'Grenoble',
    codePostal: '38000',
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
    region: 'Luxembourg',
    departement: 'Luxembourg',
    ville: 'Luxembourg',
    codePostal: '1115',
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
    client: 'Orange Rennes',
    adresse: 'Orange Rennes - 4 Rue du Pré Botté, 35000, Rennes',
    pays: 'France',
    region: 'Bretagne',
    departement: 'Ille-et-Vilaine (35)',
    ville: 'Rennes',
    codePostal: '35000',
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
    client: 'BNP Paribas Fortis',
    adresse: 'BNP Paribas Fortis - Montagne du Parc 3, 1000, Bruxelles',
    pays: 'Belgique',
    region: 'Région de Bruxelles-Capitale',
    departement: 'Bruxelles-Capitale',
    ville: 'Bruxelles',
    codePostal: '1000',
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
    client: 'LVMH Reims',
    adresse: 'LVMH Reims - 20 Avenue de Champagne, 51200, Épernay',
    pays: 'France',
    region: 'Grand Est',
    departement: 'Marne (51)',
    ville: 'Épernay',
    codePostal: '51200',
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
    client: 'Capgemini Toulouse',
    adresse: 'Capgemini Toulouse - 118 Route de Narbonne, 31400, Toulouse',
    pays: 'France',
    region: 'Occitanie',
    departement: 'Haute-Garonne (31)',
    ville: 'Toulouse',
    codePostal: '31400',
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
    client: 'Ubisoft Annecy',
    adresse: 'Ubisoft Annecy - 368 Rue du Paradis, 74370, Metz-Tessy',
    pays: 'France',
    region: 'Auvergne-Rhône-Alpes',
    departement: 'Haute-Savoie (74)',
    ville: 'Metz-Tessy',
    codePostal: '74370',
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
    client: 'Danone Evian',
    adresse: 'Danone Evian - Avenue des Sources, 74500, Évian-les-Bains',
    pays: 'France',
    region: 'Auvergne-Rhône-Alpes',
    departement: 'Haute-Savoie (74)',
    ville: 'Évian-les-Bains',
    codePostal: '74500',
    dureeMinutes: 80,
    budgetTemps: 50.00,
    budgetReel: 55.50,
    statut: 'effectue',
    tarifHoraire: 37.50
  }
];

export const useCityStatsData = ({ dateRange, timeGroup, dataChoice, measure = 'heures' }) => {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);

  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setRawData(mockCityInterventions);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [dateRange, dataChoice, measure]);

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

  // Grouper les données par ville
  const groupedByCity = useMemo(() => {
    if (!filteredData.length) return {};

    const groups = {};

    filteredData.forEach(item => {
      const key = `${item.pays}_${item.region}_${item.departement}_${item.ville}_${item.codePostal}`;
      
      if (!groups[key]) {
        groups[key] = {
          pays: item.pays,
          region: item.region,
          departement: item.departement,
          ville: item.ville,
          codePostal: item.codePostal,
          type: 'Effectué terminé',
          adresses: new Set(),
          interventions: 0,
          dureeMinutes: 0,
          budgetTemps: 0,
          budgetReel: 0,
          tarifsHoraires: []
        };
      }

      groups[key].adresses.add(item.adresse);
      groups[key].interventions += 1;
      groups[key].dureeMinutes += item.dureeMinutes;
      groups[key].budgetTemps += item.budgetTemps;
      groups[key].budgetReel += item.budgetReel;
      groups[key].tarifsHoraires.push({
        tarif: item.tarifHoraire,
        heures: item.dureeMinutes / 60
      });
    });

    // Convertir les Set en nombre et calculer tarif moyen pondéré par ville
    Object.keys(groups).forEach(key => {
      groups[key].adresses = groups[key].adresses.size;
      
      // Calculer le tarif horaire moyen pondéré pour cette ville
      const totalHeuresVille = groups[key].dureeMinutes / 60;
      if (totalHeuresVille > 0) {
        const tarifPondere = groups[key].tarifsHoraires.reduce((sum, item) => {
          return sum + (item.tarif * item.heures);
        }, 0);
        groups[key].tarifHoraire = Math.round((tarifPondere / totalHeuresVille) * 100) / 100;
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
          dureeMinutes: 0,
          budgetTemps: 0,
          budgetReel: 0,
          interventions: 0
        };
      }

      groups[groupKey].dureeMinutes += item.dureeMinutes;
      groups[groupKey].budgetTemps += item.budgetTemps;
      groups[groupKey].budgetReel += item.budgetReel;
      groups[groupKey].interventions += 1;
    });

    return groups;
  }, [filteredData, timeGroup]);

  // Préparer les données pour le graphique selon la mesure
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

      let value;
      switch (measure) {
        case 'chiffre-affaires':
          value = Math.round(groupedByPeriod[key].budgetReel * 100) / 100;
          break;
        case 'interventions':
          value = groupedByPeriod[key].interventions;
          break;
        case 'heures':
        default:
          value = Math.round(groupedByPeriod[key].dureeMinutes / 60 * 100) / 100;
          break;
      }

      return {
        period,
        heures: value,
        date: key
      };
    });
  }, [groupedByPeriod, timeGroup, measure]);

  // Préparer les données pour le tableau
  const tableData = useMemo(() => {
    return Object.values(groupedByCity).map(group => ({
      pays: group.pays,
      region: group.region,
      departement: group.departement,
      ville: group.ville,
      codePostal: group.codePostal,
      villeComplete: `${group.ville} (${group.codePostal})`,
      type: group.type,
      adresses: group.adresses,
      interventions: group.interventions,
      dureeMinutes: group.dureeMinutes,
      budgetTemps: Math.round(group.budgetTemps * 100) / 100,
      budgetReel: Math.round(group.budgetReel * 100) / 100,
      tarifHoraire: group.tarifHoraire
    }));
  }, [groupedByCity]);

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
    
    // Pondérer par les heures travaillées de chaque ville
    const totalHeures = totalData.dureeMinutes / 60;
    if (totalHeures === 0) return 37.50;
    
    const tarifPondere = tableData.reduce((sum, item) => {
      const heuresVille = item.dureeMinutes / 60;
      return sum + (item.tarifHoraire * heuresVille);
    }, 0);
    
    return Math.round((tarifPondere / totalHeures) * 100) / 100;
  }, [tableData, totalData]);

  // Fonction d'export
  const exportData = (format = 'csv') => {
    if (format === 'csv') {
      const headers = [
        'Pays',
        'Région',
        'Département',
        'Ville',
        'Code Postal',
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
          `"${row.region}"`,
          `"${row.departement}"`,
          `"${row.ville}"`,
          `"${row.codePostal}"`,
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
          '-',
          '-',
          '-',
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
      link.setAttribute('download', `temps-travaille-villes-${format(new Date(), 'yyyy-MM-dd')}.csv`);
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