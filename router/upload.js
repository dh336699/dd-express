const express = require('express')
const router = express.Router()
const uploadController = require('../controller/uploadController')
const {
  verifyToken
} = require('../util/jwt')

router
  .get('/signature', verifyToken(), uploadController.getSignature)
module.exports = router