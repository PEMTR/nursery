"use strict"

const {
  NURSERY_INTERFACE_CONFFILE = "./configure/interface.toml"
} = process.env

const http = require("http")
const bodyparse = require("body-parser")
const cookieparse = require("cookie-parser")
const express = require("lazy_mod/express")
const routers = require("../router/interface/mod")
const model = require("../model/interface/mod")
const cache = require("../cache//interface/mod")
const analysis = require("../analysis/interface/mod")
const { ServiceBroker } = require("moleculer")
const middlewares = require("../middleware")
const validate = require("@mod/validator")
const quasipaa = require("@mod/quasipaa")
const elasticx = require("@mod/elasticx")
const decrypt = require("@mod/decrypt")
const wechat = require("@mod/wechat")
const mongod = require("@mod/mongod")
const redis = require("@mod/redis")
const util = require("@mod/util")
const code = require("../code")

const crate = {}
const app = express()
const configure = util.readtoml(NURSERY_INTERFACE_CONFFILE)
const middleware = new middlewares({ configure, code }, crate)
const broker = new ServiceBroker(configure.service)
const schema = new validate(true, "E.PARAMS.TYPE")
const server = http.createServer(app)

crate.code = code
crate.util = util
crate.broker = broker
crate.pid = process.pid
crate.env = process.env
crate.dirname = __dirname
crate.configure = configure
crate.quasipaa = new quasipaa(crate)
crate.mongo = new mongod(crate)
crate.redis = new redis(crate)
crate.decrypt = new decrypt(crate)
crate.wechat = new wechat(crate)
crate.model = new model(crate)
crate.elasticx = new elasticx(crate)
crate.analysis = new analysis(crate)
crate.cache = new cache(crate)

schema.type("objectId", util.isValidOID)
schema.type("ip", util.isValidIP)

app.use("/interface", cookieparse(), bodyparse.json(), schema.express())
app.use("/interface", bodyparse.urlencoded({ extended: true }))
app.use("/interface", middleware.filter(), routers)
app.use("/interface", middleware.hooks())

server.listen(configure.listen)
broker.start()