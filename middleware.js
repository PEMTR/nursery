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
  constructor ({ code, configure }) {
    this.configure = configure
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
    if (this.configure.debug && fatal) {
      signale.fatal(fatal)
    }

    // 返回响应数据
    return fatal ? {
      stack: fatal.stack,
      code: fatal.message,
      error: this.code[fatal.message] || fatal.message
    } : success
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
  filter () {
    return (req, res, next) => {
      req._timeout_ = Date.now()
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
  hooks () {
    return [(fatal, req, res, _) => {
      res.status(500).send(this.logs(req, { fatal }))
    }, (_, res) => res.status(404).end()]
  }
}