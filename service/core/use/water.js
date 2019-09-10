"use strict"


// 水滴类
// @class
module.exports = class Water {
  
  // @constructor
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
      ExchangeMock: async ({ params: { user, commodity, count } }) => {
        return await this.crate.model.Mongo.Commodity.GetMock({ 
          commodityId: this.crate.util.createHexId(commodity), 
          userId: this.crate.util.createHexId(user), 
          count 
        })
      },

      // 用户签到
      // @params {string} [user] 用户索引
      // @return {Promise<any>}
      SignIn: async ({ params: { user } }) => {
        return await this.crate.model.Mongo.Water.SignIn({ 
          userId: this.crate.util.createHexId(user)
        })
      },

      // 分享公众号
      // @params {string} [user] 用户索引
      // @return {Promise<any>}
      ShareWechatPublicNumber: async ({ params: { user } }) => {
        return await this.crate.model.Mongo.Water.ShareWechatPublicNumber({ 
          userId: this.crate.util.createHexId(user)
        })
      }
    }
  }
}