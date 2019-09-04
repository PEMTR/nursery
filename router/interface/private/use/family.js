"use strict"


// package
// @package
const { Schema } = require("lazy_mod/validate")
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户所在家庭所有成员
router.get("/", async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.Mongo.Family.users({ userId })
})


// 删除家庭成员
router.delete("/:family/:user", Schema({
  temp: require("./scheam/family.delete.json")
}, async function (req) {
  return req.params
}), async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  let fromId = req.crate.util.createHexId(req.ctx.user)
  let familyId = req.crate.util.createHexId(req.ctx.family)
  return await req.crate.model.Mongo.Family.remove({ 
    familyId, fromId, userId 
  })
})


// export.
module.exports = router