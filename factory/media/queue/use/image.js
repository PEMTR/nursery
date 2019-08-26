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
  constructor ({ configure, media, rabbitx }) {
    this.configure = configure
    this.rabbitx = rabbitx
    this.media = media
  }
  
  // 更新文件名
  // @params {string} old 老文件
  // @params {string} name 新文件
  // @private
  _rename (old, name) {
    return new Promise((resolve, reject) => {
      fs.rename(old, name, function (err) {
        err ? reject(err) : resolve()
      })
    })
  }
  
  // 任务
  // @params {string} name 文件名
  // @params {string} mime 文件类型
  // @params {Array<string>} uid 任务标识
  // @return {Promise<void>}
  // @public
  async process (name, mime, uid) {
    
    // 文件路径处理
    let fat = mime.split("/")[1]
    let outuid = uuid()
    let outname = [ outuid, fat ].join(".")
    let dir = this.configure.stage.path
    let size = this.configure.stage.size
    let inputpath = path.join(dir, name)
    let outpath = path.join(dir, outname)
    
    // 处理缩略图
    // 重命名文件，消除后缀
    void await this.media.ImageResize(inputpath, outpath, size)
    void await this._rename(outpath, path.join(dir, outuid))
    
    // 推送到回调队列
    this.rabbitx.Send("MediaWorksCallBack", {
      uid, out: outuid,
      type: "Image"
    })
  }
}