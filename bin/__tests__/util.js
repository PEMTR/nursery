"use strict"


// package
// @package
const path = require("path")
const util = require("../util")


test("加载配置文件", function () {
  let _out = { a: { b: 1 } }
  let _file = path.join(__dirname, ".test.toml")
  let _toml = util.readtoml(_file)
  expect(_toml).toEqual(_out)
})


test("计算MD5", function () {
  let _str = "hello"
  let _out = "5d41402abc4b2a76b9719d911017c592"
  expect(util.md5(_str)).toBe(_out)
})


test("HMAC SHA256", function () {
  let _key = "hello"
  let _str = "word"
  let _out = "MWNhNjkyNzdkMDM3MTJkOTI2OGZlZmMwOGIwZGFlMjY0YzI5ZmI5YmI0YjIxYTNlMjJhZWY2MjExOGRlMzVmNQ=="
  expect(util.hmacSHA256(_key, _str)).toBe(_out)
})


test("加密", function () {
  let text = "hello"
  let key = "ZDQxZTQ4OGM4MTg4ZDkYzljNjYIyNzcy"
  let type = "aes256"
  let iv = "1234567890123456"
  let option = { text, key, type, iv }
  let _out = "b4178a68cc1fe0e1ebad88c7184d2827"
  expect(util.decrypt(option)).toBe(_out)
})


test("解密", function () {
  let text = "b4178a68cc1fe0e1ebad88c7184d2827"
  let key = "ZDQxZTQ4OGM4MTg4ZDkYzljNjYIyNzcy"
  let type = "aes256"
  let iv = "1234567890123456"
  let option = { text, key, type, iv }
  let _out = "hello"
  expect(util.encrypt(option)).toBe(_out)
})


test("判断是否为IP地址", function () {
  let _ip = "192.168.3.1"
  let _not = "192.168.300"
  expect(util.isValidIP(_ip)).toBe(true)
  expect(util.isValidIP(_not)).toBe(false)
})


test("判断是否超时", function () {
  let _time = Date.now() - 5000
  expect(util.timeout(_time, 10000)).toBe(false)
  expect(util.timeout(_time, 1000)).toBe(true)
})


test("判断是否为ObjectId", function () {
  let _not = "hello"
  let _id = "5c9f5e9226a6a67deb34f288"
  expect(util.isValidOID(_id)).toBe(true)
  expect(util.isValidOID(_not)).toBe(false)
})


test("判断是否为NULL", function () {
  expect(util.isNullValue(null)).toBe(false)
  expect(util.isNullValue(true)).toBe(true)
})


test("判断是否手机号码", function () {
  let _phone = "13126434557"
  let _not = "1198100147"
  expect(util.isPoneAvailable(_phone)).toBe(true)
  expect(util.isPoneAvailable(_not)).toBe(false)
})


test("判断是否为邮箱", function () {
  let _email = "xivistudios@gmail.com"
  let _not = "1198100147"
  expect(util.isEmail(_email)).toBe(true)
  expect(util.isEmail(_not)).toBe(false)
})


test("对象数组展平", function () {
  let _out = { a: 0 }
  let _temp = { a: [0] }
  expect(util.unwind(_temp)).toEqual(_out)
})


test("翻页参数过滤", function () {
  let _page = { page: "10", limit: "20" }
  let _out = { skip: 180, limit: 20 }
  expect(util.pagination(_page)).toEqual(_out)
})


test("参数保证", function () {
  expect(util.promise(true)).toBe(true)
})


test("正整数检查", function () {
  let _number = 10
  let _not = 10.01
  expect(util.Integer(_number)).toBe(true)
  expect(util.Integer(_not)).toBe(false)
})


test("重试函数", async function () {
  let _limit = 0
  let _out = await util.Retry(3, async _ => { return 1 })
  try { void await util.Retry(3, async i => {
    expect(_limit).toBe(i)
    _limit += 1
    throw new Error()
  }) } catch {}
  expect(_out).toBe(1)
  expect(_limit).toBe(3)
})