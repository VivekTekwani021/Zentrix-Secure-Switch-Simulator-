const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  action: { type: String, enum: ['encrypt', 'decrypt', 'key_generated', 'auth'], required: true },
  status: { type: String, enum: ['success', 'fail'], required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String }
});

module.exports = mongoose.model('Log', logSchema);
