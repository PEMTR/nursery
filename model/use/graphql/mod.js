"use strict"


// package
// @package
const user = require("./use/user/mod")


// GraphQL
// @class
module.exports = class GraphQL {
  
  // @new
  constructor (crate) {
    this.User = new user(crate)
  }
}