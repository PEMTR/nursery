"use strict"

const validate = require("../validate")
const validatx = new validate(true, "e.validate")

test("validate", () => {
  let _temp = require("./.temp.json")
  let _data = { name: "panda", age: 10 }
  validatx.bind("test", _temp)
  let _result = validatx.schema("test", _data)
  expect(_result).toBe(true)
})