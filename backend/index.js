require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser')

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);
const port = process.env.PORT || 5000;

app.listen(port, async () => {
	await connectDB();
	console.log(` App started on port ${port}`);
});