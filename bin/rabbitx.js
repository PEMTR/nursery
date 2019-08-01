"use strict"


// package
// @package
const amqplib = require("amqplib")


// RabbitMQ
// @class
module.exports =  class Rabbitx {

  // @new
  constructor ({ configure: { rabbitmq } }) {
    this.configure = rabbitmq
    this._sendProxy = null
    this._context = null
    this._map = {}
    this._connect()
  }

  // 连接到服务器
  // @private
  _connect () {
    amqplib.connect(this.configure.host).then(async connect => {
      this._context = await connect.createChannel()
      this.configure.topic_list.forEach(async topic => {
        void this._context.assertQueue(topic)
      })
    })
  }

  // 消息转Buffer
  // @params {any} message
  // @private
  _stringify (message) {
    if (Buffer.isBuffer(message)) {
      return message
    }

    // 类型为字符串
    // 直接转Buffer
    if (typeof message === "string") {
      return Buffer.from(message)
    }

    // 类型为对象
    // 转字符串再转Buffer
    if (typeof message === "object") {
      return Buffer.from(JSON.stringify(message))
    }

    // 其他情况处理
    // 直接转字符串
    return String(message)
  }

  // Buffer转消息
  // @params {any} message
  // @private
  _parse (message) {
    return { 
      as: function (format = "buffer") {
        if (format === "buffer") {
          return message
        }

        // 转字符串
        // 默认utf8
        if (format === "string") {
          return message.toString("utf8")
        }

        // 转JSON
        // 转字符串
        // 转对象
        if (format === "json") {
          let str = message.toString("utf8")
          return JSON.parse(str)
        }
      }
    }
  }

  // 推送
  // @params {string} topic
  // @params {any} message
  // @public
  Send (topic, message) {
    let buf = this._stringify(message)
    this._context.sendToQueue(topic, buf)
  }

  // 监听
  // @params {string} topic
  // @params {function} process
  // @public
  On (topic, process) {
    this._context.consume(topic, message => {
      process(this._parse(message), ackMsg => {
        this._context.ack(ackMsg || message)
      })
    })
  }
}