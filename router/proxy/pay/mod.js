"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 路由表
router.use("/wechat", require("./use/wechat"))


// export.
module.exports = router