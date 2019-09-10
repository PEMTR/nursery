"use strict"

const {
  NURSERY_DISK_CONFFILE = "./configure/disk.toml"
} = process.env

const http = require("http")
const bodyparse = require("body-parser")
const cookieparse = require("cookie-parser")
const express = require("lazy_mod/express")
const redis = require("@mod/redis")
const util = require("@mod/util")
const multer = require("@mod/multer")
const mongo = require("@mod/mongod")
const validate = require("@mod/validator")
const service = require("../service/disk/mod")
const { ServiceBroker } = require("moleculer")
const analysis = require("../analysis/disk/mod")
const routers = require("../router/disk/mod")
const model = require("../model/disk/mod")
const middlewares = require("../middleware")
const elasticx = require("@mod/elasticx")
const referer = require("@mod/referer")
const media = require("@mod/media")
const code = require("../code")

const crate = {}
const app = express()
const server = http.createServer(app)
const configure = util.readtoml(NURSERY_DISK_CONFFILE)
const middleware = new middlewares({ configure, code }, crate)
const broker = new ServiceBroker(configure.service)
const schema = new validate(true, "E.PARAMS.TYPE")

crate.code = code
crate.util = util
crate.media = media
crate.broker = broker
crate.env = process.env
crate.pid = process.pid
crate.dirname = __dirname
crate.configure = configure
crate.mongo = new mongo(crate)
crate.multer = new multer(crate)
crate.elasticx = new elasticx(crate)
crate.analysis = new analysis(crate)
crate.referer = new referer(crate)
crate.model = new model(crate)

schema.type("objectId", util.isValidOID)
schema.type("ip", util.isValidIP)

app.use("/disk", cookieparse(), bodyparse.json(), schema.express())
app.use("/disk", bodyparse.urlencoded({ extended: true }))
app.use("/disk", middleware.filter(), routers)
app.use("/disk", middleware.hooks())

broker.createService(new service(crate))
server.listen(configure.listen)
broker.start()