"use strict"


/**
 * package.
 * @package
 */
const MongoDB = require("mongodb")


/**
 * 全局模式
 * @private
 */
const Methods = {
  back: {  "updateOne": "updateOne", "updateMany": "updateMany", "insertOne": "deleteOne", "insertMany": "deleteMany", "deleteOne": "insertOne", "deleteMany": "insertMany" },
  method: [ "find", "findOne", "aggregate", "updateOne", "updateMany", "insertOne", "insertMany", "deleteOne", "deleteMany" ],
  write: [ "updateOne", "updateMany", "deleteOne", "deleteMany", "insertOne", "insertMany" ],
  unwind: [ "aggregate", "insertMany", "deleteMany", "updateMany" ],
  query: [ "updateOne", "updateMany", "deleteOne", "deleteMany" ],
  cursor: [ "next", "toArray" ],
  match: [ "if", "assert" ]
}


/**
 * 数据库处理类
 * @param {class} mongo
 * @class
 */
function Retryable ({ mongo }) {
  this.mongo = mongo
  this.Methods = Methods
}


/**
 * 数据库事务类
 * @param {class} mongo
 * @param {string} mark
 * @class
 */
function Transactions ({ mongo, mark }) {
  this.mark = mark || "@."
  this.Methods = Methods
  this.Retryable = new Retryable({ mongo })
}


/**
 * 数据库操作
 * @param {string} collection
 * @param {string} method
 * @param {object||array} args
 * @param {string} cursor
 * @returns {any}
 * @public
 */
Retryable.prototype.handle = async function (collection, method, args, cursor) {
  let session = {
    main: { collection, method, args, cursor },    // 命令缓存
    data: null,                                    // 结果
    record: null                                   // 缓存数据
  }

  // 非参数数组
  // 转为参数数组
  if (!Array.isArray(args)) {
    args = [ args ]
  }

  // 先查询条件
  if (this.Methods.query.includes(method)) {
    session.record = await this.query(collection, "find", args[0], "toArray")
  }

  // 执行真正的操作
  session.data = await this.query(collection, method, args, cursor)

  // 过滤单写
  if (method === "insertOne") {
    const _id = session.data.insertedId
    session.record = Object.assign(args[0], { _id })
  }

  // 过滤多写
  if (method === "insertMany") {
    session.record = []
    for (let i = 0; i < args.length; i ++) {
      const _id = session.data.insertedIds[i]
      session.record.push(Object.assign(args[i], { _id }))
    }
  }

  // 返回
  return session
}


/**
 * 回写队列
 * @param {array} session
 * @returns {array}
 * @public
 */
Retryable.prototype.backWrite = async function (session) {
  for (let i = session.length - 1; i >= 0; i --) {
    const { main, record } = session[i]
    
    // 检查是否需要回写
    if (main.method in this.Methods.back) {

      // 执行回写操作
      const backMethod = this.Methods.back[main.method]
      const topology = await this.query(main.collection, backMethod, record)

      // 检查回写是否成功
      if (topology.result.ok !== 1) {

        // 返回错误
        throw "BULKWRITE_ERROR"
        break
      }
    }
  }

  // 回写正确
  // 返回
  return {
    backWrite: session.length
  }
}


/**
 * 查询数据库
 * @param {string} collection
 * @param {string} method
 * @param {object||array} args
 * @param {string} cursor
 * @returns {any}
 * @private
 */
Retryable.prototype.query = async function (collection, method, args, cursor) {
  if (this.Methods.unwind.includes(method)) {
    args = [ args ]
  }

  // 防守检查
  // 如果非参数组
  // 转为参数组
  if (!Array.isArray(args)) {
    args = [ args ]
  }

  // 查询
  // 检查游标
  const topology = this.mongo[collection][method](...args)
  if (cursor && this.Methods.cursor.includes(cursor)) {

    // 处理游标
    // 需要游标处理
    return await topology[cursor]()
  } else {
     
    // 直接返回拓朴
    return await topology
  }
}


/**
 * 取值
 * @param {any} value
 * @returns {any}
 * @private
 */
Transactions.prototype.matchValue = function (value, bulkLoop, env) {
  if (typeof value !== "string") {
    return value
  }

  // 是非为外部变量
  if (value.startsWith("<(") && value.endsWith(")>")) {
    // 拆分变量和类型
    let [ 
      variable, 
      type 
    ] = value.replace(/\s/g, "").split("<(")[1].split(")>")[0].split(":")

    // 检查变量是否包含
    if (!(variable in env)) {
      throw "REDERENCE_ERROR"
    }

    // 过滤NaN
    if (type === "number") {
      if (!isNaN(env[variable])) {
        return env[variable]
      } else {
        throw "REDERENCE_ERROR"
      }
    }

    // 过滤数组类型
    if (type === "array") {
      if (Array.isArray(env[variable])) {
        return env[variable]
      } else {
        throw "REDERENCE_ERROR"
      }
    }

    // 检查类型
    if (typeof env[variable] === type) {
      return env[variable]
    } else {
      throw "REDERENCE_ERROR"
    }
  }

  // 是否为索引
  // 转换为索引对象
  if (value.startsWith("ObjectId.")) {
    const hexId = value.split("ObjectId.")[1]
    return MongoDB.ObjectID.createFromHexString(hexId)
  } 

  // 检查表达式匹配
  if (!value.startsWith(this.mark)) {
    return value
  }

  // 解析头
  let session = Object.create(bulkLoop)
  const key = value.split(this.mark, 2)[1]
  const keys = key.split(".")
  
  // 循环更新链
  for (const method of keys) {
    // 检查有值
    if (method in session) {

      // 更新链
      session = session[method]
    } else {

      // 链中断
      // 报错
      throw "REDERENCE_ERROR"
      break
    }
  }

  // 返回链尾
  return session
  
}


/**
 * 解析JSON
 * @param {any} data
 * @returns {object}
 * @private
 */
Transactions.prototype.parse = function (data, bulkLoop, env) {
  if (typeof data === "string") {
    // 匹配到字符串
    // 直接交给值处理
    return this.matchValue(data, bulkLoop, env)
  }

  // JSON解析
  // 返回解析结果
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (value === null || value === undefined) {
      return value
    }

    // 修复BUG
    // JSON.stringify返回对象的时候会把索引的类型丢失
    // 暂时添加循环一遍对象
    // 如果找到索引
    // 先提前转为内部类型
    if (typeof value === "object") {
      for (let key of Object.keys(value)) {
        if (typeof value[key] === "string" || typeof value[key] === "object") {
          if (MongoDB.ObjectID.isValid(value[key])) {
            value[key] = "ObjectId." + value[key].toString()
          }
        }
      }
    }

    // 解决索引转为字符串的时候会丢失的问题
    // 转为内部通用格式
    // 转出自动转类型
    if (typeof value === "object") {
      if (typeof value[key] === "string" || typeof value[key] === "object") {
        if (MongoDB.ObjectID.isValid(value)) {
          return "ObjectId." + value.toString()
        }
      }
    }
    
    // 返回原值
    return value
  }), (key, value) => {
    const values = this.matchValue(value, bulkLoop, env)
    return values
  })
}


/**
 * 判断方法
 * @param {class} handle
 * @param {any} bool 
 * @param {object} thens 
 * @param {object} elses
 * @returns {object}
 * @private
 */
Transactions.prototype.judge = function (bool, thens, elses, bulkLoop, env) {
  if (typeof bool === "boolean") {
    return this.parse(bool ? thens : elses, bulkLoop, env)
  } else {

    // 不是boolean类型
    // 检查是否为字符串
    if (typeof bool === "string") {

      // 处理值
      // 检查值
      // 返回处理值
      const bools = this.matchValue(bool, bulkLoop, env)
      return this.parse(bools !== bool && bools ? thens : elses, bulkLoop, env)
    } else {

      // 返回错误
      throw "IF_ERROR"
    }
  }
}


/**
 * 断言值过滤
 * @param {any} ref
 * @returns {boolean}
 * @private
 */
Transactions.prototype.assertMatch = function (refce, bulkLoop, env) {
  if (typeof refce === "boolean") {
    return refce
  }

  // 过滤其他表达式
  if (typeof refce === "string") {
    return refce.startsWith(this.mark) ? this.matchValue(refce, bulkLoop, env) : refce
  } else {
    const key = Object.keys(refce)[0]
    const value = refce[key]
    const valud = this.matchValue(value, bulkLoop, env)

    // 是否为null
    if (key === "@.isNull") {
      return valud !== undefined && valud !== null
    }

    // 类型判断
    if (key === "@.typeof") {
      return typeof valud
    }
  }
}


/**
 * 断言方法
 * @param {class} handle
 * @param {array} expecteds
 * @returns {object}
 * @private
 */
Transactions.prototype.assert = function (asserts, bulkLoop, env) {
  for (const { 
    actual,         // 对比条件
    expected,       // 对比条件
    message         // 错误码
  } of asserts) {
    const actuals = this.assertMatch(actual, bulkLoop, env)
    const expecteds = this.assertMatch(expected, bulkLoop, env)
    
    // 对比
    if (actuals !== expecteds) {
      throw message || "ASSERT_ERROR"
      break
    }
  }

  // 返回正确
  return "@_.assert.true"
}


/**
 * 过滤表达式
 * @param {string} keys
 * @param {object} data
 * @param {object} bulkLoop
 * @private
 */
Transactions.prototype.reference = function (keys, data, bulkLoop, env) {
  if (keys === this.mark + "assert") {
    return this.assert(data, bulkLoop, env)
  }

  // 匹配判断
  const key = Object.keys(data)[0]
  if (key === this.mark + "if") {
    const mods = data[key]
    return this.judge(mods.bool, mods.then, mods.else, bulkLoop, env)
  }

  // 尾部匹配
  return false
}


/**
 * 队列
 * @param {array} bulk
 * @param {array} bulk
 * @returns {array}
 * @public
 */
Transactions.prototype.bulkWrite = async function (bulk, env) {
  let bulkLoop = {}
  let session = []

  // 文本转换
  if (typeof bulk === "string") {
    bulk = JSON.parse(bulk)
  }

  // 循环队列
  for (const step of bulk) {
    let key = Object.keys(step)[0]
    let value = step[key]

    // 过滤表达式
    const bool = this.reference(key, value, bulkLoop, env)

    // 检查表达式过滤结果
    if (bool) {

      // 需要跳过
      if (bool === "@_.assert.true") {
        continue
      } else {

        // 修改为过滤后的结果
        value = bool
      }
    }

    // 结构命令
    // 解析值
    // 数据库处理
    let { 
      collection,    // 表
      method,        // CRUD方法
      args,          // 参数列表
      cursor         // 游标
    } = value
    const scalar = this.parse(args, bulkLoop, env)   
    const backr = await this.Retryable.handle(collection, method, scalar, cursor)
    bulkLoop[key] = backr.data

  // 检查是否处理成功
    if (this.Methods.write.includes(method)) {
      if ( backr.data.result.ok === 1) {

        // 添加进缓存
        session.push(backr)
      } else {
        
        // 错误写入
        // 进入回写
        return await this.Retryable.backWrite(session)
        break
      }
    } else {

      // 添加返回数据
      session.push(backr)
    }
  }

  // 清理缓存
  // 返回结果
  this.session = []
  return bulkLoop
}


/**
 * 导出类
 * @public
 */
module.exports = Transactions