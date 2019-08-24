"use strict"


// package
// @package
const path = require("path")
const util = require("../util")
const redix = require("../redis")
const decryptx = require("../decrypt")
const _file = "../../configure/.dev.toml"
const _config = path.join(__dirname, _file)
const configure = util.readtoml(_config)
const redis = new redix({ configure })
const decrypt = new decryptx({ util, configure, redis })


// 测试完成之后断开链接
afterEach(async function () {
  void await redis.ready()
  redis.close()
})


test("decrypt", async function () {
  void await redis.ready()
  
  // 用户信息
  let _user = {
    "_id":"5d35159d337dcc22f37d0a8d",
    "type":0,
    "username":"panda",
    "password":"1198",
    "nick_name":"Mr.Panda",
    "phone":"13126434557",
    "avatar":"./avatar.png",
    "status":1,
    "date":"1563760081317",
    "update":"1563760081317"
  }
  
  // 测试处理是否正常
  let token = await decrypt.toUserAuthToken(_user)
  let _to = await decrypt.parseUserAuthToken(token) 
  expect(_to).toEqual({ ..._user, token })
}, 10000)