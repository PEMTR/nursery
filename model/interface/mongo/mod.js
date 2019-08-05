"use strict"


// package
// @package
const user = require("./use/User")
const member = require("./use/Member")
const water = require("./use/Water")
const cups = require("./use/Cups")
const commodity = require("./use/Commodity")
const achievement = require("./use/Achievement")
const family = require("./use/Family")
const animation = require("./use/Animation")
const audio = require("./use/Audio")
const signin = require("./use/SignIn")


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
    this.Cups = new cups(crate)
    this.Commodity = new commodity(crate)
    this.Achievement = new achievement(crate)
    this.Family = new family(crate)
    this.Animation = new animation(crate)
    this.Audio = new audio(crate)
    this.SignIn = new signin(crate)
  }
}