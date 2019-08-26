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
  // @params {Array<string>} uid 水杯照片索引
  // @params {string} cover 图片文件名
  // @return {Promise<any>}
  // @public
  async Image (uid, cover) {
    let ids = uid.map(this.util.createHexId)
    return await this.model.Mongo.Image.WaterCover({ ids, cover })
  }
}