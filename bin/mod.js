"use strict"


// package
// @package
const oss = require("./oss")
const pay = require("./pay")
const util = require("./util")
const mongod = require("./mongod")
const multer = require("./multer")
const decrypt = require("./decrypt")
const rabbitmq = require("./rabbitmq")
const transaction = require("./transaction")
const validate = require("./validate")
const wechat = require("./wechat")


// 动态链接库
// @class
module.exports = class Library {
  
  // @new
  constructor () {
    this.crate = {}
  }
  
  // 添加外部依赖
  // @params {string} key
  // @params {any} value
  // @public
  apply (key, value) {
    this.crate[key] = value
  }
}