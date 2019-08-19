"use strict"


// 取水语音
// @class
module.exports = class Audio {

  // @new
  constructor ({ mongo, util }) {
    this.mongo = mongo
    this.util = util
  }

  // 获取取水语音列表
  // @params {number} [skip] 跳过
  // @params {number} [limit] 限制
  // @return {Promise<array>}
  // @public
  async iter ({ skip, limit }) {
    return await this.mongo.Cos.Audio.aggregate([
      { $skip: skip },
      { $limit: limit }
    ]).toArray()
  }

  // 获取水杯取水语音
  // @params {ObjectId} [userId] 用户索引
  // @params {ObjectId} [cupId] 水杯索引
  // @return {Promise<object>}
  // @public
  async cup ({ userId, cupId }) {
    return this.util.promise(await this.mongo.Cos.CupAudio.aggregate([
      { $match: {
        user: userId,
        cup: cupId
      } },
      { $limit: 1 },
      { $project: {
        audio: true,
        update: true
      } }
    ]).next(), "E.NOTFOUND")
  }

  // 设置水杯取水语音
  // @params {ObjectId} [userId] 用户索引
  // @params {ObjectId} [cupId] 水杯索引
  // @params {ObjectId} [audioId] 语音索引
  // @return {Promise<boolean>}
  // @public
  async cupSet ({ userId, cupId, audioId  }) {

    // 验证用户水杯
    void this.util.promise(await this.mongo.Cos.UserCups.findOne({
      user: userId,
      cup: cupId
    }), "E.NOTFOUND")

    // 更新水杯语音
    assert.deepStrictEqual((await this.mongo.Cos.CupAudio.updateOne({
      cup: cupId
    }, { $set: {
      user: userId,
      audio: audioId,
      update: Date.now()
    } })).result.n, 1, "E.UPDATA")

    return true
  }
}