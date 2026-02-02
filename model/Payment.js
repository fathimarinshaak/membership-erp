const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true
    },
    method: {
        type: String,
        enum: ['RAZORPAY',
            'STRIPE',
            'PHONEPE',
            'UPI',
            'CASH',
            'BANK_TRANSFER'],
        required: true
    },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILED', 'PENDING'],
        default: 'PENDING'
    },
    paidAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
