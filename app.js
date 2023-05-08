const express = require('express');
const fs = require('fs')
const router = require('./router')

const http = require("http");
const socketIO = require('socket.io');
// const io = require('./websocket'); // 引入 WebSocket 相关代码

const app = express();

app.use(express.json({
  extended: false
}))
app.use(express.urlencoded({
  extended: false
}))
app.use(express.static('public')); // 静态资源处理
app.use('/api/v1', router)

var host = 'localhost'; // Input you domain name here.

var options = {
  key: fs.readFileSync( './' + host + '.key' ),
  cert: fs.readFileSync( './' + host + '.cert' ),
  requestCert: false,
  rejectUnauthorized: false
};

const server = http.createServer(app);

const io = socketIO(server);

io.on('connect', (socket) => {
  console.log('WebSocket连接建立');

  socket.on('joinRoom', (roomNo) => {
    console.log(`加入房间: ${roomNo}`);
    socket.join(roomNo);
  });

  socket.on('message', (data) => {
    console.log(`接收到消息: ${data}`);
    // 处理接收到的消息逻辑
  });

  socket.on('disconnect', () => {
    console.log('WebSocket连接断开');
  });
});

const PORT = process.env.PORT || 443 || 3000

server.listen(3000, () => {
  console.log(`Server is running at http://localhost:${3000}`)
})