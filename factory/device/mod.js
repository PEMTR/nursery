"use strict"


// package
// @package
const process = require("./process")


// 消息类型
// 处理函数方法对照
// @const
const TYPINGS = [
  "WaterBefore",  // 取水完成
  null,           // 占位
]


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
    let _name = TYPINGS[_data.type]
    return this.Process[_name](_data)
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