"use strict"


// 老师
// @class
module.exports = class Teacher {
  
  // @new
  constructor ({ mongo, util }) {
    this.mongo = mongo
    this.util = util
  }
  
  // 获取班级信息
  // @params {ObjectId} [userId]
  // @public
  async detil ({ userId }) {
    let { after, before } = this.util.DaySplit()
    
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