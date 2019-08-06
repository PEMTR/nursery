"use strict"


// 视频类
// @class
module.exports = class Video {
  
  // @new
  constructor ({ model, queue, util }) {
    this.util = util
    this.model = model
    this.queue = queue
    this.util.sleep(5000).then(_ => {
      this.queue.OnTransfer("MediaVideo", async (message) => {
        let { type, data } = message.as("json")
        return await this[type](data)
      })
    })
  }
}