const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;
const pool = require('./db');
require('dotenv').config();

app.use(cors({
  origin: proces.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/travel', require('./routes/travel'));

app.get('/', (req, res) => {
  res.send('✅ Express server is working!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is online: http://localhost:${PORT}`);
});
