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
        from: "Classroom",
        localField: "cup.classroom",
        foreignField: "_id",
        as: "classroom"
      } },
      { $unwind: "$classroom" },
      { $lookup: {
        from: "CupWaters",
        localField: "cup._id",
        foreignField: "cup",
        as: "waters"
      } },
      { $project: {
        standard: "$classroom.standard",
        water: {
          number: { $sum: "$waters.number" },
          count: { $size: "$waters" }
        },
        cup: {
          _id: true,
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
      notice,
      update: Date.now()
    } })).result.n, 1, "E.UPDATE")
    
    return true
  }
  
  // 获取水杯照片
  // @params {ObjectId} [cupId]
  // @params {ObjectId} [userId]
  // @params {number} [lte]
  // @params {number} [gte]
  // @params {number} [skip]
  // @params {number} [limit]
  // @returns {array}
  // @public
  async photo ({ userId, cupId, lte, gte, skip, limit }) {
    
    // 验证用户水杯
    void this.util.promise(await this.mongo.Cos.UserCups.findOne({
      user: userId,
      cup: cupId
    }), "E.NOTFOUND")
    
    // 查询相册
    return await this.mongo.Cos.CupPhoto.aggregate([
      { $match: {
        cup: cupId,
        $lte: lte,
        $gte: gte
      } },
      { $skip: skip },
      { $limit: limit },
      { $project: {
        cup: false
      } }
    ]).toArray()
  }
}