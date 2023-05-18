const express = require('express')
const router = express.Router()

// router.use('/video', require('./video'))
router.use('/user', require('./user'))
router.use('/background', require('./menu'))
router.use('/order', require('./order'))
router.use('/tables', require('./table'))
router.use('/upload', require('./upload'))
module.exports = router