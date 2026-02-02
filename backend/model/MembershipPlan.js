const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    durationInDays: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
