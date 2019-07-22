"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 用户状态
router.use(async function (req, _, next) {
  try {
    
    // 解析用户token
    // 取出缓存状态
    let auth = req.headers.authorization || req.cookies.Authorization
    req.user = auth ? await req.crate.decrypt.parseUserAuthToken(auth) : false
  } catch (_) {
    
    // 取出错误
    req.user = false
  }
  
  // 递交
  next()
})


// 路由表
router.use("/user", require("./use/user"))
router.use("/cup", require("./use/cup"))
router.use("/member", require("./use/member"))


// export.
module.exports = router