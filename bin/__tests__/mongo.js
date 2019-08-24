"use strict"


// package
// @package
const path = require("path")
const util = require("../util")
const mongox = require("../mongod")
const _file = "../../configure/.dev.toml"
const _config = path.join(__dirname, _file)
const configure = util.readtoml(_config)
const mongod = new mongox({ configure })


// 测试完成之后断开链接
afterEach(async function () {
  void await mongod.ready()
  mongod.close()
})


test("mongod", async function () {
  void await mongod.ready()
  let _data = { name: "panda" }
  let _to = { age: 24 }
  let _events = 0
  
  // 测试基础行为
  let _get = await mongod.Cos.test.findOne(_data)
  let _set = await mongod.Cos.test.insertOne(_data)
  let _update = await mongod.Cos.test.updateOne(_data, { $set: _to })
  let _gets = await mongod.Cos.test.findOne(_data)
  let _del = await mongod.Cos.test.deleteOne(_data)
  expect(_get).toBeNull()
  expect(_set.result.n).toBe(1)
  expect(_update.result.n).toBe(1)
  expect(_gets).toEqual(Object.assign(_data, _to))
  expect(_del.result.n).toBe(1)
  
  // 测试事务
  expect(await mongod.Transfer(async session => {
    let _get = await mongod.Cos.test.findOne(_data, { session })
    let _set = await mongod.Cos.test.insertOne(_data, { session })
    let _update = await mongod.Cos.test.updateOne(_data, { $set: _to }, { session })
    let _gets = await mongod.Cos.test.findOne(_data, { session })
    let _del = await mongod.Cos.test.deleteOne(_data, { session })
    expect(_get).toBeNull()
    expect(_set.result.n).toBe(1)
    expect(_update.result.n).toBe(1)
    expect(_gets).toEqual(Object.assign(_data, _to))
    expect(_del.result.n).toBe(1)
    return true
  })).toBe(true)
  
  // 测试watch
  mongod.Watch("change", target => {
    let { ns: { coll }, operationType } = target
    
    // 写入事件
    if (_events === 0) {
      expect(coll).toBe("test")
      expect(operationType).toBe("insert")
    }
    
    // 更新事件
    if (_events === 1) {
      expect(coll).toBe("test")
      expect(operationType).toBe("delete")
    }
    
    // 迭代
    _events ++
  })
  
  // 触发watch
  void await mongod.Cos.test.insertOne(_data)
  void await mongod.Cos.test.deleteOne(_data)
}, 10000)