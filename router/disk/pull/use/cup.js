"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()
const path = require("path")
const fs = require("fs")


// 写入响应流
// @params {stream} write
// @params {string} path
// @return {Promise<void>}
// @private
function WriteStream (write, path) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .on("error", reject)
      .on("end", resolve)
      .pipe(write)
  })
}


// 获取取水动画
router.get("/:cup/animation", async function (req, res) {
  let name = "test.mp4"
  let _dir = req.crate.configure.stage.path
  let _path = path.join(_dir, name)
  void await WriteStream(res, _path)
})


// 获取取水语音
router.get("/:cup/audio", async function (req, res) {
  let name = "test.mp3"
  let _dir = req.crate.configure.stage.path
  let _path = path.join(_dir, name)
  void await WriteStream(res, _path)
})


// export.
module.exports = router