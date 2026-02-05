const { dashboard, AddMember, viewMembers, deleteMember, updateMember } = require('../controllers/adminController')
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

module.exports = router