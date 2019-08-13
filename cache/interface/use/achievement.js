"use strict"


// 成就
// @class
module.exports = class Achievement {
  
  // @new
  constructor ({ quasipaa, model }) {
    this.quasipaa = quasipaa
    this.model = model
  }
  
  // 获取所有成就列表
  // @public
  async all () {
    return await this.quasipaa.Engine("achievement.all", {
      
      // 没有任何参数
      // 随意生成固定参数
      Achievement: "all"
    }, async _ => {
      
      // 调用数据库模型
      // 查询所有成就
      return await this.model.Mongo.Achievement.all()
    }, async _ => ({
      
      // 全表关联
      // 成就类别表
      // 成就表
      AchievementClass: "all",
      Achievement: "all"
    }))
  }
  
  // 获取用户所有成就
  // @params {ObjectId} [userId]
  // @public
  async user ({ userId }) {
    return await this.quasipaa.Engine("achievement.user", {
      
      // 用户索引
      user: userId.toString()
    }, async _ => {
      
      // 调用数据模型
      // 查询用户已达成成就
      return await this.model.Mongo.Achievement.user({ 
        userId 
      })
    }, async _v => ({
      
      // 关联用户成就表
      // 当前用户关联的成就
      UserAchievements: _v.map(({ _id }) => {
        return String(_id)
      })
    }))
  }
}