const { adminLogin, adminLogout, adminRegister } = require('../controllers/authController')

const router = require('express').Router()

router
    .route('/login')
    .post(adminLogin)

router
    .route('/logout')
    .post(adminLogout)

module.exports = router