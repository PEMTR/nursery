"use strict"


// package
// @package
const face = require("./interface/mod")


// cache
// @class
module.exports = class Cache {
  constructor (crate) {
    this.Interface = new face(crate)
  }
}