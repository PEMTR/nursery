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
    return { stream, name, path: _path }
  }
  
  // 处理文件表单请求
  // @params {Request} req
  // @params {WriteStream} write
  // @params {string} key
  // @params {reg} mmie
  // @public
  from (req, write, key, mmie) {
    return new Promise((resolve, reject) => {
      let _detil = null
      let { headers } = req
      req.pipe(new busboy({ headers })
        .on("file", (...params) => {
          if (params[0] !== key || !mmie.test(params[4])) {
            return reject(new Error("E.FORMDATA"))
          }
        
          _detil = params[4]
          params[1].pipe(write) 
        }).on("finish", _ => {
          resolve(_detil)
        }))
    })
  }
}