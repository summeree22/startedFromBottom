const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../upload');

router.post('/', (req, res, next) => {
    const uploader = upload().single('image');
    uploader(req, res, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    const { location, date, description, x, y } = req.body;
    const image_url = req.file?.location || null;

    try {
        const result = await pool.query(
            `INSERT INTO travel_entries
            (location, date, description, x, y, image_url)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [location, date, description, parseInt(x), parseInt(y), image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM travel_entries ORDER BY created_at DESC');
    res.json(result.rows);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM travel_entries WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', (req, res, next) => {
    const uploader = upload().single('image');
    uploader(req, res, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        next();
    });
}, async (req, res) => {
    const { id } = req.params;
    const { location, date, description, x, y } = req.body;
    const image_url = req.file?.location || req.body.image_url || null;
    const result = await pool.query(
        'UPDATE travel_entries SET location = $1, date = $2, description = $3, x = $4, y = $5, image_url = $6 WHERE id = $7 RETURNING *',
        [location, date, description, parseInt(x), parseInt(y), image_url, id]
    );
    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Entry not found' });
    }
    res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query(
        'DELETE FROM travel_entries WHERE id = $1 RETURNING *',
        [id]
    );
    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Entry not found' });
    }
    res.json({ message: 'Entry deleted', deleted: result.rows[0] });
});

module.exports = router;

