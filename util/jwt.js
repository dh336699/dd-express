const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const toJwt = promisify(jwt.sign)
const verify = promisify(jwt.verify)
const { uuid } = require('../config/config.default')
module.exports.createToken = async userInfo => {
  return await toJwt({ userInfo }, uuid, {
    expiresIn: 60 * 60 * 24 * 30
  })
}

module.exports.verifyToken = function(required = true) {
  return async (req, res, next) => {
    let token = req.headers.authorization
    token = token ? token.split('Bearer ')[1] : null
    if (token) {
      try {
        let { userInfo } = await verify(token, uuid)
        req.userInfo = userInfo
        next()
      } catch (error) {
        res.status(402).json({ error: '无效的Token' })
      }
    } else if (required) {
      res.status(402).json({ error: '请传入token' })
    } else {
      next()
    }
    
  }
}