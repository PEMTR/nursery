"use strict"


// 任务类
// @class
module.exports = class Work {
  
  // @new
  constructor ({ mongo, util }) {
    this.mongo = mongo
    this.util = util
  }
  
  // 获取用户当天任务列表
  // @params {ObjectId} [userId] 用户索引
  // @return {Promise<array>}
  // @public
  async dayWorks ({ userId }) {
    let { after, before } = this.util.DaySplit()
    return await this.mongo.Cos.Works.find({
      update: { $gte: after, $lte: before },
      user: userId
    }).toArray()
  }
}