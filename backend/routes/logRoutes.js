const express = require('express');
const Log = require('../models/Log');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
