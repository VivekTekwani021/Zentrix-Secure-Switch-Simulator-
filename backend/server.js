const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment config
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
const connectDB = require('./config/db');
connectDB();

// Import API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/keys', require('./routes/keyRoutes'));
app.use('/api/devices', require('./routes/deviceRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));

// Basic health check
app.get('/', (req, res) => {
    res.send('Secure Switch Simulator Backend is up and running! 🚀');
});

// ------------- VIVA DEMO SIMULATION ROUTE ------------- //
// Simulating legacy data entering the Universal Switch
const { encryptMiddleware, decrypt } = require('./middleware/encryption');
const Log = require('./models/Log');

app.post('/api/simulate/transmit', encryptMiddleware, async (req, res) => {
    try {
        // req.body.data is now ENCRYPTED via the middleware!
        await Log.create({
            action: 'encrypt',
            status: 'success',
            details: `Legacy data wrapped & encrypted successfully.`
        });
        
        res.json({ 
            message: 'Data Securely Transmitted by Universal Switch', 
            encryptedPayload: req.body.data,
            originalDataInfo: "Hidden for security"
        });
    } catch (err) {
        await Log.create({ action: 'encrypt', status: 'fail', details: err.message });
        res.status(500).json({ error: 'Transmission Failed' });
    }
});

app.post('/api/simulate/receive', async (req, res) => {
    try {
        // Opposite side: receiving and decrypting text
        const output = decrypt(req.body.encryptedData);
        await Log.create({ action: 'decrypt', status: 'success' });
        res.json({ message: 'Data Decrypted via Switch', decryptedPayload: output });
    } catch (err) {
        res.status(500).json({ error: 'Decryption Failed' });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
