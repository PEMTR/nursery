"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.router()


// 路由表
router.use("/manage", require("./manage/mod"))


// export.
module.exports = router