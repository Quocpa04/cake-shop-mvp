const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  variantId: String,
  size: String,
  price: Number,
  quantity: Number,
  image: String,
  messageOnCake: String,
  accessories: [
    {
      optionId: String,
      name: String,
      price: Number,
    },
  ],
});

const TimelineLogSchema = new mongoose.Schema({
  status: String,
  timestamp: String,
  actor: String,
  note: String,
});

const OrderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String },
    items: [OrderItemSchema],
    subtotal: { type: Number },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'BAKING', 'PACKED', 'SHIPPING', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    paymentMethod: { type: String, default: 'MOMO' },
    paymentStatus: { type: String, default: 'PAID' },
    isSecretGift: { type: Boolean, default: false },
    recipientName: { type: String },
    recipientPhone: { type: String },
    slotTime: { type: String },
    timelineLogs: [TimelineLogSchema],
    complaint: {
      hasComplaint: { type: Boolean, default: false },
      title: String,
      description: String,
      refundAmount: Number,
      status: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
