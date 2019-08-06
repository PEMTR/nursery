"use strict"


// package
// @package
const video = require("./use/video")


// Core
// @class
module.exports = class Core {
  constructor (crate) {
    this.Video = new video(crate)
  }
}