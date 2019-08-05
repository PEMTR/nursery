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
const expmiddleware = require("../../middleware")
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

const middleware = new expmiddleware(crate)

middleware.apply("code", crate.code)
middleware.apply("util", crate.util)
middleware.apply("model", crate.model)
middleware.apply("dirname", crate.dirname)
middleware.apply("configure", crate.configure)
middleware.apply("schema", crate.schema)
middleware.apply("mongo", crate.mongo)
middleware.apply("redis", crate.redis)
middleware.apply("events", crate.events)
middleware.apply("decrypt", crate.decrypt)
middleware.apply("rabbitx", crate.rabbitx)
middleware.apply("env", crate.env)

app.use(cookieparse(), bodyparse.json())
app.use(bodyparse.urlencoded({ extended: true }))
app.use(middleware.filter(), routers)
app.use(middleware.hooks())

server.listen(configure.listen)
process.title = configure.name