const express = require('express')
const router = express.Router()

// router.use('/video', require('./video'))
router.use('/user', require('./user'))
router.use('/background', require('./menu'))
router.use('/order', require('./order'))
module.exports = router