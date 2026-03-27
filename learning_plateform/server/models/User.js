const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  class: { type: String, required: true },
  city: { type: String, required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', default: null },
  schoolIdNumber: { type: String, default: '' }, // The entered school ID
  role: { type: String, enum: ['student', 'school'], default: 'student' },
  approved: { type: Boolean, default: false }, // For students who registered with school ID
  premium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);