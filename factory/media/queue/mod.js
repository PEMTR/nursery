"use strict"


// package
// @package
const image = require("./use/image")


// 队列
// @class
module.exports = class Queue {
  
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
    let { type, name, mime, uid } = message.as("json")
    return await this.Modules[type].process(name, mime, uid)
  }
  
  // 绑定主题
  // @params {object} crate
  // @private
  _bind (rabbitx) {
    
    // 多媒体任务
    rabbitx.On("MediaWorks", (message, queue) => {
      this._Works(message)
        .then(_ => queue.ack())
        .catch(err => {
        console.log(err)
        // queue.nack()
      })
    })
  }
}