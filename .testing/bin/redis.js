"use strict"

const crate = require("../.crate")

beforeEach(async () =>  {
  void await crate.redis.ready()
})

test("redis", async () =>  {
  let _get = await crate.redis.promise.get("test")
  let _set = await crate.redis.promise.set("test", "test")
  let _test = await crate.redis.promise.get("test")
  let _del = await crate.redis.promise.del("test")
  expect(_get).toBeNull()
  expect(_set).toBe("OK")
  expect(_test).toBe("test")
  expect(_del).toBe(1)
}, 10000)