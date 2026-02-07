const Admin = require('../model/Admin')

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body
    if (!(email && password)) {
        return res.json({ success: false, msg: "Username and password required" })
    }

    try {
        const admin = await Admin.findOne({ email }).select('+password')
        if (!admin) {
            return res.json({ success: false, msg: "Invalid Email" })
        }
        const isMatch = await admin.validatePassword(password)
        if (!isMatch) {
            return res.json({ success: false, msg: "Incorrect password" })
        }
        const admintoken = admin.getjwt()

        return res
            .cookie("admin", admintoken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
            })
            .json({ success: true , msg:"admin successfully logged in!"});

    } catch (error) {
        return res.json({success:false ,error:"admin login failed!"})
    }
}

exports.adminLogout = async (req, res) => {
    try {
        res.clearCookie("admin", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })
        return res.json({ success: true, msg: "admin logged out!" })
    } catch (error) {
        return res.json({success:false , msg:error.message})
    }
}

exports.isAuthenticated = (req,res)=>{
    try {
        return res.json({success:true, msg:"Authentication success"})
    } catch (error) {
        return res.json({success:false , msg:error.message})
    }
}