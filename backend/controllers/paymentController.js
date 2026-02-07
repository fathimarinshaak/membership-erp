const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const Invoice = require("../model/Invoice");
const Payment = require("../model/Payment");

exports.createOrder = async (req, res) => {
  try {
    const { invoiceId } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice || invoice.status === "PAID") {
      return res.status(400).json({ success: false, message: "Invalid invoice" });
    }

    const order = await razorpay.orders.create({
      amount: invoice.amount * 100, // paise
      currency: "INR",
      receipt: invoice.invoiceNumber
    });

    // 🔹 create PENDING payment
    const payment = await Payment.create({
      invoiceId: invoice._id,
      method: "RAZORPAY",
      amount: invoice.amount,
      status: "PENDING"
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      paymentId: payment._id,
      invoiceId: invoice._id
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
      invoiceId
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      await Payment.findByIdAndUpdate(paymentId, { status: "FAILED" });
      return res.status(400).json({ success: false });
    }

    // ✅ success
    await Payment.findByIdAndUpdate(paymentId, {
      status: "SUCCESS",
      paidAt: new Date()
    });

    await Invoice.findByIdAndUpdate(invoiceId, {
      status: "PAID",
      transactionId: razorpay_payment_id,
      paidAt: new Date(),
      paymentMethod: "RAZORPAY"
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markCashPayment = async (req, res) => {
  try {
    const { invoiceId } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice || invoice.status === "PAID") {
      return res.status(400).json({ success: false, message: "Invalid invoice" });
    }

    await Payment.create({
      invoiceId,
      method: "CASH",
      amount: invoice.amount,
      status: "SUCCESS",
      paidAt: new Date()
    });

    invoice.status = "PAID";
    invoice.paymentMethod = "CASH";
    invoice.paidAt = new Date();
    await invoice.save();

    res.json({ success: true, message: "Cash payment recorded" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};