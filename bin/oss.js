"use strict"


// package.
// @package
const fs = require("fs")
const util = require("util")
const oss = require("ali-oss")


// 对象存储类
// @param {object} configure
// @param {class} multer
// @param {class} redis
// @class
function Oss ({ redis, multer, configure }) {
  this.store = new oss(configure.oss)
  this.configure = configure.oss
  this.multer = multer
  this.redis = redis
}


// 获取bucket
// @returns {array}
// @public
Oss.prototype.buckets = async function () {
  let { buckets } = await this.store.listBuckets()
  return buckets
}


// 获取文件列表
// 指定bucket
// @param {string} bucket
// @param {number} limit
// @returns {array}
// @public
Oss.prototype.files = async function ({ bucket, limit, skip }) {
  this.store.useBucket(bucket)
  let { objects } = await this.store.list({ 
    "max-keys": limit,
    marker: skip
  })

  // 返回文件列表
  return objects
}


// 获取文件地址
// @param {string} bucket
// @param {string} name
// @returns {string}
// @public
Oss.prototype.get = async function (bucket, name) {
  let key = [ "@OSS.FILE", bucket, name ].join(".")
  let cache = await this.redis.promise.get(key)
  if (typeof cache === "string") {
    return cache
  }

  // 没有缓存
  // 请求服务器
  this.store.useBucket(bucket)
  let path = await this.store.signatureUrl(name, { 
    expires: this.configure.expires / 1000,
    method: "GET"
  })

  // 刷新缓存
  // 过期时间
  let expires = this.configure.expires / 1000 - 60
  void await this.redis.promise.set(key, path, "EX", expires)

  // 返回
  return path
}


// 上传文件
// @param {string} bucket
// @param {string} name
// @param {stream} stream
// @returns {object}
// @public
Oss.prototype.put = async function (bucket, name, stream, meta) {
  this.store.useBucket(bucket)
  return await this.store.putStream(name, stream, meta || null)
}


// 删除文件
// @param {string} bucket
// @param {string} name
// @returns {object}
// @public
Oss.prototype.remove = async function (bucket, name) {
  this.store.useBucket(bucket)
  let { res } = await this.store.delete(name)
  return res
}


// multer
// @param {string} bucket
// @param {string} name
// @param {string} filename
// @returns {string}
// @public
Oss.prototype.multers = async function (bucket, name, filename) {
  let unlink = util.promisify(fs.unlink)
  let stream = fs.createReadStream(filename)
  void await this.put(bucket, name, stream)
  void await unlink(filename)
  return name
}


// export
module.exports = Oss