"use strict"


// package
// @package
const assert = require("assert").strict
const express = require("lazy_mod/express")
const router = express.Router()


// 路由表
router.use("/commodity", require("./use/commodity"))
router.use("/achievement", require("./use/achievement"))
router.use("/animation", require("./use/animation"))
router.use("/audio", require("./use/audio"))


// export.
module.exports = router