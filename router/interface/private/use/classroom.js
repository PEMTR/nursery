"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 老师获取班级信息
router.get("/", async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  return req.crate.model.mongo.Teacher.detil({ userId })
})


// export.
module.exports = router