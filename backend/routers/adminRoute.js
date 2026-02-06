const { dashboard, AddMember, viewMembers, deleteMember, updateMember, editMember } = require('../controllers/adminController')
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
    .route('/editMember/:id')
    .post(editMember)

module.exports = router