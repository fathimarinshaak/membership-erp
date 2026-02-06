const { createPlan, getPlans, updatePlan, deletePlan } = require('../controllers/membershipController')
const { dashboard, AddMember, viewMembers, deleteMember, updateMember, editMember, assignPlan, getPlanHistory } = require('../controllers/adminController')
const { adminOnly } = require('../middleware/auth')

const router = require('express').Router()

router
    .route('/dashboard')
    .get(adminOnly, dashboard)

router
    .route('/addMember')
    .post(AddMember)

router
    .route('/viewMembers')
    .get(viewMembers)

router
    .route('/deleteMember/:id')
    .post(deleteMember)

router
    .route('/addplan')
    .post(createPlan)

router
    .route('/viewplan')
    .get(getPlans)

router
    .route('/updateplan/:id')
    .post(updatePlan)

router
    .route('/deleteplan/:id')
    .post(deletePlan)

router
    .route('/editMember/:id')
    .post(editMember)
router
    .route('/assignPlan/:id')
    .post(assignPlan);

router
.route("/planHistory/:id")
.get(getPlanHistory);
module.exports = router