"use strict"


// 水滴类
// @class
module.exports = class Water {
  
  // @new
  constructor ({ util, model }) {
    this.util = util
    this.model = model
  }
  
  // 水滴兑换虚拟商品
  // @params {string} [user]
  // @params {string} [commodity]
  // @params {number} [count]
  // @public
  async ExchangeMock ({ user, commodity, count }) {
    return await this.model.mongo.Commodity.GetMock({
      commodityId: this.util.createHexId(commodity),
      userId: this.util.createHexId(user),
      count
    })
  }
  
  // 用户签到
  // @params {string} [user]
  // @public
  async SignIn ({ user }) {
    return await this.model.mongo.Water.SignIn({
      userId: this.util.createHexId(user)
    })
  }
  
  // 分享公众号
  // @params {string} [user]
  // @public
  async ShareWechatPublicNumber ({ user }) {
    return await this.model.mongo.Water.ShareWechatPublicNumber({
      userId: this.util.createHexId(user)
    })
  }
}