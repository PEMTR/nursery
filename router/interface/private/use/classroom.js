"use strict"


// package
// @package
const { Schema } = require("lazy_mod/validate")
const express = require("lazy_mod/express")
const router = express.Router()


// 获取班级饮水量排名
router.get("/cup/:cup/sort", Schema({
  temp: require("./schema/cpu.json")
}, async function (req) {
  return req.params
}), async function (req) {
  let { _id } = req.user
  let { cup } = req.params
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  return await req.crate.cache.Classroom.waterSort({
    userId, cupId
  })
})


// 获取班级饮水目标
router.get("/cup/:cup/standard", Schema({
  temp: require("./schema/cpu.json")
}, async function (req) {
  return req.params
}), async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  return await req.crate.cache.Classroom.waterStandard({
    userId, cupId
  })
})


// 获取活动列表
router.get("/cup/:cup/trend", Schema({
  temp: require("./schema/classroom.cpu.trend.json")
}, async function (req) {
  req.query.page = Number(req.query.page)
  req.query.limit = Number(req.query.limit)
  return { ...req.params, ...req.query }
}), async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  let { skip, limit } = req.crate.util.pagination(req.ctx)
  return await req.crate.cache.Classroom.trend({ 
    userId, cupId, skip, limit 
  })
})


// export.
module.exports = router