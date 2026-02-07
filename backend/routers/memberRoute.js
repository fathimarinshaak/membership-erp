const {userDashboard } = require('../controllers/memberController')
// const { memberOnly } = require('../middleware/auth')

const router = require('express').Router()

router.get("/dashboard/:token", userDashboard);



module.exports = router