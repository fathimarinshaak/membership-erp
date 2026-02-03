require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);
const port = process.env.PORT || 5000;

// app.get('/api/testing', (req, res) => {
// 	res.json({ status: 'ok', message: 'backend is connected' });
// });

app.listen(port, async () => {
	await connectDB();
	console.log(` App started on port ${port}`);
});