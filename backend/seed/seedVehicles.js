const mongoose = require('mongoose');
const createError = require('http-errors');
const Vehicle = require('../models/vehicleModel.js');

const URI = process.env.MONGO_URI;
if (!URI) throw new Error('MONGO_URI is required');

const vehicles = [
  {
    immatriculation: 'FN-235-RJ',
    marque: 'Opel',
    modele: 'Vivaro',
    capacite: 1200,
    statut: 'Disponible',
    fuelType: 'Diesel',
    vehiclePhotoUrl: '/vehicles-images/voiture1.jpg',
    registrationCardUrl: '/vehicles-images/voiture1-carte-grise.jpg',
    insuranceUrl: '/vehicles-images/voiture1-assurance.jpg'
  },
  {
    immatriculation: 'ES-290-XK',
    marque: 'Opel',
    modele: 'Combo',
    capacite: 800,
    statut: 'Disponible',
    fuelType: 'Essence',
    vehiclePhotoUrl: '/vehicles-images/voiture2.jpg',
    registrationCardUrl: '/vehicles-images/voiture2-carte-grise.jpg',
    insuranceUrl: '/vehicles-images/voiture2-assurance.jpg'
  },
  {
    immatriculation: 'EX-927-EW',
    marque: 'Ford',
    modele: 'Transit',
    capacite: 1400,
    statut: 'En maintenance',
    fuelType: 'Diesel',
    vehiclePhotoUrl: '/vehicles-images/voiture3.jpg',
    registrationCardUrl: '/vehicles-images/voiture3-carte-grise.jpg',
    insuranceUrl: '/vehicles-images/voiture3-assurance.jpg'
  },
  {
    immatriculation: 'HB-224-MS',
    marque: 'Peugeot',
    modele: 'Partner',
    capacite: 1000,
    statut: 'Disponible',
    fuelType: 'Électrique',
    vehiclePhotoUrl: '/vehicles-images/voiture4.jpg',
    registrationCardUrl: '/vehicles-images/voiture4-carte-grise.jpg',
    insuranceUrl: '/vehicles-images/voiture4-assurance.jpg'
  },
  {
    immatriculation: 'GP-064-WK',
    marque: 'Peugeot',
    modele: 'Expert',
    capacite: 1100,
    statut: 'Hors service',
    fuelType: 'Hybride',
    vehiclePhotoUrl: '/vehicles-images/voiture5.jpg',
    registrationCardUrl: '/vehicles-images/voiture5-carte-grise.jpg',
    insuranceUrl: '/vehicles-images/voiture5-assurance.jpg'
  }
];

async function seedVehicles() {
  try {
    await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const results = [];
    for (const v of vehicles) {
      const filter = { immatriculation: v.immatriculation };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const doc = await Vehicle.findOneAndUpdate(filter, v, options).lean();
      results.push({ immatriculation: v.immatriculation, status: 'upserted', id: doc._id });
    }
    return results;
  } catch (err) {
    throw createError(500, 'Erreur de seed vehicles', { cause: err });
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { seedVehicles };
