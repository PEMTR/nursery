"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取取水照片
router.get("/image/:name", async function (req) {
  let { name } = req.params
  
})


// export.
module.exports = router