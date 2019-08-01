"use strict"

// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户水滴信息
router.get("/", async function (req) {
  let { _id } = req.user
  return await req.crate.model.mongo.Water.find({
    userId: req.crate.util.createHexId(_id)
  })
})


// export.
module.exports = router