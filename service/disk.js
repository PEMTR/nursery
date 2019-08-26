"use strict"

const {
  NURSERY_DISK_CONFFILE = "./configure/disk.toml"
} = process.env

const http = require("http")
const bodyparse = require("body-parser")
const cookieparse = require("cookie-parser")
const express = require("lazy_mod/express")
const redis = require("../bin/redis")
const util = require("../bin/util")
const multer = require("../bin/multer")
const mongo = require("../bin/mongod")
const analysis = require("../analysis/disk/mod")
const routers = require("../router/disk/mod")
const model = require("../model/disk/mod")
const factory = require("../factory/disk/mod")
const middlewares = require("../middleware")
const elasticx = require("../bin/elasticx")
const rabbitx = require("../bin/rabbitx")
const referer = require("../bin/referer")
const media = require("../bin/media")
const code = require("../code")

const crate = {}
const app = express()
const server = http.createServer(app)
const configure = util.readtoml(NURSERY_DISK_CONFFILE)
const middleware = new middlewares({ configure, code }, crate)

crate.code = code
crate.util = util
crate.media = media
crate.env = process.env
crate.pid = process.pid
crate.dirname = __dirname
crate.configure = configure
crate.mongo = new mongo(crate)
crate.multer = new multer(crate)
crate.rabbitx = new rabbitx(crate)
crate.elasticx = new elasticx(crate)
crate.analysis = new analysis(crate)
crate.referer = new referer(crate)
crate.model = new model(crate)
crate.factory = new factory(crate)

app.use(cookieparse(), bodyparse.json())
app.use(bodyparse.urlencoded({ extended: true }))
app.use(middleware.filter(), routers)
app.use(middleware.hooks())

server.listen(configure.listen)
process.title = configure.name