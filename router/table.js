const express = require('express')
const router = express.Router()
const tableController = require('../controller/tableController')

const {
  verifyToken
} = require('../util/jwt')

router
  .get('/table', verifyToken(), tableController.getTableList)
  .post('/table', verifyToken(), tableController.createTable)
  .put('/scanQRCode', verifyToken(), tableController.updateTable)
  .delete('/table/:id', verifyToken(), tableController.deleteTable)
module.exports = router