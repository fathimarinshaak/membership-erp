const mongoose = require('mongoose');
async function connectDB() {
	try {
		await mongoose.connect(process.env.DB_URL);
		console.log('db connected successfuly!');
	} catch (e) {
		console.log('db connection failed!');
	}
}
module.exports = connectDB;
