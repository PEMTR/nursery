"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户绑定的水杯列表
router.get("/all", async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.mongo.UserCups.finds(userId)
})


// 用户设置水杯提醒
router.put("/:cups/notice", async function (req) {
  let { _id } = req.user
  let { cups } = req.params
  let { boolean } = req.body
  
  // 验证参数
  req.crate.schema.eq("private.cup.set.notice", {
    cups, boolean
  })
  
  // 索引
  let userId = req.crate.util.createHexId(_id)
  let userCupsId = req.crate.util.createHexId(cups)
  
  // 更新
  return await req.crate.model.mongo.UserCups.setNotice({
    _id: userCupsId,
    user: userId,
    notice: boolean
  })
})


// export.
module.exports = router