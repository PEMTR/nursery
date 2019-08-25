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
  useNewUrlParser: true,
  useUnifiedTopology: true
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
    this._mongod = null
    this._from(mongo)
    this._Cos = {}
  }
  
  // 设置表
  // @params {string} key 表名
  // @private
  _setProxy (key) {
    let _db = this._mongod.db(this._db)
    this._Cos[key] = _db.collection(key)
  }
  
  // 等待连接完成
  // @private
  _awitConn () {
    return new Promise((resolve, _) => {
      let _loop = setInterval(_ => {
        if (this._mongod !== null) {
          clearInterval(_loop)
          resolve()
        }
      }, 500)
    })
  }
  
  // 连接数据库
  // @params {string} [host] 域名或者地址
  // @params {number} [port] 端口
  // @params {string} [db] 数据库
  // @params {object} [options] 选项
  // @params {object} [auth] 认证
  // @params {string} [auth.username] 用户名
  // @params {string} [auth.password] 密码
  // @private
  _from ({ host, port, db, options, auth }) {
    let _temp = auth ? "mongodb://%s:%s@%s:%s/%s" : "mongodb://%s:%s/%s"
    let _args = auth ? [ auth.username, auth.password, host, port, db ] : [ host, port, db ]
    let _opts = [ util.format(_temp, ..._args), options || DEFAULT_OPT ]
    this.self.MongoClient.connect(..._opts).then(mongod => {
      this._mongod = mongod
      this._db = db
      
      // 错误事件
      // 事件报告
      // 重连
      mongod.on("error", (...args) => {
        this._events.emit("error", ...args)
        this._from({ host, port, db, options, auth })
      })
    })
  }
  
  // 监听
  // @params {string} event 事件
  // @params {function} process 回调
  // @return {Promise<void>}
  // @public
  async Watch (event, process) {
    void await this._awitConn()
    this._mongod.db(this._db).watch().on(event, process)
  }
  
  // 事务
  // @params {async function} process 处理函数
  // @return {Promise<object>}
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
  
  // 等待
  // @return {Promise<this>}
  // @public
  async ready () {
    void await this._awitConn()
  }
  
  // 关闭
  // @public
  close () {
    this._mongod.close()
  }
  
  // 获取句柄
  // @return {Proxy<class>}
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
  
  // 监听事件
  // @params {string} event 事件
  // @params {function} process 回调
  // @return {void}
  // @public
  on (event, process) {
    this._events.on(event, process)
  }
}