"use strict"


// package
// @package
const MongoDB = require("mongodb")


// 全局常量
const DEFAULT_OPT = {
  poolSize: 10,
  ssl: false,
  noDelay: true,
  keepAlive: true,
  useNewUrlParser: true
}


// <超级类>
// @class
class Mongod extends MongoDB {
  
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
  // @params {Option} options 配置
  constructor (options) {
    this.Cos = {}
    this._default_from(options)
  }
  
  // 连接数据库
  // @params {Option} .. 配置
  // @private
  _default_from ({ host, port, db, collections, options, auth }) {
    let temp = auth ? "mongodb://%s:%s@%s:%s/%s" : "mongodb://%s:%s/%s"
    let args = auth ? [ auth.username, auth.password, host, port, db ] : [ host, port, db ]
    this.MongoClient.connect(util.format(temp, ...args), options || DEFAULT_OPT).then(mongod => {
      this.Cos = collections.map(element => mongod.db(db).collection(element))
    })
  }
}