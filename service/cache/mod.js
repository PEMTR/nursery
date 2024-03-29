"use strict"


// 水滴类
// @class
module.exports = class Water {
  
  // @constructor
  constructor (crate) {
    this.crate = crate
    this.name = "Cache"
    this.version = 1
  }
  
  // 生命周期
  // 创建
  // @public
  created () {
    this._watch()
  }
  
  // 监听
  // @private
  _watch () {
    this.crate.mongo.Watch("change", _target => {
      this._process(_target).catch(console.error)
    })
  }
  
  // 处理更改
  // @params {object} [_id]
  // @params {string} [_id._data] 操作ID
  // @params {string} [operationType] 事件类型
  // @params {object} [clusterTime] oplog时间戳
  // @params {object} [fullDocument] 新文档
  // @params {object} [ns] 受影响的实例
  // @params {string} [ns.db] 数据库
  // @params {string} [ns.coll] 文档集
  // @params {object} [to] 新的文档集
  // @params {string} [to.db] 数据库
  // @params {string} [to.coll] 文档集名称
  // @params {string} [documentKey] 受影响的文档
  // @params {objectid} [documentKey._id] 索引
  // @private
  async _process (target) {
    let { ns: { coll }, documentKey: { _id } = {} } = target
    
    // 为空
    // 不继续执行
    if (!_id) {
      return false
    }
    
    // 处理缓存模型
    let _skey = "CACHE.MODEL." + coll + "." + _id.toString()
    let _akey = "CACHE.MODEL." + coll + ".all"
    let _keys = await this.crate.redis.promise.smembers(_skey)
    let _akeys = await this.crate.redis.promise.smembers(_akey)
    _keys.push(..._akeys)
    
    // 检查是否存在
    // 遍历所有关联项
    if (Array.isArray(_keys)) {
      for (let _key of _keys) {
        void this.crate.redis.promise.srem(_skey, _key)
        
        // 检查关联是否存在
        // 如果存在就删除
        let _hkey = "CACHE.VALUE." + _key
        if (await this.crate.redis.promise.exists(_hkey)) {
          void await this.crate.redis.promise.del(_hkey)
        }
      }
    }
  }
  
  // 动作
  // @return {object}
  // @public
  get actions () {
    return {
      
      // 设置缓存
      // @param {string} key 索引
      // @param {object} model 模式绑定
      // @param {any} value 数据
      // @public
      Set: async ({ params: { key, model, value } }) => {
        let _hkey = "CACHE.VALUE." + key
        let _value = JSON.stringify(value)
        let _expire = 1000 * 60 * 60 * 6
        void await this.crate.redis.promise.set(_hkey, _value, "EX", _expire)

        // 写入所有模式
        // 这里将存储所有跟此文档关联的数据
        // 作为失效来使用
        for (let coll in model) {
          if (!Array.isArray(model[coll])) {
            let _skey = "CACHE.MODEL." + coll + "." + model[coll]
            return await this.crate.redis.promise.sadd(_skey, key)
          }

          // 数组
          // 多绑定
          for (let k of model[coll]) {
            let _skey = "CACHE.MODEL." + coll + "." + k
            void await this.crate.redis.promise.sadd(_skey, key)
          }
        }
      },
      
      // 获取缓存
      // @param {string} key 索引
      // @public
      Get: async ({ params: { key } }) => {
        let _hkey = "CACHE.VALUE." + key
        let _value = await this.crate.redis.promise.get(_hkey)
        return JSON.parse(_value)
      }
    }
  }
}