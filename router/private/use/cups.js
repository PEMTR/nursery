"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户绑定的水杯列表
router.get("/user", async function (req) {
  let { _id } = req.user
  let user_id = req.crate.util.createHexId(_id)
  return await req.crate.model.mongo.UserCups.finds(user_id)
})


// export.
module.exports = router