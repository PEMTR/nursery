"use strict"

// 环境变量
const {
  NURSERY_INTERFACE_CONFFILE = "./configure/interface.toml"
} = process.env

// package
// @package
const http = require("http")
const bodyparse = require("body-parser")
const cookieparse = require("cookie-parser")
const express = require("lazy_mod/express")
const routers = require("../../router/interface/mod")
const schema = require("../../schema/interface/mod")
const model = require("../../model/interface/mod")
const expmiddleware = require("../../middleware")
const decrypt = require("../../bin/decrypt")
const wechat = require("../../bin/wechat")
const mongod = require("../../bin/mongod")
const redis = require("../../bin/redis")
const util = require("../../bin/util")
const code = require("../../code")

// 初始化
const crate = {}
const app = express()
const configure = util.readtoml(NURSERY_INTERFACE_CONFFILE)
const server = http.createServer(app)

// 依赖总线
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

// 路由中间件
const middleware = new expmiddleware(crate)

// 路由中间件
// 依赖注入
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
middleware.apply("env", crate.env)

// 路由中间件
// 路由初始化
app.use(cookieparse(), bodyparse.json())
app.use(bodyparse.urlencoded({ extended: true }))
app.use(middleware.filter(), routers)
app.use(middleware.hooks())

// 绑定端口
// 绑定进程名
server.listen(configure.listen)
process.title = configure.name