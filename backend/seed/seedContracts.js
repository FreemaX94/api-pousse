const mongoose = require('mongoose');
const createError = require('http-errors');
const Contract = require('../models/contractModel.js');

const URI = process.env.MONGO_URI;
if (!URI) throw new Error('MONGO_URI is required');

const seedData = [
  {
    clientName: 'Hôtel Artus',
    title: 'CE Hôtel Artus',
    duration: '01:00',
    budget: 960,
    startDate: new Date('2025-05-13'),
    isB2B: true,
    contractType: 'Entretien'
  },
  // … vos autres lignes issues du PDF
];

async function seedContracts() {
  try {
    await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const results = [];
    for (const data of seedData) {
      const filter = { clientName: data.clientName, title: data.title };
      const existing = await Contract.findOne(filter);
      if (existing) {
        results.push({ ...data, status: 'skipped', id: existing._id });
      } else {
        const created = await Contract.create(data);
        results.push({ ...data, status: 'created', id: created._id });
      }
    }
    return results;
  } catch (err) {
    throw createError(500, 'Erreur de seed contracts', { cause: err });
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { seedContracts };
