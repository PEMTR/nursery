"use strict"


// package
// @package
const fs = require("fs")
const path = require("path")


// 水杯类
// @class
class Cups {
  
  // @new
  // @params {class} crate
  // @params {object} data
  constructor (crate, data) {
    Object.assign(this, data)
    this.crate = crate
  }
  
  // 获取水杯信息
  // @public
  async cupLink () {
    return await this.crate.mongo.Cups.findOne({
      _id: this.cup
    })
  }
  
  // 获取水杯喝水信息
  // @public
  async waters () {
    return await this.crate.mongo.CupWaters.find({
      cup: this.cup
    }).toArray()
  }
}


// 用户类
// @class
class User {
  
  // @new
  // @params {class} crate
  // @params {object} data
  constructor (crate, data) {
    Object.assign(this, data)
    this.crate = crate
  }
  
  // 获取用户水杯列表
  // @public
  async cups () {
    return (await this.crate.mongo.UserCups.find({
      user: this._id
    }).toArray()).map(value => {
      new Cups(this.crate, value)
    })
  }
  
  // 获取用户水滴
  // @public
  async water () {
    return this.crate.mongo.Water.findOne({
      user: this._id
    })
  }
}


// 用户
// @class
module.exports = class {
  
  // @new
  // @params {class} crate
  constructor (crate) {
    let schema_file = path.join(__dirname, "schema.gql")
    this.template = fs.readFileSync(schema_file, "utf8")
    this.crate = crate
  }
  
  // 获取单个用户
  // @params {string} [id]
  // @returns {object}
  // @public
  async user ({ id }) {
    return new User(this.crate, await this.crate.mongo.User.findOne({ 
      _id: this.crate.util.createHexId(id)
    }))
  }
  
  // 获取用户列表
  // @params {object} [match]
  // @params {number} skip
  // @params {number} limit
  // @returns {array}
  // @public
  async users ({ match = {}, skip = 0, limit = 20 }) {
    return (await this.crate.mongo.User.aggregate([
      { $match: match },
      { $skip: skip },
      { $limit: limit }
    ]).toArray()).map(value => {
      return new User(this.crate, value)
    })
  }
  
  // 设置用户信息
  // @params {string} [id]
  // @params {object} [body]
  // @returns {boolean}
  // @public
  async setUser ({ id, body = {} }) {
    return (await this.crate.mongo.User.updateOne({
      _id: this.crate.util.createHexId(id)
    }, { $set: body }).result.n === 1)
  }
}