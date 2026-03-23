const express = require('express');
const crypto = require('crypto');
const Key = require('../models/Key');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// Generate a new secure encryption key
router.post('/generate', async (req, res) => {
  try {
    const newKey = await Key.create({
      keyId: crypto.randomBytes(8).toString('hex'),
      keyValue: crypto.randomBytes(32).toString('hex')
    });
    res.status(201).json(newKey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all keys for dashboard
router.get('/', async (req, res) => {
  try {
    const keys = await Key.find().sort({ createdAt: -1 });
    res.json(keys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rotate key
router.post('/rotate/:id', async (req, res) => {
  try {
    const oldKey = await Key.findByIdAndUpdate(req.params.id, { isActive: false });
    const newKey = await Key.create({
        keyId: crypto.randomBytes(8).toString('hex'),
        keyValue: crypto.randomBytes(32).toString('hex')
    });
    res.json({ message: "Key rotated successfully", newKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete key
router.delete('/:id', async (req, res) => {
  try {
    await Key.findByIdAndDelete(req.params.id);
    res.json({ message: "Key deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
