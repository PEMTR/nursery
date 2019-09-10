"use strict"


// package
// @package
const { Zone } = require("@mod/quasipaa")
const express = require("lazy_mod/express")
const router = express.Router()


// 获取所有成就列表
router.get("/all", Zone("achievement.all", async function () {
  return { Achievement: "all" }
}, async function (req) {
  return await req.crate.model.Mongo.Achievement.all()
}, async function () {
  return {
    AchievementClass: "all",
    Achievement: "all"
  }
}))


// export.
module.exports = router