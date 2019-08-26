"use strict"


// package
// @package
const fs = require("fs")
const { URL } = require("url")
const https = require("https")
const axios = require("axios")
const uuid = require("uuid/v4")
const moment = require("moment")
const crypto = require("crypto")
const assert = require("assert").strict
const querystring = require("querystring")


// 支付类
// @class
class Pay {
  
  // @new
  // @params {class} util 工具模块
  // @params {object} configure 配置
  constructor ({ util, configure }) {
    this.configure = configure
    this.util = util
  }
  
  // 生成随机字符串
  // @params {number} len
  // @returns {string}
  // @private
  noncestr (len = 30) {
    return crypto.randomBytes(len / 2).toString("hex").toUpperCase()
  }
  
  // ASCII字节序
  // @params {object} params
  // @private
  paramsSort (params) {
    let body = {}, keys = Object.keys(params).sort()
    for (let key of keys) body[key] = params[key]
    return body
  }
}


// 支付宝类
// @class
class AliPay extends Pay {
  
  // @new
  constructor (crate) {
    super(crate)
    this.loadKey()
  }
  
  // 加载证书
  // @private
  LoadKey () {
    let { alipay } = this.configure
    this.alipayPublicKey = fs.readFileSync(alipay.keys.public)
    this.alipayPrivateKey = fs.readFileSync(alipay.keys.private)
    this.alipayAppPublicKey = fs.readFileSync(alipay.keys.appPublic)
    this.alipayAppPrivateKey = fs.readFileSync(alipay.keys.appPrivate)
  }
  
  // 生成时间字符串
  // @params {number} data
  // @private
  moment (date) {
    return moment(date).format("YYYY-MM-DD hh:mm:ss")
  }
  
  // 生成订单号
  // @params {string} type
  // @private
  tradeNumber (type) {
    let rand = crypto.randomBytes(4).toString("hex")
    let time = String(Date.now())
    return type + time + rand 
  }
  
  // 对象传查询字符串
  // @params {object} params
  // @private
  queryString (params, strs = []) {
    for (let key in params) strs.push(`${key}=${params[key]}`)
    return strs.join("&")
  }

  // 对象转查询字符串（带编码）
  // @params {object} params
  // @private
  queryStringDecode (params, strs = []) {
    for (let key in params) strs.push(`${key}=${decodeURI(params[key])}`)
    return strs.join("&")
  }
  
  // 请求参数签名
  // @params {object} params
  // @private
  sign (params) {
    let options = this.paramsSort(params)
    let params_str = this.queryString(options)
    let crypto_type = this.configure.alipay.crypto
    let rsa = crypto.createSign(crypto_type).update(params_str, "utf8")
    let sign = rsa.sign(this.alipayPrivateKey, "base64")
    return { 
      ...params,
      sign 
    }
  }

  // 公共请求参数
  // @params {string} method
  // @params {object} params
  // @private
  publicParams (method, params) {
    return {
      notify_url: this.configure.alipay.callbackUri,
      timestamp: this.moment(Date.now()),
      biz_content: JSON.stringify(params),
      app_id: this.configure.alipay.appid,
      sign_type: "RSA2",
      charset: "utf-8",
      method: method,
      version: "1.0"
    }
  }
  
  // 统一收单下单并支付页面接口
  // @params {number} [amount] 金额
  // @params {string} [name] 商品名称
  // @params {string} [body] 商品描述
  // @params {string} [referer] 发起地址
  // @params {string} [detail] 订单索引
  // @public
  tradePagePay ({
    amount, name, body, referer, detail
  }) {

    // 参数
    let params = {
      out_trade_no: this.tradeNumber("A"),
      product_code: "FAST_INSTANT_TRADE_PAY",
      total_amount: amount,
      subject: name,
      body: body,
      passback_params: detail,
      goods_type: "0",
      timeout_express: "10m",
      request_from_url: referer
    }

    // 合并公共参数
    // 参数摘要
    // 转为请求字符串
    let method = "alipay.trade.page.pay"
    let options = this.publicParams(method, params)
    let querys = querystring.stringify(this.sign(options))

    // 请求接口
    // 返回跳转地址
    let uri = this.configure.alipay.api.alipayTradePagePay
    return uri + "?" + querys
  }
  
  // 校验摘要
  // @params {object} params
  // @public
  verifySign (params) {
    let params_copy = Object.assign({}, params)

    // 删除非摘要字段
    delete params_copy.sign
    delete params_copy.sign_type

    // 转为查询字符串
    // 校验摘要
    let crypto_type = this.configure.alipay.crypto
    let params_str = this.queryStringDecode(this.paramsSort(params_copy))
    let rsa = crypto.createVerify(crypto_type).update(params_str, "utf8")
    return rsa.verify(this.alipayPublicKey, params.sign, "base64")
  }
}


// 微信支付类
// @class
class WxPay extends Pay {
  
  // @new
  constructor (crate) {
    super(crate)
    this.loadKey()
  }
  
  // 加载证书
  // @private
  loadKey () {
    let key = this.configure.wechat.pay.cert.key
    let cert = this.configure.wechat.pay.cert.cert
    this.key = fs.readFileSync(key)
    this.cert = fs.readFileSync(cert)
  }
  
  // 生成签名
  // @param {object} params 参数对象
  // @param {string} key 加密密钥
  // @returns {string}
  // @private
  sign (params, key, paramstr = "") {
    for (let v in this.util.acsiiSort(params)) paramstr += v + "=" + params[v] + "&"
    let sign = this.util.payMd5((paramstr + "key=" + key)).toUpperCase()
    return sign
  }
  
  // 生成订单号
  // 生成时间
  // 失效时间
  // @param {string} type 订单号后缀
  // @returns {object} data
  // @returns {string} [data.trade] 订单号
  // @returns {string} [data.time] 订单开始时间
  // @returns {string} [data.failtime] 订单结束时间
  // @private
  trade (type) {
    let now = Date.now()
    let uids = [Math.round(Math.random() * 9), Math.round(Math.random() * 9), Math.round(Math.random() * 9)]
    let uid = String(uids[0]) + String(uids[1]) + String(uids[2])
    let trade = "JH" + String(now) + uid + type.slice(0, 1).toUpperCase()
    let time = moment(now).format("YYYY-MM-DD-HH-mm-ss").replace(/-/g, "")
    let failtime = moment(now + 300000).format("YYYY-MM-DD-HH-mm-ss").replace(/-/g, "")
    return { trade, time, failtime }
  }

  // 微信通信解密
  // @param {object} options
  // @param {string} [options.text] 密文
  // @param {string} [options.key] 密钥
  // @returns {string}
  // @private
  encrypt (options) {
    let { text, key } = options
    let texts = Buffer.from(text, "base64")
    let keys  = Buffer.from(key + "=", "base64")
    let ivs = key.slice(0, 16)
    let Decipher = crypto.createDecipheriv("aes-256-cbc", keys, ivs)
    Decipher.setAutoPadding(false)
    let Dec = Decipher.update(texts)
    let final =  Decipher.final()
    let len = Dec.length + final.length
    let data = Buffer.concat([Dec, final], len)
    let xml = data.slice(20).toString().split("</xml>")[0] + "</xml>"
    return xml
  }

  // 证书代理请求
  // @param {string} method
  // @param {string} host
  // @param {any} body
  // @private
  pemRequest ({ method, host, body }) {
    return new Promise((resolve, reject) => {
      let reqContext = new URL(host)
      let buffer = Buffer.alloc(0)
      let options = {
        path: reqContext.pathname,
        host: reqContext.host,
        port: 443, method,
        cert: this.cert,
        key: this.key
      }

      // 请求
      options.agent = new https.Agent(options)
      let req = https.request(options, res => {
        res.on("data", data => {
          buffer = Buffer.concat([ 
            data, buffer
          ])
        })

        // 响应结束
        res.on("end", _ => {
          resolve(buffer)
        })
      })

      // 请求错误
      // 发送数据
      req.on("error", reject)
      body && req.write(body)
      req.end()
    })
  }

  // 统一下单
  // @param {object} [commodity] 订单详情
  // @param {string} [openid] 用户id
  // @param {string} [attach] 附加数据
  // @param {string} [referer] 来源
  // @param {string} [type] 类型
  // @param {object} [order] 订单号
  // @returns Promise
  async unifiedorder ({
    referer, openid, attach,
    commodity = {},  
    order = {}
  }) {
    let { name, total, deviceIp } = commodity
    let { trade, time, failtime } = order

    // 参数验证
    assert.deepStrictEqual(typeof name, "string", "参数错误")
    assert.deepStrictEqual(typeof total, "number", "参数错误")
    assert.deepStrictEqual(typeof deviceIp, "string", "参数错误")

    // 请求参数
    let params = {
      appid: this.configure.wechat.mch[referer].appid,
      mch_id: this.configure.wechat.pay.mchId,
      nonce_str: this.noncestr(),
      body: name,
      out_trade_no: trade,
      total_fee: total,
      spbill_create_ip: deviceIp,
      time_start: time,
      time_expire: failtime,
      notify_url: this.configure.wechat.pay.callbackUri[referer],
      attach: attach,
      trade_type: "JSAPI",
      openid: openid
    }

    // 计算签名
    params = {
      sign: this.sign(params, this.configure.wechat.pay.key),
      ...params
    }

    // 请求微信服务器 -> axios.post
    // 计算签名 -> sigen
    // 合并对象 -> assign
    // 转为xml -> xml
    let req = await axios.post(this.configure.wechat.baseUris.payUri, this.util.toXml(params))
    let result = this.util.unwind(await this.util.parseXml(req.data))

    // return_code和result_code
    // 都为SUCCESS为正确
    // 否则错误
    assert.deepStrictEqual("return_code" in result, true, "返回错误")
    assert.deepStrictEqual("result_code" in result, true, "返回错误")
    assert.deepStrictEqual(result["return_code"], "SUCCESS", "返回错误")
    assert.deepStrictEqual(result["result_code"], "SUCCESS", "返回错误")

    // 返回
    return Object.assign(result, { res: {
      trade, time, failtime,
      total: params.total_fee,
      ip: params.spbill_create_ip,
      noncestr: params.nonce_str
    }})
  }

  // 提现
  // @params {string} referer
  // @params {string} trade
  // @params {object} user
  // @params {number} amount
  // @params {string} desc
  // @params {string} ip
  // @returns Promise
  async withdraw ({
    referer, trade, user, 
    amount, desc, ip
  }) {
    let { openid, name } = user

    // 请求参数
    let params = {
      mch_appid: this.configure.wechat.mch[referer].appid,
      mchid: this.configure.wechat.pay.mchId,
      nonce_str: this.noncestr(),
      partner_trade_no: trade,
      openid: openid,
      check_name: "FORCE_CHECK",
      re_user_name: name,
      amount: amount,
      desc: desc,
      spbill_create_ip: ip
    }

    // 计算签名
    params = {
      sign: this.sign(params, this.configure.wechat.pay.key),
      ...params
    }

    // 请求微信服务器 -> axios.post
    // 计算签名 -> sigen
    // 合并对象 -> assign
    // 转为xml -> xml
    let method = "POST"
    let body = this.util.toXml(params)
    let host = this.configure.wechat.baseUris.withdrawUri
    let data = await this.pemRequest({ method, host, body })
    let result = this.util.unwind(await this.util.parseXml(data.toString("utf8")))

    // return_code和result_code
    // 都为SUCCESS为正确
    // 否则错误
    assert.deepStrictEqual("return_code" in result, true, "E.WITHDRAW")
    assert.deepStrictEqual("return_msg" in result, true, "E.WITHDRAW")
    assert.deepStrictEqual(result["return_code"], "SUCCESS", result.return_code || "E.WITHDRAW")
    assert.deepStrictEqual(result["return_msg"], "", result.err_code || "E.WITHDRAW")
    assert.deepStrictEqual(result["result_code"], "SUCCESS", result.err_code || "E.WITHDRAW")

    // 返回
    return {
      paymentNo: result.payment_no,
      paymentTime: result.payment_time
    }
  }
}


// export.
module.exports = {
  AliPay,
  WxPay
}