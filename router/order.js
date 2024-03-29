const express = require('express')
const router = express.Router()
const orderController = require('../controller/orderController')
const validator = require('../middleware/validator/userValidator')
const {
  verifyToken
} = require('../util/jwt')

router
  .get('/car/:id', verifyToken(), orderController.getShopCar)
  .post('/car', verifyToken(), orderController.optShopCar)
  .put('/car/', verifyToken(), orderController.updateShopCarTableNo)
  .delete('/car/:tableNo', verifyToken(), orderController.deleteShopCar)
  .post('/confirm', verifyToken(), orderController.createOrder)
  .get('/order', verifyToken(), orderController.getOrder)
  .get('/getAllOrderMoney', verifyToken(), orderController.getAllOrderMoney)
  .get('/mine', verifyToken(), orderController.getMyOrders)
  .put('/mine', verifyToken(), orderController.updateOrder)
module.exports = router