"use strict"


// package
// @package
const moment = require("moment")
const assert = require("assert").strict


// 签到
// @class
module.exports = class SignIn {
  
  // @constructor
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 获取签到信息
  // @params {ObjectId} [userId] 用户索引
  // @return {Promise<array>}
  // @public
  async signIns ({ userId }) {
    let gte = moment().day(1).hour(0).minute(0).second(0).valueOf()
    let lte = moment().day(7).hour(0).minute(0).second(0).valueOf()
    return await this.mongo.Cos.UserSignIn.aggregate([
      { $match: { 
        user: userId,
        update: { 
          $gte: gte, 
          $lte: lte 
        }
      } },
      { $project: {
        _date: { $toDate: "$update" }
      } },
      { $project: {
        day: { $dayOfYear: "$_date" },
        week: { $dayOfWeek: "$_date" }
      } }
    ]).toArray()
  }
}