const { validationResult } = require('express-validator')
module.exports = validators => {
  return async (req, res, next) => {
    await Promise.all(validators.map(validator => validator.run(req)))
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(401).json({ error: errors.array() })
    }
    next()
  }
}