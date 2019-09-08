"use strict"


// package
// @package
const { Schema } = require("@mod/validator")
const express = require("lazy_mod/express")
const router = express.Router()
const path = require("path")


// 获取取水动画
router.get("/:cup/animation/:name", Schema({
  cup: { type: "objectId" },
  name: { type: "string" }
}, async function (req) {
  return req.params
}), async function (req, res) {
  let { stage } = req.crate.configure
  let filePath = path.join(stage.path, req.ctx.name)
  void await req.crate.util.WriteStream(res, filePath)
})


// 获取取水语音
router.get("/:cup/audio/:name", Schema({
  cup: { type: "objectId" },
  name: { type: "string" }
}, async function (req) {
  return req.params
}), async function (req, res) {
  let { stage } = req.crate.configure
  let filePath = path.join(stage.path, req.ctx.name)
  void await req.crate.util.WriteStream(res, filePath)
})


// export.
module.exports = router