"use strict"


// package
// @package
const image = require("./use/image")


// 媒体
// @class
module.exports = class Media {
  
  // @new
  constructor (crate) {
    this.Modules = {}
    this._exports(crate)
    this._bind(crate.rabbitx)
  }
  
  // 模块导入
  // @params {object} crate
  // @private
  _exports (crate) {
    this.Modules.Image = new image(crate)
  }
  
  // 媒体任务
  // @params {object} message
  // @private
  async _Works (message) {
    let { type, name, mime } = message.as("json")
    return await this.Modules[type].process(name, mime)
  }
  
  // 绑定主题
  // @params {object} crate
  // @private
  _bind (rabbitx) {
    
    // 多媒体任务
    rabbitx.On("MediaWorks", (message, queue) => {
      this._Works(message)
        .then(_ => queue.ack())
        .catch(_ => queue.nack())
    })
  }
}