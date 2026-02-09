const Member = require('../model/Member')
const Membership = require("../model/Membership");
const Invoice = require("../model/Invoice")

exports.userDashboard = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const member = await Member.findOne({ secretToken: token });
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const latestPlan = await Membership.findOne({ memberId: member._id })
      .populate("planId")
      .sort({ startDate: -1 });

    const invoices = await Invoice.find({ memberId: member._id })
      .populate({
        path: "membershipId",
        populate: { path: "planId" }
      })
      .sort({ createdAt: -1 });

    // ✅ normalize plan data for frontend
    const currentPlan = latestPlan
      ? {
        name: latestPlan.planId.name,
        price: latestPlan.planId.price,
        durationInDays: latestPlan.planId.durationInDays,
        status: latestPlan.status,
        startDate: latestPlan.startDate,
        endDate: latestPlan.endDate,
        daysLeft:
          latestPlan.status === "ACTIVE"
            ? Math.max(
              0,
              Math.ceil(
                (new Date(latestPlan.endDate) - new Date()) /
                (1000 * 60 * 60 * 24)
              )
            )
            : 0
      }
      : null;

    res.json({ member, currentPlan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const { token } = req.params;

    const member = await Member.findOne({ secretToken: token }); // ✅ use secretToken
    if (!member) return res.status(404).json({ message: "Member not found" });

    const invoices = await Invoice.find({ memberId: member._id })
      .populate({
        path: "membershipId",
        populate: { path: "planId" },
      })
      .sort({ createdAt: -1 });

    res.json({ invoices }); // or just res.json(invoices)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

exports.getMembershipHistory = async (req, res) => {
  try {
    const { token } = req.params;
    const member = await Member.findOne({ secretToken: token });
    if (!member) return res.status(404).json({ message: "Member not found" });

    const history = await Membership.find({ memberId: member._id })
      .populate("planId")
      .sort({ startDate: -1 });

    // normalize data for frontend
    const formatted = history.map(item => ({
      _id: item._id,
      planName: item.planId?.name || "—",
      startDate: item.startDate,
      endDate: item.endDate,
      status: item.status
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Membership history error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
