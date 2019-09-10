"use strict"


// package
// @package
const MongoDB = require("mongodb")
const events = require("events")
const util = require("util")


// @const
// Default connection configuration.
const DEFAULT_OPT = {
  poolSize: 10,
  ssl: false,
  noDelay: true,
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}


// @const
// Default transaction level.
const TRANSFER_CONF = {
  readConcern: { level: "snapshot" },
  writeConcern: { w: "majority" },
  readPreference: "primary"
}


// MongoDB
// @class
module.exports = class Mongod {
  
  // @constructor
  constructor ({ configure: { mongo } }) {
    this._events = new events.EventEmitter()
    this.self = MongoDB
    this._mongod = null
    this._from(mongo)
    this._Cos = {}
  }
  
  // Setting up documentation.
  // @params {string} key Documentation name.
  // @private
  _setProxy (key) {
    let _db = this._mongod.db(this._db)
    this._Cos[key] = _db.collection(key)
  }
  
  // Wait for the connection to complete.
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
  
  // Connect to the database.
  // @params {string} [host] Domain name or address.
  // @params {number} [port] Port.
  // @params {string} [db] Database.
  // @params {object} [options]
  // @params {object} [auth] Authentication.
  // @params {string} [auth.username]
  // @params {string} [auth.password]
  // @private
  _from ({ host, port, db, options, auth }) {
    let _temp = auth ? "mongodb://%s:%s@%s:%s/%s" : "mongodb://%s:%s/%s"
    let _args = auth ? [ auth.username, auth.password, host, port, db ] : [ host, port, db ]
    let _opts = [ util.format(_temp, ..._args), options || DEFAULT_OPT ]
    this.self.MongoClient.connect(..._opts).then(mongod => {
      this._mongod = mongod
      this._db = db
      
      // error event.
      // event report.
      // reconnection.
      mongod.on("error", (...args) => {
        this._events.emit("error", ...args)
        this._from({ host, port, db, options, auth })
      })
    })
  }
  
  // Listen for database data changes.
  // @params {string} event
  // @params {function} process Callback.
  // @return {Promise<void>}
  // @public
  async Watch (event, process) {
    void await this._awitConn()
    this._mongod.db(this._db).watch().on(event, process)
  }
  
  // Transaction.
  // @params {async function} process Transaction function.
  // @return {Promise<object>}
  // @public
  async Transfer (process) {
    let _session = this._mongod.startSession(TRANSFER_CONF) // Initialize session.
    _session.startTransaction() // Initialize transaction.
    try {

      // pass transaction handle.
      // running a transaction.
      // submit transaction.
      // return callback result.
      let _result = await process(_session)
      void await _session.commitTransaction();
      _session.endSession()
      return _result
    } catch (err) {
      
      // event report.
      // transaction error.
      this._events.emit("error.transfer", {
        error: err
      })

      // transaction error.
      // close transaction.
      // close session.
      // return error.
      void await _session.abortTransaction()
      _session.endSession()
      throw err
    }
  }
  
  // Wait.
  // @return {Promise<this>}
  // @public
  async ready () {
    void await this._awitConn()
  }
  
  // Close.
  // @public
  close () {
    this._mongod.close()
  }
  
  // Get handle.
  // @return {Proxy<class>}
  // @public
  get Cos () {
    
    // check if the proxy is initialized.
    // Initialize the proxy and bind the document.
    if (!this._proxy) {
      this._proxy = new Proxy(this._Cos, {
        get: (promise, key) => {
          !promise[key] && this._setProxy(key)
          return promise[key]
        }
      })
    }
    
    // return proxy instance.
    return this._proxy
  }
  
  // Listening event.
  // @params {string} event
  // @params {function} process
  // @return {void}
  // @public
  on (event, process) {
    this._events.on(event, process)
  }
}