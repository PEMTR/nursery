"use strict"


// package
// @package
const user_cup = require("./use/user_cup")


// 模型公共出口类
// 超级类
// 所有模型都挂载在此类上
// @class
module.exports = class Mongo {
  constructor ({ mongo }) {
    this.mongo = mongo
    
    // 实现多继承
    // 模拟多继承子类
    this.user_cup = new user_cup(this)
  }
}