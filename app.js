const express = require('express')
const cors = require('cors') // 跨域中间件
const morgan = require('morgan') // 日志中间件
const router = require('./router')

const app = express()

app.use(express.json({ extended: false }))
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public')) // 静态资源处理
app.use(cors())
app.use(morgan('dev'))
app.use('/api/v1', router)

const PORT = process.env.PORT || 3000

// // 挂载路由
// app.use('/api', router)

// app.use((req, res) => {
//   res.status(500).json({ error: '错误请求'})
// }) 
// app.use((err, req, res, next) => {
//   res.status(500).send('service error')
// })
// 挂载统一处理服务端错误中间件
// app.use(errorHandler())

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
