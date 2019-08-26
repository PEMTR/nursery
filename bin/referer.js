"use strict"


// package
// @package
const path = require("path")
const fs = require("fs")


// 防盗链
// @class
module.exports = class Referer {
  
  // @new
  constructor ({ configure: { referer }, redis, util }) {
    this._root = path.resolve(referer.root)
    this.configure = referer
    this.redis = redis
    this.util = util
  }
  
  // 安全路径
  // @params {string} dir 路径
  // @return {string}
  // @private
  safe_path (dir) {
    let _dir = path.resolve(dir)
    
    // 检查是否被包含
    // 如果不被包含则抛出错误
    if (!_dir.startsWith(this._root)) {
      throw new Error("path unsafe.")
    }
    
    // 返回原始路径
    return _dir
  }
  
  // 获取文件读取流
  // @params {string} file 文件地址
  // @params {stream} stream 写入流
  // @return {Promise<void>}
  // @public
  async stream (file, stream) {
    let _dirname = this.safe_path(file)
    return await this.util.WriteStream(stream, _dirname)
  }
}