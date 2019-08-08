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


// 获取班级信息
router.get("/", async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  return req.crate.model.mongo.Classroom.detil({ userId })
})


// export.
module.exports = router