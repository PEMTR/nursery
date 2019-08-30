"use strict"

const {
  NURSERY_MEDIA_CONFFILE = "./configure/media.toml"
} = process.env

const crate = {}
const util = require("../bin/util")
const media = require("../bin/media")
const rabbitx = require("../bin/rabbitx")
const factory = require("../factory/media/mod")
const configure = util.readtoml(NURSERY_MEDIA_CONFFILE)

crate.util = util
crate.media = media
crate.configure = configure
crate.rabbitx = new rabbitx(crate)
crate.factory = new factory(crate)

process.title = configure.name
module.exports = crate