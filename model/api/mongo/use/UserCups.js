"use strict"


// package
// @package
const assert = require("assert").strict


// 用户水杯
// @class
module.exports = class UserCups {
   
  // @new
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 查询用户关联水杯列表信息
  // @params {ObjectId} user
  // @returns {array}
  // @public
  async finds (user) {
    return await this.mongo.Cos.UserCups.aggregate([
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
  
  // 用户设置水杯提醒
  // @params {ObjectId} _id
  // @params {boolean} notice
  // @params {ObjectId} user
  // @returns {boolean}
  // @public
  async setNotice ({ _id, notice, user }) {
    assert.deepStrictEqual((await this.mongo.Cos.UserCups.updateOne({ 
      _id, user 
    }, { $set: { 
      notice 
    } })).result.n, 1, "E.UPDATE")
    
    return true
  }
}