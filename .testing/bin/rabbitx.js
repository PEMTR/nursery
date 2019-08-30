"use strict"

const crate = require("../.crate")

const process = async (...agv) => {
  expect(agv[0].as("string")).toBe("hello")
  agv[1] && agv[1].ack()
  return "word"
}

beforeEach(async () => {
  void await crate.rabbitx.ready()
})

test("rabbitx", async () => {
  void await crate.rabbitx.Send("test", "hello")
  void await crate.rabbitx.On("test", process)
  void await crate.rabbitx.OnTransfer("tests", process)
  let _result = await crate.rabbitx.SendTransfer("tests", "hello")
  expect(_result.as("string")).toBe("word")
}, 10000)