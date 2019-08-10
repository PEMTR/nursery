"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取缓存
router.get("/", async function (req) {
  let { key } = req.body
  let data = await req.crate.factory.Get(key)
  return { data }
})


// 设置缓存
router.post("/", async function (req) {
  let { key, model, value } = req.body
  void await req.crate.factory.Set(key, model, value)
  return { result: true }
})


// export.
module.exports = router