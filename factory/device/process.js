"use strict"


// 设备推送处理
// @class
module.exports = class Process {
  
  // @constructor
  constructor ({ model }) {
    this.model = model
  }
  
  // 取水完成
  // @params {number} [count] 饮水量
  // @params {string} [uid] 水杯编号
  // @return {Promise<void>}
  // @public
  async WaterBefore ({ count, uid }) {
    void await this.model.mongo.Cups.WaterBefore({
      count, uid
    })
  }
}