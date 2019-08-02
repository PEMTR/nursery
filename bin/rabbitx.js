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
    this._context = null
    this._connect()
  }

  // 连接到服务器
  // 检查队列
  // @private
  async _connect () {
    let connect = await amqplib.connect(this.configure.host)
    this._context = this.configure.confirmation 
      ? await connect.createConfirmChannel() 
      : await connect.createChannel()
    this.configure.queues.forEach(async topic => {
      void await this._context.assertQueue(topic)
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
          return Object.assign(message, {
            data: message.content.toString("utf8")
          })
        }

        // 转JSON
        // 转字符串
        // 转对象
        if (format === "json") {
          let str = message.content.toString("utf8")
          return Object.assign(message, {
            data: JSON.parse(str)
          })
        }
      }
    }
  }

  // 消息处理
  // @params {any} message
  // @private
  _ack (message) {
    return new Proxy({}, {
      get: (_, key) => {
        return ackMsg => {
          this._context[key](ackMsg || message)
        }
      }
    })
  }

  // 推送
  // @params {string} topic
  // @params {any} message
  // @public
  Send (topic, message) {
    let buf = this._stringify(message)
    
    // 非确认状态
    // 无回调模式
    if (!this.configure.confirmation) {
      return this._context.sendToQueue(topic, buf)
    }
    
    // 如果是确认模式
    // 这里将返回Promise
    // 返回消息的消费状态
    return new Promise((resolve, reject) => {
      this._context.sendToQueue(topic, buf, {}, function (err) {
        err ? reject(err) : resolve()
      })
    })
  }

  // 监听
  // @params {string} topic
  // @params {function} process
  // @params {number} prefetch
  // @public
  On (topic, process, prefetch = 1) {
    this._context.prefetch(prefetch)
    this._context.consume(topic, message => {
      process(this._parse(message), this._ack(message))
    })
  }
}