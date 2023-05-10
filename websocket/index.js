// websocket.js
const http = require("http");
const express = require('express')
const socketIO = require('socket.io'); // 创建独立的 io 对象
const fs = require('fs')

const app = express();

// var host = 'localhost';

// var options = {
//   key: fs.readFileSync( './' + host + '.key' ),
//   cert: fs.readFileSync( './' + host + '.cert' ),
//   requestCert: false,
//   rejectUnauthorized: false
// };

const websocket = http.createServer(app);

const io = socketIO(websocket);

// 存储房间与客户端的映射关系是为了在 WebSocket 连接断开时能够正确地清除映射关系。这样可以确保在用户离开房间或连接断开时，房间与客户端的映射关系被正确地清除，避免出现不必要的映射关系紊乱。
const roomClients = {};

// WebSocket 连接建立时的处理逻辑
io.on('connect', socket => {

  console.log('WebSocket连接建立');
  // 处理加入房间的请求
  socket.on('joinRoom', roomNo => {
    // 将用户加入指定房间
    socket.join(roomNo)
    // 记录房间与客户端的映射关系
    roomClients[socket.id] = roomNo
  })
  // 处理购物车更新的请求
  socket.on('update', () => {
    // 获取当前客户端所在的房间号
    const roomNo = roomClients[socket.id];
    // 向当前房间内的所有用户发送购物车更新事件
    io.to(roomNo).emit('update')
  })

  // 处理连接断开事件
  socket.on('disconnect', () => {
    // 在连接断开时清除房间与客户端的映射关系
    delete roomClients[socket.id];
  });
})

module.exports = websocket