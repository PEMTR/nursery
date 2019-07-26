"use strict"


// 商品
// @class
module.exports = class Commodity {
  
  // @new
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 获取虚拟商品列表
  // @public
  async mocks () {
    return this.mongo.Commodity.find({
      type: 0
    }).toArray()
  }
}