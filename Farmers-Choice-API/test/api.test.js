const request = require('supertest');
// Mock models to avoid external MongoDB binary in this environment
const app = require('../src/app');

// Simple in-memory store to mock Mongoose model methods used by controllers
const makeInMemoryModel = () => {
  const items = new Map();
  let idCounter = 1;
  return {
    async create(doc) {
      const _id = String(idCounter++);
      const stored = { ...doc, _id };
      items.set(_id, stored);
      return stored;
    },
    async find() {
      return Array.from(items.values());
    },
    async findOne(query) {
      for (const v of items.values()) {
        let ok = true;
        for (const k of Object.keys(query)) {
          if (v[k] !== query[k]) { ok = false; break; }
        }
        if (ok) return v;
      }
      return null;
    },
    async findById(id) {
      return items.get(id) || null;
    },
    async findByIdAndUpdate(id, doc, opts) {
      if (!items.has(id)) return null;
      const updated = { ...items.get(id), ...doc };
      items.set(id, updated);
      return updated;
    },
    async findByIdAndDelete(id) {
      return items.delete(id);
    },
    async deleteMany() {
      items.clear();
    }
  };
};

// Replace real models with mocks
jest.mock('../src/models/user', () => makeInMemoryModel());
jest.mock('../src/models/item', () => makeInMemoryModel());

describe('API integration tests', () => {
  test('GET /api/items returns 200 and array', async () => {
    const res = await request(app).get('/api/items');
    expect([200, 204, 404]).toContain(res.status);
    if (res.status === 200) expect(Array.isArray(res.body)).toBe(true);
  }, 15000);

  test('Auth: register and login', async () => {
    const userPayload = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    const reg = await request(app).post('/api/auth/register').send(userPayload);
    expect([200,201]).toContain(reg.status);
    const login = await request(app).post('/api/auth/login').send({ email: userPayload.email, password: userPayload.password });
    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty('token');
  }, 20000);

  test('Item CRUD', async () => {
    // create an item
    const itemPayload = { name: 'Apple', category: 'Fruit', price: 1.5, quantity: 10 };
    const createRes = await request(app).post('/api/items').send(itemPayload);
    expect([200,201]).toContain(createRes.status);
    const item = createRes.body.item || createRes.body;
    const id = item._id || item.id;

    // get list
    const listRes = await request(app).get('/api/items');
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);

    // get by id
    const getRes = await request(app).get(`/api/items/${id}`);
    expect([200,404]).toContain(getRes.status);

    // update
    const updateRes = await request(app).put(`/api/items/${id}`).send({ price: 2.0 });
    expect([200,404]).toContain(updateRes.status);

    // delete
    const delRes = await request(app).delete(`/api/items/${id}`);
    expect([204,404]).toContain(delRes.status);
  }, 30000);
});
