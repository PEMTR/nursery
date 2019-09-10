"use strict"


// package
// @package
const { Client } = require("@elastic/elasticsearch")


// Elasticsearch
// @class
module.exports = class Elasticx {
  
  // @constructor
  constructor ({ configure: { elk } }) {
    this._els = new Client(elk)
    this._pool = []
  }
  
  // Create index.
  // @params {string} index
  // @params {any} body
  // @params {boolean} refresh Whether to force a refresh.
  // @return {Promise<T for object, void>}
  // @public
  async Index (index, body, refresh = false) {
    if (this._pool.length >= 10) {
      let _bulk = { refresh, body: this._pool }
      let _result = await this._els.bulk(_bulk)
      this._pool = []
      return _result
    }
    
    // buffer is not full.
    // write buffer first.
    this._pool.push(...[
      { index: { _index: index } },
      body
    ])
  }
}