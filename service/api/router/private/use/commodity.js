"use strict"

// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 兑换虚拟商品
router.get("/mock/:commodity/:count", async function (req) {
  let { commodity, count } = req.params
  let { _id } = req.user
  
  // 验证参数
  req.crate.schema.eq("private.commodity.user.get.mock", {
    count: Number(count),
    commodity
  })
  
  // 索引
  let userId = req.crate.util.createHexId(_id)
  let commodityId = req.crate.util.createHexId(commodity)
  
  // 更新
  return await req.crate.model.mongo.Commodity.get(userId, commodityId, count)
})


// export.
module.exports = router