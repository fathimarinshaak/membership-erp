const members = require('../model/Member')
exports.dashboard = (req, res) => {
  return res.json({ msg: "dashboard" })
}

exports.AddMember = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      whatsappNumber,
      personalTrainer,
      status
    } = req.body;

    if (!name || !email || !phone || !whatsappNumber) {
      return res.json({ success: false, message: "All fields required" });
    }
    const member = await members.create({
      name,
      email,
      phone,
      whatsappNumber,
      status: status || "ACTIVE",
      personalTrainer: {
        name: personalTrainer?.name || "",
        phone: personalTrainer?.phone || ""
      },
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    return res.status(201).json({ success: true, member });
  } catch (error) {
    console.error("AddMember error:", error);
    res.status(500).json({ success: false, message: "Error adding member", error });
  }
};

exports.viewMembers=async (req,res)=>{
  try{
      const allMembers= await members.find()
      return res.json(allMembers)
  }catch(error){
    console.error("Fetch Members error:", error);
    return res.json({success:false,message:error.message})
  }
}

exports.deleteMember=async(req,res)=>{
  try{
    const{id}=req.params
  const member=await members.findByIdAndDelete(id)

  if(!member){
    return res.json({success:false,message:'not found'})
  }
  return res.json({success:true,message:'deleted successfully'})
  }catch(error){
 res.json({success:false,message:'error deleting member',error})
  }
}


