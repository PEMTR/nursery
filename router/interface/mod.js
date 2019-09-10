"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


router.use("*", async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Allow-Methods","*")
    next()
})


// 路由表
router.use("/public", require("./public/mod"))
router.use("/private", require("./private/mod"))
router.use("/manage", require("./manage/mod"))


// export.
module.exports = router