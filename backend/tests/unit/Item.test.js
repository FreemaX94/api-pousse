const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Item = require('../../../backend/models/Item');

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
  await Item.deleteMany({});
});

describe('Item Model', () => {
  it('devrait créer un item valide', async () => {
    const item = new Item({
      name: 'Ficus',
      type: 'plante',
      data: { couleur: 'vert' }
    });

    const saved = await item.save();
    expect(saved._id).toBeDefined();
    expect(saved.name).toBe('Ficus');
    expect(saved.type).toBe('plante');
    expect(saved.data).toEqual({ couleur: 'vert' });
  });

  it('devrait appliquer une valeur vide par défaut à "data"', async () => {
    const item = new Item({
      name: 'Pot en terre',
      type: 'pot'
    });

    const saved = await item.save();
    expect(saved.data).toEqual({});
  });

  it('devrait échouer si "name" est manquant', async () => {
    const item = new Item({
      type: 'accessoire'
    });

    await expect(item.save()).rejects.toThrow(/name/);
  });

  it('devrait échouer si "type" est manquant', async () => {
    const item = new Item({
      name: 'SansType'
    });

    await expect(item.save()).rejects.toThrow(/type/);
  });
});
