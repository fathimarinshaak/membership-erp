const Invoice = require('../model/Invoice');
const generatePdf = require("../utils/invoicePdf");

exports.getInvoicesByMember = async (req, res) => {
  try {
    const invoices = await Invoice.find({ memberId: req.params.memberId })
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

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId)
      .populate({
        path: "membershipId",
        populate: { path: "planId" }
      })
      .populate("memberId"); 

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    res.json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId)
      .populate({
        path: "membershipId",
        populate: { path: "planId" }
      })
      .populate("memberId"); 

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    const pdf = await generatePdf(invoice);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${invoice.invoiceNumber}.pdf`
    });

    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to generate PDF" });
  }
};

exports.markInvoiceAsPaid = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { paymentMethod, transactionId } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    invoice.status = "PAID";
    invoice.paidAt = new Date();
    invoice.paymentMethod = paymentMethod;
    invoice.transactionId = transactionId;

    await invoice.save();

    res.json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};