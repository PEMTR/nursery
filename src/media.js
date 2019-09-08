"use strict"

const {
  NURSERY_MEDIA_CONFFILE = "./configure/media.toml"
} = process.env

const util = require("../bin/util")
const media = require("../bin/media")
const { ServiceBroker } = require("moleculer")
const service = require("../service/media/mod")

const crate = {}
const configure = util.readtoml(NURSERY_MEDIA_CONFFILE)
const broker = new ServiceBroker(configure.service)

crate.util = util
crate.media = media
crate.broker = broker
crate.configure = configure

broker.createService(new service.image(crate))
broker.start()