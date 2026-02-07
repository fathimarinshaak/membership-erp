// controllers/memberController.js
const Member = require("../model/Member");
const Membership = require("../model/Membership");


exports.userDashboard = async (req, res) => {
  try {
    const { token } = req.params; // get token from URL

    if (!token) return res.status(400).json({ message: "Token is required" });

    // Find member by token
    const member = await Member.findOne({ secretToken: req.params.token });
    if (!member) return res.status(404).json({ message: "Member not found" });
    // Get latest assigned plan
    const latestPlan = await Membership.findOne({ memberId: member._id }).populate("planId")
      .sort({ startDate: -1 });

    const currentPlan = latestPlan
      ? {
        name: latestPlan.planId.name,
        price: latestPlan.planId.price,
        durationInDays: latestPlan.planId.durationInDays,
        startDate: latestPlan.startDate,
        endDate: latestPlan.endDate,
        status: latestPlan.status,
        remainingDays: latestPlan.status === "ACTIVE"
          ? Math.ceil((new Date(latestPlan.endDate) - new Date()) / (1000 * 60 * 60 * 24))
          : 0,
      }
      : null;

    return res.json({ member, currentPlan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
