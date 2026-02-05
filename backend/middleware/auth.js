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