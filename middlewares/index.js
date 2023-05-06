const express = require('express')
const cors = require('cors') // 跨域中间件
const morgan = require('morgan')

const middlewares = express();

middlewares.use(cors())
middlewares.use(morgan('dev'))

module.exports = middlewares