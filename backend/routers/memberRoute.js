const {userDashboard } = require('../controllers/memberController')
// const { memberOnly } = require('../middleware/auth')

const router = require('express').Router()

router
    .route("/dashboard/:token")    
    .get(userDashboard);

module.exports = router