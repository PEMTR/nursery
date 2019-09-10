"use strict"

const {
  NURSERY_PROXY_CONFGILE = "./configure/proxy.toml"
} = process.env

const http = require("http")
const bodyparse = require("body-parser")
const xmlparse = require("express-xml-bodyparser")
const express = require("lazy_mod/express")
const util = require("@mod/util")
const routers = require("../router/proxy/mod")
const middlewares = require("../middleware")
const rabbitx = require("@mod/rabbitx")
const elasticx = require("@mod/elasticx")
const code = require("../code")

const crate = {}
const app = express()
const server = http.createServer(app)
const configure = util.readtoml(NURSERY_DISK_CONFFILE)
const middleware = new middlewares({ configure, code }, crate)

crate.code = code
crate.util = util
crate.env = process.env
crate.pid = process.pid
crate.dirname = __dirname
crate.configure = configure
crate.rabbitx = new rabbitx(crate)
crate.elasticx = new elasticx(crate)

app.use(xmlparse, bodyparse.json())
app.use(bodyparse.urlencoded({ extended: true }))
app.use(middleware.filter(), routers)
app.use(middleware.hooks())

server.listen(configure.listen)