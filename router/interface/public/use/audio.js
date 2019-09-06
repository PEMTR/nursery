"use strict"


// package
// @package
const { Schema } = require("lazy_mod/validate")
const express = require("lazy_mod/express")
const router = express.Router()


// 获取取水语音列表
router.get("/", Schema({
  page: { type: "number", integer: true, max: 999, mim: 1, optional: true },
  limit: { type: "number", integer: true, max: 100, mim: 1, optional: true }
}, async function (req) {
  req.query.page = Number(req.query.page)
  req.query.limit = Number(req.query.limit)
  return req.query
}), async function (req) {
  let { skip, limit } = req.crate.util.pagination(req.ctx)
  return await req.crate.cache.Audio.iter({ skip, limit })
})


// export.
module.exports = router