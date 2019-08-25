"use strict"


// package
// @package
const cache = require("./cache/mod")
const core = require("./core/mod")
const device = require("./device/mod")
const disk = require("./disk/mod")
const media = require("./media/mod")


// factory
// @class
module.exports = class Factory {
  constructor (crate) {
    this.Cache = new cache(crate)
    this.Core = new core(crate)
    this.Device = new device(crate)
    this.Disk = new disk(crate)
    this.Media = new media(crate)
  }
}