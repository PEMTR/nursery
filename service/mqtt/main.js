"use strict"


// package
// @package
const net = require("net")
const mqtt = require("mqtt-connection")


const server = net.createServer()

server.on("connection", stream => {
  let socket = mqtt(stream)
  
  // 连接
  socket.on("connect", packet => {
    console.log("contect", packet)
    socket.connack({ returnCode: 0 })
  })
  
  // 发布
  socket.on("publish", packet => {
    console.log("publish", packet)
    socket.puback({ messageId: packet.messageId })
  })
  
  // ping
  socket.on("pingreq", _ => {
    socket.pingresp()
  })
  
  // 订阅
  socket.on("subscribe", packet => {
    console.log("subscribe", packet)
    socket.suback({ granted: [packet.qos], messageId: packet.messageId })
  })
  
  // 设置超时
  stream.setTimeout(1000 * 60 * 5)
  
  // 绑定事件
  socket.on("close", _ => { socket.destroy() })
  socket.on("error", _ => { socket.destroy() })
  socket.on("disconnect", _ => { socket.destroy() })
  stream.on("timeout", _ => { socket.destroy() }) 
})

// 绑定端口
server.listen(9080)