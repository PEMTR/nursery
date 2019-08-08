"use strict"


// package
// @package
const commodity = require("./use/commodity")
const water = require("./use/water")


// MongoDB
// @class
module.exports = class Mongo {
  constructor (crate) {
    this.Commodity = new commodity(crate)
    this.Water = new water(crate)
  }
}