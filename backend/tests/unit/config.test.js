describe('config.js', () => {
  let config;

  beforeAll(() => {
    jest.resetModules(); // 🧹 Vide le cache require
    require('dotenv').config({ path: './.env.test' }); // 🟩 Charge les variables
    config = require('../../../backend/config/config'); // ✅ À charger *après*
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
