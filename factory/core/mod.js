"use strict"


// package
// @package
const water = require("./use/water")


// Core
// @class
module.exports = class Core {
  constructor (crate) {
    this.Water = new water(crate)
  }
}