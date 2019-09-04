"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户所有成就列表
router.get("/", function (req, _, next) {
  let { _id } = req.user
  req.ctx.userId = req.crate.util.createHexId(_id)
  next()
  
}, async function (req) {
  return await req.crate.cache.Achievement.user(req.ctx)
})


// export.
module.exports = router