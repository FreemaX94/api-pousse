const mongoose = require('mongoose');
const Concepteur = require('./models/Concepteur');
const logger = require('../utils/logger');

/**
 * Fonction de seed des concepteurs
 */
async function seedConcepteurs() {
  // Exemple données, ou lecture depuis un fichier
  const data = [
    { name: 'Alice' },
    { name: 'Bob' }
  ];
  const res = await Concepteur.insertMany(data);
  return res;
}

// Si exécuté directement
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => seedConcepteurs().then(() => process.exit()))
    .catch(err => { logger.error(err); process.exit(1); });
}

module.exports = { seedConcepteurs };
