"use strict"

// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户信息
router.get("/", async function (req) {
  return req.user
})


// export.
module.exports = router