const path = require('path');

describe('module redisClient', () => {
  let RedisMock;
  let loggerMock;

  beforeEach(() => {
    jest.resetModules();
    // Mock du logger
    loggerMock = { log: jest.fn(), warn: jest.fn(), error: jest.fn() };
    jest.doMock('../../../backend/utils/logger', () => loggerMock, { virtual: true });
    // Mock de ioredis
    RedisMock = jest.fn();
    jest.doMock('ioredis', () => RedisMock, { virtual: true });
    // Réinitialisation des variables d'environnement
    delete process.env.REDIS_HOST;
    delete process.env.REDIS_PORT;
    delete process.env.NODE_ENV;
  });

  test('devrait instancier Redis avec host et port par défaut, connectTimeout et exporter l\'instance', () => {
    const eventHandlers = {};
    const fakeInstance = { on: (event, handler) => { eventHandlers[event] = handler; } };
    RedisMock.mockReturnValue(fakeInstance);

    const instance = require('../../../backend/config/redisClient');
    const options = RedisMock.mock.calls[0][0];

    expect(options.host).toBe('127.0.0.1');
    expect(options.port).toBe(6379);
    expect(options.connectTimeout).toBe(5000);
    expect(options.retryStrategy).toEqual(expect.any(Function));
    expect(instance).toBe(fakeInstance);
  });

  test('devrait instancier Redis avec host et port personnalisés et exporter l\'instance', () => {
    process.env.REDIS_HOST = 'redis.local';
    process.env.REDIS_PORT = '6380';
    const fakeInstance = { on: () => {} };
    RedisMock.mockReturnValue(fakeInstance);

    const instance = require('../../../backend/config/redisClient');
    const options = RedisMock.mock.calls[0][0];

    expect(options.host).toBe('redis.local');
    expect(options.port).toBe('6380');
    expect(options.connectTimeout).toBe(5000);
    expect(instance).toBe(fakeInstance);
  });

  test('retryStrategy doit logger un avertissement et retourner le délai approprié pour plusieurs tentatives', () => {
    const fakeInstance = { on: () => {} };
    RedisMock.mockReturnValue(fakeInstance);

    require('../../../backend/config/redisClient');
    const retry = RedisMock.mock.calls[0][0].retryStrategy;

    const delay3 = retry(3);
    expect(loggerMock.warn).toHaveBeenCalledWith('🔁 Tentative #3 de reconnexion Redis dans 300ms');
    expect(delay3).toBe(300);

    const delay50 = retry(50);
    expect(loggerMock.warn).toHaveBeenCalledWith('🔁 Tentative #50 de reconnexion Redis dans 2000ms');
    expect(delay50).toBe(2000);
  });

  test('retryStrategy doit logger un avertissement pour la première tentative et retourner 100ms', () => {
    const fakeInstance = { on: () => {} };
    RedisMock.mockReturnValue(fakeInstance);

    require('../../../backend/config/redisClient');
    const retry = RedisMock.mock.calls[0][0].retryStrategy;

    const delay1 = retry(1);
    expect(loggerMock.warn).toHaveBeenCalledWith('🔁 Tentative #1 de reconnexion Redis dans 100ms');
    expect(delay1).toBe(100);
  });

  test('devrait logger l\'événement connect pour hôte/port personnalisés', () => {
    process.env.REDIS_HOST = 'redis.custom';
    process.env.REDIS_PORT = '6381';
    const eventHandlers = {};
    const fakeInstance = { on: (event, handler) => { eventHandlers[event] = handler; } };
    RedisMock.mockReturnValue(fakeInstance);

    require('../../../backend/config/redisClient');
    eventHandlers.connect();
    expect(loggerMock.log).toHaveBeenCalledWith('✅ Redis connecté sur redis.custom:6381');
  });

  test('devrait logger \'connect\', \'ready\' et \'end\' events quand NODE_ENV n\'est pas \'test\'', () => {
    process.env.NODE_ENV = 'development';
    const eventHandlers = {};
    const fakeInstance = { on: (event, handler) => { eventHandlers[event] = handler; } };
    RedisMock.mockReturnValue(fakeInstance);

    require('../../../backend/config/redisClient');

    eventHandlers.connect();
    expect(loggerMock.log).toHaveBeenCalledWith('✅ Redis connecté sur 127.0.0.1:6379');

    eventHandlers.ready();
    expect(loggerMock.log).toHaveBeenCalledWith('🚀 Redis prêt à recevoir des commandes');

    eventHandlers.end();
    expect(loggerMock.warn).toHaveBeenCalledWith('⛔ Connexion Redis terminée');
  });

  test('ne doit pas logger \'connect\', \'ready\' et \'end\' lorsque NODE_ENV est \'test\'', () => {
    process.env.NODE_ENV = 'test';
    const eventHandlers = {};
    const fakeInstance = { on: (event, handler) => { eventHandlers[event] = handler; } };
    RedisMock.mockReturnValue(fakeInstance);

    require('../../../backend/config/redisClient');

    eventHandlers.connect();
    eventHandlers.ready();
    eventHandlers.end();

    expect(loggerMock.log).not.toHaveBeenCalled();
    expect(loggerMock.warn).not.toHaveBeenCalled();
  });

  test('devrait logger l\'erreur via l\'événement \'error\'', () => {
    const eventHandlers = {};
    const fakeInstance = { on: (event, handler) => { eventHandlers[event] = handler; } };
    RedisMock.mockReturnValue(fakeInstance);

    require('../../../backend/config/redisClient');
    const error = new Error('Redis failed');
    eventHandlers.error(error);

    expect(loggerMock.error).toHaveBeenCalledWith('❌ Erreur Redis :', error.message);
  });
});
