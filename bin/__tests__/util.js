"use strict"

const path = require("path")
const util = require("../util")

const TOML_OUT = { a: { b: 1 } }
const TOML_FILE = path.join(__dirname, ".test.toml")
const MD5_STR = "hello"
const MD5_OUT = "5d41402abc4b2a76b9719d911017c592"
const HMAC_KEY = "hello"
const HMAC_STR = "word"
const HMAC_OUT = "MWNhNjkyNzdkMDM3MTJkOTI2OGZlZmMwOGIwZGFlMjY0YzI5ZmI5YmI0YjIxYTNlMjJhZWY2MjExOGRlMzVmNQ=="
const DECRYPT_OPT = { text: "hello", key: "ZDQxZTQ4OGM4MTg4ZDkYzljNjYIyNzcy", type: "aes256", iv: "1234567890123456" }
const DECRYPT_OUT = "b4178a68cc1fe0e1ebad88c7184d2827"
const ENCRYPT_OPT = { text: "b4178a68cc1fe0e1ebad88c7184d2827", key: "ZDQxZTQ4OGM4MTg4ZDkYzljNjYIyNzcy", type: "aes256", iv: "1234567890123456" }
const ENCRYPT_OUT = "hello"
const IP = "192.168.3.1"
const IP_NOT = "192.168.300"
const TIME = Date.now() - 5000
const OBJECTID_NOT = "hello"
const OBJECTID = "5c9f5e9226a6a67deb34f288"
const PHONE = "13126434558"
const PHONE_NOT = "1198100147"
const EMAIL = "xivistudios@gmail.com"
const EMIAL_NOT = "1198100147"
const UNWIND_OUT = { a: 0 }
const UNWIND_TEMP = { a: [0] }
const PAGE = { page: "10", limit: "20" }
const PAGE_OUT = { skip: 180, limit: 20 }
const INT_NUMBER = 10
const INT_NUMBER_NOT = 10.01

test("util", async () => {
  expect(util.readtoml(TOML_FILE)).toEqual(TOML_OUT)
  expect(util.md5(MD5_STR)).toBe(MD5_OUT)
  expect(util.hmacSHA256(HMAC_KEY, HMAC_STR)).toBe(HMAC_OUT)
  expect(util.decrypt(DECRYPT_OPT)).toBe(DECRYPT_OUT)
  expect(util.encrypt(ENCRYPT_OPT)).toBe(ENCRYPT_OUT)
  expect(util.isValidIP(IP)).toBe(true)
  expect(util.isValidIP(IP_NOT)).toBe(false)
  expect(util.timeout(TIME, 10000)).toBe(false)
  expect(util.timeout(TIME, 1000)).toBe(true)
  expect(util.isValidOID(OBJECTID)).toBe(true)
  expect(util.isValidOID(OBJECTID_NOT)).toBe(false)
  expect(util.isNullValue(null)).toBe(false)
  expect(util.isNullValue(true)).toBe(true)
  expect(util.isPoneAvailable(PHONE)).toBe(true)
  expect(util.isPoneAvailable(PHONE_NOT)).toBe(false)
  expect(util.isEmail(EMAIL)).toBe(true)
  expect(util.isEmail(EMIAL_NOT)).toBe(false)
  expect(util.unwind(UNWIND_TEMP)).toEqual(UNWIND_OUT)
  expect(util.pagination(PAGE)).toEqual(PAGE_OUT)
  expect(util.promise(true)).toBe(true)
  expect(util.Integer(INT_NUMBER)).toBe(true)
  expect(util.Integer(INT_NUMBER_NOT)).toBe(false)
  expect(await util.Retry(3, async _ => 1)).toBe(1)
})