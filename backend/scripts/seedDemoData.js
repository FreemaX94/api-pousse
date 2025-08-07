require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('../models/vehicleModel');
const Expense = require('../models/Expense');
const User = require('../models/userModel');

// Configuration MongoDB
const mongoURI = process.env.MONGODB_URI;

// Données de démonstration pour les véhicules
const vehiclesData = [
  {
    licensePlate: 'AB-123-CD',
    brand: 'Renault',
    model: 'Master',
    year: 2020,
    type: 'van',
    status: 'available',
    capacity: { weight: 3500, volume: 12, passengers: 3 },
    specifications: { fuelType: 'diesel', transmission: 'manual' },
    mileage: { current: 45000 },
    insurance: { 
      provider: 'AXA',
      policyNumber: 'AXA-VEH-2025-001',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      coverage: { liability: true, collision: true }
    }
  },
  {
    licensePlate: 'EF-456-GH',
    brand: 'Ford',
    model: 'Transit',
    year: 2019,
    type: 'van',
    status: 'in_use',
    capacity: { weight: 2800, volume: 10, passengers: 2 },
    specifications: { fuelType: 'diesel', transmission: 'manual' },
    mileage: { current: 67000 },
    insurance: { 
      provider: 'Groupama',
      policyNumber: 'GRP-VEH-2025-002',
      startDate: new Date('2024-08-15'),
      endDate: new Date('2025-08-15'),
      coverage: { liability: true }
    }
  },
  {
    licensePlate: 'IJ-789-KL',
    brand: 'Mercedes',
    model: 'Sprinter',
    year: 2021,
    type: 'van',
    status: 'maintenance',
    capacity: { weight: 4000, volume: 15, passengers: 3 },
    specifications: { fuelType: 'diesel', transmission: 'automatic' },
    mileage: { current: 32000 },
    maintenance: {
      schedule: { nextServiceDate: new Date('2025-08-01') }
    },
    insurance: { 
      provider: 'MAIF',
      policyNumber: 'MAIF-VEH-2025-003',
      startDate: new Date('2025-03-20'),
      endDate: new Date('2026-03-20'),
      coverage: { liability: true, collision: true, comprehensive: true }
    }
  },
  {
    licensePlate: 'MN-012-OP',
    brand: 'Iveco',
    model: 'Daily',
    year: 2018,
    type: 'truck',
    status: 'available',
    capacity: { weight: 7000, volume: 20, passengers: 2 },
    specifications: { fuelType: 'diesel', transmission: 'manual' },
    mileage: { current: 89000 },
    insurance: { 
      provider: 'AXA',
      policyNumber: 'AXA-VEH-2025-004',
      startDate: new Date('2024-11-10'),
      endDate: new Date('2025-11-10'),
      coverage: { liability: true }
    }
  },
  {
    licensePlate: 'QR-345-ST',
    brand: 'Volkswagen',
    model: 'Crafter',
    year: 2022,
    type: 'van',
    status: 'available',
    capacity: { weight: 3200, volume: 11, passengers: 3 },
    specifications: { fuelType: 'diesel', transmission: 'automatic' },
    mileage: { current: 18000 },
    insurance: { 
      provider: 'Allianz',
      policyNumber: 'ALZ-VEH-2025-005',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2026-01-15'),
      coverage: { liability: true, collision: true }
    }
  }
];

// Données de démonstration pour les dépenses
const expensesData = [
  {
    category: 'fuel',
    amount: 85.50,
    description: 'Plein d\'essence véhicule AB-123-CD',
    date: new Date('2025-07-10'),
    currency: 'EUR',
    status: 'approved',
    vendor: { name: 'Station Total' },
    payment: { method: 'card' }
  },
  {
    category: 'maintenance',
    amount: 320.00,
    description: 'Révision complète Mercedes Sprinter',
    date: new Date('2025-07-08'),
    currency: 'EUR',
    status: 'pending_approval',
    vendor: { name: 'Garage Mercedes' },
    payment: { method: 'bank_transfer' }
  },
  {
    category: 'supplies',
    amount: 156.75,
    description: 'Achat matériel de jardinage',
    date: new Date('2025-07-15'),
    currency: 'EUR',
    status: 'approved',
    vendor: { name: 'Jardiland' },
    payment: { method: 'card' }
  },
  {
    category: 'office',
    amount: 89.99,
    description: 'Fournitures de bureau - papeterie',
    date: new Date('2025-07-12'),
    currency: 'EUR',
    status: 'draft',
    vendor: { name: 'Office Depot' },
    payment: { method: 'card' }
  },
  {
    category: 'insurance',
    amount: 450.00,
    description: 'Assurance flotte véhicules Q3',
    date: new Date('2025-07-01'),
    currency: 'EUR',
    status: 'paid',
    vendor: { name: 'AXA Assurances' },
    payment: { method: 'bank_transfer' }
  },
  {
    category: 'fuel',
    amount: 72.30,
    description: 'Carburant véhicule EF-456-GH',
    date: new Date('2025-07-14'),
    currency: 'EUR',
    status: 'approved',
    vendor: { name: 'Station Shell' },
    payment: { method: 'card' }
  },
  {
    category: 'equipment',
    amount: 1250.00,
    description: 'Achat tondeuse professionnelle',
    date: new Date('2025-07-05'),
    currency: 'EUR',
    status: 'approved',
    vendor: { name: 'Husqvarna' },
    payment: { method: 'check' }
  },
  {
    category: 'meals',
    amount: 45.60,
    description: 'Repas équipe chantier',
    date: new Date('2025-07-16'),
    currency: 'EUR',
    status: 'pending_approval',
    vendor: { name: 'Restaurant Le Jardin' },
    payment: { method: 'cash' }
  }
];

async function seedDemoData() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(mongoURI);
    console.log('✅ Connecté à MongoDB');

    // Vider les collections existantes
    await Vehicle.deleteMany({});
    await Expense.deleteMany({});
    console.log('🗑️ Collections vidées');

    // Créer ou récupérer un utilisateur de test
    let testUser = await User.findOne({ email: 'demo@test.com' });
    if (!testUser) {
      testUser = await User.create({
        username: 'demo',
        email: 'demo@test.com',
        password: 'demo12345', // Le middleware de hachage s'en chargera
        role: 'admin'
      });
      console.log('✅ Utilisateur de test créé');
    } else {
      console.log('✅ Utilisateur de test existant récupéré');
    }

    // Insérer les véhicules un par un pour éviter les problèmes d'index
    const vehicles = [];
    for (const vehicleData of vehiclesData) {
      try {
        const vehicle = await Vehicle.create(vehicleData);
        vehicles.push(vehicle);
      } catch (error) {
        console.error(`Erreur lors de la création du véhicule ${vehicleData.licensePlate}:`, error.message);
      }
    }
    console.log(`✅ ${vehicles.length} véhicules créés`);

    // Insérer les dépenses avec createdBy
    const expenses = [];
    for (const expenseData of expensesData) {
      try {
        const expense = await Expense.create({
          ...expenseData,
          createdBy: testUser._id
        });
        expenses.push(expense);
      } catch (error) {
        console.error(`Erreur lors de la création de la dépense "${expenseData.description}":`, error.message);
      }
    }
    console.log(`✅ ${expenses.length} dépenses créées`);

    console.log('🎉 Données de démonstration créées avec succès !');
    
    // Afficher un résumé
    console.log('\n📊 Résumé:');
    console.log(`- Véhicules: ${vehicles.length}`);
    console.log(`- Dépenses: ${expenses.length}`);
    console.log(`- Total dépenses: ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}€`);

  } catch (error) {
    console.error('❌ Erreur lors de la création des données:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Déconnexion de MongoDB');
  }
}

// Exécuter le script si lancé directement
if (require.main === module) {
  seedDemoData();
}

module.exports = { seedDemoData };