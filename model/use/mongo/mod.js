"use strict"


// package
// @package
const user = require("./use/User")
const member = require("./use/Member")
const water = require("./use/Water")
const user_cups = require("./use/UserCups")
const commodity = require("./use/Commodity")


// 模型公共出口类
// 超级类
// 所有模型都挂载在此类上
// @class
module.exports = class Mongo {
  
  // 实现多继承
  // 模拟多继承子类
  // @new
  constructor (crate) {
    this.User = new user(crate)
    this.Member = new member(crate)
    this.Water = new water(crate)
    this.UserCups = new user_cups(crate)
    this.Commodity = new commodity(crate)
  }
}