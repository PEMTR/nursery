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
const routers = require("../../router/disk/mod")

const crate = {}
const app = express()
const server = http.createServer(app)
const configure = util.readtoml(NURSERY_DISK_CONFFILE)

app.use(cookieparse(), bodyparse.json())
app.use(bodyparse.urlencoded({ extended: true }))
app.use(middleware.filter(), routers)
app.use(middleware.hooks())

server.listen(configure.listen)
process.title = configure.name