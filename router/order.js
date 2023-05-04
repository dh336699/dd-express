const express = require('express')
const router = express.Router()
const orderController = require('../controller/orderController')
const validator = require('../middleware/validator/userValidator')
const {
  verifyToken
} = require('../util/jwt')

router
  .get('/car', verifyToken(), orderController.getShopCar)
  .post('/car', verifyToken(), orderController.createShopCar)
  .put('/car', verifyToken(), orderController.updateShopCar)
  .delete('/car', verifyToken(), orderController.deleteShopCar)
  .post('/confirm', verifyToken(), orderController.createOrder)
module.exports = router