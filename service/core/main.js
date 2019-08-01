"use strict"


// 环境变量
const {
  NURSERY_CORE_CONFFILE = "./configure/core.toml"
}


// package
// @package
const rabbitx = require("../../bin/rabbitx")
const util = require("../../bin/util")

// 初始化
const configure = util.readtoml(NURSERY_CORE_CONFFILE)

new rabbitx()
