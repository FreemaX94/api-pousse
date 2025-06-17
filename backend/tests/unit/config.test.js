describe('config.js', () => {
  let config;

  beforeAll(() => {
    jest.resetModules();

    // ⚠️ Définir toutes les variables attendues
    process.env.MONGO_URI = 'mongodb://localhost/test';
    process.env.PORT = '3000';
    process.env.JWT_SECRET = 'secret';
    process.env.REDIS_HOST = 'localhost';
    process.env.REDIS_PORT = '6379';
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASS = 'pass';

    config = require('../../../backend/config/config');
  });

  test('devrait charger toutes les variables requises', () => {
    expect(config).toHaveProperty('mongoURI');
    expect(config).toHaveProperty('port');
    expect(config).toHaveProperty('jwtSecret');
    expect(config.redis).toHaveProperty('host');
    expect(config.redis).toHaveProperty('port');
    expect(config.email).toHaveProperty('user');
    expect(config.email).toHaveProperty('pass');
  });
});
