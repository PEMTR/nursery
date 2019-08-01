"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户所在家庭所有成员
router.get("/", async function (req) {
  let { _id } = req.user
  return await req.crate.model.mongo.Family.users({
    userId: req.crate.util.createHexId(_id)
  })
})


// 删除家庭成员
router.delete("/:family/:user", async function (req) {
  let { family, user } = req.params
  let { _id } = req.user
  
  // 验证参数
  req.crate.schema.eq("private.family.remove.user", {
    family, user
  })
  
  // 删除成员
  return await req.crate.model.mongo.Family.remove({
    familyId: req.crate.util.createHexId(family),
    fromId: req.crate.util.createHexId(user),
    userId: req.crate.util.createHexId(_id)
  })
})


// export.
module.exports = router