"use strict"


// package
// @package
const { Schema } = require("lazy_mod/validate")
const express = require("lazy_mod/express")
const router = express.Router()


// 获取用户绑定的水杯列表
router.get("/all", async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.Mongo.Cups.finds({ userId })
})


// 用户设置水杯提醒
router.put("/:cup/notice/:notice", Schema({
  temp: require("./schema/cup.notice.json")
}, async function (req) {
  req.crate.util.toBoolean(req.params.notice)
  return req.params
}), async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  return await req.crate.model.Mongo.Cups.setNotice({
    notice: req.ctx.notice,
    cupId, userId
  })
})


// 获取水杯取水动画
router.get("/:cup/animation", Schema({
  temp: require("./schema/cup.json")
}, async function (req) {
  return req.params
}), async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  return await req.crate.model.Mongo.Animation.cup({ 
    cupId, userId 
  })
})


// 获取水杯取水语音
router.get("/:cup/audio", Schema({
  temp: require("./schema/cup.json")
}, async function (req) {
  return req.params
}), async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  return await req.crate.model.Mongo.Audio.cup({
    cupId, userId 
  })
})


// 设置水杯取水动画
router.put("/:cup/animation/:animation", Schema({
  temp: require("./schema/cup.animation.json")
}, async function (req) {
  return req.params
}), async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  let animationId = req.crate.util.createHexId(req.ctx.animation)
  return await req.crate.model.Mongo.Animation.cupSet({ 
    animationId, cupId, userId 
  })
})


// 设置水杯取水语音
router.put("/:cup/audio/:audio", Schema({
  temp: require("./schema/cup.audio.json")
}, async function (req) {
  return req.params
}), async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  let audioId = req.crate.util.createHexId(req.ctx.audio)
  return await req.crate.model.Mongo.Audio.cupSet({ 
    audioId, userId, cupId 
  })
})


// export.
module.exports = router