"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取班级饮水量排名
router.get("/cup/:cup/sort", function (req, _, next) {
  let { _id } = req.user
  let { cup } = req.params
  req.ctx.userId = req.crate.util.createHexId(_id)
  req.ctx.cupId = req.crate.util.createHexId(cup)
  next()
  
}, async function (req) {
  return await req.crate.cache.Classroom.waterSort(req.ctx)
})


// 获取班级饮水目标
router.get("/cup/:cup/standard", function (req, _, next) {
  let { _id } = req.user
  let { cup } = req.params
  req.ctx.userId = req.crate.util.createHexId(_id)
  req.ctx.cupId = req.crate.util.createHexId(cup)
  next()
  
}, async function (req) {
  return await req.crate.cache.Classroom.waterStandard(req.ctx)
})


// 获取活动列表
router.get("/cup/:cup/trend", function (req, _, next) {
  let { _id } = req.user
  let { cup } = req.params
  let { skip, limit } = req.crate.util.pagination(req.query)
  req.ctx.userId = req.crate.util.createHexId(_id)
  req.ctx.cupId = req.crate.util.createHexId(cup)
  req.ctx.limit = limit
  req.ctx.skip = skip
  next()
  
}, async function (req) {
  return await req.crate.cache.Classroom.trend(req.ctx)
})


// export.
module.exports = router