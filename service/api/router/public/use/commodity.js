"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取虚拟商品列表
router.get("/mocks", async function (req) {
  return await req.crate.model.mongo.Commodity.mocks()
})


// export.
module.exports = router