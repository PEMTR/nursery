"use strict"


// 动画
// @class
module.exports = class Achievement {
  
  // @new
  constructor ({ quasipaa, model }) {
    this.quasipaa = quasipaa
    this.model = model
  }
  
  // 获取取水动画列表
  // @params {number} [skip]
  // @params {number} [limit]
  // @public
  async iter ({ skip, limit }, process) {
    let _key = "animation.iter"
    return await this.quasipaa.Engine(_key, {
      skip, limit
    }, _ => this.model.Animation.iter({ skip, limit }), async _ => ({
      Animation: "all"
    }))
  }
  
  // 获取水杯取水动画
  // @params {ObjectId} [userId]
  // @params {ObjectId} [cupId]
  // @public
  async cup ({ userId, cupId }, process) {
    let _key = "animation.cup"
    return await this.quasipaa.Engine(_key, {
      user: userId.toString(),
      cup: cupId.toString()
    }, _ => this.model.Animation.cup({ userId, cupId }), async _v => ({
      CupAnimation: _v._id.toString()
    }))
  }
}