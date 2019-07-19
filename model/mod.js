"use strict"


// package
// @package
const mongo = require("./use/mongo/mod")
const redis = require("./use/redis/mod")


// export.
// @class
module.exports = class Model {
  constructor (crate) {
    this.mongo = new mongo(crate)
    //this.redis = new redis(crate)
  }
}