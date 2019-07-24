"use strict"


// package
// @package
const assert = require("assert").strict
const express = require("lazy_mod/express")
const router = express.Router()


// 路由表
router.use("/commodity", require("./use/commodity"))


// export.
module.exports = router