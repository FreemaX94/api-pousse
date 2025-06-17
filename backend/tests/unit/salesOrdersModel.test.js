const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const SalesOrder = require('../../../backend/models/salesOrdersModel');
const Produit = require('../../../backend/models/Produit');

let mongoServer;
let mockCustomerId, mockProductId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'test' });

  mockCustomerId = new mongoose.Types.ObjectId();

  // Créer un produit simulé
  const produit = await Produit.create({
    name: 'Ficus',
    price: 40,
    category: 'plantes'
  });

  mockProductId = produit._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await SalesOrder.deleteMany({});
});

describe('SalesOrder Model', () => {
  it('devrait créer une commande valide avec total calculé', async () => {
    const order = new SalesOrder({
      customer: mockCustomerId,
      items: [{ product: mockProductId, quantity: 3 }]
    });

    const saved = await order.save();
    expect(saved._id).toBeDefined();
    expect(saved.totalAmount).toBe(120); // 3 * 40
    expect(saved.status).toBe('pending');
  });

  it('devrait échouer si items est vide', async () => {
    const order = new SalesOrder({
      customer: mockCustomerId,
      items: []
    });

    await expect(order.save()).rejects.toThrow(/au moins un item/);
  });

  it('devrait échouer si product est invalide', async () => {
    const order = new SalesOrder({
      customer: mockCustomerId,
      items: [{ product: new mongoose.Types.ObjectId(), quantity: 1 }]
    });

    await expect(order.save()).rejects.toThrow(/Produit introuvable/);
  });

  it('devrait échouer si customer est manquant', async () => {
    const order = new SalesOrder({
      items: [{ product: mockProductId, quantity: 1 }]
    });

    await expect(order.save()).rejects.toThrow(/customer/);
  });
});
