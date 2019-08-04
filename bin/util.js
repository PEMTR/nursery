"use strict"


// package
// @package
const fs = require("fs")
const url = require("url")
const path = require("path")
const mongodb = require("mongodb")
const assert = require("assert").strict
const crypto = require("crypto")
const toml = require("toml")


// 加载配置文件
// @param {string} path 路径
// @returns {object}
// @public
exports.readtoml = function (path) {
  return toml.parse(fs.readFileSync(path))
}

  
// 计算MD5
// @param {string} str 要计算的字符串
// @returns {string}
// @public
exports.md5 = function (str) {
  return crypto.createHash("md5").update(str).digest("hex")
}


// HMAC SHA256
// @param {string} key 密钥
// @param {string} toSign 待摘要数据
// @returns {String}
// @public
exports.hmacSHA256 = function (key, toSign) {
  let crypted = crypto.createHmac("sha256", key.toString())
  let hex = crypted.update(toSign).digest("hex")
  return Buffer.from(hex).toString("base64")
}


// 加密
// @param {object} options 配置
// @param {string} [options.text] 明文
// @param {string} [options.key] 密钥
// @param {string} [options.type] 加密算法
// @param {string} [options.iv] 初始化向量
// @returns {string}
// @public
exports.decrypt = function (options) {
  let { text, iv, type, key } = options
  let cipher = crypto.createCipheriv(type, key, iv)
  let crypted = cipher.update(text, "utf8", "hex")
  crypted += cipher.final("hex")
  return crypted
}


// 解密
// @param {object} options 配置
// @param {String} [options.text] 密文
// @param {String} [options.key] 密钥
// @param {String} [options.type] 加密算法
// @param {String} [options.iv] 初始化向量
// @returns {string}
// @public
exports.encrypt = function (options) {
  let { text, iv, type, key } = options
  let decipher = crypto.createDecipheriv(type, key, iv)
  let dec = decipher.update(text, "hex", "utf8")
  dec += decipher.final("utf8")
  return dec
}


// 判断是否为IP地址
// @param {string} ip ip地址
// @returns {boolean}
// @public
exports.isValidIP = function (ip) {
  let reg = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
  return reg.test(ip)
}


// 判断是否为ObjectId
// @param {any} id
// @returns {boolean}
// @public
exports.isValidOID = function (id) {
  return mongodb.ObjectID.isValid(id)
}


// 判断是否超时
// @param {number} date
// @param {number} fdate
// @returns {boolean}
// @public
exports.timeout = function (date, fdate) {
  return date >= (Date.now() - fdate)
}


// 转ObjectId
// @param {string} id
// @returns {object}
// @public
exports.createHexId = function (id) {
  return mongodb.ObjectID.createFromHexString(id)
}


// 判断是否为NULL
// @param {(string|object|boolean|array)} value 判断值
// @returns {boolean}
// @public
exports.isNullValue = function (value) {
  return (value !== null && value !== undefined)
}


// 判断是否手机号码
// @param {string} phone 手机号
// @returns {boolean}
// @public
exports.isPoneAvailable = function (phone) {
  let reg = /^[1][3,4,5,7,8][0-9]{9}$/
  return reg.test(phone)
}


// 判断是否为邮箱
// @param {string} eamil
// @returns {boolean}
// @public
exports.isEmail = function (email) {
  let reg = /^[A-Za-z\\d]+([-_.][A-Za-z\\d]+)*@([A-Za-z\\d]+[-.])+[A-Za-z\\d]{2,4}$/
  return reg.test(email)
}


// 下载文件
// @param {string} uri 地址
// @param {string} pathname 下载根目录
// @param {string} filename 文件名
// @returns {Promise}
// @public
exports.downloadFile = function (uri, pathname, name) {
  const filename = name || path.parse(url.parse(uri).path).base
  const dir = addon.downloadFile(uri,  path.join(pathname, filename))
  return { dir, filename }
}


// 对象数组展平
// @param {object} data 待转换对象
// @returns {Object}
// @public
exports.unwind = function (data) {
  for (let v in data) data[v] = data[v][0]
  return data
}


// 翻页参数过滤
// @param {any} [query.page] 页号
// @param {any} [query.limit] 限制
// @returns {object}
// @public
exports.pagination = function ({ page = "1", limit = "10" }) {
  page = Number(page), limit = Number(limit)
  return { skip: (page - 1) * limit, limit }
}


// 参数保证
// @params {any} arg
// @params {string} err
// @public
exports.promise = function (arg, err) {
  assert.deepStrictEqual(arg !== null && arg !== undefined, true, err)
  return arg
}


// 线程沉睡
// @params {number} timeout
// @public
exports.sleep = function (timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}


// 正整数检查
// @params {number} number
// @public
exports.Integer = function (number) {
  let number_str = String(number)
  return !number_str.includes(".") && !number_str.includes("-")
}

// 重试函数
// @params {number} int
// @params {function} process
// @public
exports.Retry = async function (int, process) {
  let _number = 0
  let _err = null
  
  // 循环指定阈值
  while (_number < int) {
    try {
      
      // 尝试运行函数
      // 成功回调并结束循环
      return await process(_number)
    } catch (err) {
      _number += 1
      _err = err
    }
  }
  
  // 到达阈值不成功
  // 抛出错误
  throw _err
}