"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户签到信息
router.get("/", async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.Mongo.SignIn.signIns({ userId })
})


// 用户签到
router.post("/", async function (req) {
  return (await req.crate.rabbitx.SendTransfer("CoreWater", {
    data: { user: req.user._id },
    type: "SignIn"
  })).as("boolean")
})


// export.
module.exports = router