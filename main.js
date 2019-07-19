"use strict"


// 环境变量
const {
  WATER_API_CONF = "./configure.toml"
} = process.env


// package
// @package
const http = require("http")
const events = require("events")
const bodyparse = require("body-parser")
const cookieparse = require("cookie-parser")
const middleware = require("./middleware")
const express = require("lazy_mod/express")
const mongo = require("lazy_mod/mongo")
const redis = require("lazy_mod/redis")
const schema = require("./schema/mod")
const model = require("./model/mod")
const rabbitmq = require("./bin/rabbitmq")
const validate = require("./bin/validate")
const decrypt = require("./bin/decrypt")
const multer = require("./bin/multer")
const wechat = require("./bin/wechat")
const util = require("./bin/util")
const oss = require("./bin/oss")
const pay = require("./bin/pay")
const code = require("./code")


// 初始化
const app = express()
const configure = util.readtoml(WATER_API_CONF)
const server = http.createServer(app)
const crate = {}


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
crate.events = new events.EventEmitter()
crate.ware = new middleware(crate)
crate.validate = new validate(true, "E.VALIDATE")
crate.decrypt = new decrypt(crate)
crate.wechat = new wechat(crate)
crate.model = new model(crate)
// crate.pay = new pay(crate)
// crate.oss = new oss(crate)


// 依赖注入
crate.ware.apply("code", crate.code)
crate.ware.apply("util", crate.util)
crate.ware.apply("model", crate.model)
crate.ware.apply("dirname", crate.dirname)
crate.ware.apply("configure", crate.configure)
crate.ware.apply("mongo", crate.mongo)
crate.ware.apply("redis", crate.redis)
crate.ware.apply("events", crate.events)
crate.ware.apply("env", crate.env)


// 路由初始化
app.use(cookieparse())
app.use(bodyparse.json())
app.use(bodyparse.urlencoded({ extended: true }))
app.use("/static", express.static(configure.static))
app.use(crate.ware.fhooks())
app.use(require("./router/mod"))
app.use(crate.ware.ehooks())


// 绑定端口
// 绑定进程名
// 初始化接口验证
server.listen(configure.listen)
process.title = configure.name
schema(crate)