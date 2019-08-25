"use strict"

const crate = require("../.crate")

beforeEach(async () => {
  void await crate.redis.ready()
})

test("decrypt", async () => {
  let _user = require("../.temp/user.json")
  let token = await crate.decrypt.toUserAuthToken(_user)
  let _to = await crate.decrypt.parseUserAuthToken(token) 
  expect(_to).toEqual({ ..._user, token })
}, 10000)