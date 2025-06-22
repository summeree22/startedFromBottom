CREATE TABLE IF NOT EXISTS travel_entries (
	id SERIAL PRIMARY KEY,
	country VARCHAR(100),
	city VARCHAR(100),
	date DATE,
	title TEXT,
	description TEXT,
	favorite_food TEXT,
	favorite_music TEXT,
	image_url TEXT,
	lat FLOAT,
	lng FLOAT,
	created_at TIMESTAMP DEFAULT NOW()
);
