const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
	const { country, city, date, title, description, favorite_food, favorite_music, image_url, lat, lng } = req.body;

	try {
	const result = await pool.query(
		`INSERT INTO travel_entries
		(country, city, date, title, description, favorite_food, favorite_music, image_url, lat, lng)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
		[country, city, date, title, description, favorite_food, favorite_music, image_url, lat, lng]
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

router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { country, city, date, title, description, favorite_food, favorite_music, image_url, lat, lng } = req.body;
	const result = await pool.query (
		'UPDATE travel_entries SET country = $1, city = $2, date = $3, title = $4, description = $5, favorite_food = %6, favorite_music = $7, image_url = $8, lat = $9, lng = $10 WHERE id = $11 RETURNING *',
		[country, city, date, title, description, favorite_food, favorite_music, image_url, lat, lng, id]
	);
	if (result.rows.length === 0) {
		return res.status(404).json({ error: 'Entry not found' });
	}
	res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	const result = await pool.query (
		'DELETE FROM travel_entries WHERE id = $1 RETURNING *',
		[id]
	);
	if (result.rows.length === 0) {
		return res.status(404).json({ error: 'Entry not found' });
	}
	res.json({ message: 'Entry deleted', deleted: result.rows[0] });
});


module.exports = router;
