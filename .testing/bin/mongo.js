"use strict"

const crate = require("../.crate")

beforeEach(async () => {
  void await crate.mongo.ready()
})

test("mongod", async () => {
  let _data = { name: "panda" }
  let _to = { age: 24 }
  let _events = 0
  
  let _get = await crate.mongo.Cos.test.findOne(_data)
  let _set = await crate.mongo.Cos.test.insertOne(_data)
  let _update = await crate.mongo.Cos.test.updateOne(_data, { $set: _to })
  let _gets = await crate.mongo.Cos.test.findOne(_data)
  let _del = await crate.mongo.Cos.test.deleteOne(_data)
  
  let _result = await crate.mongo.Transfer(async session => {
    let _get = await crate.mongo.Cos.test.findOne(_data, { session })
    let _set = await crate.mongo.Cos.test.insertOne(_data, { session })
    let _update = await crate.mongo.Cos.test.updateOne(_data, { $set: _to }, { session })
    let _gets = await crate.mongo.Cos.test.findOne(_data, { session })
    let _del = await crate.mongo.Cos.test.deleteOne(_data, { session })
    expect(_get).toBeNull()
    expect(_set.result.n).toBe(1)
    expect(_update.result.n).toBe(1)
    expect(_gets).toEqual(Object.assign(_data, _to))
    expect(_del.result.n).toBe(1)
    return true
  })
  
  crate.mongo.Watch("change", target => {
    let { ns: { coll }, operationType } = target
    let _type = [ "insert", "delete" ][_events]
    expect(coll).toBe("test")
    expect(operationType).toBe(_type)
    _events ++
  })
  
  void await crate.mongo.Cos.test.insertOne(_data)
  void await crate.mongo.Cos.test.deleteOne(_data)
  
  expect(_get).toBeNull()
  expect(_set.result.n).toBe(1)
  expect(_update.result.n).toBe(1)
  expect(_gets).toEqual(Object.assign(_data, _to))
  expect(_del.result.n).toBe(1)
  expect(_result).toBe(true)
}, 10000)