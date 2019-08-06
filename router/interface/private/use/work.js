"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取任务信息
router.get("/", async function (req) {
  
})


// 分享小象公众号
router.post("/share/wechat", async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  
})


// export.
module.exports = router