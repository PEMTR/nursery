"use strict"


// 会员
// @class
module.exports = class Member {
  
  // @new
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 获取用户会员信息
  // @params {ObjectId} [userId]
  // @returns {object}
  // @public
  async find ({ userId }) {
    return await this.mongo.Cos.Member.aggregate([
      { $match: { 
        user: userId 
      }},
      { $project: {
        user: false
      }}
    ]).next()
  }
}