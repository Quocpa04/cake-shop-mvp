const mongoose = require('mongoose');

const OccasionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    personName: { type: String, required: true },
    relationship: { type: String, required: true },
    date: { type: String, required: true },
    remindDaysBefore: { type: Number, default: 7 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Occasion', OccasionSchema);
