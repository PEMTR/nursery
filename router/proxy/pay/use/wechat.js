"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 微信支付回调
router.post("/", async function (req) {
  let { } = req.crate.util.unwind(req.body.xml)
})


// export.
module.exports = router