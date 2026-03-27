const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  schoolId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  fee: { type: Number, required: true, default: 999 }, // Premium fee
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('School', schoolSchema);