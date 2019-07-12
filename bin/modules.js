"use strict"


// package
// @package
const fs = require("fs")
const path = require("path")


// 读取目录
// @params {string} dir
// @private
function readdir (dir) {
  return fs.readdirSync(dir)
}


// 加载模块
// @params {string} dir
// @private
function load (dir) {
  let model = require(dir)
  model.__proto__.isFile = true
  return model
}


// 检查列表
// @params {object} model
// @params {string} root
// @params {array} files
// @private
function iter (model, root, files) {
  for (let file of files) {
    let dir = path.join(root, file)
    let status = fs.statSync(dir)
    let name = path.parse(dir).name
    
    // 检查是否为文件
    // 是文件
    // 加载模块
    // 非文件
    // 继续处理
    model[name] = {}
    model[name] = ({
      "true": _ => load(dir),
      "false": _ => types(model[name], dir, readdir(dir))
    })[String(status.isFile())]()
  }
  
  // 返回
  return model
}


// 按目录结构
// 加载所有模块文件
// export.
module.exports = function (root) { 
  return iter({}, root, readdir(root))
}