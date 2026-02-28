const express = require("express")
const router = express.Router()
const authControllers = require('../controllers/authController')
const userauth = require("../middleware/authMiddleware")

router.post('/register',authControllers.register)
router.post('/login',authControllers.login)
router.get('/logout',authControllers.logout)

router.post('/send-verify-otp',userauth ,authControllers.sendverifyotp)
router.post('/verify-otp', userauth ,authControllers.verifyOPT)
router.post('/send-reset-otp' ,authControllers.sendresetotp)
router.post('/reset-password', authControllers.verifyresetotp)
router.get('/isauth', userauth ,authControllers.isauth)

module.exports = router