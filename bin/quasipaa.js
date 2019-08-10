"use strict"


// package
// @package
const http = require("http")
const assert = require("assert").strict


// 缓存模块
// @class
module.exports = class Quasipaa {
  
  // @new
  constructor ({ util, configure }) {
    let { cache: { host, port } } = configure
    this.host = host
    this.port = port
    this.util = util
  }
  
  // 返回处理
  // @params {buffer} buf
  // @params {string} format
  // @private
  _as (buf, format) {
    switch (format) {
      case "buffer":
        return buf
        break
      case "string":
        return buf.toString()
        break
      case "json":
        return JSON.parse(buf.toString())
        break
    }
  }
  
  // 请求头
  // @params {number} len
  // @private
  _header (len) {
    return {
      "Content-Type": "application/json",
      "Content-Length": len
    }
  }
  
  // 请求选项
  // @params {string} method
  // @params {number} len
  // @private
  _option (method, len) {
    return {
      host: this.host,
      port: this.port,
      headers: this._header(len),
      method: method.toUpperCase(),
      path: "/"
    }
  }
  
  // 请求
  // @params {string} method
  // @params {object} body
  // @params {string} format
  // @private
  _request (method, body, format) {
    return new Promise((resolve, reject) => {
      let _buf = Buffer.alloc(0)
      let _data = JSON.stringify(body)
      let _len = Buffer.byteLength(_data)
      let _req = http.request(this._option(method, _len), res => {
        res.on("end", _ => resolve(this._as(_buf, format)))
        res.on("data", _chunk => {
          _buf = Buffer.concat([ _buf, _chunk ])
        })
      })
      
      // 绑定请求错误事件
      // 发送请求内容
      // 快速请求
      _req.on("error", reject)
      _req.write(_data)
      _req.end()
    })
  }
  
  // 缓存处理类
  // @params {string} key
  // @params {object} params
  // @params {function} process
  // @params {function} models
  // @public
  async Engine (name, params, process, models) {
    let _md5 = this.util.md5(JSON.stringify(params))
    let key = name + "." + _md5
    
    // 请求缓存服务
    // 如果有缓存
    // 直接返回
    let _res = await this._request("get", { key }, "json")
    if (_res.data) {
      return _res.data
    }
    
    // 处理数据函数
    // 获取数据和模型
    let value = await process(params)
    let model = await models(value)
    
    // 请求缓存服务
    // 设置缓存
    // 重试3次
    void await this.util.Retry(3, async _ => {
      assert.deepStrictEqual((await this._request("post", {
        model, value, key 
      }, "json")).result, true, "E.CACHE")
    })
    
    // 返回数据
    return value
  }
}