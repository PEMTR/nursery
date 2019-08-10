"use strict"


// package
// @package
const http = require("http")


// 客户端
// @class
class Client {
  
  // @new
  constructor () {
    this.host = "localhost"
    this.port = 80
  }

  // 请求
  // @params {string} method
  // @params {object} body
  // @private
  _request (method, body, format) {
    return new Promise((resolve, reject) => {
      let _data = JSON.stringify(body)
      let _len = Buffer.byteLength(_data)
      let _buf = Buffer.alloc(0)
      
      // 请求头
      // 固定为JSON类型
      let headers = {
        "Content-Type": "application/json",
        "Content-Length": _len
      }
      
      // 响应处理
      // 处理成不同类型的数据
      let _as = _ => {
        switch (format) {
          case "buffer":
            return _buf
            break
          case "string":
            return _buf.toString()
            break
          case "json":
            return JSON.parse(_buf.toString())
            break
        }
      }
      
      // 请求对象
      // 固定类型
      let _option = {
        host: this.host,
        port: this.port,
        path: "/",
        method,
        headers
      }
      
      // 创建请求处理
      let _req = http.request(_option, res => {
        res.on("end", _ => resolve(_as()))
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
  
  // 处理
  // @params {string} name
  // @params {function} work
  // @public
  async process (key, work) {
    let res = await this._request("GET", {
      uid: key
    }, "string")
    
    console.log(res)
  }
}




let client = new Client()

client.process("panda", model => {
  // model({
  //   name: "panda"
  // })
})