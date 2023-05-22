const express = require('express')
const router = express.Router()
const menuController = require('../controller/menuController')
const validator = require('../middleware/validator/bgValidator')
const {
  verifyToken
} = require('../util/jwt')
const multer = require('multer')
// const upload = multer({
//   dest: 'public/'
// })
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.headers.env === 'dev') {
      cb(null, './public/dev/goods')
    } else {
      cb(null, './public/prod/goods')
    }
  },
  filename: async (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage
})

router
  .get('/menuList', verifyToken(), menuController.getMenuList)
  .post('/menuList', verifyToken(), validator.menu, menuController.createMenu)
  .put('/menuList', verifyToken(), validator.menu, menuController.updateMenu)
  .delete('/menuList/:id', verifyToken(), menuController.deleteMenu)
  .get('/goodsList', verifyToken(), menuController.getGoodsList)
  .post('/goodsList', verifyToken(), validator.goods, menuController.createGoods)
  .post('/uploadImage', verifyToken(), upload.single('goodsPic'), menuController.uploadImage)
  .delete('/deleteImage/:fileName', verifyToken(), menuController.deleteImage)
  .put('/goodsList', verifyToken(), validator.goods, menuController.updateGoods)
  .delete('/goodsList/:id', verifyToken(), menuController.deleteGoods)
module.exports = router