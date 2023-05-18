const express = require('express')
const multer = require('multer')
const router = express.Router()
const menuController = require('../controller/menuController')
const validator = require('../middleware/validator/bgValidator')
const {
  verifyToken
} = require('../util/jwt')
const upload = multer({
  dest: '/public'
})

router
  .get('/menuList', verifyToken(), menuController.getMenuList)
  .post('/menuList', verifyToken(), validator.menu, menuController.createMenu)
  .put('/menuList', verifyToken(), validator.menu, menuController.updateMenu)
  .delete('/menuList/:id', verifyToken(), menuController.deleteMenu)
  .get('/goodsList', verifyToken(), menuController.getGoodsList)
  .post('/goodsList', verifyToken(), validator.goods, menuController.createGoods)
  .post('/uploadGoodsPic', verifyToken(), upload.single('goodsPic'), menuController.uploadGoodsPic)
  .put('/goodsList', verifyToken(), validator.goods, menuController.updateGoods)
  .delete('/goodsList/:id', verifyToken(), menuController.deleteGoods)
module.exports = router