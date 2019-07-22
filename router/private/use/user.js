"use strict"

// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户信息
router.get("/", async function (req) {
  delete req.user.password
  delete req.user.username
  delete req.user.token
  return req.user
})


// export.
module.exports = router