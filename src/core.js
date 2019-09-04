"use strict"

const {
  NURSERY_CORE_CONFGILE = "./configure/core.toml"
} = process.env

const crate = {}
const util = require("../bin/util")
const mongod = require("../bin/mongod")
const model = require("../model/core/mod")
const service = require("../service/core/mod")
const { ServiceBroker } = require("moleculer")
const configure = util.readtoml(NURSERY_CORE_CONFGILE)
const broker = new ServiceBroker(configure.service)

crate.util = util
crate.broker = broker
crate.env = process.env
crate.dirname = __dirname
crate.configure = configure
crate.mongo = new mongod(crate)
crate.model = new model(crate)

broker.createService(new service.water(crate))
broker.start()