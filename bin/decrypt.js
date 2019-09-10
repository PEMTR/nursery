"use strict"


// package
// @package
const uuid = require("uuid/v4")
const assert = require("assert").strict


// Encrypted and decrypted package.
// Encrypt and decrypt user signature.
// @class
module.exports = class Decrypt {
  
  // @constructor
  constructor ({ util, configure, redis }) {
    this.configure = configure
    this.redis = redis
    this.util = util
  }
  
  // Generate user token.
  // @param {object} user User info.
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

    // encrypt user id.
    // check if the encryption is successful.
    let decrypt = this.util.decrypt({ text: uid, iv, key, type })
    assert.deepStrictEqual(this.util.isNullValue(decrypt), true, "E.AUTH")

    // generate token.
    // write redis.
    let token = Buffer.from(decrypt + " " + id).toString("base64")
    let redisData = JSON.stringify({ token, ...user })
    void await this.redis.promise.set("USERDATA." + id, redisData)

    // return Token.
    return token
  }

  // Decrypt user token.
  // Get redis data.
  // @param {string} token User token.
  // @returns {object}
  // @public
  async parseUserAuthToken (token) {
    assert.deepStrictEqual(this.util.isNullValue(token), true, "E.AUTH")
    let [ text, id ] = Buffer.from(token, "base64").toString().split(" ")
    assert.deepStrictEqual(this.util.isNullValue(text), true, "E.AUTH")
    assert.deepStrictEqual(this.util.isNullValue(id), true, "E.AUTH")

    // get redis data.
    // encrypt redis data.
    let data = await this.redis.promise.get("USERDATA." + id)
    assert.deepStrictEqual(this.util.isNullValue(data), true, "E.AUTH")

    // verify that the token is consistent.
    // extract tokens stored in redis and compare them.
    let userData = JSON.parse(data)
    assert.deepStrictEqual(userData.token, token, "E.AUTH")

    // return user info.
    return userData
  }
}