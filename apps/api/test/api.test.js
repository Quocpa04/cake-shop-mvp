import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'cake-shop-api-'));
const app = createApp({ dataFile: path.join(temporary, 'db.json') });
let token, order, payment;

test('health and catalog expose seeded products', async () => {
  assert.equal((await request(app).get('/api/health')).status, 200);
  const response = await request(app).get('/api/products');
  assert.equal(response.status, 200); assert.equal(response.body.products.length, 12); assert.equal(response.body.products[0].variants.length, 3);
});

test('sandbox OTP authenticates a customer', async () => {
  await request(app).post('/api/auth/otp').send({ phone: '0912345678' }).expect(200);
  const response = await request(app).post('/api/auth/verify').send({ phone: '0912345678', code: '123456', name: 'Khách Demo' }).expect(200);
  token = response.body.token; assert.equal(response.body.user.role, 'CUSTOMER');
});

test('creates idempotent order, pays it, and exposes timeline', async () => {
  const tomorrow = new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
  const body = { items: [{ variantId: 'p01-v18', quantity: 1, cakeMessage: 'Chúc mừng sinh nhật', accessoryIds: ['acc-candle'] }], fulfillment: 'PICKUP', receiveDate: tomorrow, receiveTime: '15:00' };
  const first = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).set('Idempotency-Key', 'test-order-0001').send(body).expect(201);
  const repeated = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).set('Idempotency-Key', 'test-order-0001').send(body).expect(201);
  order = first.body.order; assert.equal(repeated.body.order.id, order.id); assert.equal(order.status, 'PENDING_PAYMENT');
  const paymentResponse = await request(app).post('/api/payments/create').set('Authorization', `Bearer ${token}`).send({ orderId: order.id }).expect(201);
  payment = paymentResponse.body.payment;
  const paid = await request(app).post(`/api/payments/${payment.id}/simulate-success`).set('Authorization', `Bearer ${token}`).send().expect(200);
  assert.equal(paid.body.order.status, 'CONFIRMED');
  const detail = await request(app).get(`/api/orders/${order.id}`).set('Authorization', `Bearer ${token}`).expect(200);
  assert.equal(detail.body.timeline.length, 2);
});

test('kitchen can follow state machine but cannot skip a state', async () => {
  await request(app).post('/api/auth/otp').send({ phone: '0900000002' });
  const login = await request(app).post('/api/auth/verify').send({ phone: '0900000002', code: '123456' }).expect(200);
  const kitchenToken = login.body.token;
  await request(app).patch(`/api/admin/orders/${order.id}/status`).set('Authorization', `Bearer ${kitchenToken}`).send({ status: 'READY' }).expect(409);
  await request(app).patch(`/api/admin/orders/${order.id}/status`).set('Authorization', `Bearer ${kitchenToken}`).send({ status: 'IN_PRODUCTION' }).expect(200);
  const ready = await request(app).patch(`/api/admin/orders/${order.id}/status`).set('Authorization', `Bearer ${kitchenToken}`).send({ status: 'READY' }).expect(200);
  assert.equal(ready.body.order.status, 'READY');
});

test.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
