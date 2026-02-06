const Admin = require('../model/Admin')
const jwt = require('jsonwebtoken')

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

exports.authenticateMember = async (req, res) => {
  try {
    const { token } = req.params;

    const member = await Member.findOne({
      secretToken: token,
      expiresAt: { $gt: new Date() },
      status: 'ACTIVE'
    });

    if (!member) {
      return res.status(401).json({ message: 'Invalid or expired link' });
    }

    // invalidate token
    member.secretToken = null;
    member.expiresAt = null;
    await member.save();

    const jwtToken = jwt.sign(
      { id: member._id, role: 'MEMBER' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('member_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Login successful'
    });

  } catch (err) {
    res.status(500).json({ message: 'Authentication failed' });
  }
};
