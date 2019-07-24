"use strict"

// 环境变量
const {
  NURSERY_CONFFILE = "./configure.toml"
} = process.env

// package
// @package
const http = require("http")
const bodyparse = require("body-parser")
const cookieparse = require("cookie-parser")
const expmiddleware = require("./middleware")
const express = require("lazy_mod/express")
const mongo = require("lazy_mod/mongo")
const redis = require("lazy_mod/redis")
const schema = require("./schema/mod")
const model = require("./model/mod")
const rabbitmq = require("./bin/rabbitmq")
const decrypt = require("./bin/decrypt")
const multer = require("./bin/multer")
const wechat = require("./bin/wechat")
const util = require("./bin/util")
const oss = require("./bin/oss")
const pay = require("./bin/pay")
const code = require("./code")

// 初始化
const crate = {}
const app = express()
const configure = util.readtoml(NURSERY_CONFFILE)
const server = http.createServer(app)

// 依赖总线
crate.code = code
crate.util = util
crate.multer = multer
crate.pid = process.pid
crate.env = process.env
crate.dirname = __dirname
crate.configure = configure
crate.mongo = mongo(configure.mongo)
crate.redis = redis(configure.redis)
crate.rabbitmq = new rabbitmq(configure.rabbitmq)
crate.decrypt = new decrypt(crate)
crate.wechat = new wechat(crate)
crate.model = new model(crate)
crate.schema = new schema(crate)
// crate.pay = new pay(crate)
// crate.oss = new oss(crate)

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
app.use("/static", express.static(configure.static))
app.use(middleware.filter())
app.use(require("./router/mod"))
app.use(middleware.hooks())

// 绑定端口
// 绑定进程名
// 初始化接口验证
server.listen(configure.listen)
process.title = configure.name