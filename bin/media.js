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
  
  // 转码
  // @params {string || stream} input
  // @params {string || stream} out
  // @public
  VideoTrans (input, out) {
    return new Promise((resolve, reject) => {
      ffmpeg(input)
        .on("error", reject)
        .on("end", resolve)
        .output(out)
        .run
    })
  }
  
  // 获取视频元信息
  // @params {string || stream} file
  // @public
  VideoMeta (file) {
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
}