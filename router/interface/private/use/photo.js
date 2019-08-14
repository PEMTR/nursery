"use strict"

// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取水杯取水照片
router.get("/:cup", async function (req) {
  let { _id } = req.user
  let { cup } = req.params
  let { lte, gte } = req.query
  let { skip, limit } = req.crate.util.pagination(req.query)
  req.crate.schema.eq("pagination", { skip, limit })
  lte = Number(lte), gte = Number(gte)
  req.crate.schema.eq("private.photo.cup", { cup, lte, gte })
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(cup)
  let _params = { userId, cupId, lte, gte, skip, limit }
  return await req.crate.model.Mongo.Cups.photo(_params)
})


// export.
module.exports = router