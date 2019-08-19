"use strict"


// 语音
// @class
module.exports = class Audio {
  
  // @new
  constructor ({ quasipaa, model }) {
    this.quasipaa = quasipaa
    this.model = model
  }
  
  // 获取取水语音列表
  // @params {number} [skip] 跳过
  // @params {number} [limit] 限制
  // @return {Promise<object>}
  // @public
  async iter ({ skip, limit }) {
    return await this.quasipaa.Engine("audio.iter", {
      
      // 翻页参数
      skip, limit
    }, async _ => {
      
      // 数据库模型
      // 查询所有的语音
      return await this.model.Mongo.Audio.iter({ 
        skip, limit 
      })
    }, async _ => ({
      
      // 全表关联
      // 语音表
      Audio: "all"
    }))
  }
  
  // 获取水杯取水语音
  // @params {ObjectId} [userId] 用户索引
  // @params {ObjectId} [cupId] 水杯索引
  // @return {Promise<object>}
  // @public
  async cup ({ userId, cupId }) {
    return await this.quasipaa.Engine("audio.cup", {
      
      // 用户和水杯
      user: userId.toString(),
      cup: cupId.toString()
    }, async _ => {
      
      // 数据库模型
      // 查询当前用户当前水杯的动画
      return await this.model.Mongo.Audio.cup({ 
        userId, cupId 
      })
    }, async _v => ({
      
      // 水杯语音索引关联
      CupAudio: String(_v._id)
    }))
  }
}