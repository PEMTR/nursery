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

  // 更新
  return await req.crate.model.mongo.Commodity.get({
    commodityId: req.crate.util.createHexId(commodity), 
    userId: req.crate.util.createHexId(_id), 
    count
  })
})


// export.
module.exports = router