"use strict"


// 动画
// @class
module.exports = class Achievement {
  
  // @constructor
  constructor ({ quasipaa, model }) {
    this.quasipaa = quasipaa
    this.model = model
  }
  
  // 获取取水动画列表
  // @params {number} [skip] 跳过
  // @params {number} [limit] 限制
  // @return {Promise<object>}
  // @public
  async iter ({ skip, limit }, process) {
    return await this.quasipaa.Engine("animation.iter", {
      
      // 翻页参数
      skip, limit
    }, async _ => {
      
      // 数据库模型
      // 查询动画列表
      return await this.model.Mongo.Animation.iter({ 
        skip, limit 
      })
    }, async _ => ({
      
      // 动画表全表关联
      Animation: "all"
    }))
  }
  
  // 获取水杯取水动画
  // @params {ObjectId} [userId] 用户索引
  // @params {ObjectId} [cupId] 水杯索引
  // @return {Promise<object>}
  // @public
  async cup ({ userId, cupId }, process) {
    return await this.quasipaa.Engine("animation.cup", {
      
      // 关联用户和水杯
      user: userId.toString(),
      cup: cupId.toString()
    }, async _ => {
      
      // 数据库模型
      // 查询当前用户当前水杯的关联动画
      return await this.model.Mongo.Animation.cup({ 
        userId, cupId 
      })
    }, async _v => ({
      
      // 水杯动画索引关联
      CupAnimation: String(_v._id)
    }))
  }
}