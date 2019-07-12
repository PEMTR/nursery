"use strict"


// package
// @pckage
const path = require("path")
const modules = require("../bin/modules")


// 迭代器
// @private
function iter (left = "", models, apply) {
  for (let key in models) {
    let model = models[key]
    let option = model.isFile
    let name = [ left, key ].join(".")
    let params = [ name, model ]
    option && params.push(apply)
    option ? apply(...params) : iter(...params)
  }
}


// 初始化验证模板
// export.
module.exports = function ({ validate, util, dirname }) {
  validate.type("phone", util.isPoneAvailable)
  validate.type("nonull", util.isNullValue)
  validate.type("hexid", util.isValidOID)
  validate.type("email", util.isEmail)
  validate.type("ip", util.isValidIP)
  
  // 迭代
  // 绑定所有模板
  iter(...[
    null, 
    modules(path.join(dirname, "./schema/use")), 
    validate.bind
  ])
}