const { dashboard, AddMember, viewMembers, deleteMember, updateMember } = require('../controllers/adminController')
const { createPlan, getPlans, updatePlan, deletePlan } = require('../controllers/membershipController')
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


module.exports = router