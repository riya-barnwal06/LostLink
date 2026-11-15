const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database/db');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please fill in all fields.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters.'
            });
        }

        const existingUser = db.prepare(
            'SELECT id FROM users WHERE email = ?'
        ).get(email.trim().toLowerCase());

        if (existingUser) {
            return res.status(409).json({
                message: 'Email is already registered.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = db.prepare(`
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `).run(
            name.trim(),
            email.trim().toLowerCase(),
            hashedPassword
        );

        res.status(201).json({
            message: 'Registration successful!',
            userId: result.lastInsertRowid
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Registration failed.'
        });

    }

});

// Login user
router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Please enter email and password.'
            });
        }

        const user = db.prepare(
            'SELECT * FROM users WHERE email = ?'
        ).get(email.trim().toLowerCase());

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        req.session.regenerate((error) => {

            if (error) {
                return res.status(500).json({
                    message: 'Unable to create login session.'
                });
            }

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            res.json({
                message: 'Login successful!',
                user: req.session.user
            });

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Login failed.'
        });

    }

});

// Check logged-in user
router.get('/me', (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            message: 'Not logged in.'
        });
    }

    res.json(req.session.user);

});

// Logout user
router.post('/logout', (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            return res.status(500).json({
                message: 'Logout failed.'
            });
        }

        res.clearCookie('connect.sid');

        res.json({
            message: 'Logged out successfully!'
        });

    });

});

module.exports = router;