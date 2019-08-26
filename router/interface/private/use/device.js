"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取水杯关联设备水质信息
router.get("/cup/:cup/water/quality", async function (req) {
  let { _id } = req.user
  let { cup } = req.params
  let cupId = req.crate.util.createHexId(cup)
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.Mongo.Device.waterQuality({ cupId, userId })
})


// export.
module.exports = router