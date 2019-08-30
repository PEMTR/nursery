"use strict"


// package.
// @package
const { createClient } = require("redis")
const { promisify } = require("util")
const events = require("events")


// Redis
// @class
module.exports = class Redis {
  
  // @new
  constructor ({ configure: { redis } }) {
    this._events = new events.EventEmitter()
    this._promise = {}
    this._proxy = null
    this.self = null
    this._con = false
    this._connect(redis)
  }
  
  // 链接
  // @params {object} redis 实例
  // @private
  _connect (redis) {
    this.self = createClient(redis)
    this.self.on("ready", _ => {
      this._con = true
    })
    
    // 错误事件
    // 报告
    // 重连
    this.self.on("error", err => {
      this._con = false
      this._events.emit("error", err)
      this._connect(redis)
    })
  }
  
  // 绑定promise
  // @params {string} key 方法
  // @private
  _bind (key) {
    this._promise[key] = promisify(this.self[key])
      .bind(this.self)
  }
  
  // 获取promise
  // @return {Promise<class>}
  // @public
  get promise () {
    
    // 检查代理
    // 是否初始化
    // 初始化代理
    // 绑定命令
    if (!this._proxy) {
      this._proxy = new Proxy(this._promise, {
        get: (promise, key) => {
          !promise[key] && this._bind(key)
          return promise[key]
        }
      })
    }
    
    // 返回代理实例
    return this._proxy
  }
  
  // 等待准备
  // @return {Promise<this>}
  // @public
  ready () {
    return new Promise((resolve, _) => {
      let _loop = setInterval(_ => {
        if (this._con === true) {
          clearInterval(_loop)
          resolve()
        }
      }, 500)
    })
  }
  
  // 关闭
  // @return {void}
  // @public
  close () {
    this.self.quit()
  }
  
  // 绑定事件
  // @params {string} event 事件
  // @params {function} process 事件处理
  // @return {Promise<void>}
  // @public
  on (event, process) {
    this._events.on(event, process)
  }
}