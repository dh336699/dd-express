const express = require('express')
const router = express.Router()
const menuController = require('../controller/menuController')
const validator = require('../middleware/validator/bgValidator')
const {
  verifyToken
} = require('../util/jwt')

router
  .get('/menuList', verifyToken(), menuController.getMenuList)
  .post('/menuList', verifyToken(), validator.menu, menuController.createMenu)
  .put('/menuList', verifyToken(), validator.menu, menuController.updateMenu)
  .delete('/menuList/:id', verifyToken(), menuController.deleteMenu)

  .get('/menuGoods/:id', verifyToken(), menuController.getMenuGoods)
  .post('/menuGoods', verifyToken(), menuController.createMenuGoods)
  .get('/goodsList', verifyToken(), menuController.getGoodsList)
  .post('/goodsList', verifyToken(), menuController.createGoods)
  .put('/goodsList', verifyToken(), menuController.updateGoods)
  .delete('/goodsList/:id', verifyToken(), menuController.deleteGoods)
module.exports = router