"use strict"


// package
// @package
const assert = require("assert").strict
const express = require("lazy_mod/express")
const router = express.Router()


// OPTIONS
router.options("*", function (_, res) {
  res.status(200).end()
})


// 用户状态
router.use(async function (req, _, next) {
  let auth = req.headers.authorization || req.cookies.Authorization
  assert.deepStrictEqual(typeof auth, "string", "E.AUTH")
  req.user = await req.crate.decrypt.parseUserAuthToken(auth)
  next()
})


// 路由表
router.use("/user", require("./use/user"))
router.use("/cup", require("./use/cup"))
router.use("/member", require("./use/member"))
router.use("/water", require("./use/water"))
router.use("/family", require("./use/family"))
router.use("/commodity", require("./use/commodity"))
router.use("/achievement", require("./use/achievement"))
router.use("/signin", require("./use/signin"))
router.use("/classroom", require("./use/classroom"))


// export.
module.exports = router