"use strict"


// 成就
// @class
module.exports = class Commodity {
  
  // @new
  constructor ({ mongo, quasipaa }) {
    this.quasipaa = quasipaa
    this.mongo = mongo
  }
  
  // 获取所有成就列表
  // @returns {array}
  // @public
  async all () {
    return await this.quasipaa.Engine("achievement.all", {}, async _ => {
      return await this.mongo.Cos.AchievementClass.aggregate([
        { $lookup: {
          from: "Achievement",
          localField: "_id",
          foreignField: "class",
          as: "achievements"
        } },
        { $project: {
          name: true,
          detil: true,
          achievements: {
            _id: true,
            icon: true,
            name: true,
            detil: true
          }
        } }
      ]).toArray()
    }, async _ => {
      return {
        AchievementClass: "all",
        Achievement: "all"
      }
    })
  }
  
  // 获取用户所有成就
  // @params {ObjectId} [userId]
  // @returns {array}
  // @public
  async user ({ userId }) {
    return await this.quasipaa.Engine("achievement.user", {
      user: userId.toString()
    }, async _ => {
      return await this.mongo.Cos.UserAchievements.aggregate([ 
        { $match: { 
          user: userId 
        } },
        { $project: {
          user: false
        } }
      ]).toArray()
    }, async result => {
      return { 
        UserAchievements: result.map(({ _id }) => {
          return _id.toString()
        })
      }
    })
  }
}