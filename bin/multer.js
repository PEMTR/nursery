"use strict"


// package
// @package
const fs = require("fs")
const path = require("path")
const busboy = require("busboy")
const uuid = require("uuid/v4")


// 表单处理
// @class
module.exports = class Multer {
  
  // @new
  constructor ({ configure: { stage } }) {
    this.configure = stage
  }
  
  // 创建文件可写流
  // @params {string} name
  // @params {string} dir
  // @public
  createWriteStream (name = uuid(), dir) {
    let _dir = dir || this.configure.path
    let _path = path.join(_dir, name)
    let stream = fs.createWriteStream(_path)
    return { stream, name }
  }
  
  // 处理请求
  // @params {Request} req
  // @params {WriteStream} write
  // @public
  from (req, write) {
    return new Promise((resolve, reject) => {
      let _detil = {}
      let { headers } = req
      req.pipe(new busboy({ headers })
        .on("file", (...params) => {
          _detil.type = params[4]
          params[1].pipe(write)
        }).on("finish", _ => {
          resolve(_detil)
        }))
    })
  }
}