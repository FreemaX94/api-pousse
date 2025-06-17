const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Concepteur = require('../../../backend/models/Concepteur');

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
  await Concepteur.deleteMany({});
});

describe('Concepteur Model', () => {
  it('devrait créer un concepteur valide', async () => {
    const c = new Concepteur({ nom: 'Studio Vert' });
    const saved = await c.save();

    expect(saved._id).toBeDefined();
    expect(saved.nom).toBe('Studio Vert');
  });

  it('devrait échouer sans nom', async () => {
    const c = new Concepteur({});
    let error;

    try {
      await c.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.nom).toBeDefined();
  });

  it('devrait refuser un nom dupliqué', async () => {
    await Concepteur.create({ nom: 'GreenLab' });

    let error;
    try {
      await Concepteur.create({ nom: 'GreenLab' });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // violation d'unicité Mongo
  });
});
