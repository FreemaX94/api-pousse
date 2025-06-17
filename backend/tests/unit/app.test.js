const request = require('supertest');
process.env.CORS_ORIGIN = 'https://test.ok';
const { app } = require('../../app');

// 🔧 Ajout anticipé de la route simulant une erreur
app.get('/error-manuel', (req, res, next) => {
  const err = new Error('Erreur simulée');
  err.status = 500;
  next(err);
});

describe('🧪 Tests complets de app.js', () => {
  describe('🧩 Routes statiques simulées', () => {
    it.each([
      '/api/users',
      '/api/sanitize-test',
      '/api/statistiques',
      '/api/comptabilite',
      '/api/parametres',
      '/api/creation',
      '/api/contracts',
      '/api/depots',
      '/api/livraisons',
      '/api/deliveries',
      '/api/entretien',
      '/api/vehicules',
    ])('GET %s → 200 + array vide', async (url) => {
      const res = await request(app).get(url);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('🧪 /api/products CRUD', () => {
    const product = { id: 'xyz', name: 'TestProduit' };

    it('POST /api/products → 201', async () => {
      const res = await request(app).post('/api/products').send(product);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(product);
    });

    it('GET /api/products → retourne la liste contenant le produit', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([product]);
    });

    it('GET /api/products/:id → 200 si trouvé, 404 sinon', async () => {
      const ok = await request(app).get(`/api/products/${product.id}`);
      expect(ok.status).toBe(200);

      const notFound = await request(app).get('/api/products/inexistant');
      expect(notFound.status).toBe(404);
      expect(notFound.body).toHaveProperty('message', 'Not Found');
    });
  });

  describe('🧪 Routes dynamiques montées dans setupRoutes()', () => {
    const urls = [
      '/api/auth',
      '/api/stocks',
      '/api/invoices',
      '/api/concepteurs',
      '/api/catalogue',
      '/api/catalogueitems',
      '/api/nieuwkoop',
      '/api/events',
    ];

    it.each(urls)('GET %s → retourne un code 2xx ou 4xx', async (url) => {
      const res = await request(app)
        .get(url)
        .set('Authorization', 'Bearer fake_token');
      expect(res.status).toBeGreaterThanOrEqual(200);
      expect(res.status).toBeLessThan(500);
    });
  });

  it('GET /api/vehicles → retourne 401, 403 ou 500', async () => {
    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', 'Bearer fake_token');
    expect([401, 403, 500]).toContain(res.status);
  }, 15000);

  describe('❌ Middleware global - gestion des erreurs', () => {
    it('déclenche une erreur 500 personnalisée', async () => {
      const res = await request(app).get('/error-manuel');
      expect(res.status).toBe(500);

      console.log('❗Erreur simulée body:', res.body, 'text:', res.text);

      if (res.body && res.body.error) {
        expect(res.body.error).toMatch(/erreur simulée/i);
      } else {
        expect(res.text).toMatch(/erreur simulée/i);
      }
    });
  });

  describe('🔐 Sécurité CORS', () => {
    it('autorise une origine autorisée', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Origin', 'https://test.ok');
      expect(res.status).toBe(200);
    });
  });
});

