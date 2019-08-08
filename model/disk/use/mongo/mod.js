"use strict"


// package
// @package
const image = require("./use/image")


// MongoDB
// @class
module.exports = class Mongo {
  constructor (crate) {
    this.Image = new image(crate)
  }
}