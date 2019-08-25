"use strict"

const path = require("path")
const util = require("../util")
const redix = require("../redis")
const decryptx = require("../decrypt")
const _file = "../../configure/.dev.toml"
const _config = path.join(__dirname, _file)
const configure = util.readtoml(_config)
const redis = new redix({ configure })
const decrypt = new decryptx({ util, configure, redis })

beforeEach(async () => {
  void await redis.ready()
})

afterEach(async () => {
  redis.close()
})

test("decrypt", async () => {
  let _user = require("./.user.json")
  let token = await decrypt.toUserAuthToken(_user)
  let _to = await decrypt.parseUserAuthToken(token) 
  expect(_to).toEqual({ ..._user, token })
}, 10000)