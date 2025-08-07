import { useState, useEffect, useMemo } from 'react';

// Données mock pour la simulation - interventions avec assignations et catégories
const mockInterventions = [
  {
    id: 1,
    date: '2025-07-01',
    collaborateur: 'Simon Henry',
    permis: 'B',
    client: 'Singular',
    categorie: 'Entretien',
    statut: 'effectue',
    description: 'Arrosage plantes intérieures'
  },
  {
    id: 2,
    date: '2025-07-02',
    collaborateur: 'Elodie Treveten',
    permis: null,
    client: 'TORAY CE',
    categorie: 'Taille',
    statut: 'effectue',
    description: 'Taille arbustes extérieurs'
  },
  {
    id: 3,
    date: '2025-07-02',
    collaborateur: 'Marie Dubois',
    permis: 'B',
    client: 'CREDIT MUTUEL',
    categorie: 'Nettoyage',
    statut: 'non-effectue',
    description: 'Nettoyage bacs à plantes'
  },
  {
    id: 4,
    date: '2025-07-03',
    collaborateur: 'Pierre Martin',
    permis: 'B+E',
    client: 'SOCIETE GENERALE',
    categorie: 'Fertilisation',
    statut: 'effectue',
    description: 'Application d\'engrais'
  },
  {
    id: 5,
    date: '2025-07-04',
    collaborateur: 'Sophie Leroy',
    permis: null,
    client: 'BNP PARIBAS',
    categorie: 'Entretien',
    statut: 'effectue',
    description: 'Arrosage et contrôle'
  },
  {
    id: 6,
    date: '2025-07-05',
    collaborateur: 'Jean Dupont',
    permis: 'B',
    client: 'L\'OREAL',
    categorie: 'Rempotage',
    statut: 'non-effectue',
    description: 'Rempotage plantes bureau'
  },
  {
    id: 7,
    date: '2025-07-08',
    collaborateur: 'Simon Henry',
    permis: 'B',
    client: 'DANONE',
    categorie: 'Taille',
    statut: 'effectue',
    description: 'Taille haies et arbustes'
  },
  {
    id: 8,
    date: '2025-07-09',
    collaborateur: 'Elodie Treveten',
    permis: null,
    client: 'TOTAL ENERGIES',
    categorie: 'Entretien',
    statut: 'non-effectue',
    description: 'Entretien terrasses'
  },
  {
    id: 9,
    date: '2025-07-10',
    collaborateur: 'Marie Dubois',
    permis: 'B',
    client: 'MICROSOFT',
    categorie: 'Fertilisation',
    statut: 'effectue',
    description: 'Fertilisation pelouse'
  },
  {
    id: 10,
    date: '2025-07-11',
    collaborateur: 'Pierre Martin',
    permis: 'B+E',
    client: 'ORANGE',
    categorie: 'Nettoyage',
    statut: 'effectue',
    description: 'Nettoyage espaces verts'
  },
  {
    id: 11,
    date: '2025-07-12',
    collaborateur: 'Sophie Leroy',
    permis: null,
    client: 'Station F',
    categorie: 'Rempotage',
    statut: 'non-effectue',
    description: 'Rempotage plantes d\'accueil'
  },
  {
    id: 12,
    date: '2025-07-15',
    collaborateur: 'Jean Dupont',
    permis: 'B',
    client: 'SEPHORA',
    categorie: 'Entretien',
    statut: 'effectue',
    description: 'Entretien vitrine végétale'
  },
  {
    id: 13,
    date: '2025-07-16',
    collaborateur: 'Simon Henry',
    permis: 'B',
    client: 'HERMES',
    categorie: 'Taille',
    statut: 'non-effectue',
    description: 'Taille topiaires'
  },
  {
    id: 14,
    date: '2025-07-17',
    collaborateur: 'Elodie Treveten',
    permis: null,
    client: 'SPOTIFY',
    categorie: 'Fertilisation',
    statut: 'effectue',
    description: 'Apport nutritif plantes'
  },
  {
    id: 15,
    date: '2025-07-18',
    collaborateur: 'Marie Dubois',
    permis: 'B',
    client: 'WINAMAX',
    categorie: 'Nettoyage',
    statut: 'effectue',
    description: 'Nettoyage jardinières'
  },
  {
    id: 16,
    date: '2025-07-19',
    collaborateur: 'Pierre Martin',
    permis: 'B+E',
    client: 'AIRBNB',
    categorie: 'Entretien',
    statut: 'non-effectue',
    description: 'Entretien général'
  },
  {
    id: 17,
    date: '2025-07-22',
    collaborateur: 'Sophie Leroy',
    permis: null,
    client: 'NETFLIX',
    categorie: 'Rempotage',
    statut: 'effectue',
    description: 'Rempotage plantes lobby'
  },
  {
    id: 18,
    date: '2025-07-23',
    collaborateur: 'Jean Dupont',
    permis: 'B',
    client: 'UBER',
    categorie: 'Taille',
    statut: 'effectue',
    description: 'Taille végétation'
  },
  {
    id: 19,
    date: '2025-07-24',
    collaborateur: 'Simon Henry',
    permis: 'B',
    client: 'APPLE',
    categorie: 'Fertilisation',
    statut: 'non-effectue',
    description: 'Fertilisation ciblée'
  },
  {
    id: 20,
    date: '2025-07-25',
    collaborateur: 'Elodie Treveten',
    permis: null,
    client: 'GOOGLE',
    categorie: 'Entretien',
    statut: 'effectue',
    description: 'Entretien complet'
  }
];

export const useInterventionStatsData = ({ dateRange, filters = {} }) => {
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
  }, [dateRange, filters]);

  // Filtrer les données selon la période et les filtres
  const filteredData = useMemo(() => {
    if (!rawData.length) return [];

    let filtered = rawData.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      return itemDate >= startDate && itemDate <= endDate;
    });

    // Appliquer les filtres additionnels
    if (filters.statut && filters.statut !== 'tous') {
      filtered = filtered.filter(item => item.statut === filters.statut);
    }

    if (filters.collaborateur && filters.collaborateur !== 'tous') {
      filtered = filtered.filter(item => item.collaborateur === filters.collaborateur);
    }

    if (filters.client && filters.client !== 'tous') {
      filtered = filtered.filter(item => item.client === filters.client);
    }

    if (filters.categorie && filters.categorie !== 'tous') {
      filtered = filtered.filter(item => item.categorie === filters.categorie);
    }

    return filtered;
  }, [rawData, dateRange, filters]);

  // Grouper les données par collaborateur
  const collaborateurStats = useMemo(() => {
    if (!filteredData.length) return [];

    const groups = {};

    filteredData.forEach(item => {
      if (!groups[item.collaborateur]) {
        groups[item.collaborateur] = {
          collaborateur: item.collaborateur,
          permis: item.permis,
          effectue: 0,
          nonEffectue: 0,
          total: 0
        };
      }

      groups[item.collaborateur].total += 1;
      if (item.statut === 'effectue') {
        groups[item.collaborateur].effectue += 1;
      } else {
        groups[item.collaborateur].nonEffectue += 1;
      }
    });

    // Calculer les pourcentages
    return Object.values(groups).map(group => ({
      ...group,
      avancement: group.total > 0 ? Math.round((group.effectue / group.total) * 100) : 0
    }));
  }, [filteredData]);

  // Grouper les données par catégorie
  const categorieStats = useMemo(() => {
    if (!filteredData.length) return [];

    const groups = {};

    filteredData.forEach(item => {
      if (!groups[item.categorie]) {
        groups[item.categorie] = {
          categorie: item.categorie,
          effectue: 0,
          nonEffectue: 0,
          total: 0
        };
      }

      groups[item.categorie].total += 1;
      if (item.statut === 'effectue') {
        groups[item.categorie].effectue += 1;
      } else {
        groups[item.categorie].nonEffectue += 1;
      }
    });

    // Calculer les pourcentages
    return Object.values(groups).map(group => ({
      ...group,
      avancement: group.total > 0 ? Math.round((group.effectue / group.total) * 100) : 0
    }));
  }, [filteredData]);

  // Options pour les filtres
  const filterOptions = useMemo(() => {
    const uniqueCollaborateurs = [...new Set(rawData.map(item => item.collaborateur))];
    const uniqueClients = [...new Set(rawData.map(item => item.client))];
    const uniqueCategories = [...new Set(rawData.map(item => item.categorie))];

    return {
      collaborateurs: uniqueCollaborateurs.sort(),
      clients: uniqueClients.sort(),
      categories: uniqueCategories.sort(),
      statuts: ['effectue', 'non-effectue']
    };
  }, [rawData]);

  // Statistiques globales
  const globalStats = useMemo(() => {
    const total = filteredData.length;
    const effectue = filteredData.filter(item => item.statut === 'effectue').length;
    const nonEffectue = total - effectue;
    const avancement = total > 0 ? Math.round((effectue / total) * 100) : 0;

    return {
      total,
      effectue,
      nonEffectue,
      avancement
    };
  }, [filteredData]);

  return {
    collaborateurStats,
    categorieStats,
    globalStats,
    filterOptions,
    loading
  };
};