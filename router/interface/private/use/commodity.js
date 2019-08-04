"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 兑换虚拟商品
router.get("/mock/:commodity/:count", async function (req) {
  let { commodity, count } = req.params
  let { _id } = req.user
  
  // 转类型
  count = Number(count)
  
  // 验证参数
  req.crate.schema.eq("private.commodity.user.get.mock", {
    count, commodity
  })
  
  // 推送消息队列
  // 提交核心服务
  return await req.crate.rabbitx.SendTransfer("CoreWater", {
    data: { commodity, count, user: _id, count },
    type: "ExchangeMock"
  })
})


// export.
module.exports = router