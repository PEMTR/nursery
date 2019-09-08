"use strict"


// package
// @package
const { Zone } = require("@mod/quasipaa")
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户所有成就列表
router.get("/", Zone("achievement.user", async function (req) {
  return { user: req.user._id }
}, async function (req, _, params) {
  let userId = req.crate.util.createHexId(params.user)
  return await req.crate.model.Mongo.Achievement.user({ userId })
}, async function (data) {
  return { 
    UserAchievements: data.map(v => {
      return String(v._id)
    })
  }
}))


// export.
module.exports = router