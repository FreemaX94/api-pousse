const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Price = require('../../../backend/models/Price');

let mongoServer;
let mockProductId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'test' });

  mockProductId = new mongoose.Types.ObjectId(); // simulate product ref
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Price.deleteMany({});
});

describe('Price Model', () => {
  it('devrait créer un prix valide', async () => {
    const price = new Price({
      product: mockProductId,
      price: 25.5,
      currency: 'EUR'
    });

    const saved = await price.save();
    expect(saved._id).toBeDefined();
    expect(saved.currency).toBe('EUR');
    expect(saved.validFrom).toBeInstanceOf(Date);
  });

  it('devrait échouer si price est négatif', async () => {
    const price = new Price({
      product: mockProductId,
      price: -10,
      currency: 'EUR'
    });

    await expect(price.save()).rejects.toThrow(/price/);
  });

  it('devrait échouer si currency est invalide', async () => {
    const price = new Price({
      product: mockProductId,
      price: 10,
      currency: 'euros' // ❌ non valide
    });

    await expect(price.save()).rejects.toThrow(/currency/);
  });

  it('devrait échouer si product est manquant', async () => {
    const price = new Price({
      price: 15,
      currency: 'USD'
    });

    await expect(price.save()).rejects.toThrow(/product/);
  });
});
