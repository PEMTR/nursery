"use strict"

// package
// @package
const path = require("path")
const util = require("../util")
const rabbitmq = require("../rabbitx")
const _file = "../../configure/.dev.toml"
const _config = path.join(__dirname, _file)
const configure = util.readtoml(_config)
const rabbitx_0 = new rabbitmq({ configure })
const rabbitx_1 = new rabbitmq({ configure })


// 测试完成之后断开链接
afterEach(async function () {
  void await rabbitx_0.ready()
  void await rabbitx_1.ready()
  rabbitx_0.close()
  rabbitx_1.close()
})


test("rabbitx", async function () {
  void await rabbitx_0.ready()
  void await rabbitx_1.ready()
  
  // 消费测试
  void await rabbitx_0.On("test", function (msg, pco) {
    let _str = msg.as("string")
    expect(_str).toBe("hello")
    pco.ack()
  })
  
  // 事务消费测试
  void await rabbitx_0.OnTransfer("testTransfer", async msg => {
    let _str = msg.as("string")
    expect(_str).toBe("hello")
    return "word"
  })
  
  // 生产消息
  void await rabbitx_1.Send("test", "hello")
  let _result = await rabbitx_1.SendTransfer("testTransfer", "hello")
  expect(_result.as("string")).toBe("word")
}, 10000)