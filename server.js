const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./database/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Item routes
app.use('/api/items', require('./routes/items'));

// Home route
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to LostLink API!',
        status: 'Server is running successfully'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`LostLink server running at http://localhost:${PORT}`);
});