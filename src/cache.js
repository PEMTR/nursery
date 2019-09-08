"use strict"

const {
  NURSERY_CACHE_CONFGILE = "./configure/cache.toml"
} = process.env

const util = require("@mod/util")
const redis = require("@mod/redis")
const mongod = require("@mod/mongod")
const elasticx = require("@mod/elasticx")
const { ServiceBroker } = require("moleculer")
const analysis = require("../analysis/cache/mod")
const service = require("../service/cache/mod")

const crate = {}
const configure = util.readtoml(NURSERY_CACHE_CONFGILE)
const broker = new ServiceBroker(configure.service)

crate.util = util
crate.dirname = __dirname
crate.configure = configure
crate.mongo = new mongod(crate)
crate.redis = new redis(crate)
crate.elasticx = new elasticx(crate)
crate.analysis = new analysis(crate)

broker.createService(new service(crate))
broker.start()