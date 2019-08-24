"use strict"


// package
// @package
const path = require("path")
const util = require("../util")
const redix = require("../redis")
const _file = "../../configure/.dev.toml"
const _config = path.join(__dirname, _file)
const configure = util.readtoml(_config)
const redis = new redix({ configure })

test("绑定事件", function () {
    expect(1+1).toBe(2)
})