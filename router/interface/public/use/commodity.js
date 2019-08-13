"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取虚拟商品列表
router.get("/mock", async function (req) {
  return await req.crate.cache.Commodity.mocks()
})


// export.
module.exports = router