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
      
      // 固定标记
      Commodity: "all"
    }, async _ => {
      
      // 数据库模型
      // 获取虚拟商品表
      return await this.model.Mongo.Commodity.mocks()
    }, async _ => ({
      
      // 商品表
      Commodity: "all"
    }))
  }
}