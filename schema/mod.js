"use strict"


// package
// @pckage
const path = require("path")
const modules = require("../bin/modules")


// 初始化验证模板
// export.
module.exports = function ({ validate, util, dirname }) {
  validate.type("phone", util.isPoneAvailable)
  validate.type("nonull", util.isNullValue)
  validate.type("hexid", util.isValidOID)
  validate.type("email", util.isEmail)
  validate.type("ip", util.isValidIP)
}