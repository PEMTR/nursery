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
  // @params {ObjectId} [user]
  // @returns {array}
  // @public
  async finds ({ userId }) {
    return await this.mongo.Cos.UserCups.aggregate([
      { $match: { 
        user: userId 
      } },
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
  // @params {ObjectId} [cupId]
  // @params {boolean} [notice]
  // @params {ObjectId} [userId]
  // @returns {boolean}
  // @public
  async setNotice ({ cupId, notice, userId }) {
    assert.deepStrictEqual((await this.mongo.Cos.UserCups.updateOne({ 
      cup: cupId,
      user: userId
    }, { $set: { 
      notice 
    } })).result.n, 1, "E.UPDATE")
    
    return true
  }
}