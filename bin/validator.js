"use strict"


// package
// @package
const validator = require("fastest-validator")
const uuid = require("uuid/v4")


// 模式匹配
// 用于对对象进行类型验证
// 以及其他匹配验证
//
// @class
module.exports = class Schema {
  
  // @new
  // @params {boolean} option = true 选项
  // @params {string} code 错误码
  constructor (option = true, code) {
    this.error = new Error(this.code)
    this.Validator = new validator()
    this.option = option
    this.code = code
    this.map = {}
  }
  
  // 路由中间件
  // @return {function}
  // @public
  express () {
    return (req, _, next) => {
      req._validate_ = this
      next()
    }
  }
  
  // 模式
  // @param {object} temp 模板
  // @param {function} process 处理函数
  // @return {function}
  // @public
  // @static
  static Schema (temp, process) {
    const key = uuid()
    return async (req, _, next) => {
      if (!req._validate_.map[key]) {
        req._validate_.bind(key, temp)
      }
      
      // 处理数据
      // 校验参数
      // 递交
      req.ctx = await process(req)
      req._validate_.schema(key, req.ctx)
      next()
    }
  }
  
  // 绑定模板
  // @params {string} key 索引
  // @params {object} temp 模板
  // @return {void}
  // @public
  bind (key, temp) {
    this.map[key] = this.Validator.compile(temp)
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
    
    // 未找到验证器
    // 抛出错误
    if (!this.map[key]) {
      throw this.error
    }
    
    // 模式验证
    // 匹配通过
    if (this.map[key](params)) {
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
    this.Validator.add(format, handle)
  }
}