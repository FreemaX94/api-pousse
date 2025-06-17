const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const controller = require('../../../backend/controllers/userController');
const userService = require('../../../backend/services/userService');

jest.mock('../../../backend/services/userService');

const app = express();
app.use(bodyParser.json());

app.post('/api/users/register', controller.register);
app.post('/api/users/login', controller.login);
app.get('/api/users', controller.getAllUsers);
app.get('/api/users/:id', controller.getUserById);
app.put('/api/users/:id', controller.updateUser);
app.delete('/api/users/:id', controller.deleteUser);

describe('User Controller', () => {

  it('POST /api/users/register - devrait enregistrer un utilisateur', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    userService.registerUser.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/users/register')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockUser);
  });

  it('POST /api/users/login - devrait connecter un utilisateur', async () => {
    const mockResult = { token: 'abc123' };
    userService.loginUser.mockResolvedValue(mockResult);

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResult);
  });

  it('GET /api/users - devrait retourner tous les utilisateurs', async () => {
    const mockUsers = [{ id: '1' }, { id: '2' }];
    userService.getAllUsers.mockResolvedValue(mockUsers);

    const res = await request(app).get('/api/users');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUsers);
  });

  it('GET /api/users/:id - devrait retourner un utilisateur par ID', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    userService.getUserById.mockResolvedValue(mockUser);

    const res = await request(app).get('/api/users/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUser);
  });

  it('PUT /api/users/:id - devrait mettre à jour un utilisateur', async () => {
    const mockUser = { id: '1', email: 'new@example.com' };
    userService.updateUser.mockResolvedValue(mockUser);

    const res = await request(app)
      .put('/api/users/1')
      .send({ email: 'new@example.com' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUser);
  });

  it('DELETE /api/users/:id - devrait supprimer un utilisateur', async () => {
    userService.deleteUser.mockResolvedValue();

    const res = await request(app).delete('/api/users/1');

    expect(res.status).toBe(204);
    expect(res.text).toBe('');
  });

});
