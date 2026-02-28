const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const userauth = require('../middleware/authMiddleware')


router.get('/', userauth ,userController.userData)

module.exports = router