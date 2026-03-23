const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment config
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
    res.send('Secure Switch Simulator Backend is up and running! 🚀');
});

// Import the middleware
// const { encryptMiddleware } = require('./middleware/encryption');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
