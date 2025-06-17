const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const CatalogueItem = require('../../../backend/models/CatalogueItem');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'test' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// ✅ suppression sécurisée avec filtre explicite
afterEach(async () => {
  await CatalogueItem.deleteMany({ nom: { $exists: true } });
});

describe('CatalogueItem Model', () => {
  it('devrait créer un item avec succès', async () => {
    const item = new CatalogueItem({
      categorie: 'plantes',
      nom: 'Ficus',
      infos: { couleur: 'verte' }
    });

    const saved = await item.save();
    expect(saved._id).toBeDefined();
    expect(saved.nom).toBe('Ficus');
  });

  it('devrait échouer sans nom', async () => {
    const item = new CatalogueItem({ categorie: 'plantes' });
    let error;

    try {
      await item.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.nom).toBeDefined();
  });

  it('devrait bloquer deleteOne sans filtre', async () => {
    await expect(CatalogueItem.deleteOne({})).rejects.toThrow(/Suppression sans filtre interdite/);
  });

  it('devrait bloquer deleteMany sans filtre', async () => {
    await expect(CatalogueItem.deleteMany({})).rejects.toThrow(/Suppression globale interdite/);
  });

  it('devrait autoriser deleteMany avec filtre', async () => {
    await CatalogueItem.create({ categorie: 'pots', nom: 'Pot rond' });

    const res = await CatalogueItem.deleteMany({ categorie: 'pots' });
    expect(res).toBeDefined();
    expect(res.deletedCount).toBe(1);
  });
});
