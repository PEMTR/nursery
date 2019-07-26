"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 路由表
router.use("/user", require("./use/user"))


// export.
module.exports = router