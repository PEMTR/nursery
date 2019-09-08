"use strict"


// package
// @package
const { Schema } = require("@mod/validator")
const express = require("lazy_mod/express")
const router = express.Router()
const path = require("path")


// 获取取水照片
router.get("/image/:name", async function (req, res) {
  let { name } = req.params
  let { stage } = req.crate.configure
  let filePath = path.join(stage.path, name)
  void await req.crate.referer.stream(filePath, res)
})


// export.
module.exports = router