"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 兑换虚拟商品
router.get("/mock/:commodity/:count", async function (req) {
  req.params.count = Number(req.params.count)
  let { commodity, count } = req.params
  let { _id } = req.user
  req.crate.schema.eq("private.commodity.user.get.mock", { count, commodity })
  return await req.crate.rabbitx.SendTransfer("CoreWater", {
    data: { commodity, count, user: _id, count },
    type: "ExchangeMock"
  })
})


// export.
module.exports = router