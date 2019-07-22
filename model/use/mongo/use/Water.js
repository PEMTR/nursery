"use strict"


// 水滴
// @class
module.exports = class Water {
  
  // @new
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 查询用户水滴数
  // @params {ObjectId} user
  // @public
  async find (user) {
    return await this.mongo.Water.aggregate([
      { $match: { user } },
      { $project: {
        user: false
      } }
    ]).next()
  }
}