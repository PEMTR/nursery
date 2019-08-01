"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取取水动画列表
router.get("/", async function (req) {
  let { skip, limit } = req.crate.util.pagination(req.query)
  req.crate.schema.eq("pagination", { skip, limit })
  return await req.crate.model.mongo.Animation.iter({ skip, limit })
})


// export.
module.exports = router