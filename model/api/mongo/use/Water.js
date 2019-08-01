"use strict"


// 水滴
// @class
module.exports = class Water {
  
  // @new
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 查询用户水滴数
  // @params {ObjectId} [userId]
  // @returns {object}
  // @public
  async find ({ userId }) {
    return await this.mongo.Cos.Water.aggregate([
      { $match: { 
        user: userId 
      } },
      { $limit: 1 },
      { $project: {
        user: false
      } }
    ]).next()
  }
}