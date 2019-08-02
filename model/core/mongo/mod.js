"use strict"


// package
// @package
const commodity = require("./use/Commodity")


// MongoDB
// @class
module.exports = class Mongo {
  constructor (crate) {
    this.Commodity = new commodity(crate)
  }
}