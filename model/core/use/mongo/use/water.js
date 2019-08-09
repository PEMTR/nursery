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
  
  // 获取当天时间间隔
  // @private
  _daySplit () {
    return {
      after: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).valueOf(),
      before: moment().set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).valueOf()
    }
  }
  
  // 用户签到
  // @params {ObjectId} [userId]
  // @public
  async SignIn ({ userId }) {
    return await this.mongo.Transfer(async session => {
      let { after, before } = this._daySplit()

      // 检查用户当前有无签到
      assert.deepStrictEqual(await this.mongo.Cos.UserSignIn.find({
        update: { $gte: after, $lte: before },
        user: userId
      }, { 
        session 
      }).next(), null, "E.SIGNIN.DAY")

      // 写入用户签到信息
      assert.deepStrictEqual((await this.mongo.Cos.UserSignIn.insertOne({
        user: userId,
        date: Date.now(),
        update: Date.now()
      }, { 
        session 
      })).result.n, 1, "E.INSERT")
      
      // TODO:
      // 签到为50水滴
      // 更新用户水滴
      assert.deepStrictEqual((await this.mongo.Cos.Water.updateOne({
        user: userId
      }, { $inc: {
        count: 50
      } }, {
        session
      })).result.n, 1, "E.UPDATE")

      // 返回成功
      return true
    })
  }
  
  // 分享公众号
  // @params {ObjectId} [userId]
  // @public
  async ShareWechatPublicNumber ({ userId }) {
    return await this.mongo.Transfer(async session => {
      let { after, before } = this._daySplit()
      
      // 检查用户当前有无分享
      assert.deepStrictEqual(await this.mongo.Cos.Works.find({
        update: { $gte: after, $lte: before },
        user: userId,
        type: 0
      }, { 
        session 
      }).next(), null, "E.WORKS.DAY")
      
      // 写入用户分享信息
      assert.deepStrictEqual((await this.mongo.Cos.Works.insertOne({
        user: userId,
        type: 0,
        date: Date.now(),
        update: Date.now()
      }, { 
        session 
      })).result.n, 1, "E.INSERT")
      
      // TODO:
      // 分享为50水滴
      // 更新用户水滴
      assert.deepStrictEqual((await this.mongo.Cos.Water.updateOne({
        user: userId
      }, { $inc: {
        count: 50
      } }, {
        session
      })).result.n, 1, "E.UPDATE")
      
      // 返回成功
      return true
    })
  }
}