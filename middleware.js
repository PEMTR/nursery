"use strict"


// package.
// @package
const signale = require("signale")


// 路由中间件类
// @class
module.exports = class Middleware {

  // @new
  // @params {object} [code]
  // @params {object} [configure]
  // @paramss {class} [events]
  constructor ({ code, configure, events }) {
    this.configure = configure
    this.events = events
    this.code = code
    this.crate = {}
  }

  // 日志处理
  // @params {class} req
  // @params {option<object>} success
  // @params {option<error>} fatal
  // @returns {object}
  // @private
  logs (req, { fatal, success }) {
    let status = fatal ? "fatal" : "success"

    // 记录日志
    let event_name = "LOG.EXPRESS." + status
    this.events.emit(event_name, Object.assign({
      host: req.hostname,
      path: req._path_,
      origin: req.originalUrl,
      method: req.method,
      params: req.params,
      query: req.query,
      body: req.body,
      ip: req.headers["x-real-ip"] || req.ip,
      headers: req.headers,
      date: Date.now(),
      timeout: (Date.now() - req._timeout_),
      user: req.userData ? req.userData._id : null
    }, fatal ? { error: {
      message: fatal.message,
      name: fatal.name,
      stack: fatal.stack,
      code: fatal.code,
      operator: fatal.operator
    }} : { success }))
    
    // 检查是否需要调试
    if (this.configure.project.debug) {
      fatal && signale.fatal(fatal)
    }

    // 返回响应数据
    return fatal ? {
      status: 500,
      code: fatal.message,
      error: this.code[fatal.message] || "未知错误"
    } : { data: success, status: 200 }
  }

  // 依赖注入
  // @params {string} name
  // @params {any} mod
  // @public
  apply (name, mod) {
    Object.defineProperty(this.crate, name, {
      get: _ => mod
    })
  }

  // 路由头部绑定
  // @returns {function}
  // @public
  fhooks () {
    return (req, res, next) => {
      req.crate = this.crate
      res.take = success => {
        res.send(this.logs(req, { success }))
      }
  
      next()
    }
  }

  // 路由尾部绑定
  // @returns {array<function>}
  // @public
  ehooks () {
    return [(fatal, req, res, _) => {
      res.send(this.logs(req, { fatal }))
    }, (_, res) => res.status(404).end()]
  }
}