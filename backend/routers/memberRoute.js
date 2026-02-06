const { dashboard } = require('../controllers/memberController')
const { memberOnly } = require('../middleware/auth')

const router = require('express').Router()

router
    .route('/dashboard')
    .get(memberOnly, dashboard)

module.exports = router