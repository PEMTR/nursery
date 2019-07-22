"use strict"


// package
// @package
const assert = require("assert").strict
const express = require("lazy_mod/express")
const router = express.Router()


// 用户状态
router.use(async function (req, _, next) {
  let auth = req.headers.authorization || req.cookies.Authorization
  assert.deepStrictEqual(typeof auth, "string", "E.AUTH")
  req.user = await req.crate.decrypt.parseUserAuthToken(auth)
  next()
})


// 路由表
router.use("/user", require("./use/user"))
router.use("/cups", require("./use/cups"))
router.use("/member", require("./use/member"))
router.use("/water", require("./use/water"))


// export.
module.exports = router