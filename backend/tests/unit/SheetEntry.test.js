
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const SheetEntry = require('../../../backend/models/SheetEntry');

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
  await SheetEntry.deleteMany({});
});

describe('SheetEntry Model', () => {
  it('devrait créer une entrée valide', async () => {
    const entry = new SheetEntry({
      sheetId: 'SHEET123',
      data: { field: 'valeur' },
      source: 'import'
    });
    const saved = await entry.save();
    expect(saved._id).toBeDefined();
    expect(saved.source).toBe('import');
  });

  it('devrait échouer sans sheetId', async () => {
    const entry = new SheetEntry({ data: { f: 1 } });
    await expect(entry.save()).rejects.toThrow(/sheetId/);
  });
});
