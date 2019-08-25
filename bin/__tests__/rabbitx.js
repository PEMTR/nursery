"use strict"

const path = require("path")
const util = require("../util")
const rabbitmq = require("../rabbitx")
const _file = "../../configure/.dev.toml"
const _config = path.join(__dirname, _file)
const configure = util.readtoml(_config)
const rabbitx_0 = new rabbitmq({ configure })
const rabbitx_1 = new rabbitmq({ configure })

const process = async (...agv) => {
  expect(agv[0].as("string")).toBe("hello")
  agv[1] && agv[1].ack()
  return "word"
}

beforeEach(async () => {
  void await rabbitx_0.ready()
  void await rabbitx_1.ready()
})

afterEach(async () => {
  rabbitx_0.close()
  rabbitx_1.close()
})

test("rabbitx", async () => {
  void await rabbitx_1.Send("test", "hello")
  void await rabbitx_0.On("test", process)
  void await rabbitx_0.OnTransfer("tests", process)
  let _result = await rabbitx_1.SendTransfer("tests", "hello")
  expect(_result.as("string")).toBe("word")
}, 10000)