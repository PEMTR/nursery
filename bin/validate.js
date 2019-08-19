"use strict"


// package
// @package
const ajv = require("ajv")


// 模式匹配
// 用于对对象进行类型验证
// 以及其他匹配验证
//
// export.
// @class
module.exports = class Schema {
  
  // @new
  // @params {boolean} option = true 选项
  // @params {string} code 错误码
  constructor (option = true, code) {
    this.error = new Error(this.code)
    this.Validator = new ajv()
    this.option = option
    this.code = code
    this.map = {}
  }
  
  // 绑定模板
  // @params {string} key 索引
  // @params {object} temp 模板
  // @return {void}
  // @public
  bind (key, temp) {
    this.map[key] = {
      context: this.Validator.compile(temp),
      temp
    }
  }
  
  // 验证
  // @params {string} key 索引
  // @params {any} params 参数
  // @return {boolean}
  // @public
  schema (key, params) {
    if (!this.option) {
      return true
    }
    
    // 模式验证
    let { context, temp } = this.map[key]
    let result = context(params)
    
    // 匹配通过
    if (result) {
      return true
    }
    
    // 匹配未通过
    // 抛出错误
    throw this.error
  }
  
  // 自定义类型
  // @params {string} format 类型名称
  // @params {function} handle 处理
  // @public
  type (format, handle) {
    this.Validator.addFormat(format, handle)
  }

  // 自定义关键字
  // @params {string} keyword 关键字名称
  // @params {function} handle 处理
  // @public
  keyword (keyword, handle) {
    this.Validator.addKeyword(keyword, handle)
  }
}