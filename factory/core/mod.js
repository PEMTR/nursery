"use strict"


// package
// @package
const water = require("./use/water")


// Core
// @class
module.exports = class Core {
  
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
    this.Modules.Water = new water(crate)
  }
  
  // 核心水滴处理
  // @params {object} message
  // @private
  async _Water (message) {
    let { type, data } = message.as("json")
    return await this.Modules.Water[type](data)
  }
  
  // 绑定主题
  // @params {class} rabbitx
  // @private
  _bind (rabbitx) {
    
    // 水滴管理
    rabbitx.OnTransfer("CoreWater", async (message) => {
      return await this._Water(message)
    })
  }
}