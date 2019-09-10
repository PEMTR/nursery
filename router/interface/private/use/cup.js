"use strict"


// package
// @package
const { Zone } = require("@mod/quasipaa")
const { Schema } = require("@mod/validator")
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
  cup: { type: "objectId" },
  notice: { type: "boolean" }
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
  cup: { type: "objectId" }
}, async function (req) {
  return req.params
}), Zone("cup.animation", async function (req) {
  req.ctx.user = req.user._id
  return req.ctx
}, async function (req) {
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  let userId = req.crate.util.createHexId(req.ctx.user)
  return await req.crate.model.Mongo.Animation.cup({ cupId, userId })
}, async function (data) {
  return {
    CupAnimation: String(data._id)
  }
}))


// 获取水杯取水语音
router.get("/:cup/audio", Schema({
  cup: { type: "objectId" }
}, async function (req) {
  return req.params
}), Zone("cup.audio", async function (req) {
  req.ctx.user = req.user._id
  return req.ctx
}, async function (req) {
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  let userId = req.crate.util.createHexId(req.ctx.user)
  return await req.crate.model.Mongo.Audio.cup({ cupId, userId })
}, async function (data) {
  return {
    CupAudio: String(data._id)
  }
}))


// 设置水杯取水动画
router.put("/:cup/animation/:animation", Schema({
  cup: { type: "objectId" },
  animation: { type: "objectId" }
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
  cup: { type: "objectId" },
  audio: { type: "objectId" }
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