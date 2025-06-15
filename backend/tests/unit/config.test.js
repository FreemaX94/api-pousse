describe('config.js', () => {
  let config;

  beforeAll(() => {
    jest.resetModules(); // vide le cache
    require('dotenv').config({ path: './.env.test' }); // charge les variables
    config = require('../../../backend/config/config'); // charge le module après dotenv
  });

  test('devrait charger toutes les variables requises', () => {
    expect(config).toHaveProperty('port');
    expect(config).toHaveProperty('mongoURI');
    expect(config).toHaveProperty('jwtSecret');
    expect(config.redis).toHaveProperty('host');
    expect(config.redis).toHaveProperty('port');
    expect(config.email).toHaveProperty('user');
    expect(config.email).toHaveProperty('pass');
  });
});
