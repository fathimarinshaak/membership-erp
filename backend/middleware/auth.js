const jwt = require('jsonwebtoken')

exports.adminOnly = (req,res,next)=>{
    const token = req.cookies?.admin
    if(!token){
        return res.json({success:false , msg:"not authorised,login again"})
    }

    try {
        const verifyToken = jwt.verify(token,process.env.JWT_SECRET)
        if(verifyToken.Id){
            req.admin = verifyToken.Id
        }else{
            return res.json({success:false , msg:"not authorised,login again"})    
        }
        next()
    } catch (error) {
        return res.json({success:false , msg:error.message})
    }
}

exports.memberOnly = (req, res, next) => {
  const token = req.cookies.member_token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    req.member = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
