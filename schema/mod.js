"use strict"


// package
// @pckage
const path = require("path")
const validate = require("./bin/validate")


// 模式验证
// @class
module.exports = class Schema {
  
  // @new
  // @params {object} util
  // @params {object} configure
  constructor ({ util, configure }) {
    let { status, code } = configure.schema
    this.core = new validate(status, code)
    this.util = util
    this.bindType()
    this.applyTemp()
  }
  
  // 绑定自定义类型
  // @private
  bindType () {
    this.core.type("phone", this.util.isPoneAvailable)
    this.core.type("some", this.util.isNullValue)
    this.core.type("objectId", this.util.isValidOID)
    this.core.type("email", this.util.isEmail)
    this.core.type("ip", this.util.isValidIP)
  }
  
  
  // 绑定模版
  // @private
  applyTemp () {
    
  }
  
  // 验证
  // @params {string} key
  // @params {any} params
  // @public
  schema (key, params) {
    return this.core.schema(key, params)
  }
}