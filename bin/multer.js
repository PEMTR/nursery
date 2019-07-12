"use strict"


// package.
// @package
const path = require("path")
const uuid = require("uuid/v4")
const multer = require("multer")


// 文件名处理
// @param {string} name
// @returns {function}
// @private
function filename (name) {
  return function (req, file, next) {
    let mimename = path.parse(file.originalname).ext
    let filesname = name === false ? uuid() : name
    next(null, filesname + mimename)
  }
}


// 存储引擎
// @param {number} files
// @param {string} destination
// @returns {object}
// @private
function diskStorage (files, destination, name) {
  return Object.assign({ storage: multer.diskStorage({ 
    destination, filename: filename(name) 
  }) }, { limits: { files } })
}


// 单文件上传
// @param {object} options
// @public
function single (options) {
  return new Promise((resolve, reject) => {
    let { req, res, destination, single, name = uuid() } = options
    let multers = multer(diskStorage(1, destination, name)).single(single)
    multers(req, res, error => error ? reject(error) : resolve(name))
  })
}


// 多文件上传
// @param {object} options
// @public
function fields (options) {
  return new Promise((resolve, reject) => {
    let { req, res, destination, fields, name = false, limit } = options
    let multers = multer(diskStorage(limit, destination, name)).fields(fields)
    multers(req, res, error => error ? reject(error) : resolve(name))
  })
}


// export.
module.exports = {
  single,
  fields
}