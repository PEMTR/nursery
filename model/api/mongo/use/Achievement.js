"use strict"


// 成就
// @class
module.exports = class Commodity {
  
  // @new
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 获取所有成就列表
  // @returns {array}
  // @public
  async all () {
    return this.mongo.Cos.AchievementClass.aggregate([
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
  }
  
  // 获取用户所有成就
  // @params {ObjectId} user
  // @returns {array}
  // @public
  async user (user) {
    return this.mongo.Cos.UserAchievements.aggregate([ 
      { $match: { user } },
      { $project: {
        user: false
      } }
    ]).toArray()
  }
}