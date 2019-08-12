"use strict"


// 成就
// @class
module.exports = class Commodity {
  
  // @new
  constructor ({ mongo, temp }) {
    this.mongo = mongo
    this.temp = temp
  }
  
  // 获取所有成就列表
  // @returns {array}
  // @public
  async all () {
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
  }
  
  // 获取用户所有成就
  // @params {ObjectId} [userId]
  // @returns {array}
  // @public
  async user ({ userId }) {
    return await this.mongo.Cos.UserAchievements.aggregate([ 
      { $match: { 
        user: userId 
      } },
      { $project: {
        user: false
      } }
    ]).toArray()
  }
}