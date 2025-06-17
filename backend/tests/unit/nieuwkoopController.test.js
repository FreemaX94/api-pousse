const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const controller = require('../../../backend/controllers/nieuwkoopController');
const nieuwkoopApi = require('../../../backend/services/nieuwkoopApi');

jest.mock('../../../backend/services/nieuwkoopApi');

const app = express();
app.use(bodyParser.json());

// Routes simulées
app.get('/items', controller.getItems);
app.get('/item/:productId', controller.getItem);
app.get('/item-image/:productId', controller.getItemImage);
app.get('/catalog', controller.getCatalog);
app.get('/catalog/:catalogId', controller.getCatalogById);
app.get('/stocks', controller.getStocks);
app.get('/stocks/:productId', controller.getStockById);
app.get('/health', controller.getHealth);

describe('Nieuwkoop Controller', () => {

  it('GET /items - getItems', async () => {
    nieuwkoopApi.fetchItems.mockResolvedValue([{ id: 1 }]);
    const res = await request(app).get('/items');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toEqual([{ id: 1 }]);
  });

  it('GET /item/:productId - getItem', async () => {
    nieuwkoopApi.fetchItem.mockResolvedValue({ id: '123' });
    const res = await request(app).get('/item/123');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('123');
  });

  it('GET /item-image/:productId - getItemImage', async () => {
    nieuwkoopApi.fetchItemImage.mockResolvedValue(Buffer.from('imagebinary'));
    const res = await request(app).get('/item-image/456');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('image/jpeg');
  });

  it('GET /catalog - getCatalog', async () => {
    nieuwkoopApi.fetchCatalog.mockResolvedValue(['catalog1']);
    const res = await request(app).get('/catalog');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(['catalog1']);
  });

  it('GET /catalog/:catalogId - getCatalogById', async () => {
    nieuwkoopApi.fetchCatalogById.mockResolvedValue({ id: 'cat42' });
    const res = await request(app).get('/catalog/cat42');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('cat42');
  });

  it('GET /stocks - getStocks', async () => {
    nieuwkoopApi.fetchStock.mockResolvedValue([{ id: 'stockA' }]);
    const res = await request(app).get('/stocks');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([{ id: 'stockA' }]);
  });

  it('GET /stocks/:productId - getStockById', async () => {
    nieuwkoopApi.fetchStockById.mockResolvedValue({ id: 'prod9' });
    const res = await request(app).get('/stocks/prod9');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('prod9');
  });

  it('GET /health - getHealth', async () => {
    nieuwkoopApi.fetchHealth.mockResolvedValue({ status: 'ok' });
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
  });

});
