const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Product = require('./models/Product');
const Order = require('./models/Order');
const Category = require('./models/Category');
const Occasion = require('./models/Occasion');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27018/miette_bakery';

// Middlewares
app.use(cors());
app.use(express.json());

// Connect MongoDB (Port 27018)
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`✅ MongoDB connected to: ${MONGO_URI}`))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ============================================================================
// API ROUTES
// ============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'miette_bakery',
    port: 27018,
    timestamp: new Date().toISOString(),
  });
});

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Products (Supports filtering & sorting)
app.get('/api/products', async (req, res) => {
  try {
    const { category, gender, search, sort } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.categoryId = category;
    }

    if (gender === 'female') {
      query.gender = true;
    } else if (gender === 'male') {
      query.gender = false;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { subtitle: regex }, { description: regex }];
    }

    let productsQuery = Product.find(query);

    if (sort === 'price_desc') {
      productsQuery = productsQuery.sort({ cost: -1, 'variants.0.price': -1 });
    } else if (sort === 'price_asc') {
      productsQuery = productsQuery.sort({ cost: 1, 'variants.0.price': 1 });
    } else if (sort === 'rating') {
      productsQuery = productsQuery.sort({ rating: -1 });
    }

    const products = await productsQuery.exec();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single Product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Order (POS / Mobile)
app.post('/api/orders', async (req, res) => {
  try {
    const newOrderData = req.body;
    if (!newOrderData.orderCode) {
      newOrderData.orderCode = `BK2610${Math.floor(1000 + Math.random() * 9000)}`;
    }
    const order = new Order(newOrderData);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Order Status
app.patch('/api/orders/:orderCode/status', async (req, res) => {
  try {
    const { status, note, actor } = req.body;
    const order = await Order.findOne({ orderCode: req.params.orderCode });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    order.timelineLogs.push({
      status,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
      actor: actor || 'Quản lý',
      note: note || `Chuyển trạng thái sang ${status}`,
    });

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Occasions
app.get('/api/occasions', async (req, res) => {
  try {
    const occasions = await Occasion.find();
    res.json(occasions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Miette Bakery Backend running on http://localhost:${PORT}`);
  console.log(`📦 MongoDB Database: mongodb://127.0.0.1:27018/miette_bakery`);
});
