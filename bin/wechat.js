"use strict"


// package
// @package
const axios = require("axios")
const assert = require("assert").strict
const querystring = require("querystring")


// 微信接口类
// @class
function Wechat ({ util, configure, redis }) {
  this.configure = configure
  this.redis = redis
  this.util = util
}


// 获取access_token
// @returns {object}
// @public
Wechat.prototype.getAccessToken = async function () {
  let res = await axios.get(this.configure.wechat.baseUris.accessTokenUri, { params: {
    grant_type: "client_credential",
    appid: this.configure.wechat.service.appid,
    secret: this.configure.wechat.service.appSecret
  }})

  /**
   * status == 200
   * access_token in res.data
   * expires_in in res.data
   */
  assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
  assert.deepStrictEqual("access_token" in res.data, true, "E.WECHATAPI")
  assert.deepStrictEqual("expires_in" in res.data, true, "E.WECHATAPI")

  // 写入redis
  void await this.redis.Set("@SYSTEM.WECHAT.ACCESS.TOKEN", res.data.access_token)

  // 回调响应数据
  return res.data
}


// 推送模板消息
// @param {object} params 参数
// @param {string} touser 到达用户
// @param {string} template 模板id
// @param {string} url 跳转链接
// @param {string} appid 需要跳转的小程序ID
// @returns {object}
// @public
Wechat.prototype.template = async function ({ 
  params, touser, template, pagepath,
  url, appid, miniprogram, 
}) {
  let token = await this.redis.Get("@SYSTEM.WECHAT.ACCESS.TOKEN")
  assert.deepStrictEqual(this.util.isNullValue(token), true, "E.WECHATAPI")
  assert.deepStrictEqual(this.util.isNullValue(touser), true, "E.WECHATAPI")

  // template data.
  let templateData = {
    template_id: template,
    touser: touser,
    data: params
  }

  // if params of join.
  if (appid) templateData.appid = appid
  if (miniprogram) templateData.miniprogram = miniprogram
  if (pagepath) templateData.pagepath = pagepath
  if (url) templateData.url = url

  // request
  let uri = this.configure.wechat.baseUris.pushTemplateMessage + "?access_token=" + token
  let res = await axios.post(uri, templateData)

  /**
   * status == 200
   * errcode = 0
   * errmsg = ok
   */
  assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
  assert.deepStrictEqual(res.data.errcode, 0, "E.WECHATAPI")
  assert.deepStrictEqual(res.data.errmsg, "ok", "E.WECHATAPI")

  // 回调响应数据
  return res.data.msgid
}


// 生成二维码
// @param {number} expire 有效期
// @param {string} str 字符串
// @returns {object}
Wechat.prototype.qrcode = async function ({ expire, str }) {
  let token = await this.redis.Get("@SYSTEM.WECHAT.ACCESS.TOKEN")
  assert.deepStrictEqual(this.util.isNullValue(token), true, "E.WECHATAPI")

  let uri = this.configure.wechat.baseUris.qrcode + "?access_token=" + token
  let res = await axios.post(uri, {
    action_name: "QR_STR_SCENE",
    expire_seconds: expire,
    action_info: { scene: { scene_str: str } }
  })

  /**
   * status == 200
   * ticket in res.data
   * expire_seconds in res.data
   * url in res.data
   */
  assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
  assert.deepStrictEqual("ticket" in res.data, true, "E.WECHATAPI")
  assert.deepStrictEqual("expire_seconds" in res.data, true, "E.WECHATAPI")
  assert.deepStrictEqual("url" in res.data, true, "E.WECHATAPI")

  // 回调响应数据
  return res.data
}


// 获取openid
// @param {string} [code] 临时登陆凭证
// @param {string} [referer] 来源
// @returns {object}
// @public
Wechat.prototype.codetoOpenid = async function ({ code, referer }) {
  let queryParam = querystring.stringify({
    appid: this.configure.wechat.mch[referer].appid,
    secret: this.configure.wechat.mch[referer].appSecret,
    grant_type: "authorization_code",
    js_code: code
  })

  let uri = this.configure.wechat.baseUris.getOpenid + "?" + queryParam
  let res = await axios.get(uri)

  // status == 200
  assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
  assert.deepStrictEqual("openid" in res.data, true, "E.WECHATAPI")
  
  // 验证返回
  return res.data
}


// 获取素材列表
// @param {string} type 素材类型
// @param {number} offset 跳过
// @param {number} count 截取
// @returns {obhect}
// @public
Wechat.prototype.getMaterials = async function ({ type, offset, count }) {
  let token = await this.redis.Get("@SYSTEM.WECHAT.ACCESS.TOKEN")
  assert.deepStrictEqual(this.util.isNullValue(token), true, "E.WECHATAPI")

  let uri = this.configure.wechat.baseUris.getMaterialList + "?access_token=" + token
  let res = await axios.post(uri, { type, offset, count })

  /**
   * status == 200
   * total_count in res.data
   */
  // 验证返回
  assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
  assert.deepStrictEqual("total_count" in res.data, true, "E.WECHATAPI")
  return res.data
}


// 获取用户基本信息(UnionID机制)
// @param {string} openid
// @returns {object}
// @public
Wechat.prototype.getUserInfo = async function ({ openid }) {
  let token = await this.redis.Get("@SYSTEM.WECHAT.ACCESS.TOKEN")
  assert.deepStrictEqual(this.util.isNullValue(token), true, "E.WECHATAPI")

  // 请求微信服务器
  let uri = this.configure.wechat.baseUris.getUserInfo
  let res = await axios.get(uri, { params: { access_token: token, openid } })

  /**
   * status == 200
   * total_count in res.data
   * res.data.subscribe === 1
   */
  assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
  assert.deepStrictEqual("subscribe" in res.data, true, "E.WECHATAPI")
  assert.deepStrictEqual(res.data.subscribe, 1, "E.WECHATAPI")

  // 验证返回
  return res.data
}


// 设置服务号菜单
// @param {object} options
// @returns {object}
// @public
Wechat.prototype.setMenu = async function (options) {
  let token = await this.redis.Get("@SYSTEM.WECHAT.ACCESS.TOKEN")
  assert.deepStrictEqual(this.util.isNullValue(token), true, "E.WECHATAPI")

  let uri = this.configure.wechat.baseUris.setMenu
  let res = await axios.post(uri, { params: { access_token: token }, data: options })

  /**
   * status == 200
   * total_count in res.data
   * res.data.subscribe === 1
   */
  assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
  assert.deepStrictEqual(res.data.errcode, 0, "E.WECHATAPI")
  assert.deepStrictEqual(res.data.errmsg, "ok", "E.WECHATAPI")

  // 验证返回
  return true
}


// export
module.exports = Wechat