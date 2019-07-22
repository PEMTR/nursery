"use strict"


// package
// @package
const fs = require("fs")
const { buildSchema } = require("graphql")
const template = fs.readFileSync(__dirname + "/schema", "utf8")


class User {
  constructor (crate, data) {
    this.crate = crate
    Object.assign(this, data)
  }
  
  async cups () {
    return await this.crate.mongo.UserCups.find({
      user: this._id
    }).toArray()
  }
}


// 用户
// @class
module.exports = class {
  
  // @new
  constructor (crate) {
    this.crate = crate
  }
  
  // 获取
  // @public
  get () {
    return {
      graphiql: true,
      schema: buildSchema(template),
      rootValue: {
        user: async ({ id }) => {
          let _id = this.crate.util.createHexId(id)
          return new User(this.crate, await this.crate.mongo.User.findOne({ _id }))
        },
        users: async ({ match = {}, skip = 0, limit = 20 }) => {
          return (await this.crate.mongo.User.aggregate([
            { $match: match },
            { $skip: skip },
            { $limit: limit }
          ]).toArray()).map(value => {
            return new User(this.crate, value)
          })
        }
      }
    }
  }
}