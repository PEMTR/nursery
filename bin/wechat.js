"use strict"


// package
// @package
const axios = require("axios")
const assert = require("assert").strict
const querystring = require("querystring")


// 微信类
// @class
module.exports = class Wechat {
  
  // @new
  constructor ({ util, configure, redis }) {
    this.configure = configure
    this.redis = redis
    this.util = util
  }
  
  // 获取access_token
  // @returns {object}
  // @public
  async getAccessToken () {
    let res = await axios.get(this.configure.wechat.baseUris.accessTokenUri, { params: {
      grant_type: "client_credential",
      appid: this.configure.wechat.service.appid,
      secret: this.configure.wechat.service.appSecret
    }})

    assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
    assert.deepStrictEqual("access_token" in res.data, true, "E.WECHATAPI")
    assert.deepStrictEqual("expires_in" in res.data, true, "E.WECHATAPI")

    void await this.redis.Set("@SYSTEM.WECHAT.ACCESS.TOKEN", res.data.access_token)
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
  async template ({ 
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

    let uri = this.configure.wechat.baseUris.pushTemplateMessage + "?access_token=" + token
    let res = await axios.post(uri, templateData)
    
    assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
    assert.deepStrictEqual(res.data.errcode, 0, "E.WECHATAPI")
    assert.deepStrictEqual(res.data.errmsg, "ok", "E.WECHATAPI")
    return res.data.msgid
  }

  // 生成二维码
  // @param {number} expire 有效期
  // @param {string} str 字符串
  // @returns {object}
  async qrcode ({ expire, str }) {
    let token = await this.redis.Get("@SYSTEM.WECHAT.ACCESS.TOKEN")
    assert.deepStrictEqual(this.util.isNullValue(token), true, "E.WECHATAPI")

    let uri = this.configure.wechat.baseUris.qrcode + "?access_token=" + token
    let res = await axios.post(uri, {
      action_name: "QR_STR_SCENE",
      expire_seconds: expire,
      action_info: { scene: { scene_str: str } }
    })

    assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
    assert.deepStrictEqual("ticket" in res.data, true, "E.WECHATAPI")
    assert.deepStrictEqual("expire_seconds" in res.data, true, "E.WECHATAPI")
    assert.deepStrictEqual("url" in res.data, true, "E.WECHATAPI")
    return res.data
  }

  // 获取openid
  // @param {string} [code] 临时登陆凭证
  // @param {string} [referer] 来源
  // @returns {object}
  // @public
  async codetoOpenid ({ code, referer }) {
    let queryParam = querystring.stringify({
      appid: this.configure.wechat.mch[referer].appid,
      secret: this.configure.wechat.mch[referer].appSecret,
      grant_type: "authorization_code",
      js_code: code
    })

    let uri = this.configure.wechat.baseUris.getOpenid + "?" + queryParam
    let res = await axios.get(uri)

    assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
    assert.deepStrictEqual("openid" in res.data, true, "E.WECHATAPI")
    return res.data
  }

  // 获取素材列表
  // @param {string} type 素材类型
  // @param {number} offset 跳过
  // @param {number} count 截取
  // @returns {obhect}
  // @public
  async getMaterials ({ type, offset, count }) {
    let token = await this.redis.Get("@SYSTEM.WECHAT.ACCESS.TOKEN")
    assert.deepStrictEqual(this.util.isNullValue(token), true, "E.WECHATAPI")

    let uri = this.configure.wechat.baseUris.getMaterialList + "?access_token=" + token
    let res = await axios.post(uri, { type, offset, count })

    assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
    assert.deepStrictEqual("total_count" in res.data, true, "E.WECHATAPI")
    return res.data
  }

  // 获取用户基本信息(UnionID机制)
  // @param {string} openid
  // @returns {object}
  // @public
  async getUserInfo ({ openid }) {
    let token = await this.redis.Get("@SYSTEM.WECHAT.ACCESS.TOKEN")
    assert.deepStrictEqual(this.util.isNullValue(token), true, "E.WECHATAPI")

    let uri = this.configure.wechat.baseUris.getUserInfo
    let res = await axios.get(uri, { params: { access_token: token, openid } })

    assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
    assert.deepStrictEqual("subscribe" in res.data, true, "E.WECHATAPI")
    assert.deepStrictEqual(res.data.subscribe, 1, "E.WECHATAPI")
    return res.data
  }

  // 设置服务号菜单
  // @param {object} options
  // @returns {object}
  // @public
  async setMenu (options) {
    let token = await this.redis.Get("@SYSTEM.WECHAT.ACCESS.TOKEN")
    assert.deepStrictEqual(this.util.isNullValue(token), true, "E.WECHATAPI")

    let uri = this.configure.wechat.baseUris.setMenu
    let res = await axios.post(uri, { params: { access_token: token }, data: options })

    assert.deepStrictEqual(res.status, 200, "E.WECHATAPI")
    assert.deepStrictEqual(res.data.errcode, 0, "E.WECHATAPI")
    assert.deepStrictEqual(res.data.errmsg, "ok", "E.WECHATAPI")
    return true
  }
}