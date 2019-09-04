"use strict"


// 水滴类
// @class
module.exports = class Water {
  
  // @new
  constructor ({ util, model }) {
    this.model = model
    this.util = util
  }
  
  // 水滴兑换虚拟商品
  // @params {string} [user] 用户索引
  // @params {string} [commodity] 商品索引
  // @params {number} [count] 数量
  // @return {Promise<any>}
  // @public
  async ExchangeMock ({ user, commodity, count }) {
    let userId = this.util.createHexId(user)
    let commodityId = this.util.createHexId(commodity)
    return await this.model.Mongo.Commodity.GetMock({ commodityId, userId, count })
  }
  
  // 用户签到
  // @params {string} [user] 用户索引
  // @return {Promise<any>}
  // @public
  async SignIn ({ user }) {
    let userId = this.util.createHexId(user)
    return await this.model.Mongo.Water.SignIn({ userId })
  }
  
  // 分享公众号
  // @params {string} [user] 用户索引
  // @return {Promise<any>}
  // @public
  async ShareWechatPublicNumber ({ user }) {
    let userId = this.util.createHexId(user)
    return await this.model.Mongo.Water.ShareWechatPublicNumber({ userId })
  }
}