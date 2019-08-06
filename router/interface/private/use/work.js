"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取任务信息
router.get("/", async function (req) {
  let { _id } = req.user
  return await req.crate.model.mongo.Work.dayWorks({
    userId: req.crate.util.createHexId(_id)
  })
})


// 分享小象公众号
router.post("/share/wechat", async function (req) {
  return await req.crate.rabbitx.SendTransfer("CoreWater", {
    type: "ShareWechatPublicNumber",
    data: { user: req.user._id }
  })
})


// export.
module.exports = router