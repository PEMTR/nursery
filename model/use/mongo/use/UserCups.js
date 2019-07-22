"use strict"


// 水杯
// @class
module.exports = class UserCups {
   
  // @new
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 查询用户关联水杯列表信息
  // @params {ObjectId} user
  // @public
  async finds (user) {
    return await this.mongo.UserCups.aggregate([
      { $match: { user } },
      { $lookup: {
        from: "Cups",
        localField: "cup",
        foreignField: "_id",
        as: "cup"
      } },
      { $unwind: "$cup" },
      { $lookup: {
        from: "CupWaters",
        localField: "cup._id",
        foreignField: "cup",
        as: "waters"
      } },
      { $project: {
        water: {
          number: { $sum: "$waters.number" },
          count: { $size: "$waters" }
        },
        cup: {
          code: true,
          expires: true,
          avatar: true,
          username: true
        }
      } }
    ]).toArray()
  }
}