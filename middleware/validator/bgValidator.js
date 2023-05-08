const {
  body
} = require('express-validator')
const validate = require('./errorBack')
const {
  User
} = require('../../model')
module.exports.menu = validate([
  body('sort').notEmpty().withMessage('排序值不得为空').bail()
  .isNumeric().withMessage('排序值只能是数字').bail(),
])

module.exports.goods = validate([
  body('minPrice').notEmpty().withMessage('折后价不能为空').bail()
  .isNumeric().withMessage('折后价须为数字').bail(),
  body('name').notEmpty().withMessage('商品名不能为空').bail()
])

module.exports.update = validate([
  body('email')
  .custom(async val => {
    const emailValidate = await User.findOne({
      email: val
    })
    if (emailValidate) {
      return Promise.reject('邮箱已经被注册')
    }
  }).bail(),
  body('username')
  .custom(async val => {
    const usernameValidate = await User.findOne({
      username: val
    })
    if (usernameValidate) {
      return Promise.reject('用户名已经被注册')
    }
  }).bail(),
  body('phone')
  .custom(async val => {
    const phoneValidate = await User.findOne({
      phone: val
    })
    if (phoneValidate) {
      return Promise.reject('手机号已经被注册')
    }
  }).bail()
])