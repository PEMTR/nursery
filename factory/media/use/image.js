"use strict"


// package
// @package
const fs = require("fs")
const path = require("path")
const uuid = require("uuid/v4")


// 图片
// @class
module.exports = class Image {
  
  // @new
  constructor ({ configure, media }) {
    this.configure = configure
    this.media = media
  }
  
  // 任务
  // @params {string} name
  // @params {string} mime
  // @public
  async process (name, mime) {
    let fat = mime.split("/")[1]
    let outname = uuid() + "." + fat
    let dir = this.configure.stage.path
    let size = this.configure.size
    let inputpath = path.join(dir, name)
    let outpath = path.join(dir, outname)
    void await this.media.ImageResize(inputpath, outname, size)
  }
}