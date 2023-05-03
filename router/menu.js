const express = require('express')
const router = express.Router()
const menuController = require('../controller/menuController')
const validator = require('../middleware/validator/userValidator')
const { verifyToken } = require('../util/jwt')

router
  .get('/menuList', verifyToken(), menuController.getMenuList)
  .post('/menuList', verifyToken(), menuController.createMenu)
  .get('/goodsList', verifyToken(), menuController.getGoodsList)
  .post('/goodsList', verifyToken(), menuController.createGoods)
  .put('/goodsList', verifyToken(), menuController.updateGoods)
  .delete('/goodsList/:id', verifyToken(), menuController.deleteGoods)
module.exports = router