"use strict"


// package
// @package
const moment = require("moment")


// 任务类
// @class
module.exports = class Work {
  
  // @new
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 获取当天时间间隔
  // @private
  _daySplit () {
    return {
      after: moment().set({
        hour: 0, 
        minute: 0, 
        second: 0, 
        millisecond: 0
      }).valueOf(),
      before: moment().set({ 
        hour: 23, 
        minute: 59, 
        second: 59, 
        millisecond: 999 
      }).valueOf()
    }
  }
  
  // 获取用户当天任务列表
  // @params {ObjectId} [userId]
  // @public
  async dayWorks ({ userId }) {
    let { after, before } = this._daySplit()
    return await this.mongo.Cos.Works.find({
      update: { $gte: after, $lte: before },
      user: userId
    }).toArray()
  }
}