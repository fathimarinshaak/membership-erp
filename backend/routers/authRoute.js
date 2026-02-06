const {adminLogin, adminLogout, isAuthenticated} = require('../controllers/authController')
const { adminOnly } = require('../middleware/auth')

const router = require('express').Router()

router
    .route('/login')
    .post(adminLogin)

router
    .route('/logout')
    .post(adminLogout)

router
    .route('/isAdminAuth')
    .get(adminOnly,isAuthenticated)



module.exports = router