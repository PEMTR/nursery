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
  // @params {ObjectId} [cupId] 水杯索引
  // @params {string} [name] 文件名
  // @params {string} [mime] 文件类型
  // @return {Promise<void>}
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
  // @params {ObjectId} [id] 水杯照片索引
  // @params {Object} [cover] 缩略图文件名
  // @return {Promise<void>}
  // @public
  async WaterCover ({ id, cover }) {
    assert.deepStrictEqual((await this.mongo.Cos.CupPhoto.updateOne({
      _id: id
    }, { $set: {
      cover
    } })).result.n, 1, "E.UPDATA")
  }
}