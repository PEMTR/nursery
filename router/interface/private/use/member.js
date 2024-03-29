"use strict"

// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户会员信息
router.get("/", async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.Mongo.Member.find({ userId })
})


// export.
module.exports = router