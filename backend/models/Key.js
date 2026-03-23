const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
  keyId: { type: String, required: true, unique: true },
  keyValue: { type: String, required: true },
  algorithm: { type: String, default: 'aes-256-cbc' },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Key', keySchema);
