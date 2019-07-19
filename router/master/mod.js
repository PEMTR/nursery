"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 用户状态
router.use(async function (req, _, next) {
  try {
    let auth = req.headers.authorization || req.cookies.Authorization
    req.user = auth ? await req.crate.decrypt.parseUserAuthToken(auth) : false
  } catch (_) {
    req.user = false
  }
    
  next()
})


// export.
module.exports = router