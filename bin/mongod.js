"use strict"


// package
// @package
const MongoDB = require("mongodb")
const util = require("util")


// 全局常量
// 默认连接配置
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
  
  // @new
  constructor ({ configure: { mongo } }) {
    this.self = MongoDB
    this._from(mongo)
    this._Cos = {}
  }
  
  // 设置表
  // @params {string} key
  // @private
  _setProxy (key) {
    let _db = this._mongod.db(this._db)
    this._Cos[key] = _db.collection(key)
  }
  
  // 事务
  // @params {function} process
  // @public
  Transfer (process) {
    return new Promise((reslove, reject) => {
      let _session = this._mongod.startSession()
      _session.startTransaction()
      process(_session)
        .then(reslove)
        .catch(err => {
          void await _session.abortTransaction()
          _session.endSession()
          reject(err)
      })
    })
  }
  
  // 获取句柄
  // @public
  get Cos () {
    
    // 检查代理
    // 是否初始化
    // 初始化代理
    // 绑定表
    if (!this._proxy) {
      this._proxy = new Proxy(this._Cos, {
        get: (promise, key) => {
          !promise[key] && this._setProxy(key)
          return promise[key]
        }
      })
    }
    
    // 返回代理实例
    return this._proxy
  }
  
  // 连接数据库
  // @params {Option} .. 配置
  // @private
  _from ({ host, port, db, options, auth }) {
    let temp = auth ? "mongodb://%s:%s@%s:%s/%s" : "mongodb://%s:%s/%s"
    let args = auth ? [ auth.username, auth.password, host, port, db ] : [ host, port, db ]
    this.self.MongoClient.connect(util.format(temp, ...args), options || DEFAULT_OPT).then(mongod => {
      this._mongod = mongod
      this._db = db
    })
  }
}