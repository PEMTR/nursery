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
const validate = require("lazy_mod/validate")
const quasipaa = require("../bin/quasipaa")
const elasticx = require("../bin/elasticx")
const decrypt = require("../bin/decrypt")
const wechat = require("../bin/wechat")
const mongod = require("../bin/mongod")
const redis = require("../bin/redis")
const util = require("../bin/util")
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

schema.type("phone", util.isPoneAvailable)
schema.type("some", util.isNullValue)
schema.type("objectId", util.isValidOID)
schema.type("email", util.isEmail)
schema.type("ip", util.isValidIP)

app.use(cookieparse(), bodyparse.json(), schema.express())
app.use(bodyparse.urlencoded({ extended: true }))
app.use(middleware.filter(), routers)
app.use(middleware.hooks())

server.listen(configure.listen)
broker.start()