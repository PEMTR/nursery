"use strict"


// package
// @package
const commodity = require("./use/Commodity")
const water = require("./use/Water")


// MongoDB
// @class
module.exports = class Mongo {
  constructor (crate) {
    this.Commodity = new commodity(crate)
    this.Water = new water(crate)
  }
}