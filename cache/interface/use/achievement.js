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
    let _key = "achievement.all"
    return await this.quasipaa.Engine(_key, {
      Achievement: "all"
    }, _ => this.model.Mongo.Achievement.all(), async _ => ({
      AchievementClass: "all",
      Achievement: "all"
    }))
  }
  
  // 获取用户所有成就
  // @params {ObjectId} [userId]
  // @public
  async user ({ userId }) {
    let _key = "achievement.user"
    return await this.quasipaa.Engine(_key, {
      user: userId.toString()
    }, _ => this.model.Mongo.Achievement.user({ userId }), async _v => ({
      UserAchievements: _v.map(({ _id }) => _id.toString())
    }))
  }
}