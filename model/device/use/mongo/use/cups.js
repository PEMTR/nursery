"use strict"


// package
// @package
const assert = require("assert").strict


// 水杯
// @class
module.exports = class Cups {
  
  // @new
  constructor ({ mongo, util }) {
    this.mongo = mongo
    this.util = util
  }
  
  // 取水完成
  // @params {number} [count] 饮水量
  // @params {string} [uid] 水杯编号
  // @return {Promise<ObjectID>}
  // @public
  async WaterBefore ({ count, uid }) {
    
    // 查询水杯
    let cup = this.util.promise(await this.mongo.Cos.Cups.findOne({
      uid
    }), "E.NOTFOUND")
    
    // 水杯饮水数据
    let _data = {
      cup: cup._id,
      classroom: cup.classroom,
      number: count,
      date: Date.now(),
      update: Date.now()
    }
    
    // 写入水杯饮水数据表
    let _append = await this.mongo.Cos.CupWaters.insertOne(_data)
    assert.deepStrictEqual(_append.result.n, 1, "E.INSERT")
    
    // 返回新写索引
    return _append.insertedId
  }
}