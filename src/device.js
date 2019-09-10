"use strict"

const {
  NURSERY_DEVICE_CONFGILE = "./configure/device.toml"
} = process.env

const util = require("@mod/util")
const mongod = require("@mod/mongod")
const rabbitx = require("@mod/rabbitx")
const model = require("../model/device/mod")
const factory = require("../factory/device/mod")

const crate = {}
const configure = util.readtoml(NURSERY_DEVICE_CONFGILE)

crate.util = util
crate.env = process.env
crate.dirname = __dirname
crate.configure = configure
crate.rabbitx = new rabbitx(crate)
crate.mongo = new mongod(crate)
crate.model = new model(crate)
crate.factory = new factory(crate)