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


// 测试完成之后断开链接
afterEach(async function () {
  void await redis.ready()
  redis.close()
})


test("redis", async function () {
  void await redis.ready()
  
  // 执行动作
  let _get = await redis.promise.get("test")
  let _set = await redis.promise.set("test", "test")
  let _test = await redis.promise.get("test")
  let _del = await redis.promise.del("test")
  
  // 测试执行结果
  expect(_get).toBeNull()
  expect(_set).toBe("OK")
  expect(_test).toBe("test")
  expect(_del).toBe(1)
}, 10000)