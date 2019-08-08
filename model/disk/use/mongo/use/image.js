"use strict"


// package
// @package
const assert = require("assert").strict


// 图片
// @class
module.exports = class Image {
  
  // @new
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 上传取水照片
  // @params {ObjectId} [cupId]
  // @params {string} [name]
  // @params {string} [mime]
  // @public
  async WaterPublish ({ cupId, name, mime }) {
    let data = {
      cup: cupId,
      image: name,
      cover: null,
      type: mime,
      date: Date.now(),
      update: Date.now()
    }
    
    // 写入水杯相册
    // 返回写入索引
    let append = await this.mongo.Cos.CupPhoto.insertOne(data)
    assert.deepStrictEqual(append.result.n, 1, "E.INSERT")
    return append.insertedId
  }
  
  // 更新取水照片缩略图
  // @params {ObjectId} [id]
  // @params {Object} [cover]
  // @public
  async WaterCover ({ id, cover }) {
    assert.deepStrictEqual((await this.mongo.Cos.CupPhoto.updateOne({
      _id: id
    }, { $set: {
      cover
    } })).result.n, 1, "E.UPDATA")
  }
}