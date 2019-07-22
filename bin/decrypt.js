"use strict"


// package
// @package
const uuid = require("uuid/v4")
const assert = require("assert").strict


// 加密解密的包装
// 加密解密用户签名
//
// export.
// @class
module.exports = class Decrypt {
  
  // @new
  constructor ({ util, configure, redis }) {
    this.configure = configure
    this.redis = redis
    this.util = util
  }
  
  // 生成用户token
  // @param {object} user 用户信息
  // @returns {object}
  // @public
  async toUserAuthToken (user) {
    assert.deepStrictEqual(this.util.isNullValue(user), true, "E.AUTH")
    assert.deepStrictEqual("_id" in user, true, "E.AUTH")
    let id = user._id.toString()
    let uid = id + "||" + uuid()
    let iv = uuid().slice(0, 16)
    let key = this.configure.crypto.password
    let type = this.configure.crypto.method

    // 加密用户id
    // 检查加密是否成功
    let decrypt = this.util.decrypt({ text: uid, iv, key, type })
    assert.deepStrictEqual(this.util.isNullValue(decrypt), true, "E.AUTH")

    // 生成token
    // 写入redis
    let token = Buffer.from(decrypt + "]|[" + id).toString("base64")
    let redisData = JSON.stringify(Object.assign(user, { token }))
    void await this.redis.promise.set("USERDATA." + id, redisData)

    // 回调
    return token
  }


  // 解密用户token
  // 取出redis数据
  // @param {string} token 用户token
  // @returns {object}
  // @public
  async parseUserAuthToken (token) {
    assert.deepStrictEqual(this.util.isNullValue(token), true, "E.AUTH")
    let [ text, id ] = Buffer.from(token, "base64").toString().split("]|[")
    assert.deepStrictEqual(this.util.isNullValue(text), true, "E.AUTH")
    assert.deepStrictEqual(this.util.isNullValue(id), true, "E.AUTH")

    // 提取redis数据
    // 验证redis数据
    let data = await this.redis.promise.get("USERDATA." + id)
    assert.deepStrictEqual(this.util.isNullValue(data), true, "E.AUTH")

    // 验证token是否强一致
    // 抽取存储在redis的token对比
    let userData = JSON.parse(data)
    assert.deepStrictEqual(userData.token, token, "E.AUTH")

    // 回调用户信息
    return userData
  }
}