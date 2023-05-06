const express = require('express');
const http = require('http');
const router = require('./router')
const middlewares = require('./middlewares');
const io = require('./websocket'); // 引入 WebSocket 相关代码

const app = express();
const httpServer = http.createServer(app);
io.attach(httpServer); // 将 WebSocket 附加到 HTTP 服务器

app.use(express.json({
  extended: false
}))
app.use(express.urlencoded({
  extended: false
}))
app.use(express.static('public')); // 静态资源处理
app.use(middlewares)
app.use('/api/v1', router)

const PORT = process.env.PORT || 3000

httpServer.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})