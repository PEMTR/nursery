"use strict"


// package
// @package
const moment = require("moment")


// 老师
// @class
module.exports = class Teacher {
  
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
  
  // 获取班级信息
  // @params {ObjectId} [userId]
  // @public
  async detil ({ userId }) {
    let { after, before } = this._daySplit()
    
    // 查找班级
    let classrrom = this.util.promise(await this.mongo.Cos.Classroom.findOne({
      techer: userId
    }), "E.NOTFOUND")
    
    // 查询返回饮水排名
    return {
      ...classrrom,
      waters: await this.mongo.Cos.CupWaters.aggregate([
        { $match: {
          classroom: classrrom._id,
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
}