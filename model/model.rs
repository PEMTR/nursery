//! date: 数据生成时间；
//! update: 数据最近一次更新时间；
//! data update 所有表都要默认存在，用于数据跟踪分析，相当于数据的操作记录；
//! 所有状态尽可能使用boolean或者number表示，避免浪费不必要的空间和影响DB性能；
//! Option 为可为空的状态，内部为实际类型或者是null，表数据段定死，如果没有此字段应该填null，配合DB的定表限制；


/// 用户
struct User {
  type: i32,                      // 用户类型 (0,1..)
  username: Option<String>,       // 用户名
  password: Option<String>,       // 密码
  nick_name: String,              // 昵称
  status: i32,                    // 状态
  date: i64,
  update: i64
}


/// 分组
struct Group {
  type: i32,     // 分组类型
  name: String,  // 分组名
  date: i64,
  update: i64
}


/// 用户组
struct UserGroup {
  group: Group,       // 分组
  user: User          // 用户
}


/// 设备
struct Device {
  type: i32,                // 设备类型
  name: String,             // 设备名
  detil: Option<String>,    // 设备信息
  date: i64,
  update: i64
}


/// 水杯
struct Cup {
  code: String,        // 水杯编号
  uid: String,         // 水杯串号
}


/// 水杯绑定
struct UserCup {
  cup: Cup,       // 水杯
  user: User      // 用户
}