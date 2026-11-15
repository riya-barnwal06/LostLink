const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../database/db');

const router = express.Router();

// Image storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// Image upload configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Submit a new item report
router.post('/', upload.single('image'), (req, res) => {

    try {
        const {
            reportType,
            itemName,
            category,
            description,
            location,
            date,
            contact
        } = req.body;

        if (!reportType || !itemName || !category ||
            !description || !location || !date || !contact) {
            return res.status(400).json({
                message: 'Please fill in all required fields.'
            });
        }

        const imagePath = req.file ? '/uploads/' + req.file.filename : null;

        const result = db.prepare(`
            INSERT INTO items
            (report_type, item_name, category, description,
             location, item_date, image_path, contact)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            reportType,
            itemName,
            category,
            description,
            location,
            date,
            imagePath,
            contact
        );

        res.status(201).json({
            message: 'Item reported successfully!',
            itemId: result.lastInsertRowid
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Something went wrong while saving the report.'
        });
    }

});

// Get all reported items
router.get('/', (req, res) => {

    try {
        const items = db.prepare(`
            SELECT id, report_type, item_name, category,
                   description, location, item_date,
                   image_path, status, created_at
            FROM items
            ORDER BY created_at DESC
        `).all();

        res.json(items);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Unable to retrieve reports.'
        });
    }

});

// Get details of a single item
router.get('/:id', (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'Invalid item ID.'
            });
        }

        const item = db.prepare(`
            SELECT id, report_type, item_name, category,
                   description, location, item_date,
                   image_path, status, created_at
            FROM items
            WHERE id = ?
        `).get(id);

        if (!item) {
            return res.status(404).json({
                message: 'Item not found.'
            });
        }

        res.json(item);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Unable to retrieve item details.'
        });

    }

});

// Update item recovery status
router.put('/:id/status', (req, res) => {

    try {

        const id = Number(req.params.id);
        const { status } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'Invalid item ID.'
            });
        }

        if (!['Active', 'Recovered'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid status.'
            });
        }

        const result = db.prepare(`
            UPDATE items
            SET status = ?
            WHERE id = ?
        `).run(status, id);

        if (result.changes === 0) {
            return res.status(404).json({
                message: 'Item not found.'
            });
        }

        res.json({
            message: 'Item status updated successfully!',
            status: status
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Unable to update item status.'
        });

    }

});

module.exports = router;