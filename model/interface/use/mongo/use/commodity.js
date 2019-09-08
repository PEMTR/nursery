"use strict"


// package
// @package
const assert = require("assert").strict


// 商品
// @class
module.exports = class Commodity {
  
  // @constructor
  constructor ({ mongo, util }) {
    this.mongo = mongo
    this.util = util
  }
  
  // 获取虚拟商品列表
  // @return {Promise<array>}
  // @public
  async mocks () {
    return this.mongo.Cos.Commodity.aggregate([
      { $match: { 
        class: 0 
      } },
      { $project: {
        type: true,
        univalent: true,
        detil: true
      } }
    ]).toArray()
  }
}