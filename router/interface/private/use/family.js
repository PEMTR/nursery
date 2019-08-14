"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户所在家庭所有成员
router.get("/", async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.Mongo.Family.users({ userId })
})


// 删除家庭成员
router.delete("/:family/:user", async function (req) {
  let { family, user } = req.params
  let { _id } = req.user
  req.crate.schema.eq("private.family.remove.user", req.params)
  let userId = req.crate.util.createHexId(_id)
  let fromId = req.crate.util.createHexId(user)
  let familyId = req.crate.util.createHexId(family)
  return await req.crate.model.Mongo.Family.remove({ familyId, fromId, userId })
})


// export.
module.exports = router