"use strict"


// package
// @package
const { Client } = require("@elastic/elasticsearch")


// Elasticsearch
// @class
module.exports = class Elasticx {
  
  // @new
  constructor ({ configure: { elk } }) {
    this._els = new Client(elk)
    this._pool = []
  }
  
  // 创建索引
  // @params {string} index 索引
  // @params {any} body 内容
  // @params {boolean} refresh 是否强制刷新
  // @return {Promise<T for object, void>}
  // @public
  async Index (index, body, refresh = false) {
    if (this._pool.length >= 10) {
      let _bulk = { refresh, body: this._pool }
      let _result = await this._els.bulk(_bulk)
      this._pool = []
      return _result
    }
    
    // 缓冲区未满
    // 先写入缓冲区
    this._pool.push(...[
      { index: { _index: index } },
      body
    ])
  }
}