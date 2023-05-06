const express = require('express')
const router = express.Router()
const orderController = require('../controller/orderController')

const {
  verifyToken
} = require('../util/jwt')

router
  .get('/table', verifyToken(), tableController.getTableList)
  .post('/table', verifyToken(), tableController.createTable)
  .put('/scanQRCode', verifyToken(), tableController.updateTable)
module.exports = router