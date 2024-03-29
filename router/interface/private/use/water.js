"use strict"

// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户水滴信息
router.get("/", async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.Mongo.Water.find({ userId })
})


// export.
module.exports = router