"use strict"


// package
// @package
const works = require("./use/works")


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
    this.Modules.Works = new works(crate)
  }
  
  // 媒体任务
  // @params {object} message
  // @private
  async _Works (message) {
    let { uid, out, type } = message.as("json")
    return await this.Modules.Works[type](uid, out)
  }
  
  // 绑定主题
  // @params {object} crate
  // @private
  _bind (rabbitx) {
    
    // 多媒体任务
    rabbitx.On("MediaWorksCallBack", (message, queue) => {
      this._Works(message)
        .then(_ => queue.ack())
        .catch(err => {
        // queue.nack()
      })
    })
  }
}