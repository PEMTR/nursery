"use strict"

const path = require("path")
const util = require("../bin/util")
const decrypt = require("../bin/decrypt")
const elasticx = require("../bin/elasticx")
const media = require("../bin/media")
const mongod = require("../bin/mongod")
const multer = require("../bin/multer")
const oss = require("../bin/oss")
const pay = require("../bin/pay")
const quasipaa = require("../bin/quasipaa")
const rabbitx = require("../bin/rabbitx")
const redis = require("../bin/redis")
const validatx = require("../bin/validate")
const wechat = require("../bin/wechat")
const analysis = require("../analysis/mod")
const cache = require("../cache/mod")
const factory = require("../factory/mod")
const model = require("../model/mod")

const crate = {}
const filename = path.join(__dirname, "./.temp/.dev.toml")
const configure = util.readtoml(filename)
const validate = new validatx(true, "E.PARAMS")

crate.util = util
crate.media = media
crate.pid = process.pid
crate.env = process.env
crate.dirname = __dirname
crate.validate = validate
crate.configure = configure
// crate.oss = new oss(crate)
// crate.pay = new pay(crate)
// crate.wechat = new wechat(crate)
crate.multer = new multer(crate)
crate.quasipaa = new quasipaa(crate)
crate.mongo = new mongod(crate)
crate.redis = new redis(crate)
crate.decrypt = new decrypt(crate)
crate.model = new model(crate)
crate.rabbitx = new rabbitx(crate)
crate.elasticx = new elasticx(crate)
crate.analysis = new analysis(crate)
crate.cache = new cache(crate)
crate.factory = new factory(crate)

module.exports = crate

setTimeout(function () {
  process.exit(0)
}, 30000)