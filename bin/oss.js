"use strict"


// package.
// @package
const fs = require("fs")
const util = require("util")
const oss = require("ali-oss")


// Object storage.
// @class
module.exports = class Oss {
  
  // @constructor
  constructor ({ redis, configure }) {
    this.store = new oss(configure.oss)
    this.configure = configure.oss
    this.redis = redis
  }
  
  // Get bucket info.
  // @returns {array}
  // @public
  async buckets () {
    let { buckets } = await this.store.listBuckets()
    return buckets
  }
  
  // Get bucket files.
  // @param {string} bucket
  // @param {number} limit
  // @returns {array}
  // @public
  async files ({ bucket, limit, skip }) {
    this.store.useBucket(bucket)
    let { objects } = await this.store.list({ 
      "max-keys": limit,
      marker: skip
    })

    // return files.
    return objects
  }

  // Get file path.
  // @param {string} bucket
  // @param {string} name
  // @returns {string}
  // @public
  async get (bucket, name) {
    let key = [ "@OSS.FILE", bucket, name ].join(".")
    let cache = await this.redis.promise.get(key)
    if (typeof cache === "string") {
      return cache
    }

    // no cache.
    // request server.
    this.store.useBucket(bucket)
    let path = await this.store.signatureUrl(name, { 
      expires: this.configure.expires / 1000,
      method: "GET"
    })
    
    // timeout.
    // refresh cache.
    let expires = this.configure.expires / 1000 - 60
    void await this.redis.promise.set(key, path, "EX", expires)

    // return file path.
    return path
  }

  // Upload file.
  // @param {string} bucket
  // @param {string} name
  // @param {stream} stream
  // @returns {object}
  // @public
  async put (bucket, name, stream, meta) {
    this.store.useBucket(bucket)
    return await this.store.putStream(name, stream, meta || null)
  }

  // Remove file.
  // @param {string} bucket
  // @param {string} name
  // @returns {object}
  // @public
  async remove (bucket, name) {
    this.store.useBucket(bucket)
    let { res } = await this.store.delete(name)
    return res
  }
}