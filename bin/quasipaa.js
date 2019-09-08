"use strict"


// package
// @package
const assert = require("assert").strict


// 缓存模块
// @class
module.exports = class Quasipaa {
  
  // @constructor
  constructor ({ util, broker }) {
    this.broker = broker
    this.util = util
  }
  
  // Express中间件
  // @public
  express () {
    return (req, _, next) => {
      req._quasipaa_ = this
    }
  }
  
  // 路由处理
  // @params {string} key 索引
  // @params {object} params 参数
  // @params {async function} process 数据处理函数 
  // @params {async function} models 模型处理函数
  // @return {function}
  // @static
  static Zone (name, params, process, models) {
    return async (req, res) => {
      let arg = await params(req)
      let option = [ req, res, name, arg, process, models ]
      return await req._quasipaa_._engine(...option)
    }
  }

  // 缓存处理类
  // @params {class} req 请求
  // @params {class} res 响应
  // @params {string} key 索引
  // @params {object} params 参数
  // @params {async function} process 数据处理函数 
  // @params {async function} models 模型处理函数
  // @return {Promise<any>}
  // @private
  async _engine (req, res, name, params, process, models) {
    let _md5 = this.util.md5(JSON.stringify(params))
    let key = name + "." + _md5
    let ctx = null
    
    // 请求缓存服务
    let _res = await this.broker.call("v1.Cache.Get", {
      key
    }, { nodeID: "cache" })
    
    // 如果有缓存
    // 直接返回
    if (_res) {
      return _res
    }
    
    // 处理数据函数
    // 获取数据和模型
    let value = await process(req, res, params, ctx)
    let model = await models(value, ctx)
    
    // 请求缓存服务
    // 设置缓存
    // 重试3次
    void await this.util.Retry(3, async _ => {
      void await this.broker.call("v1.Cache.Set", {
        model, value, key
      }, { nodeID: "cache" })
    })
    
    // 返回数据
    return value
  }
}