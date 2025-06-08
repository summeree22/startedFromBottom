const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
	const { title, description } = req.body;

	const result = await pool.query(
		'INSERT INTO travel_entries (title, description) VALUES ($1, $2) RETURNING *',
		[title, description]
	);

	res.json(result.rows[0]);
});

router.get('/', async (req, res) => {
	const result = await pool.query('SELECT * FROM travel_entries');

	res.json(result.rows);
});

router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { title, description } = req.body;
	const result = await pool.query (
		'UPDATE travel_entries SET title = $1, description = $2 WHERE id = $3 RETURNING *',
			[title, description, id]
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
