"use strict"


// package
// @package
const assert = require("assert").strict
const moment = require("moment")


// 水滴
// @class
module.exports = class Water {
  
  // @new
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 用户签到
  // @params {ObjectId} [userId]
  // @public
  async signIn ({ userId }) {
    return await this.mongo.Transfer(async session => {
      let gte = moment().hour(0).minute(0).second(0).millisecond(0).valueOf()
      let lte = moment().hour(23).minute(59).second(59).millisecond(999).valueOf()

      // 检查用户当前有无签到
      assert.deepStrictEqual(await this.mongo.Cos.UserSignIn.find({
        user: userId,
        update: { $gte: gte, $lte: lte }
      }, { session }).next(), null, "E.SIGNIN.DAY")

      // 写入用户签到信息
      assert.deepStrictEqual((await this.mongo.Cos.UserSignIn.insertOne({
        user: userId,
        date: Date.now(),
        update: Date.now()
      }, { session })).result.n, 1, "E.INSERT")
      
      // TODO:
      // 签到为50水滴
      // 更新用户水滴
      assert.deepStrictEqual((await this.mongo.Cos.Water.updateOne({
        user: userId
      }, { $inc: {
        count: 50
      } })).result.n, 1, "E.UPDATE")

      // 返回成功
      return true
    })
  }
}