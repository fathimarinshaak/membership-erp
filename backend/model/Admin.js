const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select:false
    }
}, { timestamps: true });

adminSchema.pre('save', async function () {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    return
});

adminSchema.methods.validatePassword = async function (adminpassword) {
    return await bcrypt.compare(adminpassword, this.password)
}

adminSchema.methods.getjwt = function () {
    const token = jwt.sign({
        Id: this._id,
        role: 'admin'
    }, process.env.JWT_SECRET, { expiresIn: '1hr' })
    return token
}

module.exports = mongoose.model('Admin', adminSchema);