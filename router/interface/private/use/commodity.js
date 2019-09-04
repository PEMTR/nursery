"use strict"


// package
// @package
const { Schema } = require("lazy_mod/validate")
const express = require("lazy_mod/express")
const router = express.Router()


// 兑换虚拟商品
router.get("/mock/:commodity/:count", Schema({
  temp: require("./schema/commodity.user.get.mock.json")
}, async function (req) {
  req.params.count = Number(req.params.count)
  return req.params
}), async function (req) {
  let { _id } = req.user
  let { commodity, count } = req.ctx
  return await req.crate.broker.call("v1.Water.ExchangeMock", {
    commodity, count, user: _id
  }, { nodeID: "core" })
})


// export.
module.exports = router