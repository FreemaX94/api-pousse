const ProjectTemplate = require('../models/ProjectTemplate');

const defaultTemplates = [
  {
    name: "Création de Jardin Résidentiel",
    description: "Template complet pour la création d'un nouveau jardin privé avec conception paysagère",
    category: "residential",
    type: "Création",
    defaultSettings: {
      duration: 14,
      priority: "medium",
      budget: {
        materials: 2500,
        labor: 1800,
        equipment: 400,
        overhead: 300
      }
    },
    tasks: [
      {
        title: "Analyse du terrain et prise de mesures",
        description: "Étude détaillée du terrain, relevé topographique et analyse du sol",
        estimatedHours: 4,
        priority: "high",
        daysFromStart: 0,
        role: "designer",
        tags: ["analyse", "terrain"]
      },
      {
        title: "Conception du plan paysager",
        description: "Création du design et des plans techniques du jardin",
        estimatedHours: 8,
        priority: "high",
        daysFromStart: 1,
        role: "designer",
        tags: ["design", "plans"]
      },
      {
        title: "Validation client et ajustements",
        description: "Présentation du projet au client et modifications si nécessaire",
        estimatedHours: 3,
        priority: "medium",
        daysFromStart: 3,
        role: "manager",
        tags: ["client", "validation"]
      },
      {
        title: "Préparation du terrain",
        description: "Terrassement, préparation du sol et amendements",
        estimatedHours: 16,
        priority: "high",
        daysFromStart: 5,
        role: "technician",
        tags: ["terrain", "préparation"]
      },
      {
        title: "Installation système d'irrigation",
        description: "Mise en place du réseau d'arrosage automatique",
        estimatedHours: 8,
        priority: "medium",
        daysFromStart: 7,
        role: "technician",
        tags: ["irrigation", "installation"]
      },
      {
        title: "Plantation des végétaux",
        description: "Plantation des arbres, arbustes et plantes selon le plan",
        estimatedHours: 12,
        priority: "high",
        daysFromStart: 9,
        role: "technician",
        tags: ["plantation", "végétaux"]
      },
      {
        title: "Finitions et décoration",
        description: "Installation des éléments décoratifs et finitions",
        estimatedHours: 6,
        priority: "low",
        daysFromStart: 11,
        role: "technician",
        tags: ["décoration", "finitions"]
      },
      {
        title: "Réception et formation client",
        description: "Présentation finale et formation à l'entretien",
        estimatedHours: 2,
        priority: "medium",
        daysFromStart: 13,
        role: "manager",
        tags: ["réception", "formation"]
      }
    ],
    materials: [
      {
        name: "Terre végétale enrichie",
        quantity: 15,
        unitPrice: 35,
        supplier: "Pépinière Locale",
        category: "soil"
      },
      {
        name: "Plantes vivaces assorties",
        quantity: 25,
        unitPrice: 12,
        supplier: "Nieuwkoop",
        category: "plants"
      },
      {
        name: "Arbustes ornementaux",
        quantity: 8,
        unitPrice: 45,
        supplier: "Nieuwkoop",
        category: "plants"
      },
      {
        name: "Paillis décoratif",
        quantity: 10,
        unitPrice: 8,
        supplier: "Jardinerie",
        category: "decoration"
      },
      {
        name: "Kit irrigation goutte-à-goutte",
        quantity: 1,
        unitPrice: 280,
        supplier: "IrriTech",
        category: "irrigation"
      }
    ],
    equipment: [
      {
        name: "Mini-pelle",
        type: "Excavatrice",
        quantity: 1,
        daysNeeded: 3
      },
      {
        name: "Motoculteur",
        type: "Préparation sol",
        quantity: 1,
        daysNeeded: 2
      },
      {
        name: "Outils de plantation",
        type: "Outillage",
        quantity: 1,
        daysNeeded: 5
      }
    ],
    milestones: [
      {
        title: "Plan validé par le client",
        description: "Conception approuvée et devis signé",
        daysFromStart: 4,
        deliverables: ["Plan paysager", "Devis détaillé", "Planning"]
      },
      {
        title: "Terrain préparé",
        description: "Sol préparé et amendé, prêt pour plantation",
        daysFromStart: 8,
        deliverables: ["Terrain nivellé", "Sol amendé", "Système d'irrigation installé"]
      },
      {
        title: "Plantation terminée",
        description: "Tous les végétaux sont plantés",
        daysFromStart: 12,
        deliverables: ["Végétaux plantés", "Paillage réalisé"]
      },
      {
        title: "Projet livré",
        description: "Jardin terminé et remis au client",
        daysFromStart: 14,
        deliverables: ["Jardin fini", "Documentation d'entretien", "Garantie"]
      }
    ],
    qualityChecklist: [
      {
        item: "Vérification de la qualité du sol",
        phase: "planning",
        mandatory: true
      },
      {
        item: "Test du système d'irrigation",
        phase: "execution",
        mandatory: true
      },
      {
        item: "Contrôle santé des végétaux",
        phase: "execution",
        mandatory: true
      },
      {
        item: "Inspection finale avec le client",
        phase: "completion",
        mandatory: true
      }
    ],
    requiredDocuments: [
      {
        name: "Contrat signé",
        type: "contract",
        mandatory: true,
        phase: "planning"
      },
      {
        name: "Plans techniques",
        type: "plan",
        mandatory: true,
        phase: "planning"
      },
      {
        name: "Photos avant/après",
        type: "photo",
        mandatory: false,
        phase: "completion"
      }
    ],
    metadata: {
      icon: "🌿",
      color: "#22c55e",
      tags: ["jardin", "création", "résidentiel"],
      difficulty: "intermediate",
      seasonality: ["spring", "summer", "autumn"]
    },
    instructions: {
      setup: "Prévoir une visite préliminaire pour évaluer l'accès et les contraintes du terrain",
      execution: "Respecter l'ordre des tâches, la préparation du sol est cruciale",
      completion: "Former le client à l'entretien des nouvelles plantations",
      tips: [
        "Prévoir une marge de 20% sur les quantités de terre",
        "Programmer les plantations selon la saison",
        "Documenter avec photos pour le suivi"
      ],
      warnings: [
        "Vérifier les réseaux enterrés avant terrassement",
        "S'assurer de l'accès pour les engins",
        "Prévoir protection hivernale si plantation tardive"
      ]
    }
  },

  {
    name: "Entretien Jardin Saisonnier",
    description: "Template pour l'entretien régulier d'un jardin avec tâches saisonnières",
    category: "maintenance",
    type: "Entretien",
    defaultSettings: {
      duration: 1,
      priority: "low",
      budget: {
        materials: 150,
        labor: 200,
        equipment: 50,
        overhead: 50
      }
    },
    tasks: [
      {
        title: "Taille des arbustes",
        description: "Taille de formation et d'entretien des arbustes",
        estimatedHours: 3,
        priority: "medium",
        daysFromStart: 0,
        role: "technician",
        tags: ["taille", "arbustes"]
      },
      {
        title: "Désherbage et binage",
        description: "Élimination des mauvaises herbes et binage du sol",
        estimatedHours: 2,
        priority: "medium",
        daysFromStart: 0,
        role: "technician",
        tags: ["désherbage", "entretien"]
      },
      {
        title: "Fertilisation des végétaux",
        description: "Apport d'engrais et amendements selon les besoins",
        estimatedHours: 1,
        priority: "low",
        daysFromStart: 0,
        role: "technician",
        tags: ["fertilisation", "nutrition"]
      },
      {
        title: "Arrosage et vérification irrigation",
        description: "Contrôle et réglage du système d'arrosage",
        estimatedHours: 1,
        priority: "medium",
        daysFromStart: 0,
        role: "technician",
        tags: ["arrosage", "irrigation"]
      }
    ],
    materials: [
      {
        name: "Engrais organique",
        quantity: 2,
        unitPrice: 15,
        supplier: "Jardinerie",
        category: "soil"
      },
      {
        name: "Paillis de renouvellement",
        quantity: 5,
        unitPrice: 8,
        supplier: "Pépinière",
        category: "decoration"
      }
    ],
    equipment: [
      {
        name: "Sécateur et outils de taille",
        type: "Outillage",
        quantity: 1,
        daysNeeded: 1
      },
      {
        name: "Désherbeur thermique",
        type: "Entretien",
        quantity: 1,
        daysNeeded: 1,
        isOptional: true
      }
    ],
    milestones: [
      {
        title: "Entretien terminé",
        description: "Toutes les tâches d'entretien sont complétées",
        daysFromStart: 1,
        deliverables: ["Jardin entretenu", "Rapport d'intervention"]
      }
    ],
    metadata: {
      icon: "🌱",
      color: "#84cc16",
      tags: ["entretien", "maintenance", "saisonnier"],
      difficulty: "beginner",
      seasonality: ["spring", "summer", "autumn", "winter"]
    }
  },

  {
    name: "Aménagement Événement Extérieur",
    description: "Template pour l'aménagement temporaire d'espaces pour événements",
    category: "event",
    type: "Événements",
    defaultSettings: {
      duration: 7,
      priority: "high",
      budget: {
        materials: 1200,
        labor: 800,
        equipment: 600,
        overhead: 200
      }
    },
    tasks: [
      {
        title: "Reconnaissance des lieux",
        description: "Visite et analyse de l'espace événementiel",
        estimatedHours: 2,
        priority: "urgent",
        daysFromStart: 0,
        role: "manager",
        tags: ["reconnaissance", "planning"]
      },
      {
        title: "Conception de l'aménagement",
        description: "Design de l'espace selon le thème de l'événement",
        estimatedHours: 4,
        priority: "high",
        daysFromStart: 1,
        role: "designer",
        tags: ["design", "événement"]
      },
      {
        title: "Préparation des végétaux",
        description: "Sélection et préparation des plantes temporaires",
        estimatedHours: 3,
        priority: "medium",
        daysFromStart: 3,
        role: "technician",
        tags: ["végétaux", "préparation"]
      },
      {
        title: "Installation jour J-1",
        description: "Mise en place de l'aménagement paysager",
        estimatedHours: 8,
        priority: "urgent",
        daysFromStart: 5,
        role: "technician",
        tags: ["installation", "événement"]
      },
      {
        title: "Démontage post-événement",
        description: "Démontage et récupération des éléments",
        estimatedHours: 4,
        priority: "medium",
        daysFromStart: 7,
        role: "technician",
        tags: ["démontage", "récupération"]
      }
    ],
    materials: [
      {
        name: "Plantes en pot décoratives",
        quantity: 30,
        unitPrice: 20,
        supplier: "Nieuwkoop",
        category: "plants"
      },
      {
        name: "Jardinières temporaires",
        quantity: 15,
        unitPrice: 35,
        supplier: "Location Event",
        category: "decoration"
      },
      {
        name: "Éclairage LED extérieur",
        quantity: 10,
        unitPrice: 25,
        supplier: "Éclairage Pro",
        category: "decoration"
      }
    ],
    equipment: [
      {
        name: "Camionnette de transport",
        type: "Transport",
        quantity: 1,
        daysNeeded: 3
      },
      {
        name: "Matériel d'éclairage",
        type: "Éclairage",
        quantity: 1,
        daysNeeded: 3
      }
    ],
    metadata: {
      icon: "🎪",
      color: "#f59e0b",
      tags: ["événement", "temporaire", "décoration"],
      difficulty: "advanced",
      seasonality: ["spring", "summer", "autumn"]
    }
  }
];

async function seedTemplates() {
  try {
    // Vérifier si des templates existent déjà
    const existingCount = await ProjectTemplate.countDocuments();

    if (existingCount > 0) {
      console.log(`${existingCount} templates already exist. Skipping seeding.`);
      return;
    }

    // Créer les templates avec un utilisateur par défaut (à adapter selon votre système)
    const templatesWithCreator = defaultTemplates.map(template => ({
      ...template,
      createdBy: new require('mongoose').Types.ObjectId(), // Remplacer par un vrai ID utilisateur
      isPublic: true
    }));

    await ProjectTemplate.insertMany(templatesWithCreator);
    console.log(`${defaultTemplates.length} project templates created successfully!`);

  } catch (error) {
    console.error('Error seeding project templates:', error);
    throw error;
  }
}

module.exports = { seedTemplates, defaultTemplates };