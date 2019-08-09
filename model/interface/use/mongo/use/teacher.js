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
    return this.util.promise(await this.mongo.Cos.Classroom.findOne({
      techer: userId
    }), "E.NOTFOUND")
  }
}