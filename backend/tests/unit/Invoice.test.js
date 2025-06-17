const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Invoice = require('../../../backend/models/Invoice');

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
  await Invoice.deleteMany({});
});

describe('Invoice Model', () => {
  it('devrait créer une facture valide', async () => {
    const invoice = new Invoice({
      client: 'Alice',
      employee: 'Bob',
      pole: 'Ventes',
      amount: 250,
      dueDate: new Date('2025-07-01'),
      details: 'Livraison 3 plantes'
    });

    const saved = await invoice.save();
    expect(saved._id).toBeDefined();
    expect(saved.status).toBe('unpaid'); // valeur par défaut
    expect(saved.amount).toBe(250);
  });

  it('devrait échouer si "amount" est négatif', async () => {
    const invoice = new Invoice({
      client: 'Alice',
      employee: 'Bob',
      pole: 'Ventes',
      amount: -100,
      dueDate: new Date(),
    });

    await expect(invoice.save()).rejects.toThrow(/amount/);
  });

  it('devrait échouer si "status" est invalide', async () => {
    const invoice = new Invoice({
      client: 'Alice',
      employee: 'Bob',
      pole: 'Ventes',
      amount: 100,
      dueDate: new Date(),
      status: 'pending'
    });

    await expect(invoice.save()).rejects.toThrow(/status/);
  });

  it('devrait échouer si un champ requis est manquant', async () => {
    const invoice = new Invoice({
      employee: 'Bob',
      amount: 100,
      dueDate: new Date()
    });

    await expect(invoice.save()).rejects.toThrow(/client/);
  });
});
