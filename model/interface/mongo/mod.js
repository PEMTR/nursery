"use strict"


// package
// @package
const user = require("./use/user")
const member = require("./use/member")
const water = require("./use/water")
const cups = require("./use/cups")
const commodity = require("./use/commodity")
const achievement = require("./use/achievement")
const family = require("./use/family")
const animation = require("./use/animation")
const audio = require("./use/audio")
const signin = require("./use/signIn")
const work = require("./use/work")


// 数据库
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
    this.Work = new work(crate)
  }
}