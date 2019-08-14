"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()
const path = require("path")
const fs = require("fs")


// 获取取水照片
router.get("/image/:name", async function (req, res) {
  let { name } = req.params
  let _dir = req.crate.configure.stage.path
  let _path = path.join(_dir, name)
  fs.createReadStream(_path).pipe(res)
})


// export.
module.exports = router