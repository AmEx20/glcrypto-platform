'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Configuration
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic Routes
app.get('/', (req, res) => {
    res.send('Welcome to the GLCrypto Platform API');
});

app.get('/api/v1/status', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
