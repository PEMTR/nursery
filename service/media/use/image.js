"use strict"


// package
// @package
const fs = require("fs")
const path = require("path")
const uuid = require("uuid/v4")


// 图片
// @class
module.exports = class Image {
  
  // @constructor
  constructor (crate) {
    this.crate = crate
    this.name = "Image"
    this.version = 1
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
  
  // 事件
  // @return {object}
  // @public
  get events () {
    
    // 任务
    // @params {string} name 文件名
    // @params {string} mime 文件类型
    // @params {Array<string>} uid 任务标识
    // @return {Promise<void>}
    // @public
    Resize: async ({ params: { name, mime, uid }}) => {

      // 文件路径处理
      let outuid = uuid()
      let fat = mime.split("/")[1]
      let outname = [ outuid, fat ].join(".")
      let dir = this.crate.configure.stage.path
      let size = this.crate.configure.stage.size
      let inputpath = path.join(dir, name)
      let outpath = path.join(dir, outname)

      // 处理缩略图
      // 重命名文件，消除后缀
      // 完成推送
      void await this.crate.media.resize(inputpath, outpath, size)
      void await this._rename(outpath, path.join(dir, outuid))
      this.crate.broker.emit("Image", {
        uid, cover: outuid
      }, "Disk", { nodeID: "disk" })
    }
  }
}