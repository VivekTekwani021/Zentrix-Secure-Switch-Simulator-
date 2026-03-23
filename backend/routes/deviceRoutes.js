const express = require('express');
const Device = require('../models/Device');
const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (err) {
     res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
