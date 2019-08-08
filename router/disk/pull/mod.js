"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 路由表
router.use("/water", require("./use/water"))


// export.
module.exports = router