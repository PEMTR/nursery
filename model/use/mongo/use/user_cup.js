"use strict"


// @interface
// struct UserCup {
//   user: User,    用户
//   cup: Cup       水杯
// }


// 用户水杯绑定
// @class
module.exports = class UserCup {
  
  // @new
  constructor (mongo) {
    this.mongo = mongo
  }
  
  // 查询用户水杯绑定信息
  // @params {ObjectID} id
  // @public
  async find (id) {
    return await this.mongo.UserCap.aggragate([
      { $match: { user: id } },
      { $project: {
        user: false
      } }
    ]).toArray()
  }
}