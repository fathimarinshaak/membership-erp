const { getInvoiceById, downloadInvoice } = require('../controllers/invoiceController');
const {userDashboard, getInvoices, getMembershipHistory } = require('../controllers/memberController');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

const router = require('express').Router()

router
    .route("/dashboard/:token")    
    .get(userDashboard);

router
    .route("/payment/create-order")
    .post(createOrder)

router
    .route("/payment/verify")
    .post(verifyPayment);

router
    .route("/invoices/:token")
    .get(getInvoices);

router
    .route("/membership-history/:token")
    .get(getMembershipHistory);

router
    .route("/invoice/:invoiceId")
    .get(getInvoiceById)

router
    .route("/invoice/:invoiceId/download")
    .get(downloadInvoice)


module.exports = router