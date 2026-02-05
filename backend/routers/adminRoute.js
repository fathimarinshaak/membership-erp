const { dashboard } = require('../controllers/adminController')
const { adminOnly } = require('../middleware/auth')

const router = require('express').Router()

router
    .route('/dashboard')
    .get(adminOnly, dashboard)

module.exports = router