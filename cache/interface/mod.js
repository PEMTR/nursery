"use strict"


// package
// @package
const achievement = require("./use/achievement")
const animation = require("./use/animation")
const classroom = require("./use/classroom")
const commodity = require("./use/commodity")
const audio = require("./use/audio")


// 缓存类
// @class
module.exports = class Quasipaa {
  constructor (crate) {
    this.Achievement = new achievement(crate)
    this.Animation = new animation(crate)
    this.Classroom = new classroom(crate)
    this.Commodity = new commodity(crate)
    this.Audio = new audio(crate)
  }
}