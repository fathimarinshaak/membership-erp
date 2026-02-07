const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  membershipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership'
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID'],
    default: 'PENDING'
  },
  transactionId: {
    type: String
  },
  paidAt: {
    type: Date
  },
  paymentMethod: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
