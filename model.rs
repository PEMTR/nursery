//! # Rust语法
//! 
//! `Option<T>` 泛型, 表示可以为 Some(T) 或者 None, 有类型数据或者可为空
//! `HashMap<K, V>` 哈希Map 泛型 key 泛型value
//！`i32` 有符号32位整数
//！`i64` 有符号64位整数
//! `bool` Boolean
//! 
//! ## 全局字段
//! * `date` 数据生成时间
//! * `update` 数据上次更新时间


// 用户列表
struct User {
  type: i32,                  // 用户分类  0) 微信用户 1) 管理后台用户
  username: Option<String>,   // 用户名 （登录用）
  password: Option<String>,   // 密码（登录用）
  nick_name: String,          // 用户昵称或姓名
  phone: Option<String>,      // 手机号
  avatar: String,             // 用户头像
  status: i32,                // 用户是否有效 0) 无效 1）有效
  date: i64,
  update: i64
}


// 班级列表
struct Classroom {
  name: String,       // 班级名称
  count: i64,         // 班级水杯数
  techer: User,       // 老师索引
  date: i64,
  update: i64
}


// 水杯列表
struct Cups {
  code: String,                // 水杯编号
  uid: String,                 // 水杯ID
  expires: i64,                // 到期时间
  avatar: Option<String>,      // 头像 
  username: Option<String>,    // 用户名
  date: i64,
  update: i64
}


// 成就分类表
struct AchievementClass {
  name: String,                // 分类名
  detil: Option<String>,       // 详情
  date: i64,
  update: i64
}


// 成就列表
struct Achievement {
  class: AchievementClass,       // 成就分类索引
  icon: String,                  // 图标文件名
  name: String,                  // 成就
  detil: Option<String>,         // 详情说明
  date: i64,
  update: i64
}


// 取水动画列表
struct Animation {
  type: i32,                    // 动画分类   0） 系统默认
  name: String,                 // 动画名称
  file: String,                 // 文件名
  cover: String,                // 动画封面图
  timeout: i64,                 // 有效时长
  univalent: i64,               // 单价 （水滴数）
  date: i64,
  update: i64
}


// 取水语音列表
struct Audio {
  type: i32,                    // 分类 0） 系统默认 1）用户上传
  name: String,                 // 语音名称
  file: String,                 // 语音文件名
  timeout: i64,                 // 有效时长
  univalent: i64,               // 单价 （水滴数）
  date: i64,
  update: i64
}


// 商品列表
struct Commodity {
  type: i32,                                   // 商品类型  暂时未定
  class: i32,                                  // 商品分类  0) 虚拟商品, 水滴作为货币  1) 实体商品，真实货币
  univalent: i64,                              // 商品单价
  detil: Option<HashMap<String, String>>       // 商品详情 Map
}


// 水杯动画绑定列表
struct CupAnimation {
  user: User,                     // 用户索引
  cup: Cups,                      // 水杯索引
  animation: Animation,           // 动画索引
  date: i64,
  update: i64
}


// 水杯语音绑定列表
struct CupAudio {
  user: User,                     // 用户索引
  cup: Cups,                      // 水杯索引
  audio: Audio,                   // 语音索引
  date: i64,
  update: i64
}


// 取水照片列表
struct CupPhoto {
  cup: Cups,                 // 水杯索引
  image: String,             // 图片文件名
  cover: String,             // 缩略图
  date: i64,
  update: i64
}


// 水杯取水数据列表
struct CupWaters {
  cup: Cups,               // 水杯索引
  number: i64,             // 取水量
  classroom: Classroom,    // 班级索引
  date: i64,
  update: i64
}


// 家庭列表
struct Family {
  manage: User,       // 用户索引  管理员          
  date: i64,
  update: i64
}


// 家庭成员列表
struct FamilyUsers {
  family: Family,         // 家庭索引
  user: User,             // 用户索引
  class: String,          // 关系
  date: i64,
  update: i64
}


// 会员等级列表
struct Member {
  user: User,            // 用户索引
  level: i32,            // 会员等级
  date: i64,
  update: i64
}


// 用户成就列表
struct UserAchievements {
  user: User,                  // 用户索引
  achievement: Achievement,    // 成就索引
  status: i32,                 // 成就状态   0) 未完成 1）已完成
  date: i64,
  update: i64
}


// 用户商品列表
struct UserCommoditys {
  commodity: Commodity,       // 商品索引
  user: User,                 // 用户索引
  number: i64,                // 商品数量
  date: i64,
  update: i64
}


// 用户水杯列表
struct UserCups {
  cup: Cups,                // 水杯索引
  user: User,               // 用户索引
  classroom: Classrom,      // 班级索引
  notice: bool,             // 通知开源
  date: i64,
  update: i64
}


// 用户签到列表
struct UserSignIn {
  user: User,              // 用户索引
  date: i64,
  update: i64
}


// 用户水滴列表
struct Water {
  user: User,       // 用户索引
  count: i64,       // 水滴总数
  date: i64,
  update: i64
}