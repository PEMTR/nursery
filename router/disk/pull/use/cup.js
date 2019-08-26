"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()
const path = require("path")


// 获取取水动画
router.get("/:cup/animation", async function (req, res) {
  let name = "test.mp4"
  let _dir = req.crate.configure.stage.path
  void await req.crate.util.WriteStream(res, path.join(_dir, name))
})


// 获取取水语音
router.get("/:cup/audio", async function (req, res) {
  let name = "test.mp3"
  let _dir = req.crate.configure.stage.path
  void await req.crate.util.WriteStream(res, path.join(_dir, name))
})


// export.
module.exports = router