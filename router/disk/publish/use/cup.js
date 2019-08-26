"use strict"


// package
// @package
const assert = require("assert").strict
const express = require("lazy_mod/express")
const router = express.Router()


// 上传取水照片
router.post("/image", async function (req) {
  let { cups = "" } = req.query
  let cupUids = [...new Set(cups.split(","))]
  assert.deepStrictEqual(cupUids.length > 0, true, "E.PARAMS.TYPE")
  
  // 创建文件可写流
  // PIPE 可写流
  // 保存文件信息到数据库
  let { stream, name } = req.crate.multer.createWriteStream()
  let mime = await req.crate.multer.from(req, stream, "image", /^image\//)
  let photoIds = await req.crate.model.Mongo.Image.WaterPublish({ cupUids, name, mime })
  
  // 推送任务队列处理
  return await req.crate.rabbitx.Send("MediaWorks", {
    uid: photoIds.map(String),
    type: "Image",
    name, mime
  }) || true
})


// export.
module.exports = router