"use strict"


// package
// @package
const assert = require("assert").strict
const moment = require("moment")


// 班级
// @class
module.exports = class Classroom {
  
  // @new
  constructor ({ mongo, util }) {
    this.mongo = mongo
    this.util = util
  }
  
  // 获取当天时间间隔
  // @private
  _daySplit () {
    return {
      after: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).valueOf(),
      before: moment().set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).valueOf()
    }
  }
  
  // 获取班级饮水目标
  // @params {ObjectId} [cupId]
  // @params {ObjectId} [userId]
  // @public
  async waterStandard ({ cupId, userId }) {
    return this.util.promise(await this.mongo.Cos.UserCups.aggregate([
      { $match: {
        user: userId,
        cup: cupId
      } },
      { $limit: 1 },
      { $lookup: {
        from: "Cups",
        localField: "cup",
        foreignField: "_id",
        as: "cup"
      } },
      { $unwind: "$cup" },
      { $lookup: {
        from: "Classroom",
        localField: "cup.classroom",
        foreignField: "_id",
        as: "classroom"
      } },
      { $unwind: "$classroom" },
      { $project: {
        water: "$classroom.standard.water",
        number: "$classroom.standard.number"
      } }
    ]).next(), "E.NOTFOUND")
  }
  
  // 获取班级水杯饮水量排名
  // @params {ObjectId} [cupId]
  // @params {ObjectId} [userId]
  // @public
  async waterSort ({ cupId, userId }) {
    let { after, before } = this._daySplit()
    
    // 检查水杯是否归属于此用户
    // 并且查询水杯的班级绑定信息
    let UserCup = this.util.promise(await this.mongo.Cos.UserCups.aggregate([
      { $match: {
        user: userId,
        cup: cupId
      } },
      { $limit: 1 },
      { $lookup: {
        from: "Cups",
        localField: "cup",
        foreignField: "_id",
        as: "Cups"
      } },
      { $unwind: "$Cups" }
    ]).next(), "E.NOTFOUND")
    
    // 查询返回饮水排名
    return await this.mongo.Cos.CupWaters.aggregate([
      { $match: {
        classroom: UserCup.Cups.classroom,
        data: { $gte: after, $lte: before }
      } },
      { $group: {
        _id: "$cup",
        water: { $sum: "$number" },
        group: { $push: "$date" },
        cup: { $first: "$cup" }
      } },
      { $lookup: {
        from: "Cups",
        localField: "cup",
        foreignField: "_id",
        as: "cup"
      } },
      { $unwind: "$cup" },
      { $project: {
        water: true,
        count: { $size: "$group" },
        cup: {
          avatar: true,
          username: true
        }
      } },
      { $sort: {
        water: 1
      } }
    ]).toArray()
  }
}