"use strict"


// package
// @package
const assert = require("assert").strict


// 缓存模块
// @class
module.exports = class Quasipaa {
  
  // @new
  constructor ({ util, broker }) {
    this.broker = broker
    this.util = util
  }

  // 缓存处理类
  // @params {string} key 索引
  // @params {object} params 参数
  // @params {async function} process 数据处理函数 
  // @params {async function} models 模型处理函数
  // @return {Promise<any>}
  // @public
  async Engine (name, params, process, models) {
    let _md5 = this.util.md5(JSON.stringify(params))
    let key = name + "." + _md5
    
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
    let value = await process(params)
    let model = await models(value)
    
    // 请求缓存服务
    // 设置缓存
    // 重试3次
    void await this.util.Retry(3, async _ => {
      assert.deepStrictEqual(await this.broker.call("v1.Cache.Set", {
        model, value, key
      }, { nodeID: "cache" }), true, "E.CACHE")
    })
    
    // 返回数据
    return value
  }
}