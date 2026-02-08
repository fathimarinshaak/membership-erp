require('dotenv').config();
require("./cron/membershipReminder.cron");

const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const crypto = require("crypto");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);

const authRouter = require('./routers/authRoute')
const adminRouter = require('./routers/adminRoute')
const memberRouter = require('./routers/memberRoute')

app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/member', memberRouter)

const port = process.env.PORT || 5000;

app.listen(port, async () => {
	await connectDB();
	console.log(` App started on port ${port}`);
});