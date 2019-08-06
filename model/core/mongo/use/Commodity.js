"use strict"


// package
// @package
const assert = require("assert").strict


// 商品
// @class
module.exports = class Commodity {
  
  // @new
  constructor ({ mongo, util }) {
    this.mongo = mongo
    this.util = util
  }
  
  // 用户获取虚拟商品
  // @params {ObjectId} [userId]
  // @params {ObjectId} [commodityId]
  // @params {number} [count]
  // @returns {ObjectId}
  // @public
  async getMock ({ userId, commodityId, count }) {
    return await this.mongo.Transfer(async session => {
      
      // 查询商品
      let commodity = this.util.promise(await this.mongo.Cos.Commodity.findOne({
        _id: commodityId,
        class: 0 
      }, { session }), "E.NOTFOUND")

      // 查询用户水滴
      let water = this.util.promise(await this.mongo.Cos.Water.findOne({
        user: userId
      }, { session }), "E.NOTFOUND")

      // 计算总数
      // 检查水滴是否足够
      let countWater = commodity.univalent * count
      assert.deepStrictEqual(water.count >= countWater, true, "E.WATER.OVER")

      // 用户商品数据
      let data = {
        commodity: commodity._id,
        user: userId,
        number: count,
        date: Date.now(),
        update: Date.now()
      }

      // 写入用户商品
      let append = await this.mongo.Cos.UserCommoditys.insertOne(data, { session })
      assert.deepStrictEqual(append.result.n, 1, "E.INSERT")

      // 更新用户水滴
      assert.deepStrictEqual((await this.mongo.Cos.Water.updateOne({
        _id: water._id
      }, { $inc: {
        count: countWater - (countWater * 2)
      }, $set: {
        update: Date.now()
      } }, { session })).result.n, 1, "E.UPDATE")

      // 转字符串
      // 返回用户商品索引
      let UserCommoditysID = append.insertedId.toString()
      return { UserCommoditysID }
    })
  }
}