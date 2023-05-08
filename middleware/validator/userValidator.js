const {
  body
} = require('express-validator')
const validate = require('./errorBack')
const {
  User
} = require('../../model')
module.exports.register = validate([
  body('name').notEmpty().withMessage('用户名不能为空').bail()
  .isLength({
    min: 3
  }).withMessage('用户名不能小于三位').bail(),
  body('mobile')
  .notEmpty().withMessage('手机号不能为空').bail()
  .isNumeric().withMessage('手机号只能是数字').bail(),
  body('address')
  .notEmpty().withMessage('地址不能为空').bail()
])

module.exports.login = validate([
  body('email').notEmpty().withMessage('邮箱不能为空').bail()
  .isEmail().withMessage('邮箱格式不正确').bail()
  .custom(async val => {
    const emailValidate = await User.findOne({
      email: val
    })
    if (!emailValidate) {
      return Promise.reject('邮箱不存在')
    }
  }).bail(),
  body('password').notEmpty().withMessage('密码不能为空').bail()
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