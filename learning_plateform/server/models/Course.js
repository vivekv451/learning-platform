const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: String,
  content: String,
  order: Number,
  isFree: { type: Boolean, default: true }, // First 5 chapters are free
  codeExample: { type: String, default: '' } // Sample code for the practical
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  chapters: [chapterSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);