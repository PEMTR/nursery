"use strict"


// package
// @package
const assert = require("assert").strict


// 班级
// @class
module.exports = class Classroom {
  
  // @new
  constructor ({ mongo, util }) {
    this.mongo = mongo
    this.util = util
  }
  
  // 获取班级饮水目标
  // @params {ObjectId} [cupId]
  // @params {ObjectId} [userId]
  // @params {function} params
  // @public
  async waterStandard ({ cupId, userId }, params) {
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
        _cup: "$cup._id",
        _classroom: "$classroom._id",
        water: "$classroom.standard.water",
        number: "$classroom.standard.number"
      } }
    ]).next(), "E.NOTFOUND")
  }
  
  // 获取班级水杯饮水量排名
  // @params {ObjectId} [cupId]
  // @params {ObjectId} [userId]
  // @params {number} [before]
  // @params {number} [after]
  // @params {function} params
  // @public
  async waterSort ({ cupId, userId, after, before }, params) {
    let _day = this.util.DaySplit()
    before = before || _day.before
    after = after || _day.after
    
    // 检查水杯是否归属于此用户
    // 并且查询水杯的班级绑定信息
    let userCup = this.util.promise(await this.mongo.Cos.UserCups.aggregate([
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
      { $unwind: "$cup" }
    ]).next(), "E.NOTFOUND")
    
    // 参数返回
    params && params(userCup)
    
    // 查询返回饮水排名
    return await this.mongo.Cos.CupWaters.aggregate([
      { $match: {
        classroom: userCup.cup.classroom,
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
          _id: true,
          avatar: true,
          username: true
        }
      } },
      { $sort: {
        water: 1
      } }
    ]).toArray()
  }
  
  // 获取园区活动列表
  // @params {objectId} [cupId]
  // @params {onjectId} [userId]
  // @params {number} [skip]
  // @params {number} [limit]
  // @public
  async trend ({ cupId, userId, skip, limit }) {
    
    // 检查水杯是否归属于此用户
    // 并且查询水杯的班级绑定信息
    let userCup = this.util.promise(await this.mongo.Cos.UserCups.aggregate([
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
      { $unwind: "$cup" }
    ]).next(), "E.NOTFOUND")
    
    // 查询园区获取列表
    return await this.mongo.Cos.ClassroomTrend.aggregate([
      { $match: {
        classroom: userCup.cup.classroom
      } },
      { $skip: skip },
      { $limit: limit },
      { $project: {
        classroom: false,
        techer: false
      } }
    ]).toArray()
  }
}