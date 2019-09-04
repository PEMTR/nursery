"use strict"


// 水滴类
// @class
module.exports = class Water {
  
  // @new
  constructor (crate) {
    this.crate = crate
    this.name = "Water"
    this.version = 1
  }
  
  // 动作
  // @return {object}
  // @public
  get actions () {
    return {
      
      // 水滴兑换虚拟商品
      // @params {string} [user] 用户索引
      // @params {string} [commodity] 商品索引
      // @params {number} [count] 数量
      // @return {Promise<any>}
      ExchangeMock: async ({ user, commodity, count }) => {
        let userId = this.crate.util.createHexId(user)
        let commodityId = this.crate.util.createHexId(commodity)
        return await this.crate.model.Mongo.Commodity.GetMock({ commodityId, userId, count })
      },

      // 用户签到
      // @params {string} [user] 用户索引
      // @return {Promise<any>}
      SignIn: async ({ user }) => {
        let userId = this.crate.util.createHexId(user)
        return await this.crate.model.Mongo.Water.SignIn({ userId })
      },

      // 分享公众号
      // @params {string} [user] 用户索引
      // @return {Promise<any>}
      ShareWechatPublicNumber: async ({ user }) => {
        let userId = this.crate.util.createHexId(user)
        return await this.crate.model.Mongo.Water.ShareWechatPublicNumber({ userId })
      }
    }
  }
}