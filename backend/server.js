const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');

// Load environment config
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Generate a runtime 256-bit key for live socket transmissions
const SOCKET_MASTER_KEY = crypto.randomBytes(32).toString('hex');

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

// ------------- SOCKET.IO DEMONSTRATION LOGIC ------------- //
const connectedNodes = new Map();

io.on('connection', (socket) => {
    console.log(`[Socket] Device connected: ${socket.id}`);

    // Register device identity
    socket.on('register_device', (payload) => {
        const { deviceName, passcode } = payload;

        // Security Layer: Verify authorization code
        // We will use a hardcoded password 'ZENTRIX-2026' for this demo node layer
        if (passcode !== 'ZENTRIX-2026') {
            socket.emit('system_message', { error: 'Authentication Failed: Invalid Security Passcode' });
            return;
        }

        socket.data.deviceName = deviceName;
        connectedNodes.set(socket.id, { id: socket.id, deviceName, connectedAt: new Date() });
        console.log(`[Socket] Registered device: ${deviceName}`);
        socket.emit('system_message', { message: `Successfully connected as ${deviceName}` });
        
        // Broadcast updated list to everyone
        io.emit('active_nodes', Array.from(connectedNodes.values()));
    });

    // Handle incoming data
    socket.on('send_message', async (payload) => {
        const { text, targetNodeId } = payload;
        const sender = socket.data.deviceName || 'Unknown Device';
        
        try {
            // Middleware encrypts data using AES-256-CBC
            const { iv, encryptedData } = encrypt(text, SOCKET_MASTER_KEY);
            
            // Middleware decrypts data
            const decryptedMessage = decrypt(encryptedData, SOCKET_MASTER_KEY, iv);
            
            // Attempt logging to database
            try {
                await Log.create({
                    action: 'transmit',
                    status: 'success',
                    details: `[Real-world] ${sender} transmitted to ${targetNodeId || 'all'}: encrypted & decrypted successfully.`
                });
            } catch (err) {
                console.error('Log warning:', err);
            }

            const messagePacket = {
                sender,
                encryptedData,
                decryptedMessage,
                isPrivate: !!targetNodeId,
                timestamp: new Date().toISOString()
            };

            if (targetNodeId) {
                // Direct specific broadcast + sender
                io.to(targetNodeId).emit('receive_message', messagePacket);
                socket.emit('receive_message', messagePacket); 
            } else {
                // Broadcast payload to all
                io.emit('receive_message', messagePacket);
            }
        } catch (error) {
            console.error('Encryption Middleware Error:', error);
            socket.emit('system_message', { error: 'Transmission encryption failed.' });
        }
    });

    // Handle acknowledgments
    socket.on('acknowledge', (data) => {
        const { fromDevice, toDevice } = data;
        io.emit('receive_ack', {
            message: `${fromDevice} received message from ${toDevice}`,
            targetDevice: toDevice,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        console.log(`[Socket] Device disconnected: ${socket.id}`);
        connectedNodes.delete(socket.id);
        io.emit('active_nodes', Array.from(connectedNodes.values()));
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
