"use strict"


// package
// @package
const MongoDB = require("mongodb")
const util = require("util")


// 全局常量
const DEFAULT_OPT = {
  poolSize: 10,
  ssl: false,
  noDelay: true,
  keepAlive: true,
  useNewUrlParser: true
}


// MongoDB
// @class
module.exports = class Mongod {
  
  // @interface
  // type interface Option {
  //   host: String, 数据库链接地址
  //   port: Number, 端口
  //   db: String, 数据库
  //   collections: Array<String>, 数据库表
  //   options?: Object, 选项
  //   auth?: {
  //     username: String, 用户名
  //     password: String 密码
  //   }
  // }
  
  // @new
  constructor ({ configure: { mongo } }) {
    this.self = MongoDB
    this._from(mongo)
    this.Cos = {}
  }
  
  // 连接数据库
  // @params {Option} .. 配置
  // @private
  _from ({ host, port, db, collections, options, auth }) {
    let temp = auth ? "mongodb://%s:%s@%s:%s/%s" : "mongodb://%s:%s/%s"
    let args = auth ? [ auth.username, auth.password, host, port, db ] : [ host, port, db ]
    this.self.MongoClient.connect(util.format(temp, ...args), options || DEFAULT_OPT).then(mongod => {
      collections.forEach(element => {
        this.Cos[element] = mongod.db(db).collection(element)
      })
    })
  }
}