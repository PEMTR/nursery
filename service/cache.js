"use strict"

const {
  NURSERY_CACHE_CONFGILE = "./configure/cache.toml"
} = process.env

const http = require("http")
const util = require("../bin/util")
const redis = require("../bin/redis")
const mongod = require("../bin/mongod")
const bodyparse = require("body-parser")
const middlewares = require("../middleware")
const express = require("lazy_mod/express")
const analysis = require("../analysis/cache/mod")
const factory = require("../factory/cache/mod")
const routers = require("../router/cache/mod")
const elasticx = require("../bin/elasticx")
const code = require("../code.json")

const crate = {}
const app = express()
const server = http.createServer(app)
const configure = util.readtoml(NURSERY_CACHE_CONFGILE)
const middleware = new middlewares({ configure, code }, crate)

crate.code = code
crate.dirname = __dirname
crate.configure = configure
crate.mongo = new mongod(crate)
crate.redis = new redis(crate)
crate.elasticx = new elasticx(crate)
crate.factory = new factory(crate)
crate.analysis = new analysis(crate)

app.use(bodyparse.json())
app.use(bodyparse.urlencoded({ extended: true }))
app.use(middleware.filter(), routers)
app.use(middleware.hooks())

server.listen(configure.listen)
process.title = configure.name