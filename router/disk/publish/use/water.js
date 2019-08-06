"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 上传取水语音
router.post("/audio", async function (req) {
  let { stream, name } = req.crate.multer.createWriteStream()
  console.log(await req.crate.multer.from(req, stream), name)
  return true
})


// export.
module.exports = router