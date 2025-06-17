
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const StockEntry = require('../../../backend/models/StockEntry');

let mongoServer;
const fakeProductId = new mongoose.Types.ObjectId();

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'test' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await StockEntry.deleteMany({});
});

describe('StockEntry Model', () => {
  it('devrait créer une entrée valide', async () => {
    const entry = new StockEntry({
      product: fakeProductId,
      categorie: 'Plantes',
      quantity: 10,
      type: 'in'
    });
    const saved = await entry.save();
    expect(saved._id).toBeDefined();
  });

  it('devrait échouer sans catégorie', async () => {
    const entry = new StockEntry({ product: fakeProductId, quantity: 1, type: 'in' });
    await expect(entry.save()).rejects.toThrow(/categorie/);
  });
});
