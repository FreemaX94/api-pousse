const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Delivery = require('../../../backend/models/Delivery');

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
  await Delivery.deleteMany({});
});

describe('Delivery Model', () => {
  it('devrait créer une livraison valide', async () => {
    const delivery = new Delivery({
      address: '42 rue des Plantes',
      date: new Date('2025-07-01'),
      status: 'confirmed'
    });

    const saved = await delivery.save();
    expect(saved._id).toBeDefined();
    expect(saved.status).toBe('confirmed');
  });

  it('devrait appliquer le statut par défaut à "pending"', async () => {
    const delivery = new Delivery({
      address: '99 avenue Verte'
    });

    const saved = await delivery.save();
    expect(saved.status).toBe('pending');
  });

  it('devrait échouer sans adresse', async () => {
    const delivery = new Delivery({});
    await expect(delivery.save()).rejects.toThrow();
  });
});
