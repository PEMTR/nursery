"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.router()


// 路由表
router.use("*", require("./role"))


// export.
module.exports = router