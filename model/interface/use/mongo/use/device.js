"use strict"


// 设备
// @class
module.exports = class Devices {
  
  // @new
  constructor ({ mongo, util }) {
    this.mongo = mongo
    this.util = util
  }
  
  // 获取设备水质信息
  // @params {ObjectId} [userId] 用户索引
  // @params {OBjectId} [cupId] 水杯索引
  // @return {Promise<object>}
  // @public
  async waterQuality ({ userId, cupId }) {
    let { after, before } = this.util.DaySplit()
    
    // 验证用户水杯
    void this.util.promise(await this.mongo.Cos.UserCups.findOne({
      user: userId,
      cup: cupId
    }), "E.NOTFOUND")
    
    // 查询最新饮水记录
    // 查询设备信息
    let cupDevice = this.util.promise(await this.mongo.Cos.CupDevice.aggregate([
      { $match: {
        cup: cupId
      } },
      { $lookup: {
        from: "Devices",
        localField: "device",
        foreignField: "_id",
        as: "device"
      } },
      { $unwind: "$device" },
      { $project: {
          device: {
            _id: true,
            uid: true,
            cover: true,
            filter: true,
            date: true,
            update: true
          }
        } }
    ]).next(), "E.NOTFOUND")
    
    // 查询设备滤芯列表
    let deviceFilters = await this.mongo.Cos.DeviceFilters.aggregate([
      { $match: {
        device: cupDevice.device._id,
        status: 1
      } },
      { $project: {
        device: false,
        status: false
      } }
    ]).toArray()
    
    // 查询最新水质记录
    let waterQuality = this.util.promise(await this.mongo.Cos.DeviceWaterQualitys.aggregate([
      { $match: {
        device: cupDevice.device._id,
        date: { $gte: after, $lte: before }
      } },
      { $sort: {
        date: -1
      } },
      { $limit: 1 },
      { $project: {
        device: false
      } }
    ]).next(), "E.NOTFOUND")
    
    // 返回
    return {
      device: cupDevice.device,
      quality: waterQuality,
      filters: deviceFilters
    }
  }
}