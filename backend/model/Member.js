const mongoose = require('mongoose');

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
    }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
