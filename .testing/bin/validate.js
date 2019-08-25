"use strict"

const crate = require("../.crate")

test("validate", () => {
  let _temp = require("../.temp/temp.json")
  let _data = require("../.temp/user.json")
  crate.validate.type("phone", crate.util.isPoneAvailable)
  crate.validate.bind("test", _temp)
  let _result = crate.validate.schema("test", _data)
  expect(_result).toBe(true)
})