"use strict"


// package
// @package
const { Zone } = require("@mod/quasipaa")
const { Schema } = require("@mod/validator")
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
}), Zone("audio.iter", async function (req) {
  return req.ctx
}, async function (req) {
  let { skip, limit } = req.crate.util.pagination(req.ctx)
  return await req.crate.model.Mongo.Audio.iter({ skip, limit })
}, async function () {
  return {
    Audio: "all"
  }
}))


// export.
module.exports = router