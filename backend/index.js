const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;
const pool = require('./db');
require('dotenv').config();

app.use(cors({
  origin: 'http://54.252.193.253:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/travel', require('./routes/travel'));

app.get('/', (req, res) => {
  res.send('✅ Express 서버가 잘 작동하고 있어요!');
});

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

pool.query('SELECT NOW()', (err,res) => {
	if (err) {
		console.error('❌ DB 연결 실패:', err);
	} else {
		console.log('✅ DB 연결 성공:', res.rows[0]);
	}
});
