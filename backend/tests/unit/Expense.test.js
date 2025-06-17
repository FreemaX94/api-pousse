const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Expense = require('../../../backend/models/Expense');

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
  await Expense.deleteMany({});
});

describe('Expense Model', () => {
  it('devrait créer une dépense valide', async () => {
    const expense = new Expense({
      amount: 100,
      description: 'Achat de plantes',
      currency: 'EUR'
    });

    const saved = await expense.save();
    expect(saved._id).toBeDefined();
    expect(saved.currency).toBe('EUR');
  });

  it('devrait échouer si le champ "amount" est négatif', async () => {
    const expense = new Expense({
      amount: -10,
      description: 'Erreur',
      currency: 'EUR'
    });

    await expect(expense.save()).rejects.toThrow();
  });

  it('devrait échouer si la devise est invalide', async () => {
    const expense = new Expense({
      amount: 50,
      description: 'Outils',
      currency: 'euro'
    });

    await expect(expense.save()).rejects.toThrow(/currency/);
  });

  it('devrait échouer si "description" est manquant', async () => {
    const expense = new Expense({
      amount: 50,
      currency: 'USD'
    });

    await expect(expense.save()).rejects.toThrow(/description/);
  });
});
