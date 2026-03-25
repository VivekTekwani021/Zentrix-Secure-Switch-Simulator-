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
const { encrypt, decrypt } = require('./middleware/encryption');
const Log = require('./models/Log');
const Key = require('./models/Key');

app.post('/api/simulate/transmit', async (req, res) => {
    try {
        const { data, keyId } = req.body;
        
        if (!keyId) {
            return res.status(400).json({ error: 'Encryption key ID is required' });
        }

        const keyDoc = await Key.findOne({ keyId });
        if (!keyDoc || !keyDoc.isActive) {
            return res.status(404).json({ error: 'Encryption key not found or inactive' });
        }

        // Encrypt data using the database key
        const { iv, encryptedData } = encrypt(data, keyDoc.keyValue);
        
        // Package the payload so the receiver knows which key/IV was used
        const packagedPayload = `${keyId}:${iv}:${encryptedData}`;

        await Log.create({
            action: 'encrypt',
            status: 'success',
            details: `Legacy data wrapped & encrypted successfully with key ${keyId}.`
        });
        
        res.json({ 
            message: 'Data Securely Transmitted by Universal Switch', 
            encryptedPayload: packagedPayload,
            originalDataInfo: "Hidden for security"
        });
    } catch (err) {
        await Log.create({ action: 'encrypt', status: 'fail', details: err.message });
        res.status(500).json({ error: 'Transmission Failed' });
    }
});

app.post('/api/simulate/receive', async (req, res) => {
    try {
        const { encryptedData } = req.body;
        
        // Unpack the payload
        const parts = encryptedData.split(':');
        if (parts.length !== 3) {
            return res.status(400).json({ error: 'Invalid encrypted payload format' });
        }
        
        const [keyId, iv, ciphertext] = parts;
        
        const keyDoc = await Key.findOne({ keyId });
        if (!keyDoc || !keyDoc.isActive) {
            return res.status(404).json({ error: 'Decryption key not found or inactive' });
        }

        // Decrypt text
        const output = decrypt(ciphertext, keyDoc.keyValue, iv);
        
        if (output.startsWith("Error:")) {
            return res.status(400).json({ error: output });
        }

        await Log.create({ action: 'decrypt', status: 'success', details: `Decrypted with key ${keyId}` });
        res.json({ message: 'Data Decrypted via Switch', decryptedPayload: output });
    } catch (err) {
        await Log.create({ action: 'decrypt', status: 'fail', details: err.message });
        res.status(500).json({ error: 'Decryption Failed' });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
