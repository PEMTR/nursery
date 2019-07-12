"use strict"


// package.
// @package
const path = require("path")
const native = require("../native")


// 日志类
// @param {object} configure
// @private
// @class
function Logs ({ configure }) {
  this.configure = configure
}


// 写入日志
// @param {string} type
// @param {string} text
// @returns {boolean}
// @public
Logs.prototype.write = function (type, text) {
  return native.write(this.configure.logs.path, type, text)
}


// 读取日志文件
// @param {string} year
// @param {string} month
// @param {string} date
// @param {number} skip
// @param {number} limit
// @returns {buffer||array}
// @public
Logs.prototype.read = function (year, month, date, skip = 0, limit = 1000) {
  let paths = [ this.configure.logs.path ]
  year && paths.push(year)
  month && paths.push(month)
  date && paths.push(date + ".log")
  let dirname = path.join(...paths)
  return date ? native.readFile(dirname, skip, limit) : native.readDir(dirname)
}


// export
module.exports = Logs