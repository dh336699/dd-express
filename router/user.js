const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const validator = require('../middleware/validator/userValidator')
const {
  verifyToken
} = require('../util/jwt')
const multer = require('multer')
const upload = multer({
  dest: 'public/'
})

router
  .post('/login', userController.wxLogin)
  .get('/info', verifyToken(), userController.getUserInfo)
  .put('/info', verifyToken(), userController.updateUserInfo)
  .put('/member', verifyToken(), userController.updateMemberInfo)
  .get('/address', verifyToken(), userController.getAddress)
  .post('/address', verifyToken(), validator.register, userController.addAddress)
  .put('/address', verifyToken(), validator.register, userController.updateAddress)
  .delete('/address/:id', verifyToken(), userController.deleteAddress)
  .get('/applyList', verifyToken(), userController.getApplyList)
// .post('/getchannel', verifyToken(), userController.getchannel)
// .get('/getsubscribe/:userId', userController.getsubscribe)
// .get('/getuser/:userId', verifyToken(false), userController.getuser)
// .get('/unsubscribe/:userId', verifyToken(), userController.unsubscribe)
// .get('/subscribe/:userId', verifyToken(), userController.subscribe)
// .post('/registers',
//   validator.register,
//   userController.register)
// .post('/logins',
//   validator.login,
//   userController.login)
// .put('/', verifyToken(), validator.update, userController.update)
// .post('/headimg', verifyToken(), upload.single('headimg'), userController.headimg)

module.exports = router