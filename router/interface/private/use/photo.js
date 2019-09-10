"use strict"

// package
// @package
const { Schema } = require("@mod/validator")
const express = require("lazy_mod/express")
const router = express.Router()


// 获取水杯取水照片
router.get("/:cup", Schema({
  cup: { type: "objectId" },
  lte: { type: "number", integer: true, mim: 1 },
  gte: { type: "number", integer: true, mim: 1 },
  page: { type: "number", integer: true, max: 999, mim: 1, optional: true },
  limit: { type: "number", integer: true, max: 100, mim: 1, optional: true }
}, async function (req) {
  req.query.page = Number(req.query.page)
  req.query.limit = Number(req.query.limit)
  req.query.lte = Number(req.query.lte)
  req.query.gte = Number(req.query.gte)
  return { ...req.params, ...req.query }
}), async function (req) {
  let { _id } = req.user
  let userId = req.crate.util.createHexId(_id)
  let cupId = req.crate.util.createHexId(req.ctx.cup)
  let { skip, limit } = req.crate.util.pagination(req.ctx)
  return await req.crate.model.Mongo.Cups.photo({
    userId, cupId, skip, limit,
    lte: req.ctx.lte, 
    gte: req.ctx.gte
  })
})


// export.
module.exports = router