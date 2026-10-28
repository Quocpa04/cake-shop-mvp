const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  id: String,
  size: String,
  price: Number,
  sku: String,
});

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    image: { type: String },
    categoryId: { type: String, required: true },
    variants: [VariantSchema],
    allergens: [{ type: String }],
    leadTimeHours: { type: Number, default: 2 },
    isBestSeller: { type: Boolean, default: false },
    isNewProduct: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    storageInstructions: { type: String },
    percentOff: { type: Number, default: 0 },
    originalPrice: { type: Number },
    gender: { type: Boolean, default: true },
    cost: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
