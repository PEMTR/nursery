"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取班级饮水排名
router.get("/sort/:cup/water", async function (req) {
  let { cup } = req.params
  let { _id } = req.user
  
})


// export.
module.exports = router