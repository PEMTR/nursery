"use strict"


// 日志
// @class
module.exports = class Logs {
  
  // @new
  constructor ({ elasticx }) {
    this.elasticx = elasticx
  }
  
  // 标准请求头处理
  // @params {Request} req
  // @private
  _header (req) {
    return {
      host: req.hostname,
      path: req._path_,
      origin: req.originalUrl,
      method: req.method,
      params: req.params,
      query: req.query,
      body: req.body,
      ip: req.headers["x-real-ip"] || req.ip,
      headers: req.headers,
      date: req._timeout_,
      timeout: (Date.now() - req._timeout_),
      user: req.user ? req.user._id : null
    }
  }
  
  // 请求处理失败
  // @params {Request} req
  // @params {Error} fatal
  // @public
  async fatal (req, fatal) {
    let name = "nursery.cache.fatal"
    return this.elasticx.Index(name, {
      ...this._header(req),
      message: fatal.message,
      name: fatal.name,
      stack: fatal.stack,
      code: fatal.code,
      operator: fatal.operator
    })
  }
  
  // 请求处理成功
  // @params {Request} req
  // @params {object} success
  // @public
  async success (req, success) {
    let name = "nursery.cache.success"
    return await this.elasticx.Index(name, {
      ...this._header(req),
      success
    })
  }
}