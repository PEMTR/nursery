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
  temp: require("./.schema/cpu.json")
}, async function (req) {
  return req.params
}), async function (req) {
  let { _id } = req.user
  let { cup } = req.params
  let cupId = req.crate.util.createHexId(cup)
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.Mongo.Cups.setNotice({ cupId, userId, notice })
})


// 获取水杯取水动画
router.get("/:cup/animation", Schema({
  temp: require("./.schema/cpu.json")
}, async function (req) {
  return req.params
}), async function (req) {
  let { _id } = req.user
  let { cup } = req.params
  let cupId = req.crate.util.createHexId(cup)
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.Mongo.Animation.cup({ cupId, userId })
})


// 获取水杯取水语音
router.get("/:cup/audio", Schema({
  temp: require("./.schema/cpu.json")
}, async function (req) {
  return req.params
}), async function (req) {
  let { _id } = req.user
  let { cup } = req.params
  let cupId = req.crate.util.createHexId(cup)
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.Mongo.Audio.cup({ cupId, userId })
})


// 设置水杯取水动画
router.put("/:cup/animation/:animation", async function (req) {
  let { _id } = req.user
  let { cup, animation } = req.params
  let cupId = req.crate.util.createHexId(cup)
  let userId = req.crate.util.createHexId(_id)
  let animationId = req.crate.util.createHexId(animation)
  return await req.crate.model.Mongo.Animation.cupSet({ animationId, cupId, userId })
})


// 设置水杯取水语音
router.put("/:cup/audio/:audio", async function (req) {
  let { _id } = req.user
  let { cup, audio } = req.params
  let cupId = req.crate.util.createHexId(cup)
  let userId = req.crate.util.createHexId(_id)
  let audioId = req.crate.util.createHexId(audio)
  return await req.crate.model.Mongo.Audio.cupSet({ audioId, userId, cupId })
})


// export.
module.exports = router