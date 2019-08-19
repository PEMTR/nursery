"use strict"


// package
// @package
const process = require("./process")


// 设备类
// @class
module.exports = class Device {
  
  // @new
  constructor (crate) {
    this.Process = new process(crate)
    this.rabbitx = crate.rabbitx
    this._watch()
  }
  
  // 处理设备推送
  // @params {object} messagge 消息
  // @private
  async _Devices (message) {
    let _data = message.as("json")
    return this.Process[[
      "WaterBefore"
    ][_data.type]](_data)
  }
  
  // 绑定
  // @private
  _watch () {
    this.rabbitx.On("Devices", (message, queue) => {
      this._Devices(message)
        .then(_ => queue.ack())
        .catch(err => {
          queue.nack()
        })
    })
  }
}