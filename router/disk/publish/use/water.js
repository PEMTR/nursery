"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 上传取水语音
router.post("/audio", async function (req) {
  let { stream, name, path } = req.crate.multer.createWriteStream()
  let mime = await req.crate.multer.from(req, stream, "audio", /^audio/)
  void await req.crate.rabbitx.Send("MediaWorks", { name, mime, type: "Audio" })
  return true
})


// 上传取水照片
router.post("/image", async function (req) {
  let { stream, name, path } = req.crate.multer.createWriteStream()
  let mime = await req.crate.multer.from(req, stream, "image", /^image/)
  void await req.crate.rabbitx.Send("MediaWorks", { name, mime, type: "Image" })
  return true
})


// export.
module.exports = router