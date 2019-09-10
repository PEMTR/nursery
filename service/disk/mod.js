"use strict"


// 任务
// @class
module.exports = class Works {
  
  // @constructor
  constructor (crate) {
    this.crate = crate
    this.name = "Disk"
    this.version = 1
  }
  
  // 事件
  // @return {object}
  // @public
  get events () {
    return {
      
      // 图片处理
      // @params {Array<string>} uid 水杯照片索引
      // @params {string} cover 图片文件名
      // @return {Promise<any>}
      // @public
      Image: async ({ uid, cover }) => {
        let ids = uid.map(this.crate.util.createHexId)
        return await this.crate.model.Mongo.Image.WaterCover({ 
          ids, cover
        })
      }
    }
  }
}