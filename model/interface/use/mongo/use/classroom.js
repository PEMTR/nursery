"use strict"


// package
// @package
const assert = require("assert").strict


// 班级
// @class
module.exports = class Classroom {
  
  // @new
  constructor ({ mongo, util }) {
    this.mongo = mongo
    this.util = util
  }
  
  // 获取班级水杯饮水达标排名
  // @params {ObjectId} [cupId]
  // @params {ObjectId} [userId]
  // @public
  async waterSort ({ cupId, userId }) {
    
    // 检查水杯是否归属于此用户
    void this.util.promise(await this.mongo.Cos.UserCups.findOne({
      user: userId,
      cup: cupId
    }), "E.NOTFOUND")
  }
}