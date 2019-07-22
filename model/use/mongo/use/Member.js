"use strict"


// 会员
// @class
module.exports = class Member {
  
  // @new
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 获取用户会员信息
  // @params {ObjectId} user
  // @public
  async find (user) {
    return await this.mongo.Member.aggregate([
      { $match: { user }},
      { $project: {
        user: false
      }}
    ]).next()
  }
}