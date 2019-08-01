"use strict"


// package
// @package
const assert = require("assert").strict


// 家庭
// @class
module.exports = class Commodity {
  
  // @new
  constructor ({ mongo, util }) {
    this.mongo = mongo
    this.util = util
  }
  
  // 获取家庭成员列表
  // @params {ObjectId} [userId]
  // @return {object}
  // @public
  async users ({ userId }) {
    
    // 查找家庭信息
    let familyUser = this.util.promise(await this.mongo.Cos.FamilyUsers.aggregate([
      { $match: { 
        user: userId 
      } },
      { $lookup: {
        from: "Family",
        localField: "family",
        foreignField: "_id",
        as: "family"
      } },
      { $unwind: "$family" },
      { $project: {
        family: {
          _id: true,
          manage: true
        }
      } }
    ]).next(), "E.NOTFOUND")
    
    // 查找家庭用户组
    // 合并返回
    return Object.assign(familyUser, {
      users: await this.mongo.Cos.FamilyUsers.aggregate([
        { $match: { 
          family: familyUser.family._id 
        } },
        { $lookup: {
          from: "User",
          localField: "user",
          foreignField: "_id",
          as: "user"
        } },
        { $unwind: "$user" },
        { $project: {
          class: true,
          date: true,
          user: {
            nick_name: true,
            avatar: true
          }
        } }
      ]).toArray()
    })
  }
  
  // 删除家庭成员
  // @params {ObjectId} familyId
  // @params {ObjectId} fromId
  // @params {ObjectId} userId
  // @returns {boolean}
  // @public
  async remove ({ familyId, fromId, userId }) {
    
    // 检查管理员身份
    void this.util.promise(await this.mongo.Cos.Family.findOne({
      _id: familyId,
      manage: userId
    }), "E.AUTH")
    
    // 删除家庭成员
    assert.deepStrictEqual((await this.mongo.Cos.FamilyUsers.deleteOne({
      family: familyId,
      user: fromId
    })).result.n, 1, "E.DELETE")
    
    return true
  }
}