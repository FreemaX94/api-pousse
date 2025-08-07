const path = require('path');

describe('module config', () => {
  beforeEach(() => {
    jest.resetModules();
    // Sauvegarde des variables d'environnement originales
    const originalEnv = process.env;
    process.env = {};
    // Restore uniquement NODE_ENV si présent
    if (originalEnv.NODE_ENV) {
      process.env.NODE_ENV = originalEnv.NODE_ENV;
    }
  });

  test('devrait utiliser le port par défaut 3000 lorsque PORT n\'est pas défini', () => {
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASS = 'password';
    delete process.env.PORT;
    delete require.cache[require.resolve(path.resolve(__dirname, '../../config/config.test'))];
    const config = require(path.resolve(__dirname, '../../config/config.test'));
    expect(config.port).toBe(3000);
  });

  test('devrait analyser PORT depuis les variables d’environnement', () => {
    process.env.PORT = '4000';
    process.env.NODE_ENV = 'production';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASS = 'password';
    const config = require(path.resolve(__dirname, '../../config/config.test'));
    expect(config.port).toBe(4000);
  });

  test('devrait définir nodeEnv et isProduction correctement', () => {
    process.env.PORT = '4000';
    process.env.NODE_ENV = 'production';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASS = 'password';
    const config = require(path.resolve(__dirname, '../../config/config.test'));
    expect(config.nodeEnv).toBe('production');
    expect(config.isProduction).toBe(true);
  });

  test('devrait définir isProduction à false lorsque NODE_ENV n\'est pas \'production\'', () => {
    process.env.NODE_ENV = 'development';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASS = 'password';
    const config = require(path.resolve(__dirname, '../../config/config.test'));
    expect(config.isProduction).toBe(false);
  });

  test('devrait inclure mongoURI, jwtSecret, email user et pass dans la config', () => {
    process.env.NODE_ENV = 'production';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/app';
    process.env.JWT_SECRET = 'supersecret';
    process.env.EMAIL_USER = 'email@domain.com';
    process.env.EMAIL_PASS = 'emailpass';
    const config = require(path.resolve(__dirname, '../../config/config.test'));
    expect(config.mongoURI).toBe('mongodb://localhost:27017/app');
    expect(config.jwtSecret).toBe('supersecret');
    expect(config.email.user).toBe('email@domain.com');
    expect(config.email.pass).toBe('emailpass');
  });

  test('devrait construire correctement la configuration Redis', () => {
    process.env.NODE_ENV = 'development';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASS = 'password';
    process.env.REDIS_HOST = 'redis.local';
    process.env.REDIS_PORT = '6380';
    const config = require(path.resolve(__dirname, '../../config/config.test'));
    expect(config.redis.host).toBe('redis.local');
    expect(config.redis.port).toBe(6380);
    expect(config.redis.url).toBe('redis://redis.local:6380');
  });

  test('devrait utiliser les valeurs par défaut de Redis si non définies', () => {
    process.env.NODE_ENV = 'development';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASS = 'password';
    // Pas de REDIS_HOST ni REDIS_PORT
    const config = require(path.resolve(__dirname, '../../config/config.test'));
    expect(config.redis.host).toBe('127.0.0.1');
    expect(config.redis.port).toBe(6379);
    expect(config.redis.url).toBe('redis://127.0.0.1:6379');
  });

  // Nouveaux tests

  test('devrait retourner NaN lorsque PORT n\'est pas numérique', () => {
    process.env.PORT = 'notANumber';
    process.env.NODE_ENV = 'development';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASS = 'password';
    const config = require(path.resolve(__dirname, '../../config/config.test'));
    expect(config.port).toBeNaN();
  });

  test('devrait retourner NaN lorsque REDIS_PORT n\'est pas numérique', () => {
    process.env.REDIS_PORT = 'notPort';
    process.env.NODE_ENV = 'development';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASS = 'password';
    const config = require(path.resolve(__dirname, '../../config/config.test'));
    expect(config.redis.port).toBeNaN();
    expect(config.redis.url).toBe(`redis://${config.redis.host}:notPort`);
  });

  test('devrait gérer le scénario partiel Redis : seul REDIS_HOST défini', () => {
    process.env.REDIS_HOST = 'redis.hostonly';
    process.env.NODE_ENV = 'development';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASS = 'password';
    const config = require(path.resolve(__dirname, '../../config/config.test'));
    expect(config.redis.host).toBe('redis.hostonly');
    expect(config.redis.port).toBe(6379);
    expect(config.redis.url).toBe('redis://redis.hostonly:6379');
  });

  test('devrait gérer le scénario partiel Redis : seul REDIS_PORT défini', () => {
    process.env.REDIS_PORT = '6381';
    process.env.NODE_ENV = 'development';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASS = 'password';
    const config = require(path.resolve(__dirname, '../../config/config.test'));
    expect(config.redis.host).toBe('127.0.0.1');
    expect(config.redis.port).toBe(6381);
    expect(config.redis.url).toBe('redis://127.0.0.1:6381');
  });

  test('devrait définir isProduction à false lorsque NODE_ENV vaut \'test\'', () => {
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASS = 'password';
    const config = require(path.resolve(__dirname, '../../config/config.test'));
    expect(config.nodeEnv).toBe('test');
    expect(config.isProduction).toBe(false);
  });

  test('devrait lever une erreur lorsque MONGODB_URI est manquante', () => {
    process.env.NODE_ENV = 'development';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASS = 'password';
    delete process.env.MONGODB_URI;
    expect(() => {
      delete require.cache[require.resolve(path.resolve(__dirname, '../../config/config.test'))];
      require(path.resolve(__dirname, '../../config/config.test'));
    }).toThrow(/Variable d'environnement manquante : MONGODB_URI/);
  });

  test('devrait lever une erreur lorsque la variable d’environnement requise JWT_SECRET est manquante', () => {
    process.env.NODE_ENV = 'development';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.EMAIL_USER = 'user@example.com';
    process.env.EMAIL_PASS = 'password';
    delete process.env.JWT_SECRET;
    expect(() => {
      delete require.cache[require.resolve(path.resolve(__dirname, '../../config/config.test'))];
      require(path.resolve(__dirname, '../../config/config.test'));
    }).toThrow(/Variable d'environnement manquante : JWT_SECRET/);
  });

  test('devrait lever une erreur lorsque la variable d’environnement requise EMAIL_USER est manquante', () => {
    process.env.NODE_ENV = 'development';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_PASS = 'password';
    delete process.env.EMAIL_USER;
    expect(() => {
      delete require.cache[require.resolve(path.resolve(__dirname, '../../config/config.test'))];
      require(path.resolve(__dirname, '../../config/config.test'));
    }).toThrow(/Variable d'environnement manquante : EMAIL_USER/);
  });

  test('devrait lever une erreur lorsque la variable d’environnement requise EMAIL_PASS est manquante', () => {
    process.env.NODE_ENV = 'development';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'secret';
    process.env.EMAIL_USER = 'user@example.com';
    delete process.env.EMAIL_PASS;
    expect(() => {
      delete require.cache[require.resolve(path.resolve(__dirname, '../../config/config.test'))];
      require(path.resolve(__dirname, '../../config/config.test'));
    }).toThrow(/Variable d'environnement manquante : EMAIL_PASS/);
  });
});
