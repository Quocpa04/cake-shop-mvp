import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import { ORDER_STATUS, canTransitionOrder } from '@cake-shop/shared';
import { config } from './config.js';
import { JsonStore } from './store.js';
import { ApiError, assert } from './errors.js';
import { issueToken, requireAuth } from './auth.js';

const phonePattern = /^0\d{9}$/;
const roleByPhone = { '0900000002': 'KITCHEN', '0900000003': 'ADMIN' };
const slotCapacity = 5;
const currency = (value) => Math.round(Number(value));
const nowIso = () => new Date().toISOString();
const publicUser = ({ id, phone, name, role }) => ({ id, phone, name, role });

function slotDate(date, time) { return new Date(`${date}T${time}:00+07:00`); }
function slotId(date, time) { return `${date}|${time}`; }
function validateDate(date) { assert(/^\d{4}-\d{2}-\d{2}$/.test(date || ''), 400, 'INVALID_DATE', 'Ngày phải có định dạng YYYY-MM-DD'); }

function listSlots(db, date) {
  validateDate(date);
  const result = [];
  for (let hour = 9; hour <= 20; hour += 1) {
    const time = `${String(hour).padStart(2, '0')}:00`;
    const id = slotId(date, time);
    const booked = db.orders.filter((order) => order.slotId === id && ![ORDER_STATUS.CANCELLED].includes(order.status)).length;
    result.push({ id, date, startTime: time, capacity: slotCapacity, booked, remaining: Math.max(0, slotCapacity - booked), isPast: slotDate(date, time).getTime() <= Date.now() });
  }
  return result;
}

function calculateCart(db, input) {
  assert(Array.isArray(input.items) && input.items.length > 0, 400, 'EMPTY_CART', 'Giỏ hàng đang trống');
  const lines = input.items.map((line) => {
    const product = db.products.find((item) => item.variants.some((variant) => variant.id === line.variantId));
    assert(product?.status === 'ACTIVE', 400, 'PRODUCT_UNAVAILABLE', 'Sản phẩm không còn bán');
    const variant = product.variants.find((item) => item.id === line.variantId);
    const quantity = Number(line.quantity);
    assert(Number.isInteger(quantity) && quantity >= 1 && quantity <= 10, 400, 'INVALID_QUANTITY', 'Số lượng phải từ 1 đến 10');
    const message = String(line.cakeMessage || '').trim();
    assert(message.length <= 40, 400, 'CAKE_MESSAGE_TOO_LONG', 'Chữ trên bánh tối đa 40 ký tự');
    const selectedAccessories = [...new Set(line.accessoryIds || [])].map((id) => {
      const accessory = db.accessories.find((item) => item.id === id);
      assert(accessory, 400, 'INVALID_ACCESSORY', 'Phụ kiện không hợp lệ'); return accessory;
    });
    const unitPrice = variant.price + selectedAccessories.reduce((sum, item) => sum + item.price, 0);
    return { productId: product.id, productName: product.name, imageUrl: product.imageUrl, variantId: variant.id, size: variant.size, quantity, cakeMessage: message, greeting: String(line.greeting || '').trim().slice(0, 200), allergens: product.allergens, preorder: product.preorder, accessories: selectedAccessories, unitPrice, lineTotal: unitPrice * quantity };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const fulfillment = input.fulfillment === 'DELIVERY' ? 'DELIVERY' : 'PICKUP';
  const deliveryFee = fulfillment === 'DELIVERY' ? 30000 : 0;
  return { lines, subtotal, deliveryFee, total: subtotal + deliveryFee, fulfillment };
}

function expirePendingOrders(db) {
  const cutoff = Date.now() - 15 * 60 * 1000;
  let changed = false;
  db.orders.forEach((order) => { if (order.status === ORDER_STATUS.PENDING_PAYMENT && new Date(order.createdAt).getTime() < cutoff) { order.status = ORDER_STATUS.CANCELLED; order.cancelReason = 'PAYMENT_TIMEOUT'; order.updatedAt = nowIso(); changed = true; } });
  return changed;
}

export function createApp({ dataFile = config.dataFile } = {}) {
  const store = new JsonStore(dataFile);
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use((_req, _res, next) => { const db = store.load(); if (expirePendingOrders(db)) store.write(db); next(); });

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: nowIso() }));
  app.post('/api/auth/otp', async (req, res, next) => { try {
    const phone = String(req.body.phone || '').trim(); assert(phonePattern.test(phone), 400, 'INVALID_PHONE', 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0');
    await store.transaction((db) => { db.otpRequests = db.otpRequests.filter((item) => item.phone !== phone); db.otpRequests.push({ phone, code: config.otpCode, expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() }); });
    res.json({ message: 'OTP sandbox đã được tạo', expiresInSeconds: 300, developmentOtp: config.otpCode });
  } catch (error) { next(error); } });
  app.post('/api/auth/verify', async (req, res, next) => { try {
    const phone = String(req.body.phone || '').trim(), code = String(req.body.code || '').trim();
    const user = await store.transaction((db) => {
      const request = db.otpRequests.find((item) => item.phone === phone && item.code === code && new Date(item.expiresAt).getTime() > Date.now());
      assert(request, 400, 'INVALID_OTP', 'OTP không đúng hoặc đã hết hạn');
      let found = db.users.find((item) => item.phone === phone);
      if (!found) { found = { id: crypto.randomUUID(), phone, name: req.body.name?.trim() || `Khách ${phone.slice(-4)}`, role: roleByPhone[phone] || 'CUSTOMER', createdAt: nowIso() }; db.users.push(found); }
      db.otpRequests = db.otpRequests.filter((item) => item.phone !== phone); return found;
    });
    res.json({ token: issueToken(user), user: publicUser(user) });
  } catch (error) { next(error); } });
  app.get('/api/auth/me', requireAuth(store), (req, res) => res.json({ user: publicUser(req.user) }));

  app.get('/api/products', (req, res) => { const query = String(req.query.q || '').toLowerCase(); const category = String(req.query.category || ''); const products = store.load().products.filter((item) => item.status === 'ACTIVE' && (!query || item.name.toLowerCase().includes(query)) && (!category || item.category === category)); res.json({ products, accessories: store.load().accessories }); });
  app.get('/api/products/:id', (req, res, next) => { try { const product = store.load().products.find((item) => item.id === req.params.id && item.status === 'ACTIVE'); assert(product, 404, 'PRODUCT_NOT_FOUND', 'Không tìm thấy sản phẩm'); res.json({ product, accessories: store.load().accessories }); } catch (error) { next(error); } });
  app.get('/api/slots', (req, res, next) => { try { res.json({ slots: listSlots(store.load(), String(req.query.date || '')) }); } catch (error) { next(error); } });
  app.post('/api/cart/validate', (req, res, next) => { try { const calculation = calculateCart(store.load(), req.body); res.json(calculation); } catch (error) { next(error); } });

  app.post('/api/orders', requireAuth(store, ['CUSTOMER']), async (req, res, next) => { try {
    const key = String(req.headers['idempotency-key'] || '').trim(); assert(key.length >= 8, 400, 'IDEMPOTENCY_KEY_REQUIRED', 'Thiếu Idempotency-Key hợp lệ');
    const order = await store.transaction((db) => {
      if (db.idempotency[key]) return db.orders.find((item) => item.id === db.idempotency[key]);
      const calculation = calculateCart(db, req.body); const date = String(req.body.receiveDate || ''), time = String(req.body.receiveTime || ''); validateDate(date);
      assert(/^\d{2}:00$/.test(time), 400, 'INVALID_SLOT', 'Khung giờ không hợp lệ');
      const slot = listSlots(db, date).find((item) => item.startTime === time); assert(slot && !slot.isPast && slot.remaining > 0, 409, 'SLOT_FULL', 'Khung giờ không còn khả dụng');
      const leadMinutes = calculation.lines.some((item) => item.preorder) ? 24 * 60 : 2 * 60;
      assert(slotDate(date, time).getTime() >= Date.now() + leadMinutes * 60 * 1000, 400, 'LEAD_TIME_VIOLATION', `Cần đặt trước tối thiểu ${leadMinutes / 60} giờ`);
      if (calculation.fulfillment === 'DELIVERY') assert(String(req.body.address || '').trim().length >= 10, 400, 'ADDRESS_REQUIRED', 'Vui lòng nhập địa chỉ giao hàng');
      const createdAt = nowIso(); const id = crypto.randomUUID();
      const record = { id, code: `CK${Date.now().toString().slice(-8)}`, userId: req.user.id, status: ORDER_STATUS.PENDING_PAYMENT, ...calculation, receiverName: String(req.body.receiverName || req.user.name), receiverPhone: String(req.body.receiverPhone || req.user.phone), address: String(req.body.address || ''), note: String(req.body.note || '').slice(0, 300), receiveDate: date, receiveTime: time, slotId: slot.id, createdAt, updatedAt: createdAt };
      db.orders.push(record); db.idempotency[key] = id; db.statusLogs.push({ id: crypto.randomUUID(), orderId: id, from: null, to: record.status, actorId: req.user.id, createdAt }); return record;
    });
    res.status(201).json({ order });
  } catch (error) { next(error); } });
  app.get('/api/orders', requireAuth(store), (req, res) => { const orders = store.load().orders.filter((item) => req.user.role === 'CUSTOMER' ? item.userId === req.user.id : true).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); res.json({ orders }); });
  app.get('/api/orders/:id', requireAuth(store), (req, res, next) => { try { const db = store.load(); const order = db.orders.find((item) => item.id === req.params.id); assert(order && (req.user.role !== 'CUSTOMER' || order.userId === req.user.id), 404, 'ORDER_NOT_FOUND', 'Không tìm thấy đơn hàng'); res.json({ order, timeline: db.statusLogs.filter((item) => item.orderId === order.id) }); } catch (error) { next(error); } });
  app.post('/api/orders/:id/cancel', requireAuth(store, ['CUSTOMER']), async (req, res, next) => { try { const order = await store.transaction((db) => { const item = db.orders.find((entry) => entry.id === req.params.id && entry.userId === req.user.id); assert(item, 404, 'ORDER_NOT_FOUND', 'Không tìm thấy đơn hàng'); assert([ORDER_STATUS.PENDING_PAYMENT, ORDER_STATUS.CONFIRMED].includes(item.status), 409, 'CANNOT_CANCEL', 'Đơn đã vào sản xuất nên không thể hủy'); const from = item.status; item.status = ORDER_STATUS.CANCELLED; item.cancelReason = String(req.body.reason || 'CUSTOMER_REQUEST'); item.updatedAt = nowIso(); db.statusLogs.push({ id: crypto.randomUUID(), orderId: item.id, from, to: item.status, actorId: req.user.id, createdAt: item.updatedAt }); return item; }); res.json({ order }); } catch (error) { next(error); } });

  app.post('/api/payments/create', requireAuth(store, ['CUSTOMER']), async (req, res, next) => { try { const payment = await store.transaction((db) => { const order = db.orders.find((item) => item.id === req.body.orderId && item.userId === req.user.id); assert(order, 404, 'ORDER_NOT_FOUND', 'Không tìm thấy đơn hàng'); assert(order.status === ORDER_STATUS.PENDING_PAYMENT, 409, 'ORDER_NOT_PAYABLE', 'Đơn không ở trạng thái chờ thanh toán'); let item = db.payments.find((entry) => entry.orderId === order.id && entry.status === 'PENDING'); if (!item) { item = { id: crypto.randomUUID(), orderId: order.id, amount: order.total, method: 'SANDBOX_QR', status: 'PENDING', createdAt: nowIso() }; db.payments.push(item); } return item; }); res.status(201).json({ payment, qrPayload: `CAKESHOP|${payment.id}|${payment.amount}` }); } catch (error) { next(error); } });
  app.post('/api/payments/:id/simulate-success', requireAuth(store, ['CUSTOMER']), async (req, res, next) => { try { const result = await store.transaction((db) => { const payment = db.payments.find((item) => item.id === req.params.id); assert(payment, 404, 'PAYMENT_NOT_FOUND', 'Không tìm thấy giao dịch'); const order = db.orders.find((item) => item.id === payment.orderId && item.userId === req.user.id); assert(order, 404, 'ORDER_NOT_FOUND', 'Không tìm thấy đơn hàng'); if (payment.status === 'SUCCESS') return { payment, order }; assert(order.status === ORDER_STATUS.PENDING_PAYMENT, 409, 'ORDER_NOT_PAYABLE', 'Đơn không còn chờ thanh toán'); payment.status = 'SUCCESS'; payment.paidAt = nowIso(); order.status = ORDER_STATUS.CONFIRMED; order.updatedAt = payment.paidAt; db.statusLogs.push({ id: crypto.randomUUID(), orderId: order.id, from: ORDER_STATUS.PENDING_PAYMENT, to: order.status, actorId: req.user.id, createdAt: order.updatedAt }); return { payment, order }; }); res.json(result); } catch (error) { next(error); } });

  app.get('/api/admin/orders', requireAuth(store, ['ADMIN', 'KITCHEN']), (req, res) => { const status = String(req.query.status || ''), date = String(req.query.date || ''); const orders = store.load().orders.filter((item) => (!status || item.status === status) && (!date || item.receiveDate === date)).sort((a, b) => `${a.receiveDate}${a.receiveTime}`.localeCompare(`${b.receiveDate}${b.receiveTime}`)); res.json({ orders }); });
  app.patch('/api/admin/orders/:id/status', requireAuth(store, ['ADMIN', 'KITCHEN']), async (req, res, next) => { try { const order = await store.transaction((db) => { const item = db.orders.find((entry) => entry.id === req.params.id); assert(item, 404, 'ORDER_NOT_FOUND', 'Không tìm thấy đơn hàng'); const nextStatus = String(req.body.status || ''); assert(canTransitionOrder(item.status, nextStatus), 409, 'INVALID_STATUS_TRANSITION', `Không thể chuyển từ ${item.status} sang ${nextStatus}`); if (req.user.role === 'KITCHEN') assert([ORDER_STATUS.IN_PRODUCTION, ORDER_STATUS.READY].includes(nextStatus), 403, 'FORBIDDEN_ROLE', 'Bếp chỉ được bắt đầu hoặc hoàn thành bánh'); const from = item.status; item.status = nextStatus; item.updatedAt = nowIso(); db.statusLogs.push({ id: crypto.randomUUID(), orderId: item.id, from, to: nextStatus, actorId: req.user.id, createdAt: item.updatedAt }); return item; }); res.json({ order }); } catch (error) { next(error); } });

  app.use((_req, _res, next) => next(new ApiError(404, 'ROUTE_NOT_FOUND', 'API không tồn tại')));
  app.use((error, _req, res, _next) => { const status = error.status || 500; if (status >= 500) console.error(error); res.status(status).json({ error: { code: error.code || 'INTERNAL_ERROR', message: status >= 500 ? 'Hệ thống đang bận, vui lòng thử lại' : error.message, details: error.details || null } }); });
  return app;
}
