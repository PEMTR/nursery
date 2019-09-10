"use strict"


// package
// @package
const { Schema } = require("@mod/validator")
const express = require("lazy_mod/express")
const router = express.Router()


// 上传取水照片
router.post("/image", Schema({
  cups: { type: "array", items: "string", max: 10, min: 1 }
}, async function (req) {
  let { cups = "" } = req.query 
  return { cups: [...new Set(cups.split(","))] }
}), async function (req) {
  
  // 创建水杯图片数据
  let cupUids = req.ctx.cups
  let { stream, name } = await req.crate.multer.createWriteStream()
  let mime = await req.crate.multer.from(req, stream, "image", /^image\//)
  let uids = await req.crate.model.Mongo.Image.WaterPublish({ 
    cupUids, name, mime 
  })
  
  // 推送缩略图事件
  req.crate.broker.emit("Resize", { 
    name, mime, uid: uids.map(String) 
  }, "Image", { nodeId: "media" })
  
  return true
})


// export.
module.exports = router