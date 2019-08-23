"use strict"

const {
  NURSERY_CORE_CONFGILE = "./configure/core.toml"
} = process.env

const crate = {}
const util = require("../bin/util")
const mongod = require("../bin/mongod")
const rabbitx = require("../bin/rabbitx")
const model = require("../model/core/mod")
const factory = require("../factory/core/mod")
const configure = util.readtoml(NURSERY_CORE_CONFGILE)

crate.util = util
crate.env = process.env
crate.dirname = __dirname
crate.configure = configure
crate.rabbitx = new rabbitx(crate)
crate.mongo = new mongod(crate)
crate.model = new model(crate)
crate.factory = new factory(crate)

process.title = configure.name
module.exports = crate