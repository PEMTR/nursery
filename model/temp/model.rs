//! date: 数据生成时间；
//! update: 数据最近一次更新时间；
//! data update 所有表都要默认存在，用于数据跟踪分析，相当于数据的操作记录；
//! 所有状态尽可能使用boolean或者number表示，避免浪费不必要的空间和影响DB性能；
//! Option 为可为空的状态，内部为实际类型或者是null，表数据段定死，如果没有此字段应该填null，配合DB的定表限制；


/// 用户类型
enum UserType {
  Wechat(0),
  Manage(1)
}


/// 用户
struct User {
  type: i32,                      // 用户类型 (0,1..)
  username: Option<String>,       // 用户名
  password: Option<String>,       // 密码
  nick_name: String,              // 昵称
  phone: Option<>String>,         // 手机
  status: i32,                    // 状态
  date: i64,
  update: i64
}


/// 会员
struct Member {
  user: User,      // 用户
  level: i32         // 等级
}


/// 厂家
struct Company {
  name: String,     // 名称
  date: i64,
  update: i64
}


/// 经销商
struct Sales {
  name: String,    // 名称
  company: Company,
  date: i64,
  update: i64
}


/// 学校
struct School {
  name: String,
  sales: Sales,
  date: i64,
  update: i64
}


/// 班级
struct Classroom {
  name: String,   // 班级名
  school: School,
  date: i64,
  update: i64
}


/// 滤芯
struct FilterCore {
  name: String,            // 名称
  detil: Option<String>    // 备注
}


/// 设备
struct Device {
  type: i32,                // 设备类型
  version: String,          // 型号
  name: String,             // 设备名
  detil: Option<String>,    // 设备信息
  date: i64,
  update: i64
}


/// 设备滤芯绑定
struct DeviceFilter {
  device: Device,
  filter: FilterCore,
  conut_date: i64,          // 总时长
  count_flow: i64,          // 总流量
  detil: Option<String>,    // 详情
  date: i64,
  update: i64
}


/// 水杯
struct Cup {
  type: i32,         // 水杯类型
  date: i64,
  update: i64
}


/// 水杯列表
struct Cups {
  code: String,        // 水杯编号
  uid: String,         // 水杯串号
  name: String,        // 姓名
  age: i32,            // 年龄
  avatar: String,      // 头像
  classroom: Classroom,
  date: i64,
  update: i64
}


/// 设备列表
struct Devices {
  device: Device,
  company: Company,
  uid: String,        // 设备ID
  code: String,       // 设备编号
  type: i32,          // 收费模式
  service_date: i64,  // 服务时长
  status: i32,        // 状态 
  date: i64,
  update: i64
}