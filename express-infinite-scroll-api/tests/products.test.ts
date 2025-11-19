import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

// This is a lightweight example test. In reality you'd mock the DB.
describe('GET /api/products', () => {
  it('should return 400 when query params are invalid', async () => {
    const res = await request(app).get('/api/products?limit=-1');
    expect(res.status).toBe(400);
  });
});
