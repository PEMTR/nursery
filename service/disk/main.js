"use strict"

const {
  NURSERY_DISK_CONFFILE = "./configure/disk.toml"
} = process.env

const http = require("http")
const bodyparse = require("body-parser")
const cookieparse = require("cookie-parser")
const express = require("lazy_mod/express")
const redis = require("../../bin/redis")
const util = require("../../bin/util")
const multer = require("../../bin/multer")
const analysis = require("../../analysis/disk/mod")
const routers = require("../../router/disk/mod")
const middlewares = require("../../middleware")
const elasticx = require("../../bin/elasticx")
const code = require("../../code")

const crate = {}
const app = express()
const server = http.createServer(app)
const configure = util.readtoml(NURSERY_DISK_CONFFILE)
const middleware = new middlewares({ configure, code }, crate)

crate.code = code
crate.env = process.env
crate.pid = process.pid
crate.dirname = __dirname
crate.configure = configure
crate.multer = new multer(crate)
crate.elasticx = new elasticx(crate)
crate.analysis = new analysis(crate)

// app.use(cookieparse(), bodyparse.json())
// app.use(bodyparse.urlencoded({ extended: true }))
app.use(middleware.filter(), routers)
app.use(middleware.hooks())

server.listen(configure.listen)
process.title = configure.name