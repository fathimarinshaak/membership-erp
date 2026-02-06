const members = require('../model/Member')
const sendMail = require('../utils/nodemailer')

const Plan = require('../model/MembershipPlan')
const Membership = require('../model/Membership')
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
    });
    const accessLink = `${process.env.CLIENT_URL}/api/member/auth/${member.secretToken}`;
    await sendMail(member.email, accessLink);
    return res.status(201).json({ success: true, member });
  } catch (error) {
    console.error("AddMember error:", error);
    res.status(500).json({ success: false, message: "Error adding member", error });
  }
};

// exports.viewMembers=async (req,res)=>{
//   try{
//       const allMembers= await members.find()
//       return res.json(allMembers)
//   }catch(error){
//     console.error("Fetch Members error:", error);
//     return res.json({success:false,message:error.message})
//   }
// }


exports.viewMembers = async (req, res) => {
  try {
    const allMembers = await members.find();

    // Attach latest plan for each member
    const membersWithPlan = await Promise.all(
      allMembers.map(async (m) => {
        const latest = await Membership.findOne({ memberId: m._id })
          .populate("planId")
          .sort({ startDate: -1 });

        return {
          ...m.toObject(),
          latestPlan: latest ? {
            name: latest.planId.name,
            durationInDays: latest.planId.durationInDays,
            price: latest.planId.price,
            assignedAt: latest.startDate,
            expiresAt: latest.endDate
          } : null
        };
      })
    );

    return res.json(membersWithPlan);
  } catch (error) {
    console.error("Fetch Members error:", error);
    return res.json({ success: false, message: error.message });
  }
};


exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params
    const member = await members.findByIdAndDelete(id)

    if (!member) {
      return res.json({ success: false, message: 'not found' })
    }
    return res.json({ success: true, message: 'deleted successfully' })
  } catch (error) {
    res.json({ success: false, message: 'error deleting member', error })
  }
}


exports.editMember = async (req, res) => {
  try {
    const { id } = req.params;
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

    const updatedMember = await members.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        whatsappNumber,
        status: status || "ACTIVE",
        personalTrainer: {
          name: personalTrainer?.name || "",
          phone: personalTrainer?.phone || ""
        }
      },
      { new: true }
    );

    if (!updatedMember) {
      return res.json({ success: false, message: "Member not found" });
    }

    return res.json({ success: true, member: updatedMember });
  } catch (error) {
    console.error("EditMember error:", error);
    res.json({ success: false, message: "Error editing member", error });
  }
};

exports.assignPlan = async (req, res) => {
  try {
    const memberId = req.params.id;
    const { planId } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) return res.json({ success: false, message: "Plan not found" });

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.durationInDays * 86400000);

    const membership = await Membership.create({
      memberId,
      planId,
      startDate,
      endDate,
      status: "ACTIVE",
    });

    return res.json({ success: true, membership });
  } catch (error) {
    console.error("Assign Plan Error:", error);
    return res.json({ success: false, message: "Server error" });
  }
};

exports.getPlanHistory = async (req, res) => {
  try {
    const history = await Membership.find({ memberId: req.params.id })
      .populate("planId")
      .sort({ startDate: -1 });

    return res.json({ success: true, history });
  } catch (error) {
    console.error("Plan History Error:", error);
    res.json({ success: false });
  }
};