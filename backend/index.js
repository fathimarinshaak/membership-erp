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

// const razorpay = require('./utils/razorpay');
// app.post("/api/payment/create-order", async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const order = await razorpay.orders.create({
//       amount: amount * 100,
//       currency: "INR",
//       receipt: "receipt_" + Date.now()
//     });

//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 👉 Verify Payment API
// app.post("/api/payment/verify", (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//   const sign = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSign = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(sign)
//     .digest("hex");

//   if (expectedSign === razorpay_signature) {
//     res.json({ success: true });
//   } else {
//     res.status(400).json({ success: false });
//   }
// });



app.listen(port, async () => {
	await connectDB();
	console.log(` App started on port ${port}`);
});