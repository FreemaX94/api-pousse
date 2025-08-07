// mailer.config.test.js
// Tests pour le module mailer.js

describe('module mailer', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('devrait créer le transporteur avec les bonnes informations et l\'exporter', () => {
    // Mocks
    jest.doMock('nodemailer', () => ({ createTransport: jest.fn() }));
    jest.doMock('../../../backend/config/config', () => ({
      email: { user: 'user@domain.com', pass: 'password' }
    }), { virtual: true });
    jest.doMock('../../../backend/utils/logger', () => ({
      error: jest.fn(),
      log: jest.fn()
    }), { virtual: true });

    // Importations
    const nodemailer = require('nodemailer');
    const { email } = require('../../../backend/config/config');

    // Préparation du mock transporter
    const transporterMock = { verify: jest.fn() };
    nodemailer.createTransport.mockReturnValue(transporterMock);

    // Chargement du module
    const transporter = require('../../../backend/config/mailer');

    // Assertions
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: { user: email.user, pass: email.pass }
    });
    expect(transporterMock.verify).toHaveBeenCalledWith(expect.any(Function));
    expect(transporter).toBe(transporterMock);
  });

  test('devrait appeler logger.log sur vérification réussie', () => {
    // Mocks
    jest.doMock('nodemailer', () => ({ createTransport: jest.fn() }));
    jest.doMock('../../../backend/config/config', () => ({
      email: { user: 'user@domain.com', pass: 'password' }
    }), { virtual: true });
    jest.doMock('../../../backend/utils/logger', () => ({
      error: jest.fn(),
      log: jest.fn()
    }), { virtual: true });

    // Importations
    const nodemailer = require('nodemailer');
    const logger = require('../../../backend/utils/logger');

    // Transporteur simulant succès
    const transporterMock = {
      verify: cb => cb(null, true)
    };
    nodemailer.createTransport.mockReturnValue(transporterMock);

    // Chargement du module
    require('../../../backend/config/mailer');

    // Assertions
    expect(logger.log).toHaveBeenCalledWith('✅ Transporteur email prêt à envoyer des messages');
    expect(logger.error).not.toHaveBeenCalled();
  });

  test('devrait appeler logger.error sur échec de vérification', () => {
    // Mocks
    jest.doMock('nodemailer', () => ({ createTransport: jest.fn() }));
    jest.doMock('../../../backend/config/config', () => ({
      email: { user: 'user@domain.com', pass: 'password' }
    }), { virtual: true });
    jest.doMock('../../../backend/utils/logger', () => ({
      error: jest.fn(),
      log: jest.fn()
    }), { virtual: true });

    // Importations
    const nodemailer = require('nodemailer');
    const logger = require('../../../backend/utils/logger');

    // Transporteur simulant erreur
    const errorObj = new Error('Échec SMTP');
    const transporterMock = {
      verify: cb => cb(errorObj, false)
    };
    nodemailer.createTransport.mockReturnValue(transporterMock);

    // Chargement du module
    require('../../../backend/config/mailer');

    // Assertions
    expect(logger.error).toHaveBeenCalledWith('❌ Erreur configuration email :', errorObj);
    expect(logger.log).not.toHaveBeenCalled();
  });
});
