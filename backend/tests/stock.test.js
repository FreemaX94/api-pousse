const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../app');
const StockEntry = require('../models/StockEntry');
const { Counter } = require('../models/Counter');

describe('Stock ID System Tests', () => {
  let authToken;

  beforeAll(async () => {
    // Connexion à la base de test
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/test_stock');
    
    // Login pour récupérer un token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'TestPass123'
      });
    
    authToken = loginResponse.body.accessToken;
  });

  beforeEach(async () => {
    // Nettoyer les collections avant chaque test
    await StockEntry.deleteMany({});
    await Counter.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Stock ID Generation', () => {
    test('should generate unique sequential stock IDs', async () => {
      const stockData = {
        product: new mongoose.Types.ObjectId(),
        categorie: 'Plantes',
        quantity: 10,
        type: 'in'
      };

      // Créer le premier article
      const response1 = await request(app)
        .post('/api/stocks')
        .set('Cookie', `accessToken=${authToken}`)
        .send(stockData)
        .expect(201);

      expect(response1.body.stockId).toMatch(/^ST-\d{4}-0001$/);

      // Créer le deuxième article
      const response2 = await request(app)
        .post('/api/stocks')
        .set('Cookie', `accessToken=${authToken}`)
        .send(stockData)
        .expect(201);

      expect(response2.body.stockId).toMatch(/^ST-\d{4}-0002$/);

      // Vérifier que les IDs sont différents
      expect(response1.body.stockId).not.toBe(response2.body.stockId);
    });

    test('should include current year in stock ID', async () => {
      const stockData = {
        product: new mongoose.Types.ObjectId(),
        categorie: 'Contenants',
        quantity: 5,
        type: 'in'
      };

      const response = await request(app)
        .post('/api/stocks')
        .set('Cookie', `accessToken=${authToken}`)
        .send(stockData)
        .expect(201);

      const currentYear = new Date().getFullYear();
      expect(response.body.stockId).toMatch(new RegExp(`^ST-${currentYear}-\\d{4}$`));
    });
  });

  describe('Stock CRUD Operations', () => {
    test('should retrieve stock by ID', async () => {
      // Créer un article
      const stockData = {
        product: new mongoose.Types.ObjectId(),
        categorie: 'Décor',
        quantity: 3,
        type: 'in'
      };

      const createResponse = await request(app)
        .post('/api/stocks')
        .set('Cookie', `accessToken=${authToken}`)
        .send(stockData)
        .expect(201);

      const stockId = createResponse.body.stockId;

      // Récupérer l'article par ID
      const getResponse = await request(app)
        .get(`/api/stocks/${stockId}`)
        .set('Cookie', `accessToken=${authToken}`)
        .expect(200);

      expect(getResponse.body.stockId).toBe(stockId);
      expect(getResponse.body.quantity).toBe(3);
    });

    test('should update stock by ID', async () => {
      // Créer un article
      const stockData = {
        product: new mongoose.Types.ObjectId(),
        categorie: 'Artificiels',
        quantity: 8,
        type: 'in'
      };

      const createResponse = await request(app)
        .post('/api/stocks')
        .set('Cookie', `accessToken=${authToken}`)
        .send(stockData)
        .expect(201);

      const stockId = createResponse.body.stockId;

      // Modifier l'article
      const updateResponse = await request(app)
        .put(`/api/stocks/${stockId}`)
        .set('Cookie', `accessToken=${authToken}`)
        .send({ quantity: 15 })
        .expect(200);

      expect(updateResponse.body.entry.quantity).toBe(15);
      expect(updateResponse.body.entry.stockId).toBe(stockId);
    });

    test('should delete stock by ID', async () => {
      // Créer un article
      const stockData = {
        product: new mongoose.Types.ObjectId(),
        categorie: 'Séchés',
        quantity: 2,
        type: 'in'
      };

      const createResponse = await request(app)
        .post('/api/stocks')
        .set('Cookie', `accessToken=${authToken}`)
        .send(stockData)
        .expect(201);

      const stockId = createResponse.body.stockId;

      // Supprimer l'article
      await request(app)
        .delete(`/api/stocks/${stockId}`)
        .set('Cookie', `accessToken=${authToken}`)
        .expect(200);

      // Vérifier que l'article n'existe plus
      await request(app)
        .get(`/api/stocks/${stockId}`)
        .set('Cookie', `accessToken=${authToken}`)
        .expect(404);
    });
  });

  describe('Stock ID Validation', () => {
    test('should reject invalid stock ID format', async () => {
      await request(app)
        .get('/api/stocks/INVALID-ID')
        .set('Cookie', `accessToken=${authToken}`)
        .expect(400);
    });

    test('should accept valid stock ID format', async () => {
      // Cette requête devrait passer la validation mais retourner 404 (article inexistant)
      await request(app)
        .get('/api/stocks/ST-2025-0001')
        .set('Cookie', `accessToken=${authToken}`)
        .expect(404);
    });
  });
});