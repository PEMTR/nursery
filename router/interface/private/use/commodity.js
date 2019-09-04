"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 兑换虚拟商品
router.get("/mock/:commodity/:count", Schema({
  temp: require("test.json")
}, function (req) {
  let { _id } = req.user
  req.params.count = Number(req.params.count)
  return { ...req.params, _id }
}), async function (req) {
  return await req.crate.broker.call("v1.Water.ExchangeMock", req.ctx, { 
    nodeID: "core" 
  })
})


// export.
module.exports = router