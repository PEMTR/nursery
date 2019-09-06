"use strict"


// 水滴类
// @class
module.exports = class Water {
  
  // @new
  constructor (crate) {
    this.crate = crate
    this.name = "Cache"
    this.version = 1
  }
  
  // 动作
  // @return {object}
  // @public
  get actions () {
    return {
      
      // 获取缓存
      // @param {string} key 索引
      // @public
      Get: async (key) => {
        return await this.crate.factory.Get(key)
      },
      
      // 设置缓存
      // @param {string} key 索引
      // @param {object} model 模式绑定
      // @param {any} value 数据
      // @public
      Set: async (key, model, value) => {
        void await this.crate.factory.Set(key, model, value)
        return true
      }
    }
  }
}