"use strict"


// 水滴类
// @class
module.exports = class Water {
  
  // @new
  constructor ({ queue, util, model }) {
    this.model = model
    this.queue = queue
    this.util = util
    this.util.sleep(5000).then(_ => {
      this.queue.OnTransfer("CoreWater", async (message) => {
        let { type, data } = message.as("json")
        return await this[type](data)
      })
    })
  }
  
  // 水滴兑换虚拟商品
  // @private
  async ExchangeMock ({ user, commodity, count }) {
    return await this.model.mongo.Commodity.getMock({
      commodityId: this.util.createHexId(commodity),
      userId: this.util.createHexId(user),
      count
    })
  }
}