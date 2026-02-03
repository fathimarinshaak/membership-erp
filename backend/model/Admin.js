const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

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
        required: true
    }
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

adminSchema.methods.validatePassword = async function (adminpassword) {
    return await bcrypt.compare(adminpassword, this.password)
}

adminSchema.methods.getjwt = function () {
    const token = jwt.sign({
        Id: this._id,
        email: this.email,
        role: 'admin'
    }, process.env.jwtsecret, { expiresIn: '1hr' })
    return token
}


module.exports = mongoose.model('Admin', adminSchema);
