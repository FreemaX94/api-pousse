
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../../backend/models/userModel');

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
  await User.deleteMany({});
});

describe('User Model', () => {
  it('hash correctement le mot de passe', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'secret123'
    });

    expect(user.password).not.toBe('secret123');
    const match = await user.comparePassword('secret123');
    expect(match).toBe(true);
  });

  it('rejette la création sans email', async () => {
    const user = new User({ username: 'u', password: 'p' });
    await expect(user.save()).rejects.toThrow(/email/);
  });
});
