"use strict"

const {
  NURSERY_INTERFACE_CONFFILE = "./configure/interface.toml"
} = process.env

const http = require("http")
const bodyparse = require("body-parser")
const cookieparse = require("cookie-parser")
const express = require("lazy_mod/express")
const routers = require("../../router/interface/mod")
const schema = require("../../schema/interface/mod")
const model = require("../../model/interface/mod")
const analysis = require("../../analysis/interface/mod")
const expmiddleware = require("../../middleware")
const elasticx = require("../../bin/elasticx")
const rabbitx = require("../../bin/rabbitx")
const decrypt = require("../../bin/decrypt")
const wechat = require("../../bin/wechat")
const mongod = require("../../bin/mongod")
const redis = require("../../bin/redis")
const util = require("../../bin/util")
const code = require("../../code")

const crate = {}
const app = express()
const configure = util.readtoml(NURSERY_INTERFACE_CONFFILE)
const middleware = new expmiddleware({ configure, code }, crate)
const server = http.createServer(app)

crate.code = code
crate.util = util
crate.pid = process.pid
crate.env = process.env
crate.dirname = __dirname
crate.configure = configure
crate.mongo = new mongod(crate)
crate.redis = new redis(crate)
crate.decrypt = new decrypt(crate)
crate.wechat = new wechat(crate)
crate.model = new model(crate)
crate.schema = new schema(crate)
crate.rabbitx = new rabbitx(crate)
crate.elasticx = new elasticx(crate)
crate.analysis = new analysis(crate)

app.use(cookieparse(), bodyparse.json())
app.use(bodyparse.urlencoded({ extended: true }))
app.use(middleware.filter(), routers)
app.use(middleware.hooks())

server.listen(configure.listen)
process.title = configure.name