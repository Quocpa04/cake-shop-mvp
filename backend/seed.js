const mongoose = require('mongoose');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Category = require('./models/Category');
const Occasion = require('./models/Occasion');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27018/miette_bakery';

const CATEGORIES_DATA = [
  { id: 'all', name: 'Tất cả', icon: 'sparkles' },
  { id: 'birthday', name: 'Sinh nhật', icon: 'gift-outline' },
  { id: 'cold_cake', name: 'Bánh lạnh', icon: 'snow-outline' },
  { id: 'fresh_cream', name: 'Kem tươi', icon: 'heart-outline' },
  { id: 'anniversary', name: 'Kỷ niệm & Cưới', icon: 'rose-outline' },
  { id: 'cupcake', name: 'Mini & Cupcake', icon: 'cafe-outline' },
  { id: 'vegan', name: 'Bánh chay', icon: 'leaf-outline' },
];

const PRODUCTS_DATA = require('./cakes30.json');

const ORDERS_DATA = [
  {
    orderCode: 'BK2610260012',
    customerName: 'Cô Hoàng Yến',
    customerPhone: '0912 345 678',
    deliveryAddress: '88 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. HCM',
    items: [
      {
        productId: 'p1',
        productName: 'Bánh Kem Dâu Tây Hoàng Gia',
        variantId: 'v1_2',
        size: 'Size 18cm (6-8 người)',
        price: 520000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
        messageOnCake: 'Chúc mừng sinh nhật Mẹ yêu!',
        accessories: [
          { optionId: 'candle_num', name: 'Nến số mạ vàng (0-9)', price: 15000 },
        ],
      },
    ],
    subtotal: 535000,
    shippingFee: 0,
    discount: 0,
    total: 535000,
    status: 'BAKING',
    paymentMethod: 'MOMO',
    paymentStatus: 'PAID',
    isSecretGift: true,
    recipientName: 'Cô Hoàng Yến',
    recipientPhone: '0912 345 678',
    slotTime: '17:00 - 18:00',
    timelineLogs: [
      { status: 'PENDING', timestamp: '09:30 26/10', actor: 'Khách hàng', note: 'Đặt đơn qua App' },
      { status: 'CONFIRMED', timestamp: '09:47 26/10', actor: 'Thu ngân Mai', note: 'Đã nhận MoMo' },
      { status: 'BAKING', timestamp: '14:30 26/10', actor: 'Bếp Hương', note: 'Đang trang trí bánh' },
    ],
    complaint: {
      hasComplaint: true,
      title: 'Trang trí xô lệch nhẹ',
      description: 'Khách gửi ảnh xác minh sau khi nhận bánh',
      refundAmount: 50000,
      status: 'PENDING',
    },
  },
  {
    orderCode: 'BK2610200008',
    customerName: 'Anh Trần Quốc Bảo',
    customerPhone: '0988 776 554',
    deliveryAddress: '24 Lê Lợi, Quận 1, TP. HCM',
    items: [
      {
        productId: 'p2',
        productName: 'Tiramisu Mascarpone Truyền Thống',
        variantId: 'v2_2',
        size: 'Ổ Tròn 18cm',
        price: 490000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&q=80',
        messageOnCake: 'Happy Vietnamese Women Day 20/10',
        accessories: [],
      },
    ],
    subtotal: 490000,
    shippingFee: 0,
    discount: 40000,
    total: 450000,
    status: 'COMPLETED',
    paymentMethod: 'ZALOPAY',
    paymentStatus: 'PAID',
    isSecretGift: false,
    slotTime: '15:30 - 16:30',
    timelineLogs: [
      { status: 'PENDING', timestamp: '09:00 20/10', actor: 'Khách hàng', note: 'Đặt đơn' },
      { status: 'CONFIRMED', timestamp: '09:15 20/10', actor: 'Thu ngân', note: 'Đã xác nhận' },
      { status: 'COMPLETED', timestamp: '16:00 20/10', actor: 'Shipper Bảo', note: 'Giao thành công' },
    ],
    complaint: {
      hasComplaint: false,
    },
  },
];

const OCCASIONS_DATA = [
  {
    id: 'occ_1',
    title: 'Sinh nhật Mẹ yêu',
    personName: 'Mẹ Hoàng Yến',
    relationship: 'Mẹ',
    date: '15/11',
    remindDaysBefore: 7,
  },
  {
    id: 'occ_2',
    title: 'Kỷ niệm Ngày Cưới',
    personName: 'Gia đình',
    relationship: 'Vợ/Chồng',
    date: '20/12',
    remindDaysBefore: 3,
  },
  {
    id: 'occ_3',
    title: 'Sinh nhật Bé Bắp',
    personName: 'Minh Khang',
    relationship: 'Con',
    date: '02/11',
    remindDaysBefore: 7,
  },
];

async function seed() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Clean existing collections in this db only
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Category.deleteMany({});
    await Occasion.deleteMany({});

    // Insert Seed Data
    const insertedCategories = await Category.insertMany(CATEGORIES_DATA);
    console.log(`✓ Inserted ${insertedCategories.length} categories`);

    const insertedProducts = await Product.insertMany(PRODUCTS_DATA);
    console.log(`✓ Inserted ${insertedProducts.length} products`);

    const insertedOrders = await Order.insertMany(ORDERS_DATA);
    console.log(`✓ Inserted ${insertedOrders.length} orders`);

    const insertedOccasions = await Occasion.insertMany(OCCASIONS_DATA);
    console.log(`✓ Inserted ${insertedOccasions.length} occasions`);

    console.log('\n🎉 SEED COMPLETE! Database "miette_bakery" is fully populated with 30 cakes.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
