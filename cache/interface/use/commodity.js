"use strict"


// 商品
// @class
module.exports = class Commodity {
  
  // @new
  constructor ({ quasipaa, model }) {
    this.quasipaa = quasipaa
    this.model = model
  }
  
  // 获取虚拟商品列表
  // @returns {array}
  // @public
  async mocks () {
    return await this.quasipaa.Engine("commodity.mocks", {
      Commodity: "all"
    }, _ => this.model.Mongo.Commodity.mocks(), async _ => ({
      Commodity: "all"
    }))
  }
}