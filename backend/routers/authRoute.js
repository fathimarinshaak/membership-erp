const { adminLogin, adminLogout, adminRegister, isAuthenticated } = require('../controllers/authController')
const { adminOnly } = require('../middleware/auth')

const router = require('express').Router()

router
    .route('/login')
    .post(adminLogin)

router
    .route('/logout')
    .post(adminLogout)

router
    .route('/isAuth')
    .get(adminOnly,isAuthenticated)

module.exports = router