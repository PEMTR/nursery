"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 老师获取班级信息
router.get("/classroom", async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  return await req.crate.model.Mongo.Teacher.detil({ userId })
})


// export.
module.exports = router