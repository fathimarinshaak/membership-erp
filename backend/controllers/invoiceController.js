const Invoice = require('../model/Invoice');

exports.getInvoicesByMember = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      memberId: req.params.memberId
    })
      .populate({
        path: "membershipId",
        populate: { path: "planId" }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};