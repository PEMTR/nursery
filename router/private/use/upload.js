"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 水杯上传用户头像
router.get("/:cup/avatar", async function (req) {
  let { _id } = req.user
  let { cup } = req.params
  
  // 验证参数
  req.crate.schema.eq("private.upload.cup.avatar", {
    user: _id, cup
  })
  
  // 索引
  let user_id = req.crate.util.createHexId(_id)
  let cup_id = req.crate.util.createHexId(cup)
  
  
})


// export.
module.exports = router