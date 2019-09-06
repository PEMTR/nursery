"use strict"

const {
  NURSERY_CACHE_CONFGILE = "./configure/cache.toml"
} = process.env

const util = require("../bin/util")
const redis = require("../bin/redis")
const mongod = require("../bin/mongod")
const { ServiceBroker } = require("moleculer")
const analysis = require("../analysis/cache/mod")
const factory = require("../factory/cache/mod")
const service = require("../service/cache/mod")
const elasticx = require("../bin/elasticx")

const crate = {}
const configure = util.readtoml(NURSERY_CACHE_CONFGILE)
const middleware = new middlewares({ configure, code }, crate)
const broker = new ServiceBroker(configure.service)

crate.code = code
crate.dirname = __dirname
crate.configure = configure
crate.mongo = new mongod(crate)
crate.redis = new redis(crate)
crate.elasticx = new elasticx(crate)
crate.factory = new factory(crate)
crate.analysis = new analysis(crate)

broker.createService(new service(crate))
broker.start()