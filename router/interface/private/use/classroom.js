"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 获取班级饮水量排名
router.get("/cup/:cup/sort", async function (req) {
  let { _id } = req.user
  let { cup } = req.params
  return await req.crate.model.Mongo.Classroom.waterSort({ 
    userId: req.crate.util.createHexId(_id), 
    cupId: req.crate.util.createHexId(cup)
  })
})


// 获取班级饮水目标
router.get("/cup/:cup/standard", async function (req) {
  let { _id } = req.user
  let { cup } = req.params
  return await req.crate.model.Mongo.Classroom.waterStandard({ 
    userId: req.crate.util.createHexId(_id), 
    cupId: req.crate.util.createHexId(cup)
  })
})


// export.
module.exports = router