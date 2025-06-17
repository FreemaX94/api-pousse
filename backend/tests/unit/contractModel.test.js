const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Contract = require('../../../backend/models/contractModel');

let mongoServer;
let testUserId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: 'test' });

  // Mock User ID
  testUserId = new mongoose.Types.ObjectId();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Contract.deleteMany({});
});

describe('Contract Model', () => {
  it('devrait créer un contrat valide', async () => {
    const contract = new Contract({
      client: testUserId,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      contractType: 'maintenance',
      isB2B: true
    });

    const saved = await contract.save();

    expect(saved._id).toBeDefined();
    expect(saved.contractType).toBe('maintenance');
  });

  it('devrait échouer si startDate > endDate', async () => {
    const contract = new Contract({
      client: testUserId,
      startDate: new Date('2025-12-31'),
      endDate: new Date('2025-01-01'),
      contractType: 'maintenance'
    });

    await expect(contract.save()).rejects.toThrow('Start date must be before end date');
  });

  it('devrait échouer sans champ requis', async () => {
    const contract = new Contract({
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31')
    });

    await expect(contract.save()).rejects.toThrow();
  });
});
