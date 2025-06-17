const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Produit = require('../../../backend/models/Produit');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'test' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Produit.deleteMany({});
});

describe('Produit Model', () => {
  it('devrait créer un produit valide', async () => {
    const produit = new Produit({
      name: 'Cache-pot',
      price: 19.99,
      category: 'pots'
    });

    const saved = await produit.save();
    expect(saved._id).toBeDefined();
    expect(saved.name).toBe('Cache-pot');
    expect(saved.description).toBe(''); // valeur par défaut
  });

  it('devrait échouer si le prix est négatif', async () => {
    const produit = new Produit({
      name: 'Erreur',
      price: -5,
      category: 'accessoires'
    });

    await expect(produit.save()).rejects.toThrow(/price/);
  });

  it('devrait échouer sans champ "name"', async () => {
    const produit = new Produit({
      price: 12,
      category: 'pots'
    });

    await expect(produit.save()).rejects.toThrow(/name/);
  });

  it('devrait échouer sans champ "category"', async () => {
    const produit = new Produit({
      name: 'SansCatégorie',
      price: 12
    });

    await expect(produit.save()).rejects.toThrow(/category/);
  });
});
