"use strict"


// package
const amqplib = require("amqplib")
const { EventEmitter } = require("events")


// 消息队列类
// @class
function MQ ({ configure }) {
  this.host = configure.rabbitmq.host
  this.topic = configure.rabbitmq.topic
  this.consumer = {}
  this.handle = null
  this.consumerLoop = null
  this.consumerBool = false
  this.events = new EventEmitter()

  // 连接
  // 绑定消费事件
  this.connect()
  this.events.on("Producer", data => {
    this.handle.sendToQueue(this.topic, this.messagePack(data))
  })
}


// 绑定消费
// @param {any} message
// @returns {buffer}
// @private
MQ.prototype.bindConsumer = function () {
  if (!this.consumerBool) {
    this.consumerBool = true
    this.handle.consume(this.topic, message => {
      this.parser(message, () => {
        this.handle.ack(message)
      })
    })
  }
}


// 消息解包
// @param {object} message
// @param {function} ack
// @private
MQ.prototype.parser = function ({ fields, properties, content }, ack) {
  let message = content.toString("utf8")
  
  // 解包
  let head = message.match(/^\[.*?\]/g)[0]                 // 头
  let length = Number(head.split("[")[1].split("]")[0])    // 事件长度
  let headLen = head.length + length                       // 头长度
  let event = message.slice(head.length, headLen)          // 事件
  let body = message.slice(headLen, message.length)        // 消息
  
  // 检查事件是否绑定
  if (event in this.consumer) {
    this.consumer[event]({ fields, properties }, (function () {
      try { return JSON.parse(body) } catch { return body }
    })(), ack)
  }
}


// 消息处理
// @param {any} message
// @returns {buffer}
// @private
MQ.prototype.stringify = function (message) {
  if (Buffer.isBuffer(message)) {
    // 直接返回
    return message
  }

  // 字符串类型
  if (typeof message === "string") {
    return Buffer.from(message)
  }

  // 其他类型
  return Buffer.from(JSON.stringify(message))
}


// 消息打包
// @param {string} [.event]
// @param {any} [.message]
// @private
MQ.prototype.messagePack = function ({ event, message }) {
  return Buffer.concat([
    Buffer.from("["),
    Buffer.from(String(event.length)),
    Buffer.from("]"),
    Buffer.from(event),
    Buffer.from(this.stringify(message))
  ])
}


// 连接
// @private
MQ.prototype.connect = async function () {
  this.connect = await amqplib.connect(this.host)   // 连接
  this.handle = await this.connect.createChannel()  // 初始化通道

  // 初始化主题
  this.handle.assertQueue(this.topic).then(resolve => {
    this.events.emit("connect", resolve) 
  })
}


// 监听服务事件
// @param {string} event 事件名
// @param {function} handle 回调函数
// @public
MQ.prototype.on = function (event, callback) {
  this.events.on(event, callback)
}


// 生产消息
// @private
Object.defineProperty(MQ.prototype, "Producer", {
  get: function () {

     // 发送
     // @params {string} event
     // @params {any} message
     // @public
    return { emit: (event, message) => {
      this.events.emit("Producer", { event, message })
    } }
  }
})


// 消费消息
// @private
Object.defineProperty(MQ.prototype, "Consumer", {
  get: function () {
    this.bindConsumer()

     // 监听
     // @params {string} event
     // @params {function} handle
     // @public
    return { on: (event, handle) => {
      this.consumer[event] = handle
    } }
  }
})


// export
module.exports = MQ