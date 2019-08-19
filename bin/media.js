"use strict"


// package
// @package
const ffmpeg = require("fluent-ffmpeg")
const thumbnail = require("simple-thumbnail")


// 媒体转码
// @params {string || stream} input 输入文件
// @params {string || stream} out 输出文件
// @return {Promise<void>}
// @public
exports.Trans = function (input, out) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .on("error", reject)
      .on("end", resolve)
      .output(out)
      .run()
  })
}


// 获取媒体元信息
// @params {string || stream} file 文件路径
// @return {Promise<object>}
// @public
exports.Meta = function (file) {
  return new Promise((resolve, reject) => {
    ffmpeg(file).ffprobe((err, result) => {
      err ? reject(err) : resolve(result)
    })
  })
}

// 视频截图
// @params {string || stream} file 文件路径
// @params {string} floder 输出目录
// @params {string} out 输出文件名
// @params {string} skip 跳过
// @return {Promise<void>}
// @public
exports.VideoScreenHots = function (file, folder, out, skip) {
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
// @params {path} file 文件路径
// @params {path} out 输出文件
// @params {string} size 尺寸
// @return {Promise<object>}
// @public
exports.ImageResize = async function (file, out, size) {
  return await thumbnail(file, out, size)
}