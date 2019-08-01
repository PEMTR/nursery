"use strict"


// package
// @package
const assert = require("assert").strict


// 取水动画
// @class
module.exports = class Animation {

  // @new
  constructor ({ mongo, util }) {
    this.mongo = mongo
    this.util = util
  }

  // 获取取水动画列表
  // @params {number} [skip]
  // @params {number} [limit]
  // @returns {array}
  // @public
  async iter ({ skip, limit }) {
    return await this.mongo.Cos.Animation.aggregate([
      { $skip: skip },
      { $limit: limit }
    ]).toArray()
  }

  // 获取水杯取水动画
  // @params {ObjectId} [userId]
  // @params {ObjectId} [cupId]
  // @params {object}
  // @public
  async cup ({ userId, cupId }) {
    return await this.mongo.Cos.CupAnimation.aggregate([
      { $match: {
        user: userId,
        cup: cupId
      } },
      { $limit: 1 },
      { $project: {
        animation: true,
        update: true
      } }
    ]).next()
  }

  // 设置水杯取水动画
  // @params {ObjectId} [userId]
  // @params {ObjectId} [cupId]
  // @params {ObjectId} [animationId]
  // @params {boolean}
  // @public
  async cupSet ({ userId, cupId, animationId  }) {

    // 验证用户水杯
    void this.util.promise(await this.mongo.Cos.UserCups.findOne({
      user: userId,
      cup: cupId
    }), "E.NOTFOUND")

    // 更新水杯动画
    assert.deepStrictEqual((await this.mongo.Cos.CupAnimation.updateOne({
      cup: cupId
    }, { $set: {
      user: userId,
      animation: animationId
    } })).result.n, 1, "E.UPDATA")

    return true
  }
}