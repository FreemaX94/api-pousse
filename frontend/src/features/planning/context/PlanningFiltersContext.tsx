import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Collaborator {
  id: string;
  name: string;
  color: string;
  group: 'bureau' | 'terrain';
}

interface ActivityType {
  id: string;
  name: string;
  color: string;
}

interface DisplayElement {
  id: string;
  name: string;
  enabled: boolean;
}

interface ColorCode {
  id: string;
  name: string;
  color: string;
  description: string;
}

interface ActionCourante {
  id: string;
  name: string;
  color: string;
}

interface TermineStatus {
  id: string;
  name: string;
  color: string;
}

interface CategorieIntervention {
  id: string;
  name: string;
  color: string;
}

interface PlanningFilters {
  collaborators: {
    none: boolean;
    selected: string[];
  };
  activityTypes: string[];
  displayElements: string[];
  colorCodes: {
    collaborators: string[];
    actionsCourantes: string[];
    termine: string[];
    categoriesInterventions: string[];
    etatFacturation: string[];
    typesActivite: string[];
  };
}

interface PlanningFiltersContextType {
  filters: PlanningFilters;
  updateCollaborators: (collaboratorIds: string[], includeNone?: boolean) => void;
  updateActivityTypes: (activityTypeIds: string[]) => void;
  updateDisplayElements: (elementIds: string[]) => void;
  updateColorCodes: (section: keyof PlanningFilters['colorCodes'], colorCodeIds: string[]) => void;
  collaborators: Collaborator[];
  activityTypes: ActivityType[];
  displayElements: DisplayElement[];
  colorCodes: ColorCode[];
  actionsCourantes: ActionCourante[];
  termineStatuses: TermineStatus[];
  categoriesInterventions: CategorieIntervention[];
}

const PlanningFiltersContext = createContext<PlanningFiltersContextType | undefined>(undefined);

export const usePlanningFilters = () => {
  const context = useContext(PlanningFiltersContext);
  if (!context) {
    throw new Error('usePlanningFilters must be used within a PlanningFiltersProvider');
  }
  return context;
};

const defaultCollaborators: Collaborator[] = [
  // Bureau
  { id: 'estelle', name: 'Estelle Delapierre', color: '#EF4444', group: 'bureau' },
  { id: 'florence', name: 'Florence Roger', color: '#3B82F6', group: 'bureau' },
  { id: 'lucie', name: 'Lucie Garcia', color: '#F97316', group: 'bureau' },
  
  // Terrain
  { id: 'aymeric', name: 'Aymeric Tireau', color: '#10B981', group: 'terrain' },
  { id: 'david', name: 'David Celeste', color: '#DC2626', group: 'terrain' },
  { id: 'elodie', name: 'Elodie Treveten', color: '#059669', group: 'terrain' },
  { id: 'marine', name: 'Marine Sandoz', color: '#EAB308', group: 'terrain' },
  { id: 'simon', name: 'Simon Henry', color: '#EA580C', group: 'terrain' }
];

const defaultActivityTypes: ActivityType[] = [
  { id: 'maintenance', name: 'Maintenance', color: '#10B981' },
  { id: 'installation', name: 'Installation', color: '#3B82F6' },
  { id: 'diagnostic', name: 'Diagnostic', color: '#F59E0B' },
  { id: 'reparation', name: 'Réparation', color: '#EF4444' },
  { id: 'entretien', name: 'Entretien', color: '#8B5CF6' },
  { id: 'livraison', name: 'Livraison', color: '#06B6D4' },
  { id: 'formation', name: 'Formation', color: '#84CC16' },
  { id: 'autre', name: 'Autre', color: '#6B7280' }
];

const defaultDisplayElements: DisplayElement[] = [
  { id: 'interventions', name: 'Interventions', enabled: true },
  { id: 'pointages', name: 'Pointages', enabled: true },
  { id: 'absences', name: 'Absences', enabled: false },
  { id: 'revisions_vehicules', name: 'Révisions véhicules', enabled: false },
  { id: 'recurrences', name: 'Récurrences', enabled: true }
];

const defaultColorCodes: ColorCode[] = [
  { id: 'maintenance', name: 'Maintenance', color: '#10B981', description: 'Maintenance préventive et corrective' },
  { id: 'installation', name: 'Installation', color: '#3B82F6', description: 'Installation de nouvelles plantes' },
  { id: 'diagnostic', name: 'Diagnostic', color: '#F59E0B', description: 'Évaluation et diagnostic' },
  { id: 'reparation', name: 'Réparation', color: '#EF4444', description: 'Réparation d\'équipements' },
  { id: 'entretien', name: 'Entretien', color: '#8B5CF6', description: 'Entretien courant' },
  { id: 'livraison', name: 'Livraison', color: '#06B6D4', description: 'Livraison et transport' },
  { id: 'formation', name: 'Formation', color: '#84CC16', description: 'Formation du personnel' },
  { id: 'autre', name: 'Autre', color: '#6B7280', description: 'Autres interventions' }
];

const defaultActionsCourantes: ActionCourante[] = [
  { id: 'autre', name: 'Autre', color: '#6B7280' },
  { id: 'tonte', name: 'Tonte', color: '#84CC16' },
  { id: 'taille', name: 'Taille', color: '#F59E0B' },
  { id: 'debroussaillage', name: 'Débroussaillage', color: '#10B981' },
  { id: 'desherbage', name: 'Désherbage', color: '#EF4444' },
  { id: 'broyage_fauchage', name: 'Broyage / Fauchage', color: '#8B5CF6' },
  { id: 'elagage', name: 'Élagage', color: '#06B6D4' },
  { id: 'ramassage_feuilles', name: 'Ramassage des feuilles', color: '#F97316' },
  { id: 'abattage', name: 'Abattage', color: '#DC2626' },
  { id: 'terrassement', name: 'Terrassement', color: '#A3A3A3' },
  { id: 'cloture', name: 'Clôture', color: '#7C3AED' },
  { id: 'plantation', name: 'Plantation', color: '#059669' },
  { id: 'gazon', name: 'Gazon', color: '#65A30D' },
  { id: 'maconnerie', name: 'Maçonnerie', color: '#4B5563' },
  { id: 'pergola_terrasse', name: 'Pergola / Terrasse bois', color: '#92400E' },
  { id: 'eclairage', name: 'Éclairage', color: '#FBBF24' },
  { id: 'arrosage', name: 'Arrosage', color: '#0EA5E9' },
  { id: 'deco_mobilier', name: 'Déco / Mobilier', color: '#EC4899' },
  { id: 'livraison_action', name: 'Livraison', color: '#06B6D4' }
];

const defaultTermineStatuses: TermineStatus[] = [
  { id: 'planifie', name: 'Planifié', color: '#EF4444' },
  { id: 'effectue', name: 'Effectué', color: '#10B981' }
];

const defaultCategoriesInterventions: CategorieIntervention[] = [
  { id: 'packplant', name: 'PackPlant', color: '#8B5CF6' },
  { id: 'abonnement', name: 'Abonnement', color: '#3B82F6' },
  { id: 'plant_sitting', name: 'Plant sitting', color: '#10B981' },
  { id: 'rdv_reperage', name: 'RDV de repérage', color: '#F59E0B' },
  { id: 'location', name: 'Location', color: '#06B6D4' },
  { id: 'entretien_cat', name: 'Entretien', color: '#84CC16' },
  { id: 'creation', name: 'Création', color: '#EC4899' }
];

export const PlanningFiltersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<PlanningFilters>({
    collaborators: {
      none: false,
      selected: defaultCollaborators.map(c => c.id)
    },
    activityTypes: [], // Vide comme demandé
    displayElements: defaultDisplayElements.filter(e => e.enabled).map(e => e.id),
    colorCodes: {
      collaborators: defaultCollaborators.map(c => c.id),
      actionsCourantes: defaultActionsCourantes.map(a => a.id),
      termine: defaultTermineStatuses.map(t => t.id),
      categoriesInterventions: defaultCategoriesInterventions.map(c => c.id),
      etatFacturation: [], // Vide comme demandé
      typesActivite: [] // Vide comme demandé
    }
  });

  const updateCollaborators = (collaboratorIds: string[], includeNone = false) => {
    setFilters(prev => ({
      ...prev,
      collaborators: {
        none: includeNone,
        selected: includeNone ? [] : collaboratorIds
      }
    }));
  };

  const updateActivityTypes = (activityTypeIds: string[]) => {
    setFilters(prev => ({
      ...prev,
      activityTypes: activityTypeIds
    }));
  };

  const updateDisplayElements = (elementIds: string[]) => {
    setFilters(prev => ({
      ...prev,
      displayElements: elementIds
    }));
  };

  const updateColorCodes = (section: keyof PlanningFilters['colorCodes'], colorCodeIds: string[]) => {
    setFilters(prev => ({
      ...prev,
      colorCodes: {
        ...prev.colorCodes,
        [section]: colorCodeIds
      }
    }));
  };

  return (
    <PlanningFiltersContext.Provider
      value={{
        filters,
        updateCollaborators,
        updateActivityTypes,
        updateDisplayElements,
        updateColorCodes,
        collaborators: defaultCollaborators,
        activityTypes: defaultActivityTypes,
        displayElements: defaultDisplayElements,
        colorCodes: defaultColorCodes,
        actionsCourantes: defaultActionsCourantes,
        termineStatuses: defaultTermineStatuses,
        categoriesInterventions: defaultCategoriesInterventions
      }}
    >
      {children}
    </PlanningFiltersContext.Provider>
  );
};

export default PlanningFiltersContext;