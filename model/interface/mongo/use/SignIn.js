"use strict"


// 签到
// @class
module.exports = class SignIn {
  
  // @new
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 获取签到信息
  // @params {ObjectId} [userId]
  // @public
  async signIns ({ userId }) {
    
  }
}