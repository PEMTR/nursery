"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取班级饮水量排名
router.get("/cup/:cup/sort", async function (req) {
  let { _id } = req.user
  let { cup } = req.params
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(cup)
  return await req.crate.cache.Classroom.waterSort({ userId, cupId })
})


// 获取班级饮水目标
router.get("/cup/:cup/standard", async function (req) {
  let { _id } = req.user
  let { cup } = req.params
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(cup)
  return await req.crate.cache.Classroom.waterStandard({ userId, cupId })
})


// 获取活动列表
router.get("/cup/:cup/trend", async function (req) {
  let { _id } = req.user
  let { cup } = req.params
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(cup)
  let { skip, limit } = req.crate.util.pagination(req.query)
  return await req.crate.cache.Classroom.trend({ userId, cupId, skip, limit })
})


// export.
module.exports = router