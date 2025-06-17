
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Vehicle = require('../../../backend/models/vehicleModel');

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
  await Vehicle.deleteMany({});
});

describe('Vehicle Model', () => {
  it('devrait créer un véhicule valide', async () => {
    const vehicle = new Vehicle({
      licensePlate: 'AB-123-CD',
      model: 'Kangoo',
      capacity: 800
    });

    const saved = await vehicle.save();
    expect(saved._id).toBeDefined();
  });

  it('devrait échouer sans plaque', async () => {
    const vehicle = new Vehicle({ model: 'Test', capacity: 400 });
    await expect(vehicle.save()).rejects.toThrow(/licensePlate/);
  });
});
