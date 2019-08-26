"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()
const path = require("path")


// 获取取水照片
router.get("/image/:name", async function (req, res) {
  let { name } = req.params
  let _dir = req.crate.configure.stage.path
  void await req.crate.referer.stream(path.join(_dir, name), res)
})


// export.
module.exports = router