const mongoose = require('mongoose');
const crypto = require('crypto')

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required:true
    },
    phone: {
        type: String,
        required: true
    },
    whatsappNumber: {
        type: String,
        required:true
    },
    personalTrainer: {
        name: String,
        phone: String
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    secretToken: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    expiresAt: Date
}, { timestamps: true });

memberSchema.pre('save', function(next) {
  if (!this.secretToken) {
    this.secretToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);
