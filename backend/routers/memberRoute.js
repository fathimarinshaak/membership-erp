const { dashboard } = require('../controllers/adminController')

const router = require('express').Router()
router
    .route('/dashboard')
    .get(dashboard)


module.exports = router