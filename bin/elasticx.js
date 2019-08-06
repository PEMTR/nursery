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
  }
  
  // 创建索引
  // @params {string} index
  // @params {any} body
  // @params {boolean} refresh
  // @public
  async Index (index, body, refresh = false) {
    return this._els.index({ index, body, refresh })
  }
}