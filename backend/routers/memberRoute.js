const {userDashboard } = require('../controllers/memberController');
const { createOrder, verifyPayment, markCashPayment } = require('../controllers/paymentController');
// const { memberOnly } = require('../middleware/auth')

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

module.exports = router