"use strict"


// package
// @package
const { Zone } = require("@mod/quasipaa")
const { Schema } = require("@mod/validator")
const express = require("lazy_mod/express")
const router = express.Router()


// 获取班级饮水量排名
router.get("/cup/:cup/sort", Schema({
  cup: { type: "objectId" }
}, async function (req) {
  return req.params
}), Zone("classroom.water.sort", async function (req) {
  let { after, before } = req.crate.util.DaySplit()
  req.ctx.user = req.user._id
  req.ctx.before = before
  req.ctx.after = after
  return req.ctx
}, async function (req, _, _, ctx) {
  let { after, before } = req.ctx
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  let userId = req.crate.util.createHexId(req.ctx.user)
  return await req.crate.model.Mongo.Classroom.waterSort({ 
    userId, cupId, after, before 
  }, ctx)
}, async function (data, ctx) {
  return {
    UserCups: String(ctx._id),
    CupWaters: data.map(({ _id }) => String(_id)),
    Cups: data.map(({ cup: { _id } }) => String(_id))
  }
}))


// 获取班级饮水目标
router.get("/cup/:cup/standard", Schema({
  cup: { type: "objectId" }
}, async function (req) {
  return req.params
}), Zone("classroom.water.standard", async function (req) {
  req.ctx.user = req.user._id
  return req.ctx
}, async function (req) {
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  let userId = req.crate.util.createHexId(req.ctx.user)
  return await req.crate.model.Mongo.Classroom.waterStandard({ userId, cupId })
}, async function (data) {
  return {
    Classroom: String(data._classroom),
    UserCups: String(data._id),
    Cups: String(data._cup)
  }
}))


// 获取活动列表
router.get("/cup/:cup/trend", Schema({
  cup: { type: "objectId" },
  page: { type: "number", integer: true, max: 999, mim: 1, optional: true },
  limit: { type: "number", integer: true, max: 100, mim: 1, optional: true }
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