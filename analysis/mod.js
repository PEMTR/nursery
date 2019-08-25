"use strict"


// package
// @package
const cache = require("./cache/mod")
const disk = require("./disk/mod")
const face = require("./interface/mod")


// analysis
// @class
module.exports = class Analysis {
  constructor (crate) {
    this.Disk = new disk(crate)
    this.Cache = new cache(crate)
    this.Interface = new face(crate)
  }
}