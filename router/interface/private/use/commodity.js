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
  
  // 推送消息队列
  return await req.crate.rabbitx.Send("CoreExchange", {
    commodityId, userId, count
  }) || true
})


// export.
module.exports = router