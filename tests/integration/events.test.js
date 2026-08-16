import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-tests';

const admin = {
  _id: '507f1f77bcf86cd799439011',
  id: '507f1f77bcf86cd799439011',
  name: 'Admin User',
  email: 'admin@test.com',
  role: 'admin'
};

const category = {
  _id: '507f1f77bcf86cd799439012',
  name: 'Tech'
};

const createdEvent = {
  _id: '507f1f77bcf86cd799439013',
  title: 'Cairo Tech Day',
  description: 'Talks and workshops for developers',
  category,
  date: '2026-10-15T10:00:00.000Z',
  city: 'Cairo',
  venue: 'Smart Village',
  capacity: 100,
  organizer: admin._id,
  populate: jest.fn().mockResolvedValue(undefined)
};

const listQuery = {
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue([])
};

const eventQuery = {
  populate: jest.fn().mockReturnThis(),
  then: (resolve, reject) => Promise.resolve(createdEvent).then(resolve, reject)
};

const Event = {
  find: jest.fn(() => listQuery),
  countDocuments: jest.fn().mockResolvedValue(0),
  findById: jest.fn(() => eventQuery),
  create: jest.fn().mockResolvedValue(createdEvent),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

const userQuery = {
  select: jest.fn().mockResolvedValue(admin)
};

const User = {
  findById: jest.fn(() => userQuery),
  findOne: jest.fn(),
  create: jest.fn()
};

await jest.unstable_mockModule('../../src/models/Event.js', () => ({ default: Event }));
await jest.unstable_mockModule('../../src/models/User.js', () => ({ default: User }));

const { default: app } = await import('../../src/app.js');
const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET);

describe('Events API', () => {
  test('GET /api/events returns an event list', async () => {
    const response = await request(app).get('/api/events');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.totalPages).toBe(0);
  });

  test('POST /api/events without a token returns 401', async () => {
    const response = await request(app).post('/api/events').send({});
    expect(response.status).toBe(401);
  });

  test('POST /api/events with invalid data returns 422', async () => {
    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });
    expect(response.status).toBe(422);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  test('creates and fetches an event with category details', async () => {
    const created = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Cairo Tech Day',
        description: 'Talks and workshops for developers',
        category: category._id,
        date: '2026-10-15T10:00:00.000Z',
        city: 'Cairo',
        venue: 'Smart Village',
        capacity: 100
      });

    expect(created.status).toBe(201);
    const response = await request(app).get(`/api/events/${created.body.data._id}`);
    expect(response.status).toBe(200);
    expect(response.body.data.category.name).toBe('Tech');
  });
});
