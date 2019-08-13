"use strict"


// 班级
// @class
module.exports = class Classroom {
  
  // @new
  constructor ({ quasipaa, model, util }) {
    this.quasipaa = quasipaa
    this.model = model
    this.util = util
  }
  
  // 获取班级饮水目标
  // @params {ObjectId} [cupId]
  // @params {ObjectId} [userId]
  // @public
  async waterStandard ({ cupId, userId }) {
    return await this.quasipaa.Engine("classroom.water.standard", {
      
      // 用户和水杯索引
      user: userId.toString(),
      cup: cupId.toString()
    }, async _ => {
      
      // 数据库模型
      // 查询班级的饮水目标
      return await this.model.Mongo.Classroom.waterStandard({ 
        cupId, userId 
      })
    }, async _v => ({
      
      // 班级表
      // 用户水杯表
      // 水杯表
      Classroom: String(_v._classroom),
      UserCups: String(_v._id),
      Cups: String(_v._cup)
    }))
  }
  
  // 获取班级水杯饮水量排名
  // @params {ObjectId} [cupId]
  // @params {ObjectId} [userId]
  // @public
  async waterSort ({ cupId, userId }) {
    let _params = null
    return await this.quasipaa.Engine("classroom.water.sort", {
      user: userId.toString(),
      cup: cupId.toString(),
      after, before
    }, async _ => {
      
      // 获取当天开始时间和结束时间
      // 查询班级当前的饮水情况
      let { after, before } = this.util.DaySplit()
      return await this.model.Mongo.Classroom.waterStandard({ 
        cupId, userId, after, before 
      }, _p => {
        
        // 模型内部函数传递运行时
        // 传递用户水杯关联
        _params = _p
      })
    }, async _v => ({
      
      // 用户水杯表
      // 水杯饮水表
      // 水杯表
      UserCups: String(_params._id),
      CupWaters: _v.map(({ _id }) => String(_id)),
      Cups: _v.map(({ cup: { _id } }) => String(_id))
    }))
  }
}