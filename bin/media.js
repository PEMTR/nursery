"use strict"


// package
// @package
const ffmpeg = require("fluent-ffmpeg")
const sharp = require("sharp")


// Multimedia processing.
// @object
module.exports = {
  
  // Video transcoding.
  // @params {string || stream} input Input file.
  // @params {string || stream} out Output file.
  // @return {Promise<void>}
  // @public
  trans: (input, out) => new Promise((resolve, reject) => {
    ffmpeg(input).on("error", reject).on("end", resolve).output(out).run()
  }),
  
  // Get media meta information.
  // @params {string || stream} file File path.
  // @return {Promise<object>}
  // @public
  meta: file => new Promise((resolve, reject) => {
    ffmpeg(file).ffprobe((err, result) => {
      err ? reject(err) : resolve(result)
    })
  }),

  // Video screenshot.
  // @params {string || stream} file File path.
  // @params {string} floder Output directory.
  // @params {string} out Output file name.
  // @params {string} skip Skip length.
  // @return {Promise<void>}
  // @public
  screenhots: (file, folder, out, skip) => new Promis((resolve, reject) => {
    ffmpeg(file).on("error", reject).on("end", resolve).screenshots({
      timestamps: [ skip ], filename: out, folder
    })
  }),

  // Thumbnail processing.
  // @params {path} file File path.
  // @params {path} out Output file.
  // @params {number} size Thumbnail size.
  // @return {Promise<object>}
  // @public
  resize: async (file, out, size) => {
    return await sharp(file).resize(size).png().toFile(out)
  }
}