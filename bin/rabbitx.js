"use strict"


// package
// @package
const uuid = require("uuid/v4")
const amqplib = require("amqplib")
const signale = require("signale")


// RabbitMQ
// @class
module.exports =  class Rabbitx {

  // @new
  constructor ({ configure: { rabbitmq } }) {
    this.configure = rabbitmq
    this._context = null
    this._listens = {}
    this._map = {}
    this._connect()
    this._timoutLoop()
  }
  
  // 超时函数处理
  // @private
  _timoutLoop () {
    this.__loop = setInterval(_ => {
      let _ttl = Date.now() - (1000 * 60)
      Object.keys(this._listens).forEach(_value => {
        Object.keys(this._listens[_value]).forEach(_uid => {
          let { date, process } = this._listens[_value][_uid]
          
          // 如果已经超时
          // 回调超时错误
          // 删除当前回调处理
          if (date <= _ttl) {
            process({ error: "TRANSFER.TIMEOUT" })
            delete this._listens[_value][_uid]
          }
        })
      })
    }, 20000)
  }

  // 连接到服务器
  // 检查队列
  // @private
  async _connect () {
    
    // 链接到消息队列服务器，创建通道
    // 并且给定预取值，默认为预取1条消息
    let _connect = await amqplib.connect(this.configure.host)
    this._context = await _connect.createChannel()
    this._context.prefetch(this.configure.prefetch || 1)
  }

  // 消息转Buffer
  // @params {any} message
  // @private
  _stringify (message) {
    
    // 如果消息本来就是Buffer类型
    // 不需要转类型，直接抛出原始数据
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
    // 直接转字符串, 然后再转Buffer, 如：数字等
    let _str = String(message)
    return Buffer.from(_str)
  }

  // Buffer转消息
  // @params {any} message
  // @private
  _parse (message) {
    return {
      ...message,
      
      // 为原始数据对象添加as方法
      // 作用为转数据类型
      // 传入期望的数据类型，默认为Buffer，也就是原始数据
      as: function (format = "buffer") {
        
        // 原始数据
        // 不做转换，直接返回原始数据
        if (format === "buffer") {
          return message.content
        }

        // 转字符串
        // 默认utf8
        if (format === "string") {
          return message.content.toString()
        }

        // 转JSON
        // 转字符串
        // 转对象
        if (format === "json") {
          let str = message.content.toString()
          return JSON.parse(str)
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
  
  // 检查主题
  // @params {string} topic
  // @private
  async _checkTopic (topic) {
    
    // 检查主题是否已经准备完成
    // 如果没有准备完成，就断言主题
    // 然后标记主题已经准备完成
    if (!this._map[topic]) {
      void await this._context.assertQueue(topic)
      this._map[topic] = true
    }
  }
  
  // 检查交易主题
  // @params {string} topic
  // @private
  async _checkTransferTopic (topic) {
    
    // 回调主题为 ._callback 后缀，不可覆盖和重名
    // 依次检查原始主题和回调主题
    // 返回回调主题名
    let _backTopic = topic + "._callback"
    void await this._checkTopic(topic)
    void await this._checkTopic(_backTopic)
    return _backTopic
  }
  
  // 交易回调处理
  // @params {string} topic
  // @params {object} message
  // @private
  async _transferBackProcess (topic, message) {
    
    // 先将消息内部的原始Buffer转为字符串
    // 然后将字符串解析为JSON
    // 找到回调主题上下文
    let _message = JSON.parse(message.content.toString())
    let _context = this._listens[topic][_message.uid]
    
    // 检查回调主题列表中有无处理函数
    // 如果没有，中断处理
    // 这里是为了处理无宿主的返回信息
    if (!_context || !_context.process) {
      return false
    }
    
    // 调用回调函数
    // 传递回调消息
    _context.process(_message)
    
    // 因为回调已经被处理
    // 所以已经不需要回调函数
    // 删除回调函数栈
    let _uid = _message.uid
    delete this._listens[topic][_uid]
  }
  
  // 检查交易回调监听
  // @params {string} topic
  // @private
  _checkTransferListen (topic) {
    
    // 检查交易回调主题是否已经被监听
    // 如果没有被监听就监听回调主题
    // 并初始化回调主题map
    if (!this._listens[topic]) {
      this._listens[topic] = {}
      this._context.consume(topic, async message => {
        
        // TODO: 
        // 交易通道不关注函数内部处理错误
        // 所以这里如果出现错误不处理
        // 并且不会重试，直接消费该条消息
        this._transferBackProcess(topic, message)
          .catch(signale.fatal)
        void await this._context.ack(message)
      })
    }
  }
  
  // 交易消费处理
  // @params {string} topic
  // @params {object} message
  // @params {promise function} process
  // @private
  async _transferProcess (topic, message, process) {
    let _uid = null
    try {

      // 消息解包
      // 取出原始数据，转字符串，转JSON
      // 得到包装消息，记录包装消息ID
      // 
      // TODO:
      // 原始Buffer经过JSON转换会丢失类型，转为数组类型
      // 所以此处将原始消息内部数组再次转为Buffer
      let _body = JSON.parse(message.content.toString())
      let _message = Buffer.from(_body.message.data)
      _uid = _body.uid
      
      // 为了做到统一处理
      // 此次将原始消息数据模拟为驱动内部结构
      // UID为附带信息，为了方便调试
      let _msgBody = {
        uid: _uid,
        content: _message
      }

      // 提交处理
      // 返回给回调主题的消息格式为：
      // - success 处理函数回调数据
      // - uid 生产端的消息ID
      // 将结果发送到回调主题
      let _result = await process(this._parse(_msgBody))
      let _buf = this._stringify({ success: _result, uid: _uid })
      void await this._context.sendToQueue(topic, _buf)
    } catch (err) {
      signale.fatal(err)

      // 处理出现错误
      // 检查消息UID是否存在
      // 如果不存在，流程无法继续，不处理
      if (typeof _uid === "string") {
        
        // 返回给回调主题的消息格式为：
        // - error 处理函数错误信息
        // - uid 生产端的消息ID
        // 将错误结果发送到回调主题
        let error = err.message
        let _buf = this._stringify({ error, uid: _uid })
        void await this._context.sendToQueue(topic, _buf)
      }
    }
  }
  
  // 监听交易
  // @params {string} topic
  // @params {promise function} process
  // @public
  async OnTransfer (topic, process) {
    let _backTopic = await this._checkTransferTopic(topic)
    this._context.consume(topic, async _msg => {
      
      // 消费端无论出现任何结果
      // 都直接确认当前消息
      // 此处是为了避免无限循环确认
      // 交易信息应该自己确保执行结果
      void await this._transferProcess(_backTopic, _msg, process)
      void await this._context.ack(_msg)
    })
  }
  
  // 发送交易
  // @params {string} topic
  // @params {any} message
  // @public
  async SendTransfer (topic, message) {
    let _uid = uuid()
    let _backTopic = await this._checkTransferTopic(topic)
    let _message = this._stringify(message)
    let _body = { message: _message, uid: _uid }
    let _buf = Buffer.from(JSON.stringify(_body))
    this._context.sendToQueue(topic, _buf)
    this._checkTransferListen(_backTopic, _uid)
    
    // 初始化消息对象
    // 并且记录消息创建时间
    // 此处是为了处理超时的函数
    this._listens[_backTopic][_uid] = { 
      process: null,
      date: Date.now() 
    }
    
    // 返回Promise
    // 并且给当前UID消息给定闭包处理函数
    // 当回调完成的时候处理回调信息
    return new Promise((reslove, reject) => {
      this._listens[_backTopic][_uid].process = function ({ error, success }) {
        error ? reject(new Error(error)) : reslove(success)
      }
    })
  }

  // 推送
  // @params {string} topic
  // @params {any} message
  // @public
  async Send (topic, message) {
    void await this._checkTopic(topic)
    let _buf = this._stringify(message)
    return this._context.sendToQueue(topic, _buf)
  }

  // 监听
  // @params {string} topic
  // @params {function} process
  // @public
  async On (topic, process) {
    void await this._checkTopic(topic)
    this._context.consume(topic, message => {
      
      // 此处不处理函数内部错误
      // 调用者应该自己保证自己函数内部的处理
      process(this._ack(message), this._parse(message))
    })
  }
}