"use strict"


// package
// @package
const assert = require("assert").strict


// 图片
// @class
module.exports = class Image {
  
  // @constructor
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 上传取水照片
  // @params {Array<string>} [cupUids] 水杯索引
  // @params {string} [name] 文件名
  // @params {string} [mime] 文件类型
  // @return {Promise<Array<ObjectId>>}
  // @public
  async WaterPublish ({ cupUids, name, mime }) {
    let cups = await this.mongo.Cos.Cups.find({ 
      $or: cupUids.map(uid => ({ uid })) 
    }).toArray()
    
    // 水杯相册数据组
    let bluks = cups.map(({ _id }) => ({
      cup: _id,
      image: name,
      cover: null,
      type: mime,
      date: Date.now(),
      update: Date.now()
    }))
    
    // 写入水杯相册
    // 返回写入索引
    let append = await this.mongo.Cos.CupPhoto.insertMany(bluks)
    assert.deepStrictEqual(append.result.n, bluks.length, "E.INSERT")
    return Object.values(append.insertedIds)
  }
  
  // 更新取水照片缩略图
  // @params {Array<ObjectId>} [ids] 水杯照片索引
  // @params {Object} [cover] 缩略图文件名
  // @return {Promise<void>}
  // @public
  async WaterCover ({ ids, cover }) {
    for (let _id of ids) {
      assert.deepStrictEqual((await this.mongo.Cos.CupPhoto.updateMany({ _id }, { 
        $set: { cover } 
      })).result.n, 1, "E.UPDATA")
    }
  }
}