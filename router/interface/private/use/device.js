"use strict"


// package
// @package
const { Schema } = require("lazy_mod/validate")
const express = require("lazy_mod/express")
const router = express.Router()


// 获取水杯关联设备水质信息
router.get("/cup/:cup/water/quality", Schema({
  temp: require("./schema/cup.json")
}, async function (req) {
  return req.params
}), async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  return await req.crate.model.Mongo.Device.waterQuality({ 
    cupId, userId 
  })
})


// export.
module.exports = router