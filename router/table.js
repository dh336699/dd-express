const express = require('express')
const router = express.Router()
const tableController = require('../controller/tableController')

const {
  verifyToken
} = require('../util/jwt')

router
  .get('/table', verifyToken(), tableController.getTableList)
  .get('/tableQr', verifyToken(), tableController.createTableQr)
  .post('/table', verifyToken(), tableController.createTable)
  .put('/table', verifyToken(), tableController.updateTable)
  .put('/scanQRCode', verifyToken(), tableController.updateTableStatus)
  .delete('/table/:id', verifyToken(), tableController.deleteTable)
  .get('/wxInfo', verifyToken(), tableController.getWxInfo)
module.exports = router