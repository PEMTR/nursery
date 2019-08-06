"use strict"


// package.
// @package
const { createClient } = require("redis")
const { promisify } = require("util")


// Redis
// @class
module.exports = class Redis {
  
  // @new
  constructor ({ configure: { redis } }) {
    this.self = createClient(redis)
    this._promise = {}
    this._proxy = null
  }
  
  // 绑定promise
  // @params {string} key 
  // @private
  _bind (key) {
    this._promise[key] = promisify(this.self[key])
      .bind(this.self)
  }
  
  // 获取promise
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
}