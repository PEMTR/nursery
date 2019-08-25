"use strict"


// package
// @package
const disk = require("./disk/mod")
const core = require("./core/mod")
const device = require("./device/mod")
const face = require("./interface/mod")


// model
// @class
module.exports = class Model {
  constructor (crate) {
    this.Disk = new disk(crate)
    this.Core = new core(crate)
    this.Device = new device(crate)
    this.Interface = new face(crate)
  }
}