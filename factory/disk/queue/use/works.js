"use strict"


// 任务
// @class
module.exports = class Works {
  
  // @new
  constructor ({ model, util }) {
    this.model = model
    this.util = util
  }
  
  // 图片处理
  // @params {string} uid
  // @params {string} cover
  // @public
  async Image (uid, cover) {
    return await this.model.Mongo.Image.WaterCover({
      id: this.util.createHexId(uid),
      cover
    })
  }
}