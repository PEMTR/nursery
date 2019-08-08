"use strict"


// package
// @package
const ffmpeg = require("fluent-ffmpeg")
const thumbnail = require("simple-thumbnail")


// 媒体
// @class
module.exports = class Media {
  
  // @new
  constructor () {
    
  }
  
  // 媒体转码
  // @params {string || stream} input
  // @params {string || stream} out
  // @public
  Trans (input, out) {
    return new Promise((resolve, reject) => {
      ffmpeg(input)
        .on("error", reject)
        .on("end", resolve)
        .output(out)
        .run()
    })
  }
  
  // 获取媒体元信息
  // @params {string || stream} file
  // @public
  Meta (file) {
    return new Promise((resolve, reject) => {
      ffmpeg(file).ffprobe((err, result) => {
        err ? reject(err) : resolve(result)
      })
    })
  }
  
  // 视频截图
  // @params {string || stream} file
  // @params {string} floder
  // @params {string || stream} out
  // @params {string} skip
  // @public
  VideoScreenHots (file, folder, out, skip) {
    return new Promis((resolve, reject) => {
      ffmpeg(file)
        .on("error", reject)
        .on("end", resolve)
        .screenshots({
          timestamps: [ skip ],
          filename: out,
          folder
        })
    })
  }
  
  // 缩略图处理
  // @params {path} file
  // @params {path} out
  // @params {string} size
  // @public
  async ImageResize (file, out, size) {
    return await thumbnail(file, out, size)
  }
}