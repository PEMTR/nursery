"use strict"


// 用户类
// @class
module.exports = class User {
  
  // @new
  constructor({ redis }) {
    this.redis = redis
  }
}