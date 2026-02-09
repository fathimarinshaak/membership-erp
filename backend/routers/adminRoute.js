const { createPlan, getPlans, updatePlan, deletePlan } = require('../controllers/membershipController')
const { dashboard, AddMember, viewMembers, deleteMember, editMember, assignPlan, getPlanHistory, sendMemberLink, regenerateLink } = require('../controllers/adminController')
const { adminOnly } = require('../middleware/auth')
const { getInvoicesByMember, paymentSuccess, getInvoiceById, downloadInvoice, markInvoiceAsPaid, getAllPayments } = require('../controllers/invoiceController')
const { markCashPayment } = require('../controllers/paymentController')

const router = require('express').Router()

router
    .route('/dashboard')
    .get(adminOnly, dashboard)

router
    .route('/addMember')
    .post(adminOnly, AddMember)

router
    .route('/viewMembers')
    .get(adminOnly, viewMembers)

router
    .route('/deleteMember/:id')
    .post(adminOnly, deleteMember)

router
    .route('/addplan')
    .post(adminOnly, createPlan)

router
    .route('/viewplan')
    .get(adminOnly, getPlans)

router
    .route('/updateplan/:id')
    .post(adminOnly, updatePlan)

router
    .route('/deleteplan/:id')
    .post(adminOnly, deletePlan)

router
    .route('/editMember/:id')
    .post(adminOnly, editMember)
    
router
    .route('/assignPlan/:id')
    .post(adminOnly, assignPlan);

router
    .route("/planHistory/:id")
    .get(adminOnly, getPlanHistory);

router
    .route('/member/:memberId/invoices')
    .get(adminOnly, getInvoicesByMember)
   
router
    .route("/member/send-link/:id")
    .post(adminOnly, sendMemberLink)

router
    .route("/member/regenerate-link/:id")
    .post(adminOnly, regenerateLink)

router
    .route("/invoice/:invoiceId")
    .get(adminOnly, getInvoiceById)

router
    .route("/invoice/:invoiceId/download")
    .get(adminOnly, downloadInvoice)

router
    .route("/pay/:invoiceId")
    .get(adminOnly, markInvoiceAsPaid)

router
    .route("/payment/cash")
    .post(adminOnly, markCashPayment)

module.exports = router