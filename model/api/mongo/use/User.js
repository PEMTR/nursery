"use strict"


// @interface
// struct Users {
//    type: i32,                    类型 （标记用户的类型，管理平台或者微信用户）
//    username: Option<String>,     用户名 (管理平台登录用)
//    password: Option<String>,     密码 (管理平台登录用)
//    nickName: String,             昵称 （用户姓名或者是微信昵称）
//    date: i64,                    创建时间
//    update: i64,                  更新时间
//    status: i32,                  状态
//    group: Option<Group>          用户组 （组织或者分组）
// }


// 用户表类
// @class
module.exports = class User {
  
  // @new
  constructor ({ mongo }) {
    this.mongo = mongo
  }
  
  // 新建单个用户
  // @public
  insertOne () {
    
  }
}