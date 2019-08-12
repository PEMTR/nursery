"use strict"


// package
// @package
const express = require("lazy_mod/express")
const router = express.Router()


// 上传取水照片
router.post("/:cup/image", async function (req) {
  let { cup } = req.params
  let cupId = req.crate.util.createHexId(cup)
  
  // 创建文件可写流
  // PIPE 可写流
  // 保存文件信息到数据库
  let { stream, name } = req.crate.multer.createWriteStream()
  let mime = await req.crate.multer.from(req, stream, "image", /^image\//)
  let photoId = await req.crate.model.Mongo.Image.WaterPublish({ cupId, name, mime })
  
  // 推送任务队列处理
  void await req.crate.rabbitx.Send("MediaWorks", {
    uid: photoId.toString(),
    type: "Image",
    name, mime
  })
  
  return true
})


// export.
module.exports = router