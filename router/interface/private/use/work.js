"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取任务信息
router.get("/", async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.Mongo.Work.dayWorks({ userId })
})


// 分享小象公众号
router.post("/share/wechat", async function (req) {
  return (await req.crate.rabbitx.SendTransfer("CoreWater", {
    type: "ShareWechatPublicNumber",
    data: { user: req.user._id }
  })).as("boolean")
})


// export.
module.exports = router