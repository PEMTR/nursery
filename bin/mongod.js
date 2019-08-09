"use strict"


// package
// @package
const MongoDB = require("mongodb")
const events = require("events")
const util = require("util")


// 常量
// 默认连接配置
const DEFAULT_OPT = {
  poolSize: 10,
  ssl: false,
  noDelay: true,
  keepAlive: true,
  useNewUrlParser: true
}


// 常量
// 默认事务级别
const TRANSFER_CONF = {
  readConcern: { level: "snapshot" },
  writeConcern: { w: "majority" },
  readPreference: "primary"
}


// MongoDB
// @class
module.exports = class Mongod {
  
  // @new
  constructor ({ configure: { mongo } }) {
    this._events = new events.EventEmitter()
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
  async Transfer (process) {
    let _session = this._mongod.startSession(TRANSFER_CONF) // 初始化事务
    _session.startTransaction() // 初始化交易
    try {

      // 传递事务句柄
      // 运行事务
      // 提交事务
      // 返回回调结果
      let _result = await process(_session)
      void await _session.commitTransaction();
      _session.endSession()
      return _result
    } catch (err) {
      
      // 事件报告
      // 事务错误
      this._events.emit("error.transfer", {
        error: err
      })

      // 事务错误
      // 关闭事务
      // 关闭交易
      // 返回错误
      void await _session.abortTransaction()
      _session.endSession()
      throw err
    }
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
  // @params {string} [host]
  // @params {number} [port]
  // @params {string} [db]
  // @params {object} [options]
  // @params {object} [auth]
  // @params {string} [auth.username]
  // @params {string} [auth.password]
  // @private
  _from ({ host, port, db, options, auth }) {
    let _temp = auth ? "mongodb://%s:%s@%s:%s/%s" : "mongodb://%s:%s/%s"
    let _args = auth ? [ auth.username, auth.password, host, port, db ] : [ host, port, db ]
    this.self.MongoClient.connect(util.format(_temp, ..._args), options || DEFAULT_OPT).then(mongod => {
      this._mongod = mongod
      this._db = db
      
      // 错误事件
      // 事件报告
      mongod.on("error", (...args) => {
        this._events.emit("error", ...args)
      })
    })
  }
  
  // 监听事件
  // @params {string} event
  // @params {function} process
  // @public
  on (event, process) {
    this._events.on(event, process)
  }
}