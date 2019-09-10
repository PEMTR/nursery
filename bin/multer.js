"use strict"


// package
// @package
const fs = require("fs")
const path = require("path")
const busboy = require("busboy")
const uuid = require("uuid/v4")


// File upload form processing.
// @class
module.exports = class Multer {
  
  // @constructor
  constructor ({ configure: { stage } }) {
    this.configure = stage
  }
  
  // Create a file writable stream.
  // @params {string} name File name.
  // @params {string} dir Output directory.
  // @return {Promise<object>}
  // @public
  createWriteStream (name = uuid(), dir) {
    return new Promise((resolve, reject) => {
      let _dir = dir || this.configure.path
      let _path = path.join(_dir, name)
      let stream = fs.createWriteStream(_path)
        .on("error", reject)
        .on("ready", _ => resolve({ 
          stream, name, 
          path: _path 
        }))
    })
  }
  
  // Processing file form requests.
  // @params {Request} req Express request handle.
  // @params {WriteStream} write Writable stream.
  // @params {string} key Form key.
  // @params {reg} mmie Form type.
  // @return {Promise<object>}
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