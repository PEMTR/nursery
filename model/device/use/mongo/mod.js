"use strict"


// package
// @package
const cups = require("./use/cups")


// MongoDB
// @class
module.exports = class Mongo {
  constructor (crate) {
    this.Cups = new cups(crate)
  }
}