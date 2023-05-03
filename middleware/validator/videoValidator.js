const { body } = require('express-validator')
const validate = require('./errorBack')
const { User } = require('../../model')
module.exports.videoValidator = validate([
  body('title').notEmpty().withMessage('视频名不能为空').bail()
    .isLength({ max: 20 }).withMessage('视频名长度不能超过20').bail(),
  body('videoId').notEmpty().withMessage('videoId能为空').bail()
])