"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 路由表
router.use("/public", require("./public/mod"))
router.use("/private", require("./private/mod"))
router.use("/manage", require("./manage/mod"))


// export.
module.exports = router