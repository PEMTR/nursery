"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户所在家庭所有成员
router.get("/", async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.mongo.Family.users(userId)
})


// 删除家庭成员
router.delete("/:family/:user", async function (req) {
  let { family, user } = req.params
  let { _id } = req.user
  
  // 验证参数
  req.crate.schema.eq("private.family.remove.user", {
    family, user
  })
  
  // 索引
  let familyId = req.crate.util.createHexId(family)
  let fromId = req.crate.util.createHexId(user)
  let userId = req.crate.util.createHexId(_id)
  
  // 删除成员
  return await req.crate.model.mongo.Family.remove(familyId, fromId, userId)
})


// export.
module.exports = router