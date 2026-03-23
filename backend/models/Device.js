const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true },
  macAddress: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'inactive', 'compromised'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', deviceSchema);
