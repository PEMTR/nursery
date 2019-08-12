"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取所有成就列表
router.get("/all", async function (req) {
  return await req.crate.cache.Achievement.all()
})


// export.
module.exports = router